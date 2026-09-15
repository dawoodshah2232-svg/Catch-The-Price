import { NextRequest, NextResponse } from 'next/server';
import { requireAdminUser } from '@/lib/admin/requireAdmin';
import { getServerSupabase } from '@/lib/supabase/server';
import { createJsonFeedAdapter, JsonFeedConfig } from '@/lib/ingestion/jsonFeedAdapter';
import { prepareApprovedSourceBatch, LaunchMarket } from '@/lib/ingestion/sourceAdapter';

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export async function POST(request: NextRequest) {
  const admin = await requireAdminUser();
  if (!admin.ok) return NextResponse.json({ error: 'Unauthorized' }, { status: admin.status });

  const supabase = getServerSupabase();
  if (!supabase) return NextResponse.json({ error: 'Server database is not configured.' }, { status: 503 });

  let body: { sourceId?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body.' }, { status: 400 });
  }

  const sourceId = body.sourceId?.trim() || '';
  if (!UUID_RE.test(sourceId)) {
    return NextResponse.json({ error: 'A valid sourceId is required.' }, { status: 400 });
  }

  const { data: source, error: sourceError } = await supabase
    .from('ingestion_sources')
    .select('id,name,source_type,country_code,base_url,config,is_active')
    .eq('id', sourceId)
    .maybeSingle();

  if (sourceError || !source) return NextResponse.json({ error: 'Ingestion source not found.' }, { status: 404 });
  if (!source.is_active) return NextResponse.json({ error: 'This ingestion source is disabled.' }, { status: 409 });
  if (!['ae', 'us'].includes(String(source.country_code).toLowerCase())) {
    return NextResponse.json({ error: 'Only UAE and US launch-market sources are supported.' }, { status: 400 });
  }
  if (source.source_type !== 'json_feed') {
    return NextResponse.json({ error: 'This runner currently supports json_feed sources only.' }, { status: 400 });
  }

  const config = (source.config || {}) as Partial<JsonFeedConfig>;
  if (!config.feedUrl || !config.rightsId || !config.merchantSlug || !config.merchantName) {
    return NextResponse.json(
      { error: 'Source config must include feedUrl, rightsId, merchantSlug and merchantName.' },
      { status: 400 }
    );
  }

  const { data: run, error: runCreateError } = await supabase
    .from('ingestion_runs')
    .insert({
      source_id: source.id,
      status: 'running',
      started_at: new Date().toISOString(),
      items_seen: 0,
      items_created: 0,
      items_updated: 0,
      items_staged: 0,
      items_rejected: 0,
    })
    .select('id')
    .single();

  if (runCreateError || !run) {
    console.error('Failed to create ingestion run:', runCreateError);
    return NextResponse.json({ error: 'Could not start ingestion run.' }, { status: 500 });
  }

  try {
    const adapter = createJsonFeedAdapter({
      sourceRightsId: config.rightsId,
      market: String(source.country_code).toLowerCase() as LaunchMarket,
      adapterName: `${source.name} JSON Feed`,
      baseUrl: source.base_url,
      config: config as JsonFeedConfig,
    });

    const batch = await prepareApprovedSourceBatch(adapter);

    const stagedRows = batch.accepted.map((item) => ({
      source_id: source.id,
      run_id: run.id,
      source_product_id: item.sku,
      raw_title: item.title,
      normalized_title: item.title,
      brand: item.brand,
      category_slug: item.categorySlug,
      price: item.price,
      currency: item.currency,
      product_url: item.url,
      image_url: item.imageUrl || null,
      gtin: item.gtin || null,
      mpn: item.mpn || null,
      model: item.model || null,
      in_stock: item.inStock,
      shipping_info: item.shippingInfo,
      raw_payload: {
        merchantSlug: item.merchantSlug,
        merchantName: item.merchantName,
        rightsId: config.rightsId,
      },
      match_status: 'pending',
      review_status: 'pending',
      updated_at: new Date().toISOString(),
    }));

    if (stagedRows.length > 0) {
      const { error: stageError } = await supabase
        .from('ingestion_items')
        .upsert(stagedRows, { onConflict: 'source_id,source_product_id', ignoreDuplicates: false });
      if (stageError) throw stageError;
    }

    const { error: completeError } = await supabase
      .from('ingestion_runs')
      .update({
        status: 'completed',
        items_seen: batch.fetched,
        items_staged: batch.accepted.length,
        items_rejected: batch.rejected.length,
        finished_at: new Date().toISOString(),
      })
      .eq('id', run.id);

    if (completeError) throw completeError;

    console.info('Ingestion batch staged', {
      runId: run.id,
      sourceId: source.id,
      adminUserId: admin.user.id,
      fetched: batch.fetched,
      staged: batch.accepted.length,
      rejected: batch.rejected.length,
    });

    return NextResponse.json({
      runId: run.id,
      fetched: batch.fetched,
      staged: batch.accepted.length,
      rejected: batch.rejected.length,
      rejectedItems: batch.rejected.slice(0, 25),
      publishState: 'staged_for_matching',
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown ingestion error';
    console.error('Ingestion run failed:', error);

    await supabase
      .from('ingestion_runs')
      .update({
        status: 'failed',
        error_message: message.slice(0, 1000),
        finished_at: new Date().toISOString(),
      })
      .eq('id', run.id);

    return NextResponse.json({ error: message, runId: run.id }, { status: 400 });
  }
}
