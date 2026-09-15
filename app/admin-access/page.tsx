'use client';

import React, { FormEvent, useState } from 'react';
import { LockKeyhole, Mail, ShieldCheck } from 'lucide-react';
import { CountryProvider } from '@/context/CountryContext';
import { BrandLogo } from '@/components/common/BrandLogo';
import { createSupabaseBrowserClient } from '@/lib/supabase/browser';

export default function AdminAccessPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  async function requestAccess(event: FormEvent) {
    event.preventDefault();
    setError('');
    setMessage('');

    const supabase = createSupabaseBrowserClient();
    if (!supabase) {
      setError('Admin authentication is not configured yet.');
      return;
    }

    const normalizedEmail = email.trim().toLowerCase();
    if (!normalizedEmail) return;

    setLoading(true);
    const redirectTo = `${window.location.origin}/admin`;
    const { error: authError } = await supabase.auth.signInWithOtp({
      email: normalizedEmail,
      options: {
        emailRedirectTo: redirectTo,
        shouldCreateUser: true,
      },
    });
    setLoading(false);

    if (authError) {
      setError(authError.message || 'Could not send the secure sign-in link.');
      return;
    }

    setMessage('Check your email for the secure CatchThePrice admin sign-in link.');
  }

  return (
    <CountryProvider initialCountry="ae">
      <main className="min-h-screen bg-[#071015] text-[#F8FAFC] flex items-center justify-center px-4 py-10">
        <div className="w-full max-w-md">
          <div className="flex justify-center mb-7">
            <BrandLogo size="lg" />
          </div>

          <section className="rounded-3xl border border-[#1c303c] bg-[#0a151b] p-5 sm:p-7 shadow-2xl">
            <div className="w-11 h-11 rounded-2xl bg-[#00D27A]/10 border border-[#00D27A]/25 text-[#00D27A] flex items-center justify-center">
              <LockKeyhole className="w-5 h-5" />
            </div>
            <h1 className="text-2xl font-extrabold mt-4">Private operations access</h1>
            <p className="text-sm text-[#9FB0BC] mt-2 leading-relaxed">
              Sign in using an approved administrator email. The dashboard is protected server-side and is never indexed.
            </p>

            <form onSubmit={requestAccess} className="mt-6 space-y-4">
              <label className="block">
                <span className="text-xs font-bold text-[#CBD5E1]">Admin email</span>
                <div className="mt-2 flex items-center gap-2 rounded-2xl border border-[#223844] bg-[#071015] px-3.5 focus-within:border-[#00D27A]">
                  <Mail className="w-4 h-4 text-[#00D27A] shrink-0" />
                  <input
                    type="email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    placeholder="you@catchtheprice.com"
                    autoComplete="email"
                    className="w-full min-h-12 bg-transparent outline-none text-sm text-white placeholder:text-[#657985]"
                    required
                  />
                </div>
              </label>

              <button
                type="submit"
                disabled={loading}
                className="w-full min-h-12 rounded-2xl bg-[#00D27A] hover:bg-[#00E6A2] disabled:opacity-60 text-[#06110d] font-extrabold text-sm transition-colors"
              >
                {loading ? 'Sending secure link…' : 'Send secure sign-in link'}
              </button>
            </form>

            {message && (
              <div className="mt-4 rounded-2xl border border-[#00D27A]/25 bg-[#00D27A]/10 p-3 text-xs text-[#B8F5D9] flex gap-2">
                <ShieldCheck className="w-4 h-4 shrink-0" />
                <span>{message}</span>
              </div>
            )}
            {error && (
              <div className="mt-4 rounded-2xl border border-red-400/25 bg-red-400/10 p-3 text-xs text-red-200">
                {error}
              </div>
            )}

            <p className="text-[11px] text-[#718691] mt-5 leading-relaxed">
              Authentication alone does not grant admin access. The server also checks the private admin allowlist.
            </p>
          </section>
        </div>
      </main>
    </CountryProvider>
  );
}
