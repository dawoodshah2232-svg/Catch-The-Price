import { NextRequest, NextResponse } from 'next/server';
import { createAuthServerClient } from '@/lib/supabase/auth-server';

function safeRedirectPath(target: string | null, fallback: string): string {
  if (!target) return fallback;
  // Ensure relative path only (prevent open redirects)
  if (target.startsWith('/') && !target.startsWith('//') && !target.startsWith('/\\')) {
    return target;
  }
  return fallback;
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get('code');
  const next = searchParams.get('next') || '/ae/account';
  const redirectUrl = safeRedirectPath(next, '/ae/account');

  if (code) {
    const supabase = await createAuthServerClient();
    if (supabase) {
      const { error } = await supabase.auth.exchangeCodeForSession(code);
      if (!error) {
        return NextResponse.redirect(new URL(redirectUrl, request.url));
      }
      console.error('Auth code exchange failed:', error.message);
    }
  }

  // If code is missing or exchange failed, redirect to login with error
  return NextResponse.redirect(
    new URL(`/ae/login?error=${encodeURIComponent('Authentication link is invalid or has expired.')}`, request.url)
  );
}
