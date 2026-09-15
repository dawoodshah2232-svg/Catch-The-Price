import { NextRequest, NextResponse } from 'next/server';
import { createAuthServerClient } from '@/lib/supabase/auth-server';

const VALID_COUNTRIES = new Set(['ae', 'us']);

export async function GET(request: NextRequest) {
  const supabase = await createAuthServerClient();
  if (!supabase) return NextResponse.json({ error: 'Account service is not configured.' }, { status: 503 });

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) return NextResponse.json({ error: 'Authentication required' }, { status: 401 });

  const country = (request.nextUrl.searchParams.get('country') || 'ae').toLowerCase();
  if (!VALID_COUNTRIES.has(country)) return NextResponse.json({ error: 'Unsupported market' }, { status: 400 });

  const { data, error } = await supabase
    .from('alert_events')
    .select('id,alert_type,message,sent_at,created_at,products(id,name,slug,image_url),watchlists(country_code)')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
    .limit(100);

  if (error) {
    console.error('Account alert history read failed:', error);
    return NextResponse.json({ error: 'Could not load alert history.' }, { status: 500 });
  }

  const events = (data || []).filter((event: { watchlists?: { country_code?: string } | { country_code?: string }[] | null }) => {
    const relation = Array.isArray(event.watchlists) ? event.watchlists[0] : event.watchlists;
    return !relation?.country_code || relation.country_code === country;
  });

  return NextResponse.json({ events });
}
