'use client';

import React from 'react';
import { useCountry } from '@/context/CountryContext';
import { SearchBar } from '@/components/search/SearchBar';
import { ShieldCheck, Sparkles, TrendingDown, Bell } from 'lucide-react';

export function Hero() {
  const { country } = useCountry();

  const searchExamples = [
    'iPhone 17 Pro',
    'PS5 Pro',
    'MacBook Pro',
    'Samsung TV',
    'Gaming Laptop',
  ];

  return (
    <section className="relative overflow-hidden pt-8 pb-12 sm:pt-14 sm:pb-16 bg-[#071015] border-b border-[#162633]">
      {/* Subtle restrained glow in background */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 max-w-3xl h-56 bg-[#00D27A]/10 blur-[100px] pointer-events-none rounded-full" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center relative z-10">
        {/* Brand Tagline Badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#091217] border border-[#162633] text-[11px] font-bold text-[#8E9DAE] uppercase tracking-wider mb-5">
          <span className="w-1.5 h-1.5 rounded-full bg-[#00D27A] animate-pulse" />
          <span>TRACK IT. CATCH THE DROP. PAY LESS.</span>
        </div>

        {/* Headline */}
        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-[#F8FAFC] leading-[1.12]">
          Smarter Shopping for a{' '}
          <span className="text-[#00D27A]">Brighter Tomorrow.</span>
        </h1>

        {/* Supporting Text */}
        <p className="mt-4 text-sm sm:text-lg text-[#8E9DAE] max-w-2xl mx-auto leading-relaxed">
          Compare prices across trusted stores, track price drops and buy when the price is right.
        </p>

        {/* Dominant Search Input */}
        <div className="mt-8 max-w-2xl mx-auto">
          <SearchBar isHero={true} />
        </div>

        {/* Search Examples Pills */}
        <div className="mt-4 flex flex-wrap items-center justify-center gap-1.5 sm:gap-2 text-xs">
          <span className="text-[#5B6B7C] font-semibold text-[11px] sm:text-xs">Examples:</span>
          {searchExamples.map((term) => (
            <a
              key={term}
              href={`/${country}/search?q=${encodeURIComponent(term)}`}
              className="px-2.5 py-1 rounded-lg bg-[#091217] hover:bg-[#0f1c24] border border-[#162633] hover:border-[#00D27A]/40 text-[#8E9DAE] hover:text-[#00E6A2] text-[11px] sm:text-xs transition-colors"
            >
              {term}
            </a>
          ))}
        </div>

        {/* Micro Value Proposition Badges */}
        <div className="mt-8 pt-6 border-t border-[#162633]/60 grid grid-cols-3 gap-2 max-w-xl mx-auto text-[11px] sm:text-xs text-[#8E9DAE]">
          <div className="flex items-center justify-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-[#00D27A]" />
            <span>100% Store Direct</span>
          </div>
          <div className="flex items-center justify-center gap-1.5">
            <TrendingDown className="w-3.5 h-3.5 text-[#00C996]" />
            <span>Verified 90D Drops</span>
          </div>
          <div className="flex items-center justify-center gap-1.5">
            <Bell className="w-3.5 h-3.5 text-[#00E6A2]" />
            <span>Instant Alerts</span>
          </div>
        </div>
      </div>
    </section>
  );
}
