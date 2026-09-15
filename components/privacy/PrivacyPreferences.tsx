'use client';

import React, { useEffect, useState } from 'react';
import { ShieldCheck, X } from 'lucide-react';

const STORAGE_KEY = 'ctp-privacy-v1';
const CONSENT_COOKIE = 'ctp_analytics';

type PrivacyChoice = {
  version: 1;
  analytics: boolean;
  decidedAt: string;
};

function readChoice(): PrivacyChoice | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<PrivacyChoice>;
    if (parsed.version !== 1 || typeof parsed.analytics !== 'boolean') return null;
    return {
      version: 1,
      analytics: parsed.analytics,
      decidedAt: typeof parsed.decidedAt === 'string' ? parsed.decidedAt : '',
    };
  } catch {
    return null;
  }
}

export function PrivacyPreferences() {
  const [choice, setChoice] = useState<PrivacyChoice | null>(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const existing = readChoice();
    setChoice(existing);
    setOpen(!existing);

    const reopen = () => setOpen(true);
    window.addEventListener('ctp-open-privacy', reopen);
    return () => window.removeEventListener('ctp-open-privacy', reopen);
  }, []);

  const save = (analytics: boolean) => {
    const next: PrivacyChoice = {
      version: 1,
      analytics,
      decidedAt: new Date().toISOString(),
    };

    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      document.cookie = `${CONSENT_COOKIE}=${analytics ? 'granted' : 'denied'}; Path=/; Max-Age=31536000; SameSite=Lax; Secure`;
    } catch {
      // Privacy controls must remain usable even when storage is restricted.
    }

    setChoice(next);
    setOpen(false);
    window.dispatchEvent(new CustomEvent('ctp-privacy-changed', { detail: { analytics } }));
  };

  if (!open) return null;

  return (
    <div className="fixed inset-x-3 bottom-[76px] md:bottom-5 z-[70] mx-auto max-w-3xl rounded-2xl border border-[#CFE0DA] bg-white p-4 sm:p-5 shadow-[0_20px_60px_rgba(16,32,39,0.20)] text-[#102027]" role="dialog" aria-modal="false" aria-labelledby="privacy-preferences-title">
      {choice && (
        <button type="button" onClick={() => setOpen(false)} className="absolute right-3 top-3 h-9 w-9 rounded-xl border border-[#DDE7E3] bg-[#F8FAF9] text-[#60727A] flex items-center justify-center" aria-label="Close privacy settings">
          <X className="w-4 h-4" />
        </button>
      )}

      <div className="flex items-start gap-3 pr-9 sm:pr-12">
        <div className="w-10 h-10 rounded-xl bg-[#EAF8F1] border border-[#CFE9DD] text-[#08784B] flex items-center justify-center shrink-0">
          <ShieldCheck className="w-5 h-5" />
        </div>
        <div>
          <h2 id="privacy-preferences-title" className="text-sm sm:text-base font-extrabold">Your privacy choices</h2>
          <p className="mt-1 text-[11px] sm:text-xs leading-5 text-[#60727A] max-w-2xl">
            Essential storage keeps features such as market, appearance and saved-item preferences working. Optional first-party analytics helps us understand searches, page usage and retailer hand-offs. Advertising cookies are not activated by this control.
          </p>
        </div>
      </div>

      <div className="mt-4 flex flex-col-reverse sm:flex-row sm:items-center sm:justify-end gap-2">
        <a href="/privacy" className="sm:mr-auto text-[11px] font-bold text-[#08784B] hover:underline text-center sm:text-left">Read privacy policy</a>
        <button type="button" onClick={() => save(false)} className="min-h-[42px] px-4 rounded-xl border border-[#CFE0DA] bg-[#F7FAF8] text-xs font-extrabold text-[#31474F]">Essential only</button>
        <button type="button" onClick={() => save(true)} className="min-h-[42px] px-4 rounded-xl bg-[#0B8F58] text-white text-xs font-extrabold hover:bg-[#08784B]">Allow analytics</button>
      </div>
    </div>
  );
}
