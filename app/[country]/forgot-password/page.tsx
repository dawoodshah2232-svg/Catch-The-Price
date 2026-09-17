'use client';

import React, { useState, FormEvent, Suspense } from 'react';
import { useParams } from 'next/navigation';
import { Mail, ArrowRight, ArrowLeft, CheckCircle2, AlertCircle } from 'lucide-react';
import { createSupabaseBrowserClient } from '@/lib/supabase/browser';
import { BrandLogo } from '@/components/common/BrandLogo';

function ForgotPasswordForm() {
  const params = useParams();
  const country = (params?.country as string) || 'ae';

  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [sentSuccess, setSentSuccess] = useState(false);

  async function handleReset(e: FormEvent) {
    e.preventDefault();
    setErrorMessage('');

    const supabase = createSupabaseBrowserClient();
    if (!supabase) {
      setErrorMessage('Supabase authentication is not configured in this environment.');
      return;
    }

    const cleanEmail = email.trim().toLowerCase();
    if (!cleanEmail) {
      setErrorMessage('Please enter your email address.');
      return;
    }

    setLoading(true);
    const redirectTo = `${window.location.origin}/${country}/reset-password`;
    const { error } = await supabase.auth.resetPasswordForEmail(cleanEmail, {
      redirectTo,
    });
    setLoading(false);

    if (error) {
      setErrorMessage(error.message || 'Could not send reset email. Please check the address and try again.');
      return;
    }

    setSentSuccess(true);
  }

  return (
    <div className="w-full max-w-md">
      <div className="text-center mb-8">
        <BrandLogo size="lg" />
        <h1 className="mt-6 text-2xl sm:text-3xl font-black text-[#0c1913] tracking-tight">
          Reset password
        </h1>
        <p className="mt-2 text-sm text-[#546b62]">
          Enter your email and we&apos;ll send you instructions to reset your password.
        </p>
      </div>

      <div className="rounded-3xl border border-[#d6e3dd] bg-white p-6 sm:p-8 shadow-[0_16px_40px_rgba(12,25,19,0.06)]">
        {sentSuccess ? (
          <div className="text-center py-2">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#e6f9f0] text-[#00C16A]">
              <CheckCircle2 className="h-8 w-8" />
            </div>
            <h2 className="mt-4 text-xl font-black text-[#0c1913]">Reset link sent</h2>
            <p className="mt-2 text-xs text-[#546b62] leading-relaxed">
              If an account exists for <strong className="text-[#0c1913]">{email}</strong>, you will receive an email shortly with a link to reset your password.
            </p>
            <div className="mt-6">
              <a
                href={`/${country}/login`}
                className="inline-flex h-12 w-full items-center justify-center rounded-2xl bg-[#00C16A] text-sm font-black text-white hover:bg-[#00a85c] transition-colors"
              >
                Back to Sign In
              </a>
            </div>
          </div>
        ) : (
          <>
            {errorMessage && (
              <div className="mb-6 flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 p-4 text-xs font-semibold text-red-800">
                <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                <div className="leading-relaxed">{errorMessage}</div>
              </div>
            )}

            <form onSubmit={handleReset} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#1f382e] mb-1.5" htmlFor="reset-email">
                  Email address
                </label>
                <div className="flex h-12 items-center gap-2.5 rounded-2xl border border-[#d2e0da] bg-[#f8faf9] px-3.5 transition-all focus-within:border-[#00C16A] focus-within:bg-white focus-within:ring-2 focus-within:ring-[#00C16A]/20">
                  <Mail className="w-4 h-4 text-[#00A859] shrink-0" />
                  <input
                    id="reset-email"
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

              <button
                type="submit"
                disabled={loading}
                className="w-full mt-2 flex h-12 items-center justify-center gap-2 rounded-2xl bg-[#00C16A] hover:bg-[#00a85c] disabled:opacity-60 text-white text-sm font-black shadow-[0_6px_20px_rgba(0,193,106,0.25)] transition-all"
              >
                {loading ? (
                  <span>Sending reset link…</span>
                ) : (
                  <>
                    <span>Send Reset Link</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            <div className="mt-6 text-center">
              <a
                href={`/${country}/login`}
                className="inline-flex items-center gap-1.5 text-xs font-bold text-[#546b62] hover:text-[#00A859]"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back to Sign In</span>
              </a>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default function ForgotPasswordPage() {
  return (
    <main className="min-h-screen bg-[#f3f7f5] text-[#0c1913] flex items-center justify-center px-4 py-12">
      <Suspense fallback={<div className="text-center text-xs text-[#73858D]">Loading…</div>}>
        <ForgotPasswordForm />
      </Suspense>
    </main>
  );
}
