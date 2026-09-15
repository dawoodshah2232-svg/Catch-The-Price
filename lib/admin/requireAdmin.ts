import 'server-only';

import { createAuthServerClient, isAllowedAdminEmail } from '@/lib/supabase/auth-server';

export async function requireAdminUser() {
  const supabase = await createAuthServerClient();
  if (!supabase) return { ok: false as const, status: 503, user: null };

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user || !isAllowedAdminEmail(user.email)) {
    return { ok: false as const, status: 401, user: null };
  }

  return { ok: true as const, status: 200, user };
}
