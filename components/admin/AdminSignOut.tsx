'use client';

import React, { useState } from 'react';
import { LogOut } from 'lucide-react';
import { createSupabaseBrowserClient } from '@/lib/supabase/browser';

export function AdminSignOut() {
  const [loading, setLoading] = useState(false);

  async function signOut() {
    const supabase = createSupabaseBrowserClient();
    if (!supabase) return;
    setLoading(true);
    await supabase.auth.signOut();
    window.location.assign('/admin-access');
  }

  return (
    <button
      type="button"
      onClick={signOut}
      disabled={loading}
      className="w-full flex items-center justify-between px-3 py-2 rounded-xl border border-[#243846] bg-[#071015] text-xs text-[#CBD5E1] hover:text-white hover:border-[#345062] disabled:opacity-60 transition-colors"
    >
      <span>{loading ? 'Signing out…' : 'Sign out'}</span>
      <LogOut className="w-3.5 h-3.5 text-[#00D27A]" />
    </button>
  );
}
