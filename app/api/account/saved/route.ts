import { NextRequest, NextResponse } from 'next/server';
import { createAuthServerClient } from '@/lib/supabase/auth-server';
import { getCatalogProducts } from '@/lib/data/catalog.server';
import { CountryCode } from '@/lib/types';

const VALID_COUNTRIES = new Set<CountryCode>(['ae', 'us']);

async function getAuthedClient() {
  const supabase = await createAuthServerClient();
  if (!supabase) return { supabase: null, user: null };

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) return { supabase, user: null };
  return { supabase, user };
}

export async function GET(request: NextRequest) {
  const { supabase, user } = await getAuthedClient();
  if (!supabase || !user) {
    return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
  }

  const countryParam = (request.nextUrl.searchParams.get('country') || 'ae').toLowerCase() as CountryCode;
  const country: CountryCode = VALID_COUNTRIES.has(countryParam) ? countryParam : 'ae';

  // Check saved_products table first; fall back to watchlists table if empty
  const [savedRes, catalogRes] = await Promise.all([
    supabase
      .from('saved_products')
      .select('id, product_id, country_code, notes, created_at')
      .eq('user_id', user.id)
      .eq('country_code', country)
      .order('created_at', { ascending: false }),
    getCatalogProducts(country),
  ]);

  let savedItems = savedRes.data || [];

  // Fallback to watchlists with alert_type = 'saved' if saved_products has no entries yet
  if (savedItems.length === 0) {
    const { data: watchlists } = await supabase
      .from('watchlists')
      .select('id, product_id, country_code, created_at')
      .eq('user_id', user.id)
      .eq('country_code', country)
      .eq('is_active', true);

    if (watchlists && watchlists.length > 0) {
      savedItems = watchlists.map((item) => ({
        id: item.id,
        product_id: item.product_id,
        country_code: item.country_code,
        notes: null,
        created_at: item.created_at,
      }));
    }
  }

  const catalogMap = new Map(catalogRes.products.map((p) => [p.id, p]));

  const enrichedItems = savedItems.map((item) => {
    const product = catalogMap.get(item.product_id);
    return {
      id: item.id,
      productId: item.product_id,
      country: item.country_code,
      savedAt: item.created_at,
      notes: item.notes,
      product: product || null,
    };
  });

  return NextResponse.json({
    items: enrichedItems,
    count: enrichedItems.length,
  });
}

export async function POST(request: NextRequest) {
  const { supabase, user } = await getAuthedClient();
  if (!supabase || !user) {
    return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
  }

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
  }

  const productId = typeof body.productId === 'string' ? body.productId.trim() : '';
  const countryParam = typeof body.country === 'string' ? body.country.toLowerCase() : 'ae';
  const country = VALID_COUNTRIES.has(countryParam as CountryCode) ? countryParam : 'ae';
  const notes = typeof body.notes === 'string' ? body.notes.trim() : null;

  if (!productId) {
    return NextResponse.json({ error: 'Missing productId' }, { status: 400 });
  }

  // Insert into saved_products
  const { data, error } = await supabase
    .from('saved_products')
    .upsert(
      {
        user_id: user.id,
        product_id: productId,
        country_code: country,
        notes,
        created_at: new Date().toISOString(),
      },
      { onConflict: 'user_id,product_id,country_code' }
    )
    .select()
    .single();

  if (error) {
    console.error('Save product error:', error);
    return NextResponse.json({ error: 'Could not save product' }, { status: 500 });
  }

  // Also maintain backward-compatibility in watchlists table
  try {
    await supabase.from('watchlists').upsert(
      {
        user_id: user.id,
        product_id: productId,
        country_code: country,
        alert_type: 'saved',
        is_active: true,
        updated_at: new Date().toISOString(),
      },
      { onConflict: 'user_id,product_id,country_code' }
    );
  } catch {}

  return NextResponse.json({ success: true, item: data });
}

export async function DELETE(request: NextRequest) {
  const { supabase, user } = await getAuthedClient();
  if (!supabase || !user) {
    return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const productId = searchParams.get('productId');
  const country = searchParams.get('country') || 'ae';

  if (!productId) {
    return NextResponse.json({ error: 'Missing productId parameter' }, { status: 400 });
  }

  const [savedDel] = await Promise.all([
    supabase
      .from('saved_products')
      .delete()
      .eq('user_id', user.id)
      .eq('product_id', productId)
      .eq('country_code', country),
    supabase
      .from('watchlists')
      .update({ is_active: false, updated_at: new Date().toISOString() })
      .eq('user_id', user.id)
      .eq('product_id', productId)
      .eq('country_code', country)
      .eq('alert_type', 'saved'),
  ]);

  if (savedDel.error) {
    console.error('Delete saved product error:', savedDel.error);
    return NextResponse.json({ error: 'Could not remove saved product' }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
