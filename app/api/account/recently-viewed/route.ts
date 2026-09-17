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

  const [historyRes, catalogRes] = await Promise.all([
    supabase
      .from('recently_viewed')
      .select('id, product_id, country_code, viewed_at')
      .eq('user_id', user.id)
      .eq('country_code', country)
      .order('viewed_at', { ascending: false })
      .limit(30),
    getCatalogProducts(country),
  ]);

  const items = historyRes.data || [];
  const catalogMap = new Map(catalogRes.products.map((p) => [p.id, p]));

  const enriched = items
    .map((item) => {
      const product = catalogMap.get(item.product_id);
      if (!product) return null;
      return {
        id: item.id,
        productId: item.product_id,
        viewedAt: item.viewed_at,
        product,
      };
    })
    .filter(Boolean);

  return NextResponse.json({ items: enriched });
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

  if (!productId) {
    return NextResponse.json({ error: 'Missing productId' }, { status: 400 });
  }

  const { data, error } = await supabase
    .from('recently_viewed')
    .upsert(
      {
        user_id: user.id,
        product_id: productId,
        country_code: country,
        viewed_at: new Date().toISOString(),
      },
      { onConflict: 'user_id,product_id,country_code' }
    )
    .select()
    .single();

  if (error) {
    console.error('Record recently viewed error:', error);
    return NextResponse.json({ error: 'Could not record recently viewed item' }, { status: 500 });
  }

  return NextResponse.json({ success: true, item: data });
}

export async function DELETE(request: NextRequest) {
  const { supabase, user } = await getAuthedClient();
  if (!supabase || !user) {
    return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
  }

  const countryParam = (request.nextUrl.searchParams.get('country') || 'ae').toLowerCase();

  const { error } = await supabase
    .from('recently_viewed')
    .delete()
    .eq('user_id', user.id)
    .eq('country_code', countryParam);

  if (error) {
    return NextResponse.json({ error: 'Could not clear history' }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
