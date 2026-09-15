import { NextRequest, NextResponse } from 'next/server';

const VALID_ALERT_TYPES = new Set(['any_drop', 'below_amount', 'major_deal']);
const VALID_COUNTRIES = new Set(['ae', 'us']);

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const productId = typeof body.productId === 'string' ? body.productId.trim() : '';
    const alertType = typeof body.alertType === 'string' ? body.alertType : 'any_drop';
    const country = typeof body.country === 'string' ? body.country.toLowerCase() : 'ae';
    const email = typeof body.email === 'string' ? body.email.trim() : '';
    const targetPrice = body.targetPrice == null ? null : Number(body.targetPrice);

    if (!productId) {
      return NextResponse.json({ error: 'Missing productId' }, { status: 400 });
    }

    if (!VALID_ALERT_TYPES.has(alertType)) {
      return NextResponse.json({ error: 'Invalid alert type' }, { status: 400 });
    }

    if (!VALID_COUNTRIES.has(country)) {
      return NextResponse.json({ error: 'Unsupported market' }, { status: 400 });
    }

    if (alertType === 'below_amount' && (!Number.isFinite(targetPrice) || Number(targetPrice) <= 0)) {
      return NextResponse.json({ error: 'A valid target price is required' }, { status: 400 });
    }

    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: 'Invalid email address' }, { status: 400 });
    }

    // The live Supabase watchlists table is account-owned and protected by RLS.
    // Until the authenticated account + verification + notification flow is finished,
    // we must not use the service role to create anonymous rows or claim alert delivery works.
    return NextResponse.json(
      {
        error: 'Price alerts are being connected to verified accounts and email delivery. This feature is not active yet.',
        status: 'not_ready',
      },
      { status: 503 }
    );
  } catch (error) {
    console.error('Error handling alert subscription:', error);
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }
}
