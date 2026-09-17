import { NextRequest, NextResponse } from 'next/server';
import { createAuthServerClient } from '@/lib/supabase/auth-server';
import { getCatalogProducts } from '@/lib/data/catalog.server';
import { CountryCode } from '@/lib/types';

const VALID_COUNTRIES = new Set<CountryCode>(['ae', 'us']);

async function getAuthedClient() {
  const supabase = await createAuthServerClient();
  if (!supabase) return { supabase: null, user: null };

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) return { supabase, user: null };
  return { supabase, user };
}

export async function GET(request: NextRequest) {
  const { supabase, user } = await getAuthedClient();
  if (!supabase || !user) {
    return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
  }

  const countryParam = (request.nextUrl.searchParams.get('country') || 'ae').toLowerCase() as CountryCode;
  const country: CountryCode = VALID_COUNTRIES.has(countryParam) ? countryParam : 'ae';

  const [alertsRes, catalogRes] = await Promise.all([
    supabase
      .from('price_alerts')
      .select('*')
      .eq('user_id', user.id)
      .eq('country_code', country)
      .order('created_at', { ascending: false }),
    getCatalogProducts(country),
  ]);

  let alerts = alertsRes.data || [];

  // Fallback to watchlists table if price_alerts is empty
  if (alerts.length === 0) {
    const { data: watchlists } = await supabase
      .from('watchlists')
      .select('*')
      .eq('user_id', user.id)
      .eq('country_code', country)
      .neq('alert_type', 'saved');

    if (watchlists && watchlists.length > 0) {
      alerts = watchlists.map((w) => ({
        id: w.id,
        user_id: w.user_id,
        product_id: w.product_id,
        country_code: w.country_code,
        target_price: w.target_price,
        initial_price: null,
        alert_type: w.alert_type || 'below_amount',
        is_active: w.is_active,
        notify_email: w.notify_email,
        created_at: w.created_at,
        updated_at: w.updated_at,
      }));
    }
  }

  const catalogMap = new Map(catalogRes.products.map((p) => [p.id, p]));

  const enrichedAlerts = alerts.map((alert) => {
    const product = catalogMap.get(alert.product_id);
    const currentPrice = product?.currentBestPrice || 0;
    const target = Number(alert.target_price);
    const difference = currentPrice > 0 && target > 0 ? currentPrice - target : 0;
    const differencePercent = currentPrice > 0 && target > 0 ? ((currentPrice - target) / currentPrice) * 100 : 0;
    const isTargetReached = target > 0 && currentPrice > 0 && currentPrice <= target;

    return {
      id: alert.id,
      productId: alert.product_id,
      country: alert.country_code,
      targetPrice: target,
      initialPrice: alert.initial_price ? Number(alert.initial_price) : currentPrice,
      currentPrice,
      difference,
      differencePercent: Math.round(differencePercent * 10) / 10,
      isTargetReached,
      alertType: alert.alert_type,
      isActive: alert.is_active,
      createdAt: alert.created_at,
      product: product
        ? {
            id: product.id,
            title: product.title,
            slug: product.slug,
            imageUrl: product.imageUrl,
            currentBestPrice: product.currentBestPrice,
            currency: product.currency,
            bestMerchantName: product.bestMerchantName,
          }
        : null,
    };
  });

  return NextResponse.json({ alerts: enrichedAlerts, count: enrichedAlerts.length });
}

export async function POST(request: NextRequest) {
  const { supabase, user } = await getAuthedClient();
  if (!supabase || !user) {
    return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
  }

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
  }

  const productId = typeof body.productId === 'string' ? body.productId.trim() : '';
  const countryParam = typeof body.country === 'string' ? body.country.toLowerCase() : 'ae';
  const country = VALID_COUNTRIES.has(countryParam as CountryCode) ? countryParam : 'ae';
  const targetPrice = Number(body.targetPrice);
  const alertType = typeof body.alertType === 'string' ? body.alertType : 'below_amount';
  const initialPrice = body.initialPrice ? Number(body.initialPrice) : null;

  if (!productId) {
    return NextResponse.json({ error: 'Missing productId' }, { status: 400 });
  }

  if (alertType === 'below_amount' && (!Number.isFinite(targetPrice) || targetPrice <= 0)) {
    return NextResponse.json({ error: 'A valid target price greater than 0 is required.' }, { status: 400 });
  }

  const { data, error } = await supabase
    .from('price_alerts')
    .upsert(
      {
        user_id: user.id,
        product_id: productId,
        country_code: country,
        target_price: targetPrice || 0,
        initial_price: initialPrice,
        alert_type: alertType,
        is_active: true,
        notify_email: user.email,
        updated_at: new Date().toISOString(),
      },
      { onConflict: 'user_id,product_id,country_code,alert_type' }
    )
    .select()
    .single();

  if (error) {
    console.error('Create alert error:', error);
    return NextResponse.json({ error: 'Could not create price alert' }, { status: 500 });
  }

  // Also sync watchlists table for legacy runner
  try {
    await supabase.from('watchlists').upsert(
      {
        user_id: user.id,
        product_id: productId,
        country_code: country,
        target_price: targetPrice || null,
        alert_type: alertType,
        notify_email: user.email,
        is_active: true,
        updated_at: new Date().toISOString(),
      },
      { onConflict: 'user_id,product_id,country_code' }
    );
  } catch {}

  return NextResponse.json({ success: true, alert: data });
}

export async function PATCH(request: NextRequest) {
  const { supabase, user } = await getAuthedClient();
  if (!supabase || !user) {
    return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
  }

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
  }

  const alertId = typeof body.id === 'string' ? body.id : '';
  if (!alertId) {
    return NextResponse.json({ error: 'Missing alert ID' }, { status: 400 });
  }

  const updates: Record<string, unknown> = { updated_at: new Date().toISOString() };
  if (typeof body.isActive === 'boolean') updates.is_active = body.isActive;
  if (Number.isFinite(Number(body.targetPrice)) && Number(body.targetPrice) > 0) {
    updates.target_price = Number(body.targetPrice);
  }

  const { data, error } = await supabase
    .from('price_alerts')
    .update(updates)
    .eq('id', alertId)
    .eq('user_id', user.id)
    .select()
    .single();

  if (error) {
    console.error('Update alert error:', error);
    return NextResponse.json({ error: 'Could not update alert' }, { status: 500 });
  }

  return NextResponse.json({ success: true, alert: data });
}

export async function DELETE(request: NextRequest) {
  const { supabase, user } = await getAuthedClient();
  if (!supabase || !user) {
    return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const alertId = searchParams.get('id');

  if (!alertId) {
    return NextResponse.json({ error: 'Missing alert ID' }, { status: 400 });
  }

  const { error } = await supabase
    .from('price_alerts')
    .delete()
    .eq('id', alertId)
    .eq('user_id', user.id);

  if (error) {
    console.error('Delete alert error:', error);
    return NextResponse.json({ error: 'Could not delete price alert' }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
