'use client';

import React, { useState, FormEvent, Suspense } from 'react';
import { useRouter, useSearchParams, useParams } from 'next/navigation';
import { Mail, LockKeyhole, Eye, EyeOff, User, ArrowRight, ShieldCheck, AlertCircle, CheckCircle2 } from 'lucide-react';
import { createSupabaseBrowserClient } from '@/lib/supabase/browser';
import { BrandLogo } from '@/components/common/BrandLogo';

function SignupForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const params = useParams();
  const country = (params?.country as string) || 'ae';
  const next = searchParams.get('next') || `/${country}/account`;

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState(country);
  const [agreeTerms, setAgreeTerms] = useState(true);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [signedUpSuccess, setSignedUpSuccess] = useState(false);

  async function handleSignup(e: FormEvent) {
    e.preventDefault();
    setErrorMessage('');

    if (!agreeTerms) {
      setErrorMessage('Please accept the Terms of Service and Privacy Policy to continue.');
      return;
    }

    if (password.length < 8) {
      setErrorMessage('Password must be at least 8 characters long.');
      return;
    }

    const supabase = createSupabaseBrowserClient();
    if (!supabase) {
      setErrorMessage(
        'Supabase authentication is not configured yet in this environment. Please configure NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY.'
      );
      return;
    }

    const cleanEmail = email.trim().toLowerCase();
    const cleanName = fullName.trim();
    if (!cleanEmail || !cleanName) {
      setErrorMessage('Please fill in all required fields.');
      return;
    }

    setLoading(true);
    const { data, error } = await supabase.auth.signUp({
      email: cleanEmail,
      password,
      options: {
        data: {
          full_name: cleanName,
          preferred_country: selectedCountry,
          preferred_currency: selectedCountry === 'us' ? 'USD' : 'AED',
        },
        emailRedirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent(next)}`,
      },
    });
    setLoading(false);

    if (error) {
      setErrorMessage(error.message || 'Could not complete registration. Please try again.');
      return;
    }

    // If session is already created (email auto-confirmed in dev), redirect directly
    if (data.session) {
      router.push(next);
      router.refresh();
      return;
    }

    // Otherwise show email verification notice
    setSignedUpSuccess(true);
  }

  if (signedUpSuccess) {
    return (
      <div className="w-full max-w-md text-center">
        <div className="rounded-3xl border border-[#d6e3dd] bg-white p-8 shadow-[0_16px_40px_rgba(12,25,19,0.06)]">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#e6f9f0] text-[#00C16A]">
            <CheckCircle2 className="h-8 w-8" />
          </div>
          <h2 className="mt-5 text-2xl font-black text-[#0c1913]">Check your email</h2>
          <p className="mt-3 text-sm text-[#546b62] leading-relaxed">
            We sent a verification link to <strong className="text-[#0c1913]">{email}</strong>. Please click the link to activate your CatchThePrice account.
          </p>
          <div className="mt-7">
            <a
              href={`/${country}/login`}
              className="inline-flex h-12 w-full items-center justify-center rounded-2xl bg-[#00C16A] text-sm font-black text-white hover:bg-[#00a85c] transition-colors"
            >
              Return to Sign In
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md">
      <div className="text-center mb-8">
        <BrandLogo size="lg" />
        <h1 className="mt-6 text-2xl sm:text-3xl font-black text-[#0c1913] tracking-tight">
          Create your account
        </h1>
        <p className="mt-2 text-sm text-[#546b62]">
          Track prices, save your favorite products, and never miss a drop.
        </p>
      </div>

      <div className="rounded-3xl border border-[#d6e3dd] bg-white p-6 sm:p-8 shadow-[0_16px_40px_rgba(12,25,19,0.06)]">
        {errorMessage && (
          <div className="mb-6 flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 p-4 text-xs font-semibold text-red-800">
            <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
            <div className="leading-relaxed">{errorMessage}</div>
          </div>
        )}

        <form onSubmit={handleSignup} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-[#1f382e] mb-1.5" htmlFor="signup-name">
              Full Name
            </label>
            <div className="flex h-12 items-center gap-2.5 rounded-2xl border border-[#d2e0da] bg-[#f8faf9] px-3.5 transition-all focus-within:border-[#00C16A] focus-within:bg-white focus-within:ring-2 focus-within:ring-[#00C16A]/20">
              <User className="w-4 h-4 text-[#00A859] shrink-0" />
              <input
                id="signup-name"
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Dawood Shah"
                required
                autoComplete="name"
                className="w-full bg-transparent text-sm font-medium text-[#0c1913] outline-none placeholder:text-[#889b93]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#1f382e] mb-1.5" htmlFor="signup-email">
              Email address
            </label>
            <div className="flex h-12 items-center gap-2.5 rounded-2xl border border-[#d2e0da] bg-[#f8faf9] px-3.5 transition-all focus-within:border-[#00C16A] focus-within:bg-white focus-within:ring-2 focus-within:ring-[#00C16A]/20">
              <Mail className="w-4 h-4 text-[#00A859] shrink-0" />
              <input
                id="signup-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
                autoComplete="email"
                className="w-full bg-transparent text-sm font-medium text-[#0c1913] outline-none placeholder:text-[#889b93]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#1f382e] mb-1.5" htmlFor="signup-password">
              Password (min. 8 characters)
            </label>
            <div className="flex h-12 items-center gap-2.5 rounded-2xl border border-[#d2e0da] bg-[#f8faf9] px-3.5 transition-all focus-within:border-[#00C16A] focus-within:bg-white focus-within:ring-2 focus-within:ring-[#00C16A]/20">
              <LockKeyhole className="w-4 h-4 text-[#00A859] shrink-0" />
              <input
                id="signup-password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                autoComplete="new-password"
                className="w-full bg-transparent text-sm font-medium text-[#0c1913] outline-none placeholder:text-[#889b93]"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
                className="p-1 text-[#6a8077] hover:text-[#0c1913]"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#1f382e] mb-1.5" htmlFor="signup-country">
              Primary Shopping Market
            </label>
            <select
              id="signup-country"
              value={selectedCountry}
              onChange={(e) => setSelectedCountry(e.target.value)}
              className="h-12 w-full rounded-2xl border border-[#d2e0da] bg-[#f8faf9] px-3.5 text-sm font-medium text-[#0c1913] outline-none focus:border-[#00C16A] focus:bg-white focus:ring-2 focus:ring-[#00C16A]/20"
            >
              <option value="ae">🇦🇪 United Arab Emirates (AED)</option>
              <option value="us">🇺🇸 United States (USD)</option>
            </select>
          </div>

          <div className="pt-1">
            <label className="flex items-start gap-2.5 cursor-pointer">
              <input
                type="checkbox"
                checked={agreeTerms}
                onChange={(e) => setAgreeTerms(e.target.checked)}
                className="mt-1 h-4 w-4 rounded border-[#d2e0da] text-[#00C16A] focus:ring-[#00C16A]"
              />
              <span className="text-xs text-[#546b62] leading-snug">
                I agree to CatchThePrice{' '}
                <a href="/terms" className="text-[#00A859] hover:underline" target="_blank" rel="noreferrer">
                  Terms of Service
                </a>{' '}
                and{' '}
                <a href="/privacy" className="text-[#00A859] hover:underline" target="_blank" rel="noreferrer">
                  Privacy Policy
                </a>
                .
              </span>
            </label>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-3 flex h-12 items-center justify-center gap-2 rounded-2xl bg-[#00C16A] hover:bg-[#00a85c] disabled:opacity-60 text-white text-sm font-black shadow-[0_6px_20px_rgba(0,193,106,0.25)] transition-all"
          >
            {loading ? (
              <span>Creating account…</span>
            ) : (
              <>
                <span>Create Account</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        <div className="mt-7 text-center">
          <p className="text-xs text-[#546b62]">
            Already have an account?{' '}
            <a
              href={`/${country}/login?next=${encodeURIComponent(next)}`}
              className="font-black text-[#00A859] hover:text-[#008f4c] hover:underline"
            >
              Sign in
            </a>
          </p>
        </div>
      </div>

      <div className="mt-6 flex items-center justify-center gap-2 text-[11px] text-[#6b8076]">
        <ShieldCheck className="w-4 h-4 text-[#00A859]" />
        <span>CatchThePrice respects your privacy. No spam, ever.</span>
      </div>
    </div>
  );
}

export default function SignupPage() {
  return (
    <main className="min-h-screen bg-[#f3f7f5] text-[#0c1913] flex items-center justify-center px-4 py-12">
      <Suspense
        fallback={
          <div className="text-center text-xs text-[#73858D]">
            Loading CatchThePrice account creation…
          </div>
        }
      >
        <SignupForm />
      </Suspense>
    </main>
  );
}
