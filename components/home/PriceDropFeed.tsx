'use client';

import React from 'react';
import { useCountry } from '@/context/CountryContext';
import { ArrowRight, History } from 'lucide-react';

/**
 * Legacy homepage slot retained as an honest fallback.
 * Real drop cards are rendered elsewhere from stored price observations.
 * This component intentionally contains no generated prices, merchants or timestamps.
 */
export function PriceDropFeed() {
  const { country } = useCountry();

  return (
    <div className="py-6 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="rounded-2xl bg-white border border-[#DDE7E3] p-4 sm:p-5 shadow-[0_8px_24px_rgba(25,55,45,0.04)]">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#EEF8F3] border border-[#CFE6DC] text-[#08784B] flex items-center justify-center shrink-0">
              <History className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-extrabold text-[#102027]">Live drop ticker activates with genuine history</h3>
              <p className="text-xs text-[#64767E] mt-1 leading-relaxed max-w-2xl">
                CatchThePrice only shows a price drop after enough stored observations prove that the same product and market actually changed price. No sample merchant or drop data is inserted here.
              </p>
            </div>
          </div>

          <a
            href={`/${country}/price-drops/all`}
            className="shrink-0 text-[11px] font-extrabold text-[#08784B] hover:text-[#045E3A] flex items-center gap-1"
          >
            Price drops <ArrowRight className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>
    </div>
  );
}
