import 'server-only';

import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

function publicSupabaseKey(): string | undefined {
  return (
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );
}

export async function createAuthServerClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = publicSupabaseKey();

  if (!url || !key) return null;

  const cookieStore = await cookies();

  return createServerClient(url, key, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) => {
            cookieStore.set(name, value, options);
          });
        } catch {
          // Server Components cannot always write cookies. Session refresh can
          // still be handled by a route/client navigation when needed.
        }
      },
    },
  });
}

export function getAdminAllowlist(): string[] {
  return (process.env.ADMIN_EMAILS || '')
    .split(',')
    .map((email) => email.trim().toLowerCase())
    .filter(Boolean);
}

export function isAllowedAdminEmail(email?: string | null): boolean {
  if (!email) return false;
  const allowed = getAdminAllowlist();
  if (allowed.length === 0) return false;
  return allowed.includes(email.trim().toLowerCase());
}
