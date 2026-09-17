'use client';

import React, { useState, Suspense } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import { Mail, ArrowRight, CheckCircle2, AlertCircle } from 'lucide-react';
import { createSupabaseBrowserClient } from '@/lib/supabase/browser';
import { BrandLogo } from '@/components/common/BrandLogo';

function VerifyEmailContent() {
  const params = useParams();
  const searchParams = useSearchParams();
  const country = (params?.country as string) || 'ae';
  const emailParam = searchParams.get('email') || '';

  const [resending, setResending] = useState(false);
  const [resendStatus, setResendStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [statusMessage, setStatusMessage] = useState('');

  async function handleResend() {
    if (!emailParam) {
      setResendStatus('error');
      setStatusMessage('No email address was provided. Please sign in or register again.');
      return;
    }

    const supabase = createSupabaseBrowserClient();
    if (!supabase) {
      setResendStatus('error');
      setStatusMessage('Authentication service is not configured.');
      return;
    }

    setResending(true);
    setResendStatus('idle');
    const { error } = await supabase.auth.resend({
      type: 'signup',
      email: emailParam,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback?next=/${country}/account`,
      },
    });
    setResending(false);

    if (error) {
      setResendStatus('error');
      setStatusMessage(error.message || 'Could not resend email. Please wait a few minutes and try again.');
    } else {
      setResendStatus('success');
      setStatusMessage('A new verification email has been sent!');
    }
  }

  return (
    <div className="w-full max-w-md text-center">
      <div className="mb-8 flex justify-center">
        <BrandLogo size="lg" />
      </div>

      <div className="rounded-3xl border border-[#d6e3dd] bg-white p-6 sm:p-8 shadow-[0_16px_40px_rgba(12,25,19,0.06)]">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[#e6f9f0] text-[#00C16A]">
          <Mail className="h-8 w-8" />
        </div>

        <h1 className="mt-5 text-2xl font-black text-[#0c1913]">Verify your email</h1>
        <p className="mt-3 text-sm text-[#546b62] leading-relaxed">
          {emailParam ? (
            <>
              We sent a verification link to <strong className="text-[#0c1913]">{emailParam}</strong>.
            </>
          ) : (
            'Please check your inbox for the CatchThePrice verification email.'
          )}
        </p>

        <p className="mt-2 text-xs text-[#788e84]">
          Click the link in that email to activate price drops, watchlist sync, and deal alerts.
        </p>

        {resendStatus === 'success' && (
          <div className="mt-5 flex items-center gap-2 rounded-2xl border border-emerald-200 bg-emerald-50 p-3 text-xs font-semibold text-emerald-800">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{statusMessage}</span>
          </div>
        )}

        {resendStatus === 'error' && (
          <div className="mt-5 flex items-center gap-2 rounded-2xl border border-red-200 bg-red-50 p-3 text-xs font-semibold text-red-800">
            <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
            <span>{statusMessage}</span>
          </div>
        )}

        <div className="mt-7 space-y-3">
          {emailParam && (
            <button
              type="button"
              onClick={handleResend}
              disabled={resending}
              className="w-full flex h-12 items-center justify-center gap-2 rounded-2xl border border-[#00C16A] text-[#00A859] hover:bg-[#e6f9f0] disabled:opacity-60 text-sm font-bold transition-all"
            >
              {resending ? 'Sending…' : 'Resend verification email'}
            </button>
          )}

          <a
            href={`/${country}/login`}
            className="w-full flex h-12 items-center justify-center gap-2 rounded-2xl bg-[#00C16A] hover:bg-[#00a85c] text-white text-sm font-black shadow-[0_6px_20px_rgba(0,193,106,0.25)] transition-all"
          >
            <span>Go to Sign In</span>
            <ArrowRight className="w-4 h-4" />
          </a>
        </div>
      </div>
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <main className="min-h-screen bg-[#f3f7f5] text-[#0c1913] flex items-center justify-center px-4 py-12">
      <Suspense fallback={<div className="text-center text-xs text-[#73858D]">Loading…</div>}>
        <VerifyEmailContent />
      </Suspense>
    </main>
  );
}
