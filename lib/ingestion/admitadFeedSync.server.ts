import 'server-only';

import { getServerSupabase } from '@/lib/supabase/server';
import { canPublishSource, getSourceRights } from '@/lib/config/sourceRights';
import { suggestExactMatch, type CanonicalCandidate } from '@/lib/ingestion/exactMatcher.server';
import { normalizeMerchantItem } from '@/lib/ingestion/normalizer';
import type { NormalizedItem } from '@/lib/ingestion/types';
import { streamAdmitadXmlFeed } from '@/lib/ingestion/admitadXmlFeedAdapter';

type AdmitadSourceConfig = {
  adapter: 'admitad_xml';
  feedEnv: string;
  rightsId: string;
  merchantSlug: string;
  merchantName: string;
  currency: 'AED' | 'USD';
  maxItemsPerRun?: number;
  requireImage?: boolean;
  minPrice?: number;
  maxPrice?: number;
  allowedCategories?: string[];
};

type SourceRow = {
  id: string;
  name: string;
  country_code: string;
  config: unknown;
  is_active: boolean;
};

export type AdmitadSyncResult = {
  sourceId: string;
  sourceName: string;
  runId?: string;
  status: 'success' | 'partial' | 'failed' | 'skipped';
  seen: number;
  staged: number;
  rejected: number;
  error?: string;
};

const BATCH_SIZE = 100;
const HARD_MAX_ITEMS = 5_000;

function safePositiveInt(value: unknown, fallback: number): number {
  const parsed = Number(value);
  return Number.isInteger(parsed) && parsed > 0 ? Math.min(parsed, HARD_MAX_ITEMS) : fallback;
}

function safeHttps(value: string): string | null {
  try {
    const url = new URL(value);
    return url.protocol === 'https:' ? url.toString() : null;
  } catch {
    return null;
  }
}

function stageRow(item: NormalizedItem, source: SourceRow, runId: string, candidates: CanonicalCandidate[], allowImage: boolean, allowDescription: boolean) {
  const suggestion = suggestExactMatch(item, candidates);
  const now = new Date().toISOString();
  return {
    source_id: source.id,
    run_id: runId,
    source_product_id: item.sku,
    raw_title: item.title,
    normalized_title: item.title,
    brand: item.brand,
    category_slug: item.categorySlug,
    price: item.price,
    currency: item.currency,
    product_url: item.url,
    image_url: allowImage ? safeHttps(item.imageUrl || '') : null,
    gtin: item.gtin || null,
    mpn: item.mpn || null,
    model: item.model || null,
    in_stock: item.inStock,
    shipping_info: item.shippingInfo,
    raw_payload: {
      adapter: 'admitad_xml',
      merchantSlug: item.merchantSlug,
      merchantName: item.merchantName,
      originalPrice: item.originalPrice ?? null,
      affiliateUrl: safeHttps(item.affiliateUrl || ''),
      imageUrls: allowImage ? (item.imageUrls || []).map(safeHttps).filter(Boolean) : [],
      description: allowDescription ? item.description || null : null,
      metadata: item.metadata || {},
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
}

async function sourceRows(): Promise<SourceRow[]> {
  const supabase = getServerSupabase();
  if (!supabase) return [];
  const { data, error } = await supabase
    .from('ingestion_sources')
    .select('id,name,country_code,config,is_active')
    .eq('source_type', 'affiliate_feed')
    .eq('is_active', true);
  if (error) throw error;
  return (data || []).filter((row: any) => row.config?.adapter === 'admitad_xml') as SourceRow[];
}

export async function syncConfiguredAdmitadFeeds(): Promise<AdmitadSyncResult[]> {
  const sources = await sourceRows();
  const results: AdmitadSyncResult[] = [];
  for (const source of sources) results.push(await syncAdmitadSource(source));
  return results;
}

export async function syncAdmitadSource(source: SourceRow): Promise<AdmitadSyncResult> {
  const config = source.config as AdmitadSourceConfig;
  const feedUrl = typeof config.feedEnv === 'string' ? process.env[config.feedEnv]?.trim() : undefined;
  if (!feedUrl || !config.rightsId || config.adapter !== 'admitad_xml') {
    return { sourceId: source.id, sourceName: source.name, status: 'skipped', seen: 0, staged: 0, rejected: 0, error: 'Feed configuration is incomplete' };
  }

  const rights = await getSourceRights(config.rightsId);
  if (!rights || !canPublishSource(rights)) {
    return { sourceId: source.id, sourceName: source.name, status: 'skipped', seen: 0, staged: 0, rejected: 0, error: 'Source rights are not active for publishing' };
  }

  const supabase = getServerSupabase();
  if (!supabase) return { sourceId: source.id, sourceName: source.name, status: 'failed', seen: 0, staged: 0, rejected: 0, error: 'Server database is not configured' };

  const { data: run, error: runError } = await supabase
    .from('ingestion_runs')
    .insert({ source_id: source.id, status: 'running', started_at: new Date().toISOString() })
    .select('id')
    .single();
  if (runError || !run) throw runError || new Error('Could not create ingestion run');

  let seen = 0;
  let staged = 0;
  let rejected = 0;
  const maxItems = safePositiveInt(config.maxItemsPerRun, safePositiveInt(process.env.ADMITAD_FEED_MAX_ITEMS_PER_RUN, 1_000));

  try {
    const { data: candidateRows, error: candidateError } = await supabase
      .from('products')
      .select('id,brand,name,model,gtin,sku,specs')
      .in('status', ['active', 'draft'])
      .limit(3_000);
    if (candidateError) throw candidateError;
    const candidates = (candidateRows || []) as CanonicalCandidate[];
    const pending: ReturnType<typeof stageRow>[] = [];

    const flush = async () => {
      if (pending.length === 0) return;
      const { error } = await supabase
        .from('ingestion_items')
        .upsert(pending.splice(0, pending.length), { onConflict: 'source_id,source_product_id', ignoreDuplicates: false });
      if (error) throw error;
    };

    for await (const raw of streamAdmitadXmlFeed({
      feedUrl,
      merchantSlug: config.merchantSlug,
      merchantName: config.merchantName,
      currency: config.currency,
      requireImage: config.requireImage !== false,
      minPrice: config.minPrice,
      maxPrice: config.maxPrice,
      allowedCategories: config.allowedCategories,
    })) {
      seen += 1;
      const item = normalizeMerchantItem(raw);
      if (!item.sku || !item.title || !item.price || !safeHttps(item.url)) {
        rejected += 1;
        continue;
      }
      pending.push(stageRow(item, source, run.id, candidates, rights.imageRight, rights.aiProcessingRight));
      staged += 1;
      if (pending.length >= BATCH_SIZE) await flush();
      if (seen >= maxItems) break;
    }
    await flush();

    const status = seen >= maxItems ? 'partial' : 'success';
    await supabase
      .from('ingestion_runs')
      .update({ status, items_seen: seen, items_staged: staged, items_rejected: rejected, finished_at: new Date().toISOString() })
      .eq('id', run.id);
    await supabase
      .from('ingestion_sources')
      .update({ last_ingested_at: new Date().toISOString(), error_count: 0, updated_at: new Date().toISOString() })
      .eq('id', source.id);
    return { sourceId: source.id, sourceName: source.name, runId: run.id, status, seen, staged, rejected };
  } catch (error) {
    const message = error instanceof Error ? error.message.slice(0, 1000) : 'Admitad feed sync failed';
    await supabase
      .from('ingestion_runs')
      .update({ status: 'failed', items_seen: seen, items_staged: staged, items_rejected: rejected, error_message: message, finished_at: new Date().toISOString() })
      .eq('id', run.id);
    await supabase
      .from('ingestion_sources')
      .update({ error_count: 1, last_error_at: new Date().toISOString(), updated_at: new Date().toISOString() })
      .eq('id', source.id);
    return { sourceId: source.id, sourceName: source.name, runId: run.id, status: 'failed', seen, staged, rejected, error: message };
  }
}
