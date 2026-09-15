import { NextRequest, NextResponse } from 'next/server';
import { getServerSupabase } from '@/lib/supabase/server';

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

    const supabase = getServerSupabase();
    if (!supabase) {
      return NextResponse.json(
        { error: 'Price alerts are not available yet. Please try again later.' },
        { status: 503 }
      );
    }

    const { data, error } = await supabase
      .from('watchlists')
      .insert({
        product_id: productId,
        target_price: alertType === 'below_amount' ? targetPrice : null,
        alert_type: alertType,
        email: email || null,
      })
      .select('id, product_id, target_price, alert_type, created_at')
      .single();

    if (error) {
      console.error('Supabase watchlist error:', error);
      return NextResponse.json(
        { error: 'We could not save this price alert. Please try again.' },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        status: 'saved',
        message: email
          ? 'Price alert saved. Email delivery will be enabled only after verification is configured.'
          : 'Price alert saved for this device.',
        alert: {
          id: data?.id,
          productId: data?.product_id ?? productId,
          targetPrice: data?.target_price ?? null,
          alertType: data?.alert_type ?? alertType,
          country,
          createdAt: data?.created_at ?? new Date().toISOString(),
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error handling alert subscription:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
