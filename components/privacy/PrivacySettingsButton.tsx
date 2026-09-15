'use client';

import React from 'react';
import { SlidersHorizontal } from 'lucide-react';

export function PrivacySettingsButton() {
  return (
    <button
      id="privacy-preferences"
      type="button"
      onClick={() => window.dispatchEvent(new Event('ctp-open-privacy'))}
      className="inline-flex min-h-[42px] items-center justify-center gap-2 rounded-xl border border-[#CFE0DA] bg-[#F7FAF8] px-4 text-xs font-extrabold text-[#08784B] hover:bg-[#EEF7F2]"
    >
      <SlidersHorizontal className="w-4 h-4" />
      Change privacy choices
    </button>
  );
}
