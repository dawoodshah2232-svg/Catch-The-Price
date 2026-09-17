import { NextRequest, NextResponse } from 'next/server';
import { createAuthServerClient } from '@/lib/supabase/auth-server';

export async function POST(request: NextRequest) {
  const supabase = await createAuthServerClient();
  if (supabase) {
    await supabase.auth.signOut();
  }

  const { searchParams } = new URL(request.url);
  const country = searchParams.get('country') || 'ae';
  const redirectTarget = `/${country === 'us' ? 'us' : 'ae'}`;

  return NextResponse.redirect(new URL(redirectTarget, request.url), {
    status: 303,
  });
}
