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
          country_code,
          product_url,
          price,
          currency,
          availability,
          is_active,
          last_checked_at,
          merchants!inner(id,name,website_url,country_code,is_active),
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

    let destination: URL;
    try {
      destination = new URL(offer.product_url);
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
    const hostAllowed =
      merchantHost.length > 0 &&
      (destinationHost === merchantHost || destinationHost.endsWith(`.${merchantHost}`));

    if (!hostAllowed) {
      console.error('Blocked outbound destination host mismatch', {
        offerId,
        merchantHost,
        destinationHost,
      });
      return NextResponse.json(
        { error: 'Retailer destination failed validation.' },
        { status: 500, headers: { 'X-Robots-Tag': 'noindex, nofollow' } }
      );
    }

    // The production database does not yet contain the final outbound analytics table.
    // Do not fabricate a successful analytics write or trust client-supplied commercial facts.
    console.info('Validated retailer hand-off', {
      offerId: offer.id,
      productId: offer.product_id,
      merchantId: offer.merchant_id,
      market,
      price: offer.price,
      currency: offer.currency,
      lastCheckedAt: offer.last_checked_at,
    });

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
