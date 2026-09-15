import { NextRequest, NextResponse } from 'next/server';
import { getServerSupabase } from '@/lib/supabase/server';

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const VALID_MARKETS = new Set(['ae', 'us']);

function normalizeHost(value: string): string {
  return value.toLowerCase().replace(/^www\./, '');
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
          url,
          price,
          currency,
          in_stock,
          last_checked_at,
          merchants!inner(id,name,domain,country,is_active),
          products!inner(id,title,country)
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
    const market = String(product?.country || merchant?.country || '').toLowerCase();

    if (!VALID_MARKETS.has(market) || (requestedCountry && requestedCountry !== market)) {
      return NextResponse.json(
        { error: 'This offer is not valid for the selected market.' },
        { status: 409, headers: { 'X-Robots-Tag': 'noindex, nofollow' } }
      );
    }

    if (!merchant?.is_active || !offer.in_stock) {
      return NextResponse.json(
        { error: 'This retailer offer is currently unavailable.' },
        { status: 410, headers: { 'X-Robots-Tag': 'noindex, nofollow' } }
      );
    }

    let destination: URL;
    try {
      destination = new URL(offer.url);
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

    const expectedDomain = normalizeHost(String(merchant.domain || ''));
    const destinationHost = normalizeHost(destination.hostname);
    const hostAllowed =
      expectedDomain.length > 0 &&
      (destinationHost === expectedDomain || destinationHost.endsWith(`.${expectedDomain}`));

    if (!hostAllowed) {
      console.error('Blocked outbound destination host mismatch', {
        offerId,
        expectedDomain,
        destinationHost,
      });
      return NextResponse.json(
        { error: 'Retailer destination failed validation.' },
        { status: 500, headers: { 'X-Robots-Tag': 'noindex, nofollow' } }
      );
    }

    // Record only server-resolved commercial facts. Do not trust client-provided price,
    // merchant, product, or destination values.
    const referrer = request.headers.get('referer') || '';
    const userAgent = request.headers.get('user-agent') || '';

    const { error: clickError } = await supabase.from('outbound_clicks').insert({
      offer_id: offer.id,
      product_id: offer.product_id,
      merchant_id: offer.merchant_id,
      country: market,
      price: offer.price,
      currency: offer.currency,
      referrer: referrer.slice(0, 1000),
      user_agent: userAgent.slice(0, 500),
    });

    if (clickError) {
      // Analytics failure must not trap the shopper when the validated destination is safe.
      console.error('Failed to log outbound click:', clickError);
    }

    return NextResponse.redirect(destination.toString(), {
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
