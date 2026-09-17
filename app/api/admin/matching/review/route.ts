import { NextRequest, NextResponse } from 'next/server';
import { requireAdminUser } from '@/lib/admin/requireAdmin';
import { getServerSupabase } from '@/lib/supabase/server';
import { canPublishSource, getSourceRights } from '@/lib/config/sourceRights';

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

function slugify(value: string) {
  return value
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 90);
}

function safeHttps(value?: string | null): string | null {
  if (!value) return null;
  try {
    const url = new URL(value);
    return url.protocol === 'https:' ? url.toString() : null;
  } catch {
    return null;
  }
}

type ReviewBody = {
  itemId?: string;
  action?: 'assign_existing' | 'create_product' | 'reject' | 'publish';
  productId?: string;
  note?: string;
};

export async function POST(request: NextRequest) {
  const admin = await requireAdminUser();
  if (!admin.ok) return NextResponse.json({ error: 'Unauthorized' }, { status: admin.status });

  const supabase = getServerSupabase();
  if (!supabase) return NextResponse.json({ error: 'Server database is not configured.' }, { status: 503 });

  let body: ReviewBody;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body.' }, { status: 400 });
  }

  const itemId = body.itemId?.trim() || '';
  const action = body.action;
  if (!UUID_RE.test(itemId) || !action) {
    return NextResponse.json({ error: 'Valid itemId and action are required.' }, { status: 400 });
  }

  const { data: item, error: itemError } = await supabase
    .from('ingestion_items')
    .select('id,source_id,run_id,source_product_id,raw_title,normalized_title,brand,category_slug,price,currency,product_url,image_url,gtin,mpn,model,in_stock,shipping_info,raw_payload,match_status,review_status,product_id,published_offer_id')
    .eq('id', itemId)
    .maybeSingle();

  if (itemError || !item) return NextResponse.json({ error: 'Staged item not found.' }, { status: 404 });

  const reviewMeta = {
    reviewed_by: admin.user.id,
    reviewed_at: new Date().toISOString(),
    review_note: (body.note || '').trim().slice(0, 1000) || null,
  };

  if (action === 'reject') {
    if (item.review_status === 'published') {
      return NextResponse.json({ error: 'Published items cannot be rejected from this workflow.' }, { status: 409 });
    }

    const { error } = await supabase
      .from('ingestion_items')
      .update({ ...reviewMeta, review_status: 'rejected', match_status: 'rejected' })
      .eq('id', itemId);

    if (error) return NextResponse.json({ error: 'Could not reject this item.' }, { status: 500 });
    return NextResponse.json({ ok: true, state: 'rejected' });
  }

  const { data: source, error: sourceError } = await supabase
    .from('ingestion_sources')
    .select('id,name,country_code,base_url,config,is_active')
    .eq('id', item.source_id)
    .maybeSingle();

  if (sourceError || !source) return NextResponse.json({ error: 'Source record is unavailable.' }, { status: 409 });
  const config = (source.config || {}) as Record<string, unknown>;
  const rightsId = typeof config.rightsId === 'string' ? config.rightsId : '';
  const merchantSlug = typeof config.merchantSlug === 'string' ? config.merchantSlug.trim() : '';
  const merchantName = typeof config.merchantName === 'string' ? config.merchantName.trim() : '';

  if (!rightsId || !merchantSlug || !merchantName) {
    return NextResponse.json({ error: 'Source configuration is incomplete.' }, { status: 409 });
  }

  const rights = await getSourceRights(rightsId);
  if (!rights || rights.market !== String(source.country_code).toLowerCase()) {
    return NextResponse.json({ error: 'Source-rights record is missing or does not match the market.' }, { status: 409 });
  }

  if (action === 'assign_existing') {
    const productId = body.productId?.trim() || '';
    if (!UUID_RE.test(productId)) return NextResponse.json({ error: 'Select a valid product.' }, { status: 400 });

    const { data: product } = await supabase
      .from('products')
      .select('id,name,status')
      .eq('id', productId)
      .maybeSingle();
    if (!product) return NextResponse.json({ error: 'Selected product does not exist.' }, { status: 404 });

    const { error: updateError } = await supabase
      .from('ingestion_items')
      .update({
        ...reviewMeta,
        product_id: productId,
        confidence: 100,
        match_status: 'approved',
        review_status: 'approved',
      })
      .eq('id', itemId);

    if (updateError) return NextResponse.json({ error: 'Could not approve this match.' }, { status: 500 });

    await supabase.from('product_matches').upsert({
      source_name: source.name,
      source_product_id: item.source_product_id,
      product_id: productId,
      confidence: 100,
      match_method: 'manual_review',
      raw_title: item.raw_title,
    }, { onConflict: 'source_name,source_product_id' });

    return NextResponse.json({ ok: true, state: 'approved', productId });
  }

  if (action === 'create_product') {
    if (!rights.pricingRight) {
      return NextResponse.json({ error: 'This source is not approved for product/price publishing.' }, { status: 409 });
    }

    let categoryId: string | null = null;
    if (item.category_slug) {
      const { data: category } = await supabase.from('categories').select('id').eq('slug', item.category_slug).maybeSingle();
      categoryId = category?.id || null;
    }

    const baseSlug = slugify(item.normalized_title || item.raw_title) || `product-${item.source_product_id}`;
    let slug = baseSlug;
    const { data: existingSlug } = await supabase.from('products').select('id').eq('slug', slug).maybeSingle();
    if (existingSlug) slug = `${baseSlug}-${item.id.slice(0, 8)}`;

    const imageUrl = rights.imageRight ? safeHttps(item.image_url) : null;
    const specs: Record<string, string> = {};
    if (item.model) specs.Model = item.model;
    if (item.mpn) specs.MPN = item.mpn;
    const stagedPayload = (item.raw_payload || {}) as Record<string, unknown>;
    const stagedDescription = typeof stagedPayload.description === 'string' ? stagedPayload.description.slice(0, 4000) : null;

    const { data: product, error: createError } = await supabase
      .from('products')
      .insert({
        category_id: categoryId,
        brand: item.brand || null,
        name: item.normalized_title || item.raw_title,
        slug,
        model: item.model || null,
        gtin: item.gtin || null,
        image_url: imageUrl,
        description: stagedDescription,
        ai_summary: null,
        specs,
        status: 'draft',
      })
      .select('id,name,slug')
      .single();

    if (createError || !product) {
      console.error('Failed to create canonical product:', createError);
      return NextResponse.json({ error: 'Could not create the canonical product.' }, { status: 500 });
    }

    const { error: updateError } = await supabase
      .from('ingestion_items')
      .update({
        ...reviewMeta,
        product_id: product.id,
        confidence: 100,
        match_status: 'approved',
        review_status: 'approved',
      })
      .eq('id', itemId);

    if (updateError) return NextResponse.json({ error: 'Product was created but item approval failed. Review manually.' }, { status: 500 });

    await supabase.from('product_matches').upsert({
      source_name: source.name,
      source_product_id: item.source_product_id,
      product_id: product.id,
      confidence: 100,
      match_method: 'manual_create',
      raw_title: item.raw_title,
    }, { onConflict: 'source_name,source_product_id' });

    return NextResponse.json({ ok: true, state: 'approved', productId: product.id, productSlug: product.slug });
  }

  if (action === 'publish') {
    if (item.review_status !== 'approved' || !item.product_id) {
      return NextResponse.json({ error: 'Approve the exact product match before publishing.' }, { status: 409 });
    }
    if (item.published_offer_id || item.review_status === 'published') {
      return NextResponse.json({ error: 'This staged item has already been published.' }, { status: 409 });
    }
    if (!canPublishSource(rights)) {
      return NextResponse.json({ error: 'Source rights are not fully approved for production publishing.' }, { status: 409 });
    }

    const { data: product, error: productError } = await supabase
      .from('products')
      .select('id,name,slug,status,image_url,category_id,gtin,model,specs')
      .eq('id', item.product_id)
      .maybeSingle();
    if (productError || !product) return NextResponse.json({ error: 'Matched product is missing.' }, { status: 409 });

    let imageUrl = safeHttps(product.image_url);
    if (!imageUrl && rights.imageRight) imageUrl = safeHttps(item.image_url);
    if (!imageUrl) {
      return NextResponse.json({ error: 'A rights-cleared product image is required before public publishing.' }, { status: 409 });
    }

    let categoryId = product.category_id as string | null;
    if (!categoryId && item.category_slug) {
      const { data: category } = await supabase.from('categories').select('id').eq('slug', item.category_slug).maybeSingle();
      categoryId = category?.id || null;
    }

    const productSpecs = (product.specs || {}) as Record<string, unknown>;
    const mergedSpecs = { ...productSpecs } as Record<string, unknown>;
    if (item.model && !mergedSpecs.Model) mergedSpecs.Model = item.model;
    if (item.mpn && !mergedSpecs.MPN) mergedSpecs.MPN = item.mpn;

    const { error: activateError } = await supabase
      .from('products')
      .update({
        status: 'active',
        image_url: imageUrl,
        category_id: categoryId,
        gtin: product.gtin || item.gtin || null,
        model: product.model || item.model || null,
        specs: mergedSpecs,
        updated_at: new Date().toISOString(),
      })
      .eq('id', product.id);
    if (activateError) return NextResponse.json({ error: 'Could not activate the matched product.' }, { status: 500 });

    const websiteUrl = safeHttps(source.base_url);
    if (!websiteUrl) return NextResponse.json({ error: 'Source website URL must be a valid HTTPS URL.' }, { status: 409 });

    let merchantId: string | null = null;
    const { data: existingMerchant } = await supabase
      .from('merchants')
      .select('id')
      .eq('slug', merchantSlug)
      .eq('country_code', source.country_code)
      .maybeSingle();

    if (existingMerchant?.id) {
      merchantId = existingMerchant.id;
      await supabase.from('merchants').update({ is_active: true, website_url: websiteUrl, updated_at: new Date().toISOString() }).eq('id', merchantId);
    } else {
      const { data: createdMerchant, error: merchantError } = await supabase
        .from('merchants')
        .insert({
          name: merchantName,
          slug: merchantSlug,
          country_code: String(source.country_code).toLowerCase(),
          website_url: websiteUrl,
          logo_url: null,
          is_active: true,
        })
        .select('id')
        .single();
      if (merchantError || !createdMerchant) return NextResponse.json({ error: 'Could not create the merchant record.' }, { status: 500 });
      merchantId = createdMerchant.id;
    }

    const now = new Date().toISOString();
    const feedPayload = (item.raw_payload || {}) as Record<string, unknown>;
    const importedOriginalPrice = Number(feedPayload.originalPrice);
    const originalPrice = Number.isFinite(importedOriginalPrice) && importedOriginalPrice >= Number(item.price)
      ? importedOriginalPrice
      : null;
    const affiliateUrl = typeof feedPayload.affiliateUrl === 'string' ? safeHttps(feedPayload.affiliateUrl) : null;
    const offerPayload = {
      product_id: product.id,
      merchant_id: merchantId,
      country_code: String(source.country_code).toLowerCase(),
      currency: String(item.currency).toUpperCase(),
      price: Number(item.price),
      original_price: originalPrice,
      availability: item.in_stock ? 'in_stock' : 'out_of_stock',
      product_url: item.product_url,
      affiliate_url: affiliateUrl,
      source_product_id: item.source_product_id,
      last_checked_at: now,
      is_active: Boolean(item.in_stock),
      updated_at: now,
    };

    const { data: offer, error: offerError } = await supabase
      .from('offers')
      .upsert(offerPayload, { onConflict: 'merchant_id,country_code,source_product_id' })
      .select('id')
      .single();

    if (offerError || !offer) {
      console.error('Offer publish failed:', offerError);
      return NextResponse.json({ error: 'Could not publish the retailer offer.' }, { status: 500 });
    }

    if (rights.historyRight) {
      const { error: historyError } = await supabase.from('price_history').insert({
        offer_id: offer.id,
        price: Number(item.price),
        original_price: originalPrice,
        availability: item.in_stock ? 'in_stock' : 'out_of_stock',
        captured_at: now,
      });
      if (historyError) console.error('Initial history observation failed:', historyError);
    }

    const { error: itemUpdateError } = await supabase
      .from('ingestion_items')
      .update({
        ...reviewMeta,
        review_status: 'published',
        match_status: 'published',
        published_offer_id: offer.id,
        published_at: now,
      })
      .eq('id', itemId);

    if (itemUpdateError) return NextResponse.json({ error: 'Offer published but staging state could not be finalized.' }, { status: 500 });

    return NextResponse.json({ ok: true, state: 'published', productId: product.id, offerId: offer.id });
  }

  return NextResponse.json({ error: 'Unsupported action.' }, { status: 400 });
}
