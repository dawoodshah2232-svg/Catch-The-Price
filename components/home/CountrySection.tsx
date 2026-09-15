'use client';

import React from 'react';
import { useCountry } from '@/context/CountryContext';
import { CountryCode } from '@/lib/types';
import { Globe, Check, Clock3 } from 'lucide-react';

interface MarketItem {
  code: CountryCode;
  name: string;
  flag: string;
  currency: string;
  live: boolean;
}

const MARKETS: MarketItem[] = [
  { code: 'ae', name: 'United Arab Emirates', flag: '🇦🇪', currency: 'AED', live: true },
  { code: 'us', name: 'United States', flag: '🇺🇸', currency: 'USD', live: true },
  { code: 'uk', name: 'United Kingdom', flag: '🇬🇧', currency: 'GBP', live: false },
  { code: 'ca', name: 'Canada', flag: '🇨🇦', currency: 'CAD', live: false },
  { code: 'au', name: 'Australia', flag: '🇦🇺', currency: 'AUD', live: false },
];

export function CountrySection() {
  const { country, setCountry } = useCountry();

  return (
    <section className="py-8 sm:py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="rounded-[30px] ui-surface border p-5 sm:p-7 lg:p-8 ui-shadow">
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4 mb-6">
          <div>
            <span className="text-[10px] sm:text-xs font-extrabold uppercase tracking-[0.16em] text-[#0B8F58] flex items-center gap-1.5">
              <Globe className="w-3.5 h-3.5" /> Market coverage
            </span>
            <h2 className="text-xl sm:text-3xl font-extrabold ui-text mt-1.5">Shop in your local market</h2>
            <p className="text-xs sm:text-sm ui-secondary mt-1.5 max-w-2xl leading-relaxed">
              Compare prices in the correct currency and retailer market. More regions will open only after their data sources and product coverage are ready.
            </p>
          </div>
          <div className="inline-flex items-center gap-2 px-3 py-2 rounded-xl ui-soft border text-[11px] ui-secondary self-start lg:self-auto">
            <span className="w-2 h-2 rounded-full bg-[#0B8F58]" /> 🇦🇪 UAE and 🇺🇸 United States are the launch markets
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-3">
          {MARKETS.map((market) => {
            const selected = country === market.code;
            return (
              <button
                key={market.code}
                type="button"
                disabled={!market.live}
                onClick={() => market.live && setCountry(market.code)}
                className={`relative min-h-[150px] p-4 rounded-2xl text-left border transition-all ${
                  selected
                    ? 'bg-[#E7F8F0] border-[#00B56B] shadow-[0_10px_26px_rgba(11,143,88,0.10)]'
                    : market.live
                      ? 'ui-surface hover:border-[#9CCFBA] hover:-translate-y-0.5'
                      : 'ui-soft opacity-70 cursor-not-allowed'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <span className="text-3xl leading-none">{market.flag}</span>
                  {selected ? (
                    <span className="w-8 h-8 rounded-full bg-[#0B8F58] text-white flex items-center justify-center"><Check className="w-4 h-4" /></span>
                  ) : market.live ? (
                    <span className="px-2 py-1 rounded-full text-[9px] font-extrabold bg-[#EAF8F1] text-[#0B8F58]">LIVE</span>
                  ) : (
                    <span className="px-2 py-1 rounded-full text-[9px] font-bold ui-surface border ui-muted flex items-center gap-1"><Clock3 className="w-3 h-3" /> Future</span>
                  )}
                </div>

                <div className="mt-5 font-extrabold text-sm ui-text leading-snug">{market.flag} {market.name}</div>
                <div className="text-xs font-semibold ui-muted mt-1">{market.currency}</div>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
