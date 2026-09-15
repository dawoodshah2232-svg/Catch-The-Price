import { NextRequest, NextResponse } from 'next/server';
import { createAuthServerClient } from '@/lib/supabase/auth-server';

const VALID_COUNTRIES = new Set(['ae', 'us']);
const VALID_ALERT_TYPES = new Set(['saved', 'any_drop', 'below_amount', 'major_deal']);

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
  if (!supabase || !user) return NextResponse.json({ error: 'Authentication required' }, { status: 401 });

  const country = (request.nextUrl.searchParams.get('country') || 'ae').toLowerCase();
  if (!VALID_COUNTRIES.has(country)) return NextResponse.json({ error: 'Unsupported market' }, { status: 400 });

  const { data, error } = await supabase
    .from('watchlists')
    .select('id,product_id,target_price,country_code,is_active,alert_type,notify_email,email_verified,created_at,updated_at,products(id,name,slug,image_url)')
    .eq('user_id', user.id)
    .eq('country_code', country)
    .eq('is_active', true)
    .order('updated_at', { ascending: false });

  if (error) {
    console.error('Watchlist read failed:', error);
    return NextResponse.json({ error: 'Could not load saved products.' }, { status: 500 });
  }

  return NextResponse.json({ items: data || [] });
}

export async function POST(request: NextRequest) {
  const { supabase, user } = await getAuthedClient();
  if (!supabase || !user) return NextResponse.json({ error: 'Authentication required' }, { status: 401 });

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
  }

  const productId = typeof body.productId === 'string' ? body.productId.trim() : '';
  const country = typeof body.country === 'string' ? body.country.toLowerCase() : 'ae';
  const alertType = typeof body.alertType === 'string' ? body.alertType : 'saved';
  const targetPrice = body.targetPrice == null ? null : Number(body.targetPrice);
  const notifyEmail = typeof body.notifyEmail === 'string' ? body.notifyEmail.trim() : null;

  if (!productId) return NextResponse.json({ error: 'Missing productId' }, { status: 400 });
  if (!VALID_COUNTRIES.has(country)) return NextResponse.json({ error: 'Unsupported market' }, { status: 400 });
  if (!VALID_ALERT_TYPES.has(alertType)) return NextResponse.json({ error: 'Invalid alert type' }, { status: 400 });
  if (alertType === 'below_amount' && (!Number.isFinite(targetPrice) || Number(targetPrice) <= 0)) {
    return NextResponse.json({ error: 'A valid target price is required' }, { status: 400 });
  }
  if (notifyEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(notifyEmail)) {
    return NextResponse.json({ error: 'Invalid email address' }, { status: 400 });
  }

  const { data: product, error: productError } = await supabase
    .from('products')
    .select('id,status')
    .eq('id', productId)
    .maybeSingle();

  if (productError || !product || product.status !== 'active') {
    return NextResponse.json({ error: 'Product is not available for tracking.' }, { status: 404 });
  }

  const now = new Date().toISOString();
  const { data, error } = await supabase
    .from('watchlists')
    .upsert(
      {
        user_id: user.id,
        product_id: productId,
        country_code: country,
        target_price: alertType === 'below_amount' ? targetPrice : null,
        alert_type: alertType,
        notify_email: notifyEmail || user.email || null,
        email_verified: false,
        is_active: true,
        updated_at: now,
      },
      { onConflict: 'user_id,product_id,country_code' }
    )
    .select('id,product_id,target_price,country_code,is_active,alert_type,notify_email,email_verified,created_at,updated_at')
    .single();

  if (error) {
    console.error('Watchlist write failed:', error);
    return NextResponse.json({ error: 'Could not save this product.' }, { status: 500 });
  }

  return NextResponse.json({ success: true, item: data });
}

export async function DELETE(request: NextRequest) {
  const { supabase, user } = await getAuthedClient();
  if (!supabase || !user) return NextResponse.json({ error: 'Authentication required' }, { status: 401 });

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
  }

  const productId = typeof body.productId === 'string' ? body.productId.trim() : '';
  const country = typeof body.country === 'string' ? body.country.toLowerCase() : 'ae';

  if (!productId) return NextResponse.json({ error: 'Missing productId' }, { status: 400 });
  if (!VALID_COUNTRIES.has(country)) return NextResponse.json({ error: 'Unsupported market' }, { status: 400 });

  const { error } = await supabase
    .from('watchlists')
    .delete()
    .eq('user_id', user.id)
    .eq('product_id', productId)
    .eq('country_code', country);

  if (error) {
    console.error('Watchlist delete failed:', error);
    return NextResponse.json({ error: 'Could not remove this product.' }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
