'use client';

import React, { useState, FormEvent, Suspense } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { LockKeyhole, Eye, EyeOff, ArrowRight, CheckCircle2, AlertCircle } from 'lucide-react';
import { createSupabaseBrowserClient } from '@/lib/supabase/browser';
import { BrandLogo } from '@/components/common/BrandLogo';

function ResetPasswordForm() {
  const router = useRouter();
  const params = useParams();
  const country = (params?.country as string) || 'ae';

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [success, setSuccess] = useState(false);

  async function handleUpdatePassword(e: FormEvent) {
    e.preventDefault();
    setErrorMessage('');

    if (password.length < 8) {
      setErrorMessage('Password must be at least 8 characters long.');
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage('Passwords do not match.');
      return;
    }

    const supabase = createSupabaseBrowserClient();
    if (!supabase) {
      setErrorMessage('Supabase authentication is not configured.');
      return;
    }

    setLoading(true);
    const { error } = await supabase.auth.updateUser({
      password,
    });
    setLoading(false);

    if (error) {
      setErrorMessage(error.message || 'Could not update password. The reset session may have expired.');
      return;
    }

    setSuccess(true);
    setTimeout(() => {
      router.push(`/${country}/account`);
    }, 2000);
  }

  return (
    <div className="w-full max-w-md">
      <div className="text-center mb-8">
        <BrandLogo size="lg" />
        <h1 className="mt-6 text-2xl sm:text-3xl font-black text-[#0c1913] tracking-tight">
          Set new password
        </h1>
        <p className="mt-2 text-sm text-[#546b62]">
          Choose a secure new password for your CatchThePrice account.
        </p>
      </div>

      <div className="rounded-3xl border border-[#d6e3dd] bg-white p-6 sm:p-8 shadow-[0_16px_40px_rgba(12,25,19,0.06)]">
        {success ? (
          <div className="text-center py-2">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#e6f9f0] text-[#00C16A]">
              <CheckCircle2 className="h-8 w-8" />
            </div>
            <h2 className="mt-4 text-xl font-black text-[#0c1913]">Password updated!</h2>
            <p className="mt-2 text-xs text-[#546b62] leading-relaxed">
              Your password has been changed successfully. Redirecting you to your account…
            </p>
          </div>
        ) : (
          <>
            {errorMessage && (
              <div className="mb-6 flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 p-4 text-xs font-semibold text-red-800">
                <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                <div className="leading-relaxed">{errorMessage}</div>
              </div>
            )}

            <form onSubmit={handleUpdatePassword} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#1f382e] mb-1.5" htmlFor="new-password">
                  New Password (min. 8 characters)
                </label>
                <div className="flex h-12 items-center gap-2.5 rounded-2xl border border-[#d2e0da] bg-[#f8faf9] px-3.5 transition-all focus-within:border-[#00C16A] focus-within:bg-white focus-within:ring-2 focus-within:ring-[#00C16A]/20">
                  <LockKeyhole className="w-4 h-4 text-[#00A859] shrink-0" />
                  <input
                    id="new-password"
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
                <label className="block text-xs font-bold text-[#1f382e] mb-1.5" htmlFor="confirm-password">
                  Confirm New Password
                </label>
                <div className="flex h-12 items-center gap-2.5 rounded-2xl border border-[#d2e0da] bg-[#f8faf9] px-3.5 transition-all focus-within:border-[#00C16A] focus-within:bg-white focus-within:ring-2 focus-within:ring-[#00C16A]/20">
                  <LockKeyhole className="w-4 h-4 text-[#00A859] shrink-0" />
                  <input
                    id="confirm-password"
                    type={showPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    autoComplete="new-password"
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
                  <span>Updating password…</span>
                ) : (
                  <>
                    <span>Update Password</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <main className="min-h-screen bg-[#f3f7f5] text-[#0c1913] flex items-center justify-center px-4 py-12">
      <Suspense fallback={<div className="text-center text-xs text-[#73858D]">Loading…</div>}>
        <ResetPasswordForm />
      </Suspense>
    </main>
  );
}
