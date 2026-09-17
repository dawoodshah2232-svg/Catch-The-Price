import { NextRequest, NextResponse } from 'next/server';
import { requireAdminUser } from '@/lib/admin/requireAdmin';
import { getServerSupabase } from '@/lib/supabase/server';
import { createJsonFeedAdapter, JsonFeedConfig } from '@/lib/ingestion/jsonFeedAdapter';
import { createBestBuyApiAdapter, BestBuyApiConfig } from '@/lib/ingestion/bestBuyAdapter';
import { MerchantSourceAdapter, prepareApprovedSourceBatch, LaunchMarket } from '@/lib/ingestion/sourceAdapter';
import { CanonicalCandidate, suggestExactMatch } from '@/lib/ingestion/exactMatcher.server';
import { syncAdmitadSource } from '@/lib/ingestion/admitadFeedSync.server';

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

type SourceConfig = Partial<JsonFeedConfig & BestBuyApiConfig> & {
  adapter?: 'json' | 'bestbuy' | 'admitad_xml';
};

function createAdapter(source: {
  name: string;
  source_type: string;
  country_code: string | null;
  base_url: string | null;
  config: unknown;
}): MerchantSourceAdapter {
  const market = String(source.country_code || '').toLowerCase() as LaunchMarket;
  const config = (source.config || {}) as SourceConfig;

  if (!config.rightsId || !config.merchantSlug || !config.merchantName) {
    throw new Error('Source config must include rightsId, merchantSlug and merchantName.');
  }

  if (source.source_type === 'api' && config.adapter === 'bestbuy') {
    if (market !== 'us') throw new Error('Best Buy API adapter is only valid for the US market.');
    return createBestBuyApiAdapter(config as BestBuyApiConfig);
  }

  if (['feed', 'affiliate_feed'].includes(source.source_type) && config.adapter === 'json') {
    if (!config.feedUrl) throw new Error('JSON feed source config must include feedUrl.');
    return createJsonFeedAdapter({
      sourceRightsId: config.rightsId,
      market,
      adapterName: `${source.name} JSON Feed`,
      baseUrl: source.base_url,
      config: config as JsonFeedConfig,
    });
  }

  throw new Error(`Unsupported source adapter: ${source.source_type}/${config.adapter || 'unset'}`);
}

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

  const market = String(source.country_code || '').toLowerCase();
  if (!['ae', 'us'].includes(market)) {
    return NextResponse.json({ error: 'Only UAE and US launch-market sources are supported.' }, { status: 400 });
  }

  if ((source.config as SourceConfig)?.adapter === 'admitad_xml') {
    const result = await syncAdmitadSource(source as {
      id: string;
      name: string;
      country_code: string;
      config: unknown;
      is_active: boolean;
    });
    const httpStatus = result.status === 'failed' ? 400 : result.status === 'skipped' ? 409 : 200;
    return NextResponse.json(result, { status: httpStatus });
  }

  let adapter: MerchantSourceAdapter;
  try {
    adapter = createAdapter(source);
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Source adapter configuration is invalid.' },
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
    const batch = await prepareApprovedSourceBatch(adapter);

    const { data: candidateRows, error: candidateError } = await supabase
      .from('products')
      .select('id,brand,name,model,gtin,sku,specs')
      .in('status', ['active', 'draft'])
      .limit(3000);

    if (candidateError) throw candidateError;
    const candidates = (candidateRows || []) as CanonicalCandidate[];

    let suggestedMatches = 0;
    const now = new Date().toISOString();
    const sourceConfig = (source.config || {}) as SourceConfig;

    const stagedRows = batch.accepted.map((item) => {
      const suggestion = suggestExactMatch(item, candidates);
      if (suggestion) suggestedMatches += 1;

      return {
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
          rightsId: sourceConfig.rightsId,
          adapter: sourceConfig.adapter,
          suggestedMatchMethod: suggestion?.method || null,
        },
        product_id: suggestion?.productId || null,
        confidence: suggestion?.confidence || null,
        match_status: suggestion ? 'suggested' : 'pending',
        review_status: 'pending',
        review_note: null,
        reviewed_by: null,
        reviewed_at: null,
        published_offer_id: null,
        published_at: null,
        updated_at: now,
      };
    });

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
      suggestedMatches,
      rejected: batch.rejected.length,
    });

    return NextResponse.json({
      runId: run.id,
      fetched: batch.fetched,
      staged: batch.accepted.length,
      suggestedMatches,
      rejected: batch.rejected.length,
      rejectedItems: batch.rejected.slice(0, 25),
      publishState: 'staged_for_review',
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
