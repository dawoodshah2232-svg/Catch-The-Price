'use client';

import React from 'react';
import { useCountry } from '@/context/CountryContext';
import { CountryCode } from '@/lib/types';
import { Globe, Check, Store } from 'lucide-react';

interface MarketItem {
  code: CountryCode;
  name: string;
  flag: string;
  currency: string;
  currencyName: string;
  topMerchants: string;
}

const MARKETS: MarketItem[] = [
  {
    code: 'ae',
    name: 'United Arab Emirates',
    flag: '🇦🇪',
    currency: 'AED',
    currencyName: 'UAE Dirham',
    topMerchants: 'Amazon, Noon, Sharaf DG',
  },
  {
    code: 'us',
    name: 'United States',
    flag: '🇺🇸',
    currency: 'USD',
    currencyName: 'US Dollar',
    topMerchants: 'Amazon, Best Buy, Walmart',
  },
  {
    code: 'sa',
    name: 'Saudi Arabia',
    flag: '🇸🇦',
    currency: 'SAR',
    currencyName: 'Saudi Riyal',
    topMerchants: 'Amazon KSA, Jarir, Extra, Noon',
  },
  {
    code: 'uk',
    name: 'United Kingdom',
    flag: '🇬🇧',
    currency: 'GBP',
    currencyName: 'British Pound',
    topMerchants: 'Amazon UK, Currys, Argos',
  },
  {
    code: 'ca',
    name: 'Canada',
    flag: '🇨🇦',
    currency: 'CAD',
    currencyName: 'Canadian Dollar',
    topMerchants: 'Amazon CA, Best Buy, Walmart',
  },
  {
    code: 'au',
    name: 'Australia',
    flag: '🇦🇺',
    currency: 'AUD',
    currencyName: 'Australian Dollar',
    topMerchants: 'Amazon AU, JB Hi-Fi, Harvey Norman',
  },
];

export function CountrySection() {
  const { country, setCountry } = useCountry();

  return (
    <section className="py-10 sm:py-14 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-t border-[#162633]">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 mb-8">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-[#00D27A] flex items-center gap-1.5">
            <Globe className="w-3.5 h-3.5" /> Global Market Coverage
          </span>
          <h2 className="text-xl sm:text-2xl font-bold text-[#F8FAFC] mt-1.5">
            Compare Real Local Prices Across 6 Primary Markets
          </h2>
        </div>
        <p className="text-xs text-[#CBD5E1] max-w-md">
          Switch your region to track verified authorized retailer feeds, localized stock, and manufacturer warranties.
        </p>
      </div>

      {/* Unified 6-Card Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3.5 sm:gap-4">
        {MARKETS.map((m) => {
          const isSelected = country === m.code;

          return (
            <button
              key={m.code}
              type="button"
              onClick={() => setCountry(m.code)}
              className={`p-4 rounded-2xl text-left transition-all duration-200 border flex flex-col justify-between group touch-target ${
                isSelected
                  ? 'bg-[#091217] border-[#00D27A] ring-1 ring-[#00D27A]/30 shadow-[0_0_24px_rgba(0,210,122,0.12)]'
                  : 'bg-[#091217] border-[#162633] hover:border-[#203648] hover:bg-[#0d1820]'
              }`}
            >
              <div>
                {/* Flag + State Badge */}
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className="text-3xl leading-none transition-transform duration-200 group-hover:scale-110">
                    {m.flag}
                  </span>

                  {isSelected ? (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-[#00D27A]/15 text-[#00D27A] border border-[#00D27A]/30">
                      <Check className="w-3 h-3 stroke-[3]" />
                      Active
                    </span>
                  ) : (
                    <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-semibold text-[#94A3B8] group-hover:text-[#CBD5E1] bg-[#071015] border border-[#162633]">
                      Select
                    </span>
                  )}
                </div>

                {/* Country Name */}
                <div className="font-bold text-sm text-[#F8FAFC] leading-snug group-hover:text-white">
                  {m.name}
                </div>

                {/* Currency */}
                <div className="text-xs font-semibold text-[#00D27A] mt-1 flex items-center gap-1">
                  <span>{m.currency}</span>
                  <span className="text-[10px] text-[#94A3B8] font-normal">({m.currencyName})</span>
                </div>
              </div>

              {/* Retailers hint */}
              <div className="mt-4 pt-3 border-t border-[#162633] flex items-center gap-1 text-[10px] text-[#94A3B8]">
                <Store className="w-3 h-3 text-[#00D27A] shrink-0" />
                <span className="truncate">{m.topMerchants}</span>
              </div>
            </button>
          );
        })}
      </div>
    </section>
  );
}
