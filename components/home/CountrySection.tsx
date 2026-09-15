'use client';

import React from 'react';
import { useCountry } from '@/context/CountryContext';
import { Globe, Check, Clock3 } from 'lucide-react';

export function CountrySection() {
  const { country, setCountry } = useCountry();

  const markets = [
    { code: 'ae', name: 'United Arab Emirates', flag: '🇦🇪', currency: 'AED', live: true },
    { code: 'us', name: 'United States', flag: '🇺🇸', currency: 'USD', live: true },
    { code: 'sa', name: 'Saudi Arabia', flag: '🇸🇦', currency: 'SAR', live: false },
    { code: 'uk', name: 'United Kingdom', flag: '🇬🇧', currency: 'GBP', live: false },
    { code: 'ca', name: 'Canada', flag: '🇨🇦', currency: 'CAD', live: false },
    { code: 'au', name: 'Australia', flag: '🇦🇺', currency: 'AUD', live: false },
  ];

  return (
    <section className="py-9 sm:py-14 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-t border-[#DDE7E3]">
      <div className="rounded-[28px] bg-white border border-[#DDE7E3] shadow-[0_14px_38px_rgba(25,55,45,0.05)] p-4 sm:p-6 lg:p-7">
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-3 mb-5 sm:mb-6">
          <div>
            <span className="text-[11px] sm:text-xs font-extrabold uppercase tracking-[0.13em] text-[#08784B] flex items-center gap-1.5">
              <Globe className="w-3.5 h-3.5" /> Global market coverage
            </span>
            <h2 className="text-xl sm:text-2xl font-extrabold text-[#102027] mt-1.5">
              Shop in your local market
            </h2>
            <p className="mt-1 text-[11px] sm:text-xs text-[#73858D] max-w-2xl leading-relaxed">
              Compare prices in the correct currency and retailer market. More regions will open after their data sources are verified.
            </p>
          </div>

          <div className="inline-flex items-center gap-2 rounded-xl bg-[#F3F8F6] border border-[#DDE7E3] px-3 py-2 text-[10px] sm:text-[11px] text-[#60727A] self-start lg:self-auto">
            <span className="w-2 h-2 rounded-full bg-[#00B66D]" />
            UAE and United States are live now
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-2.5 sm:gap-3">
          {markets.map((market) => {
            const isSelected = market.live && country === market.code;

            if (market.live) {
              return (
                <button
                  key={market.code}
                  type="button"
                  onClick={() => setCountry(market.code as 'ae' | 'us')}
                  className={`relative min-h-[132px] sm:min-h-[140px] rounded-2xl text-left p-3.5 sm:p-4 border transition-all touch-target ${
                    isSelected
                      ? 'bg-[#EAF8F1] border-[#1AB978] shadow-[0_8px_24px_rgba(11,143,88,0.10)]'
                      : 'bg-[#FAFCFB] border-[#DDE7E3] hover:border-[#BFD6CC] hover:bg-white hover:shadow-[0_8px_22px_rgba(25,55,45,0.06)]'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <span className="text-[26px] leading-none" aria-hidden="true">{market.flag}</span>
                    {isSelected ? (
                      <span className="w-7 h-7 rounded-full bg-[#0B8F58] text-white flex items-center justify-center shadow-sm">
                        <Check className="w-4 h-4" />
                      </span>
                    ) : (
                      <span className="px-2 py-1 rounded-lg bg-[#E6F7EF] text-[#08784B] text-[9px] font-extrabold uppercase tracking-wide">
                        Live
                      </span>
                    )}
                  </div>

                  <div className="mt-4">
                    <div className="font-extrabold text-[12px] sm:text-[13px] text-[#102027] leading-snug">
                      {market.name}
                    </div>
                    <div className="text-[10px] sm:text-[11px] text-[#73858D] mt-1 font-semibold">
                      {market.currency}
                    </div>
                  </div>
                </button>
              );
            }

            return (
              <div
                key={market.code}
                className="relative min-h-[132px] sm:min-h-[140px] rounded-2xl text-left p-3.5 sm:p-4 bg-[#F7F9F8] border border-[#E2E9E6]"
              >
                <div className="flex items-start justify-between gap-2">
                  <span className="text-[26px] leading-none grayscale-[15%]" aria-hidden="true">{market.flag}</span>
                  <span className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-white border border-[#E2E9E6] text-[#829198] text-[9px] font-bold whitespace-nowrap">
                    <Clock3 className="w-3 h-3" /> Soon
                  </span>
                </div>

                <div className="mt-4">
                  <div className="font-extrabold text-[12px] sm:text-[13px] text-[#42565E] leading-snug">
                    {market.name}
                  </div>
                  <div className="text-[10px] sm:text-[11px] text-[#8A999F] mt-1 font-semibold">
                    {market.currency}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
