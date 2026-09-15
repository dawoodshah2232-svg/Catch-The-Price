'use client';

import React, { FormEvent, useState } from 'react';
import { LockKeyhole, Mail, ShieldCheck, Eye, EyeOff } from 'lucide-react';
import { CountryProvider } from '@/context/CountryContext';
import { BrandLogo } from '@/components/common/BrandLogo';
import { createSupabaseBrowserClient } from '@/lib/supabase/browser';

export default function AdminAccessPage() {
  const [email, setEmail] = useState('info@catchtheprice.com');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function signIn(event: FormEvent) {
    event.preventDefault();
    setError('');

    const supabase = createSupabaseBrowserClient();
    if (!supabase) {
      setError('Admin authentication is not configured yet.');
      return;
    }

    const normalizedEmail = email.trim().toLowerCase();
    if (!normalizedEmail || !password) return;

    setLoading(true);
    const { error: authError } = await supabase.auth.signInWithPassword({
      email: normalizedEmail,
      password,
    });
    setLoading(false);

    if (authError) {
      setError('The email or password is incorrect, or this admin account has not been activated yet.');
      return;
    }

    window.location.assign('/admin');
  }

  return (
    <CountryProvider initialCountry="ae">
      <main className="min-h-screen bg-[#F4F7F6] text-[#102027] flex items-center justify-center px-4 py-10">
        <div className="w-full max-w-md">
          <div className="flex justify-center mb-7">
            <BrandLogo size="lg" />
          </div>

          <section className="rounded-[28px] border border-[#DDE7E3] bg-white p-5 sm:p-7 shadow-[0_20px_60px_rgba(24,52,43,0.10)]">
            <div className="w-11 h-11 rounded-2xl bg-[#EAF8F1] border border-[#CFE9DD] text-[#0B8F58] flex items-center justify-center">
              <LockKeyhole className="w-5 h-5" />
            </div>
            <h1 className="text-2xl font-extrabold mt-4 text-[#102027]">CatchThePrice Admin</h1>
            <p className="text-sm text-[#65777F] mt-2 leading-relaxed">
              Private operations access for approved CatchThePrice administrators.
            </p>

            <form onSubmit={signIn} className="mt-6 space-y-4">
              <label className="block">
                <span className="text-xs font-bold text-[#31474F]">Admin email</span>
                <div className="mt-2 flex items-center gap-2 rounded-2xl border border-[#D5E2DD] bg-[#F8FAF9] px-3.5 focus-within:border-[#0B8F58] focus-within:ring-2 focus-within:ring-[#0B8F58]/10">
                  <Mail className="w-4 h-4 text-[#0B8F58] shrink-0" />
                  <input
                    type="email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    autoComplete="username"
                    className="w-full min-h-12 bg-transparent outline-none text-sm text-[#102027] placeholder:text-[#8A999F]"
                    required
                  />
                </div>
              </label>

              <label className="block">
                <span className="text-xs font-bold text-[#31474F]">Password</span>
                <div className="mt-2 flex items-center gap-2 rounded-2xl border border-[#D5E2DD] bg-[#F8FAF9] px-3.5 focus-within:border-[#0B8F58] focus-within:ring-2 focus-within:ring-[#0B8F58]/10">
                  <LockKeyhole className="w-4 h-4 text-[#0B8F58] shrink-0" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    autoComplete="current-password"
                    className="w-full min-h-12 bg-transparent outline-none text-sm text-[#102027]"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((value) => !value)}
                    className="w-9 h-9 rounded-xl flex items-center justify-center text-[#65777F] hover:bg-[#EAF3EF] hover:text-[#0B8F58]"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </label>

              <button
                type="submit"
                disabled={loading}
                className="w-full min-h-12 rounded-2xl bg-[#0B8F58] hover:bg-[#08784B] disabled:opacity-60 text-white font-extrabold text-sm transition-colors"
              >
                {loading ? 'Signing in…' : 'Sign in to admin'}
              </button>
            </form>

            {error && (
              <div className="mt-4 rounded-2xl border border-red-200 bg-red-50 p-3 text-xs text-red-700">
                {error}
              </div>
            )}

            <div className="mt-5 rounded-2xl border border-[#DDE7E3] bg-[#F8FAF9] p-3 text-[11px] text-[#65777F] leading-relaxed flex gap-2">
              <ShieldCheck className="w-4 h-4 text-[#0B8F58] shrink-0" />
              <span>Authentication alone does not grant access. The server also checks the private administrator allowlist.</span>
            </div>
          </section>
        </div>
      </main>
    </CountryProvider>
  );
}
