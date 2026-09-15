import { NextRequest, NextResponse } from 'next/server';
import { getServerSupabase } from '@/lib/supabase/server';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const offerId = searchParams.get('offerId') || 'unknown';
  const targetUrl = searchParams.get('targetUrl');
  const country = searchParams.get('country') || 'ae';
  const productTitle = searchParams.get('productTitle') || 'Unknown Product';
  const merchantName = searchParams.get('merchantName') || 'Merchant';
  const price = searchParams.get('price') || '0';

  if (!targetUrl) {
    return NextResponse.redirect(new URL(`/${country}`, request.url));
  }

  try {
    const supabase = getServerSupabase();
    if (supabase) {
      await supabase.from('outbound_clicks').insert({
        offer_id: offerId !== 'unknown' ? offerId : null,
        country,
        price: parseFloat(price) || 0,
        referrer: request.headers.get('referer') || '',
        user_agent: request.headers.get('user-agent') || '',
      });
    } else {
      console.log(`[OUTBOUND CLICK TRACKED] Product: "${productTitle}" | Store: "${merchantName}" | Price: ${price} | Country: ${country}`);
    }
  } catch (err) {
    console.error('Failed to log outbound click:', err);
  }

  // Do not invent affiliate IDs. Until a real merchant affiliate account is connected,
  // preserve the retailer URL and only add neutral attribution parameters where safe.
  let destinationUrl = targetUrl;
  try {
    const parsed = new URL(targetUrl);
    if (!parsed.searchParams.has('utm_source')) {
      parsed.searchParams.set('utm_source', 'catchtheprice');
      parsed.searchParams.set('utm_medium', 'referral');
    }
    destinationUrl = parsed.toString();
  } catch {
    destinationUrl = targetUrl;
  }

  return NextResponse.redirect(destinationUrl, {
    status: 307,
    headers: {
      'Cache-Control': 'no-store, max-age=0',
      'X-Robots-Tag': 'noindex, nofollow',
    },
  });
}
