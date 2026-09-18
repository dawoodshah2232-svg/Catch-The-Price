import { NextRequest, NextResponse } from 'next/server';
import { getServerSupabase } from '@/lib/supabase/server';
import { generateClickId, buildAffiliateUrl } from '@/lib/affiliate/affiliateEngine';

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const VALID_MARKETS = new Set(['ae', 'us']);

function normalizeHost(value: string): string {
  return value.toLowerCase().replace(/^www\./, '');
}

function isApprovedAdmitadHost(host: string): boolean {
  return host === 'ad.admitad.com' || host === 'ad.admitad.ru';
}

function isApprovedNoonAffiliateHost(host: string): boolean {
  return host === 's.noon.com';
}

function isApprovedAmazonAffiliateHost(host: string): boolean {
  return host === 'amzn.to' || host === 'a.co';
}

function isAmazonMerchant(merchant: { affiliate_network?: string | null; website_url?: string | null; name?: string | null } | null): boolean {
  let host = '';
  try {
    host = merchant?.website_url ? normalizeHost(new URL(merchant.website_url).hostname) : '';
  } catch {
    host = '';
  }
  return merchant?.affiliate_network === 'AMAZON_ASSOCIATES' || host === 'amazon.ae' || host.endsWith('.amazon.ae') || /^amazon\b/i.test(merchant?.name || '');
}

function getNoonAffiliateFallback(merchant: { affiliate_network?: string | null; website_url?: string | null; name?: string | null } | null): string | null {
  let host = '';
  try {
    host = merchant?.website_url ? normalizeHost(new URL(merchant.website_url).hostname) : '';
  } catch {
    host = '';
  }
  const isNoon = merchant?.affiliate_network === 'NOON_AFFILIATE' || host === 'noon.com' || host.endsWith('.noon.com') || /^noon\b/i.test(merchant?.name || '');
  if (!isNoon) return null;
  return process.env.NOON_AFFILIATE_TRACKING_URL?.trim() || null;
}

function getDeviceType(userAgent: string): 'mobile' | 'tablet' | 'desktop' | 'unknown' {
  const ua = userAgent.toLowerCase();
  if (!ua) return 'unknown';
  if (/ipad|tablet|kindle|silk/.test(ua)) return 'tablet';
  if (/mobi|iphone|ipod|android/.test(ua)) return 'mobile';
  if (/windows|macintosh|linux|cros/.test(ua)) return 'desktop';
  return 'unknown';
}

function getReferrerHost(value: string | null): string | null {
  if (!value) return null;
  try {
    return normalizeHost(new URL(value).hostname).slice(0, 255);
  } catch {
    return null;
  }
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const offerId = searchParams.get('offerId')?.trim() || '';
  const requestedCountry = (searchParams.get('country') || '').toLowerCase();

  if (!UUID_RE.test(offerId)) {
    return NextResponse.json(
      { error: 'This offer is not available from a verified production source.' },
      { status: 404, headers: { 'X-Robots-Tag': 'noindex, nofollow' } }
    );
  }

  const supabase = getServerSupabase();
  if (!supabase) {
    return NextResponse.json(
      { error: 'Retailer links are temporarily unavailable.' },
      { status: 503, headers: { 'X-Robots-Tag': 'noindex, nofollow' } }
    );
  }

  try {
    const { data: offer, error } = await supabase
      .from('offers')
      .select(
        `
          id,
          product_id,
          merchant_id,
          country_code,
          product_url,
          affiliate_url,
          price,
          currency,
          availability,
          is_active,
          last_checked_at,
          merchants!inner(id,name,website_url,country_code,is_active,affiliate_network),
          products!inner(id,name,status)
        `
      )
      .eq('id', offerId)
      .maybeSingle();

    if (error) {
      console.error('Failed to resolve outbound offer:', error);
      return NextResponse.json(
        { error: 'Retailer link could not be resolved.' },
        { status: 500, headers: { 'X-Robots-Tag': 'noindex, nofollow' } }
      );
    }

    if (!offer) {
      return NextResponse.json(
        { error: 'Offer not found or no longer available.' },
        { status: 404, headers: { 'X-Robots-Tag': 'noindex, nofollow' } }
      );
    }

    const merchant = Array.isArray(offer.merchants) ? offer.merchants[0] : offer.merchants;
    const product = Array.isArray(offer.products) ? offer.products[0] : offer.products;
    const market = String(offer.country_code || merchant?.country_code || '').toLowerCase();

    if (!VALID_MARKETS.has(market) || (requestedCountry && requestedCountry !== market)) {
      return NextResponse.json(
        { error: 'This offer is not valid for the selected market.' },
        { status: 409, headers: { 'X-Robots-Tag': 'noindex, nofollow' } }
      );
    }

    if (!offer.is_active || !merchant?.is_active || product?.status !== 'active' || offer.availability !== 'in_stock') {
      return NextResponse.json(
        { error: 'This retailer offer is currently unavailable.' },
        { status: 410, headers: { 'X-Robots-Tag': 'noindex, nofollow' } }
      );
    }

    const affiliateUrl = offer.affiliate_url?.trim() || getNoonAffiliateFallback(merchant);

    let destination: URL;
    try {
      destination = new URL(affiliateUrl || offer.product_url);
    } catch {
      return NextResponse.json(
        { error: 'Retailer destination is invalid.' },
        { status: 500, headers: { 'X-Robots-Tag': 'noindex, nofollow' } }
      );
    }

    if (destination.protocol !== 'https:') {
      return NextResponse.json(
        { error: 'Retailer destination is not secure.' },
        { status: 500, headers: { 'X-Robots-Tag': 'noindex, nofollow' } }
      );
    }

    let merchantHost = '';
    try {
      merchantHost = normalizeHost(new URL(merchant.website_url).hostname);
    } catch {
      merchantHost = '';
    }

    const destinationHost = normalizeHost(destination.hostname);
    const merchantDestination = merchantHost.length > 0 && (destinationHost === merchantHost || destinationHost.endsWith(`.${merchantHost}`));
    const affiliateDestination = Boolean(affiliateUrl) && (
      isApprovedAdmitadHost(destinationHost) ||
      isApprovedNoonAffiliateHost(destinationHost) ||
      (isAmazonMerchant(merchant) && isApprovedAmazonAffiliateHost(destinationHost))
    );
    const hostAllowed = merchantDestination || affiliateDestination;

    if (!hostAllowed) {
      console.error('Blocked outbound destination host mismatch', { offerId, merchantHost, destinationHost });
      return NextResponse.json(
        { error: 'Retailer destination failed validation.' },
        { status: 500, headers: { 'X-Robots-Tag': 'noindex, nofollow' } }
      );
    }

    const userAgent = request.headers.get('user-agent') || '';
    const referrerHost = getReferrerHost(request.headers.get('referer'));
    const clickId = generateClickId();

    const { destinationUrl } = buildAffiliateUrl({
      productUrl: offer.product_url,
      affiliateUrl,
      clickId,
    });

    const destinationType = affiliateUrl ? 'affiliate' : 'retailer';
    try {
      if (new URL(destinationUrl).protocol !== 'https:') {
        return NextResponse.json(
          { error: 'Retailer destination is not secure.' },
          { status: 500, headers: { 'X-Robots-Tag': 'noindex, nofollow' } }
        );
      }
    } catch {
      return NextResponse.json(
        { error: 'Retailer destination is invalid.' },
        { status: 500, headers: { 'X-Robots-Tag': 'noindex, nofollow' } }
      );
    }

    const { error: clickError } = await supabase.from('outbound_clicks').insert({
      offer_id: offer.id,
      product_id: offer.product_id,
      merchant_id: offer.merchant_id,
      country_code: market,
      price: offer.price,
      currency: offer.currency,
      referrer_host: referrerHost,
      device_type: getDeviceType(userAgent),
      click_id: clickId,
      destination_type: destinationType,
      affiliate_network: merchant.affiliate_network || null,
    });

    if (clickError) {
      // Analytics must never block a valid retailer hand-off.
      console.error('Outbound analytics write failed:', clickError);
    }

    return NextResponse.redirect(destinationUrl, {
      status: 307,
      headers: {
        'Cache-Control': 'no-store, max-age=0',
        'X-Robots-Tag': 'noindex, nofollow',
      },
    });
  } catch (error) {
    console.error('Unexpected outbound resolution failure:', error);
    return NextResponse.json(
      { error: 'Retailer link is temporarily unavailable.' },
      { status: 500, headers: { 'X-Robots-Tag': 'noindex, nofollow' } }
    );
  }
}
