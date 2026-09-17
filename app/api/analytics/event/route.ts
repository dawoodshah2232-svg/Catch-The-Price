import { NextRequest, NextResponse } from 'next/server';
import { getServerSupabase } from '@/lib/supabase/server';

const VALID_EVENTS = new Set([
  'page_view',
  'search',
  'product_view',
  'save',
  'save_product',
  'alert_intent',
  'create_alert',
  'compare',
  'affiliate_click',
  'retailer_click',
  'deal_view',
  'guide_view',
]);
const VALID_MARKETS = new Set(['ae', 'us']);
const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

function getDeviceType(userAgent: string): 'mobile' | 'tablet' | 'desktop' | 'unknown' {
  const ua = userAgent.toLowerCase();
  if (!ua) return 'unknown';
  if (/ipad|tablet|kindle|silk/.test(ua)) return 'tablet';
  if (/mobi|iphone|ipod|android/.test(ua)) return 'mobile';
  if (/windows|macintosh|linux|cros/.test(ua)) return 'desktop';
  return 'unknown';
}

function referrerHost(value: string | null): string | null {
  if (!value) return null;
  try {
    return new URL(value).hostname.toLowerCase().replace(/^www\./, '').slice(0, 255);
  } catch {
    return null;
  }
}

function safePath(value: unknown): string | null {
  if (typeof value !== 'string') return null;
  const path = value.trim();
  if (!path.startsWith('/') || path.length > 500 || path.includes('://')) return null;
  return path;
}

function safeText(value: unknown, max = 120): string | null {
  if (typeof value !== 'string') return null;
  const text = value.trim().replace(/\s+/g, ' ');
  return text ? text.slice(0, max) : null;
}

function safeCount(value: unknown): number | null {
  const number = Number(value);
  if (!Number.isInteger(number) || number < 0 || number > 100000) return null;
  return number;
}

export async function POST(request: NextRequest) {
  const supabase = getServerSupabase();
  if (!supabase) {
    return NextResponse.json({ ok: true, queued: false, reason: 'unconfigured' }, { status: 200 });
  }

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  const eventType = typeof body.eventType === 'string' ? body.eventType : '';
  const country = typeof body.country === 'string' ? body.country.toLowerCase() : '';
  const path = safePath(body.path);
  const sessionId = typeof body.sessionId === 'string' && UUID_RE.test(body.sessionId) ? body.sessionId : null;

  if (!VALID_EVENTS.has(eventType) || !VALID_MARKETS.has(country) || !path) {
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  const searchQuery = eventType === 'search' ? safeText(body.searchQuery, 120) : null;
  const productSlug =
    eventType === 'product_view' ||
    eventType === 'save' ||
    eventType === 'save_product' ||
    eventType === 'alert_intent' ||
    eventType === 'create_alert' ||
    eventType === 'deal_view'
      ? safeText(body.productSlug, 160)
      : null;

  const metadata: Record<string, string | number | boolean> = {};

  if (eventType === 'search') {
    const resultCount = safeCount(body.resultCount);
    if (resultCount !== null) {
      metadata.result_count = resultCount;
      metadata.zero_result = resultCount === 0;
    }
  }

  if ((eventType === 'save' || eventType === 'save_product') && typeof body.saved === 'boolean') {
    metadata.saved = body.saved;
  }

  if (eventType === 'create_alert' || eventType === 'alert_intent') {
    if (typeof body.targetPrice === 'number' && Number.isFinite(body.targetPrice)) {
      metadata.target_price = body.targetPrice;
    }
  }

  if (eventType === 'compare') {
    if (body.leftProduct) metadata.left_product = safeText(body.leftProduct, 160) || '';
    if (body.rightProduct) metadata.right_product = safeText(body.rightProduct, 160) || '';
  }

  if (eventType === 'affiliate_click' || eventType === 'retailer_click') {
    if (body.offerId) metadata.offer_id = safeText(body.offerId, 80) || '';
    if (body.merchantName) metadata.merchant_name = safeText(body.merchantName, 100) || '';
  }

  if (eventType === 'deal_view') {
    if (typeof body.dealScore === 'number') metadata.deal_score = body.dealScore;
    if (body.category) metadata.category = safeText(body.category, 60) || '';
  }

  if (eventType === 'guide_view') {
    if (body.guideSlug) metadata.guide_slug = safeText(body.guideSlug, 120) || '';
    if (body.category) metadata.category = safeText(body.category, 60) || '';
  }

  const { error } = await supabase.from('analytics_events').insert({
    event_type: eventType,
    country_code: country,
    path,
    referrer_host: referrerHost(request.headers.get('referer')),
    device_type: getDeviceType(request.headers.get('user-agent') || ''),
    session_id: sessionId,
    search_query: searchQuery,
    product_slug: productSlug,
    metadata,
  });

  if (error) {
    console.warn('Analytics event insert skipped/failed:', error.message);
    return NextResponse.json({ ok: false, queued: false, error: error.message }, { status: 200 });
  }

  return new NextResponse(null, { status: 204, headers: { 'Cache-Control': 'no-store' } });
}
