'use client';

import React from 'react';
import { useCountry } from '@/context/CountryContext';
import { Globe, Check, Clock } from 'lucide-react';

export function CountrySection() {
  const { country, setCountry } = useCountry();

  const activeMarkets = [
    { code: 'ae', name: 'United Arab Emirates', flag: '🇦🇪', currency: 'AED (د.إ)', status: 'Live' },
    { code: 'us', name: 'United States', flag: '🇺🇸', currency: 'USD ($)', status: 'Live' },
  ];

  const upcomingMarkets = [
    { name: 'Saudi Arabia', flag: '🇸🇦', currency: 'SAR (ر.س)', status: 'Coming Soon' },
    { name: 'United Kingdom', flag: '🇬🇧', currency: 'GBP (£)', status: 'Available' },
    { name: 'Canada', flag: '🇨🇦', currency: 'CAD (C$)', status: 'Available' },
    { name: 'Australia', flag: '🇦🇺', currency: 'AUD (A$)', status: 'Available' },
  ];

  return (
    <section className="py-8 sm:py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-t border-[#162633]">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 mb-6">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-[#00D27A] flex items-center gap-1.5">
            <Globe className="w-3.5 h-3.5" /> Global Market Coverage
          </span>
          <h2 className="text-xl sm:text-2xl font-bold text-[#F8FAFC] mt-1">
            Track Local Prices in Your Currency
          </h2>
        </div>
        <p className="text-xs text-[#CBD5E1]">
          Switch your region to instantly view local store offers and warranties
        </p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {/* Active Markets */}
        {activeMarkets.map((m) => {
          const isSelected = country === m.code;
          return (
            <button
              key={m.code}
              type="button"
              onClick={() => setCountry(m.code as any)}
              className={`p-3.5 rounded-2xl text-left transition-all border touch-target ${
                isSelected
                  ? 'bg-[#00D27A]/10 border-[#00D27A] shadow-md'
                  : 'bg-[#091217] border-[#162633] hover:border-[#203648]'
              }`}
            >
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-2xl">{m.flag}</span>
                {isSelected ? (
                  <Check className="w-4 h-4 text-[#00D27A]" />
                ) : (
                  <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-[#00D27A]/15 text-[#00D27A]">
                    {m.status}
                  </span>
                )}
              </div>
              <div className="font-bold text-xs text-[#F8FAFC]">{m.name}</div>
              <div className="text-[10px] text-[#CBD5E1] mt-0.5">{m.currency}</div>
            </button>
          );
        })}

        {/* Other / Upcoming Markets */}
        {upcomingMarkets.map((m) => (
          <div
            key={m.name}
            className="p-3.5 rounded-2xl bg-[#091217]/50 border border-[#162633] text-left opacity-75"
          >
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-2xl">{m.flag}</span>
              <span className="text-[9px] font-semibold text-[#94A3B8] flex items-center gap-0.5">
                <Clock className="w-2.5 h-2.5" />
                {m.status}
              </span>
            </div>
            <div className="font-semibold text-xs text-[#CBD5E1]">{m.name}</div>
            <div className="text-[10px] text-[#94A3B8] mt-0.5">{m.currency}</div>
          </div>
        ))}
      </div>
    </section>
  );
}
