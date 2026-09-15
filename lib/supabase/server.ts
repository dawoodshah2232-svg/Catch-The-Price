import 'server-only';

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://jghpyvawgdfhfqmtiexb.supabase.co';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

export const isServerSupabaseConfigured = Boolean(
  supabaseUrl &&
  supabaseServiceKey &&
  supabaseServiceKey !== 'placeholder' &&
  !supabaseServiceKey.includes('your-supabase') &&
  supabaseServiceKey.length > 20
);

export function getServerSupabase() {
  if (!isServerSupabaseConfigured) return null;

  return createClient(supabaseUrl, supabaseServiceKey!, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
}
