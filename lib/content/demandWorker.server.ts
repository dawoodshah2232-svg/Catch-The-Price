import 'server-only';

import { getServerSupabase } from '@/lib/supabase/server';

type SearchEvent = {
  country_code: 'ae' | 'us' | null;
  search_query: string | null;
  metadata: Record<string, unknown> | null;
  created_at: string;
};

type ExistingOpportunity = {
  topic: string;
  market: string;
};

function normalizeQuery(value: string | null): string | null {
  if (!value) return null;
  const normalized = value.trim().replace(/\s+/g, ' ').toLowerCase();
  if (normalized.length < 3 || normalized.length > 100) return null;
  return normalized;
}

function titleCase(value: string) {
  return value.replace(/\b\w/g, (char) => char.toUpperCase());
}

function categoryFor(query: string): string | null {
  if (/iphone|galaxy|pixel|phone|smartphone|fold/.test(query)) return 'phones';
  if (/laptop|macbook|notebook|ultrabook/.test(query)) return 'laptops';
  if (/gpu|graphics card|rtx|radeon|cpu|processor|ryzen|intel core/.test(query)) return 'pc-components';
  if (/playstation|ps5|xbox|nintendo|console|gaming/.test(query)) return 'gaming';
  if (/oled|qled|television|\btv\b/.test(query)) return 'tvs';
  if (/headphone|headset|earbud|airpods/.test(query)) return 'headphones';
  if (/watch|smartwatch|garmin/.test(query)) return 'smartwatches';
  return null;
}

function intentFor(query: string): 'commercial' | 'transactional' | 'informational' | 'comparison' | 'news' {
  if (/\bvs\b|versus|compare|comparison/.test(query)) return 'comparison';
  if (/price|deal|discount|buy|cheap|sale|offer/.test(query)) return 'transactional';
  if (/how|what|why|review|guide|worth/.test(query)) return 'informational';
  return 'commercial';
}

export type DemandDiscoveryResult = {
  eventsRead: number;
  zeroResultEvents: number;
  groupedQueries: number;
  created: number;
  skippedExisting: number;
  skippedLowDemand: number;
};

export async function discoverContentDemand(): Promise<DemandDiscoveryResult> {
  const supabase = getServerSupabase();
  if (!supabase) throw new Error('Server database is not configured.');

  const since = new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString();
  const { data: eventsData, error: eventsError } = await supabase
    .from('analytics_events')
    .select('country_code,search_query,metadata,created_at')
    .eq('event_type', 'search')
    .gte('created_at', since)
    .order('created_at', { ascending: false })
    .limit(5000);

  if (eventsError) throw eventsError;
  const events = (eventsData || []) as SearchEvent[];

  const grouped = new Map<string, { market: 'ae' | 'us'; query: string; count: number }>();
  let zeroResultEvents = 0;

  for (const event of events) {
    if (!event.country_code || !['ae', 'us'].includes(event.country_code)) continue;
    if (event.metadata?.zero_result !== true) continue;
    const query = normalizeQuery(event.search_query);
    if (!query) continue;

    zeroResultEvents += 1;
    const key = `${event.country_code}:${query}`;
    const current = grouped.get(key);
    grouped.set(key, {
      market: event.country_code,
      query,
      count: (current?.count || 0) + 1,
    });
  }

  const { data: existingData, error: existingError } = await supabase
    .from('content_opportunities')
    .select('topic,market')
    .limit(5000);
  if (existingError) throw existingError;

  const existing = new Set(
    ((existingData || []) as ExistingOpportunity[]).map((row) => `${row.market}:${row.topic.trim().toLowerCase()}`)
  );

  const result: DemandDiscoveryResult = {
    eventsRead: events.length,
    zeroResultEvents,
    groupedQueries: grouped.size,
    created: 0,
    skippedExisting: 0,
    skippedLowDemand: 0,
  };

  const candidates = [...grouped.values()]
    .sort((a, b) => b.count - a.count || a.query.localeCompare(b.query))
    .slice(0, 100);

  const rows = [];
  for (const candidate of candidates) {
    if (candidate.count < 2) {
      result.skippedLowDemand += 1;
      continue;
    }

    const topic = titleCase(candidate.query);
    const key = `${candidate.market}:${topic.toLowerCase()}`;
    if (existing.has(key)) {
      result.skippedExisting += 1;
      continue;
    }

    const confidence = Math.min(95, 45 + candidate.count * 8);
    const seoPotential = Math.min(95, 50 + candidate.count * 7);
    const commercialIntent = /price|deal|discount|buy|cheap|sale|offer|best|vs|compare/.test(candidate.query)
      ? Math.min(95, 70 + candidate.count * 4)
      : Math.min(85, 55 + candidate.count * 3);

    rows.push({
      topic,
      market: candidate.market,
      category_slug: categoryFor(candidate.query),
      search_intent: intentFor(candidate.query),
      source_urls: [],
      evidence_summary: `${candidate.count} zero-result searches recorded in the last 14 days for this market. This is first-party demand evidence only; factual research is still required before drafting.`,
      confidence,
      seo_potential: seoPotential,
      commercial_intent: commercialIntent,
      status: 'new',
    });
    existing.add(key);
  }

  if (rows.length > 0) {
    const { error: insertError } = await supabase.from('content_opportunities').insert(rows);
    if (insertError) throw insertError;
    result.created = rows.length;
  }

  await supabase.from('ai_jobs').insert({
    job_type: 'trend_research',
    status: 'completed',
    model_name: 'deterministic-search-demand-worker',
    input_reference: `analytics_events since ${since}`,
    output_reference: `content_opportunities:${result.created}`,
    confidence: result.created > 0 ? 90 : 70,
    estimated_cost_usd: 0,
    actual_cost_usd: 0,
    started_at: new Date().toISOString(),
    finished_at: new Date().toISOString(),
  });

  return result;
}
