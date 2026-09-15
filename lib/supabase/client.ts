import { createClient } from '@supabase/supabase-js';

const supabaseUrl =
  process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://jghpyvawgdfhfqmtiexb.supabase.co';
const supabasePublicKey =
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export const isSupabaseConfigured = Boolean(
  supabaseUrl &&
    supabasePublicKey &&
    supabasePublicKey !== 'placeholder' &&
    !supabasePublicKey.includes('your-supabase') &&
    supabasePublicKey.length > 20
);

export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabasePublicKey!)
  : null;
