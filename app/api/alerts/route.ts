import { NextRequest, NextResponse } from 'next/server';
import { createAuthServerClient } from '@/lib/supabase/auth-server';

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

    if (!productId) return NextResponse.json({ error: 'Missing productId' }, { status: 400 });
    if (!VALID_ALERT_TYPES.has(alertType)) return NextResponse.json({ error: 'Invalid alert type' }, { status: 400 });
    if (!VALID_COUNTRIES.has(country)) return NextResponse.json({ error: 'Unsupported market' }, { status: 400 });
    if (alertType === 'below_amount' && (!Number.isFinite(targetPrice) || Number(targetPrice) <= 0)) {
      return NextResponse.json({ error: 'A valid target price is required' }, { status: 400 });
    }
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: 'Invalid email address' }, { status: 400 });
    }

    const supabase = await createAuthServerClient();
    if (!supabase) return NextResponse.json({ error: 'Account service is not configured.' }, { status: 503 });

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return NextResponse.json(
        { error: 'Please sign in before creating a price alert.', status: 'authentication_required' },
        { status: 401 }
      );
    }

    const { data: product, error: productError } = await supabase
      .from('products')
      .select('id,status')
      .eq('id', productId)
      .maybeSingle();

    if (productError || !product || product.status !== 'active') {
      return NextResponse.json({ error: 'This product is not available for tracking.' }, { status: 404 });
    }

    const { data, error } = await supabase
      .from('watchlists')
      .upsert(
        {
          user_id: user.id,
          product_id: productId,
          country_code: country,
          target_price: alertType === 'below_amount' ? targetPrice : null,
          alert_type: alertType,
          notify_email: email || user.email || null,
          email_verified: false,
          is_active: true,
          updated_at: new Date().toISOString(),
        },
        { onConflict: 'user_id,product_id,country_code' }
      )
      .select('id,product_id,target_price,country_code,is_active,alert_type,created_at,updated_at')
      .single();

    if (error) {
      console.error('Price alert persistence failed:', error);
      return NextResponse.json({ error: 'We could not save this price alert.' }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      alert: data,
      delivery: {
        emailConfigured: false,
        message: 'The alert is saved to your account. Email delivery will be enabled after verification and notification delivery are configured.',
      },
    });
  } catch (error) {
    console.error('Error handling alert subscription:', error);
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }
}
