import { NextRequest, NextResponse } from 'next/server';
import { createAuthServerClient } from '@/lib/supabase/auth-server';

export async function GET() {
  const supabase = await createAuthServerClient();
  if (!supabase) {
    return NextResponse.json({ error: 'Database service is unconfigured.' }, { status: 503 });
  }

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
  }

  // Fetch profile and settings in parallel
  const [profileResult, settingsResult] = await Promise.all([
    supabase.from('profiles').select('*').eq('id', user.id).maybeSingle(),
    supabase.from('user_settings').select('*').eq('user_id', user.id).maybeSingle(),
  ]);

  const profile = profileResult.data || {
    id: user.id,
    email: user.email,
    display_name: user.user_metadata?.full_name || user.email?.split('@')[0],
    preferred_country: user.user_metadata?.preferred_country || 'ae',
    preferred_currency: user.user_metadata?.preferred_currency || 'AED',
    email_verified: Boolean(user.email_confirmed_at),
  };

  const settings = settingsResult.data || {
    user_id: user.id,
    notify_price_drops: true,
    notify_target_reached: true,
    notify_weekly_digest: true,
    notify_deals: true,
    marketing_emails: false,
    preferred_market: profile.preferred_country || 'ae',
    preferred_currency: profile.preferred_currency || 'AED',
  };

  return NextResponse.json({ user: { ...user, profile, settings } });
}

export async function PUT(request: NextRequest) {
  const supabase = await createAuthServerClient();
  if (!supabase) {
    return NextResponse.json({ error: 'Database service is unconfigured.' }, { status: 503 });
  }

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
  }

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  const displayName = typeof body.displayName === 'string' ? body.displayName.trim() : undefined;
  const preferredCountry = body.preferredCountry === 'us' ? 'us' : body.preferredCountry === 'ae' ? 'ae' : undefined;
  const preferredCurrency = preferredCountry === 'us' ? 'USD' : preferredCountry === 'ae' ? 'AED' : undefined;

  const profileUpdates: Record<string, unknown> = { updated_at: new Date().toISOString() };
  if (displayName !== undefined) profileUpdates.display_name = displayName;
  if (preferredCountry !== undefined) profileUpdates.preferred_country = preferredCountry;
  if (preferredCurrency !== undefined) profileUpdates.preferred_currency = preferredCurrency;

  const settingsUpdates: Record<string, unknown> = { updated_at: new Date().toISOString() };
  if (typeof body.notifyPriceDrops === 'boolean') settingsUpdates.notify_price_drops = body.notifyPriceDrops;
  if (typeof body.notifyTargetReached === 'boolean') settingsUpdates.notify_target_reached = body.notifyTargetReached;
  if (typeof body.notifyWeeklyDigest === 'boolean') settingsUpdates.notify_weekly_digest = body.notifyWeeklyDigest;
  if (typeof body.notifyDeals === 'boolean') settingsUpdates.notify_deals = body.notifyDeals;
  if (typeof body.marketingEmails === 'boolean') settingsUpdates.marketing_emails = body.marketingEmails;
  if (preferredCountry !== undefined) settingsUpdates.preferred_market = preferredCountry;
  if (preferredCurrency !== undefined) settingsUpdates.preferred_currency = preferredCurrency;

  const [profileRes, settingsRes] = await Promise.all([
    supabase
      .from('profiles')
      .upsert({ id: user.id, email: user.email, ...profileUpdates }, { onConflict: 'id' })
      .select()
      .single(),
    supabase
      .from('user_settings')
      .upsert({ user_id: user.id, ...settingsUpdates }, { onConflict: 'user_id' })
      .select()
      .single(),
  ]);

  if (profileRes.error) {
    console.error('Profile update error:', profileRes.error);
    return NextResponse.json({ error: 'Could not update profile' }, { status: 500 });
  }

  return NextResponse.json({
    success: true,
    profile: profileRes.data,
    settings: settingsRes.data,
  });
}
