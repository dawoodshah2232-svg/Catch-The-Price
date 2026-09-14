'use client';

import React from 'react';
import { useCountry } from '@/context/CountryContext';
import { SearchBar } from '@/components/search/SearchBar';
import { ShieldCheck, TrendingDown, Bell } from 'lucide-react';

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
    <section className="relative overflow-hidden pt-6 pb-8 sm:pt-12 sm:pb-14 bg-[#071015] border-b border-[#162633]">
      {/* Subtle restrained glow in background */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 max-w-3xl h-44 bg-[#00D27A]/10 blur-[90px] pointer-events-none rounded-full" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center relative z-10">
        {/* Brand Tagline Badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#091217] border border-[#162633] text-[10px] sm:text-[11px] font-bold text-[#CBD5E1] uppercase tracking-wider mb-4">
          <span className="w-1.5 h-1.5 rounded-full bg-[#00D27A] animate-pulse" />
          <span>TRACK IT. CATCH THE DROP. PAY LESS.</span>
        </div>

        {/* Headline */}
        <h1 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-[#F8FAFC] leading-[1.15]">
          Smarter Shopping for a{' '}
          <span className="text-[#00D27A]">Brighter Tomorrow.</span>
        </h1>

        {/* Supporting Text */}
        <p className="mt-2.5 sm:mt-3 text-xs sm:text-base text-[#CBD5E1] max-w-xl mx-auto leading-relaxed">
          Compare prices across trusted stores, track price drops and buy when the price is right.
        </p>

        {/* Dominant Search Input */}
        <div className="mt-5 sm:mt-7 max-w-2xl mx-auto">
          <SearchBar isHero={true} />
        </div>

        {/* Search Examples Pills */}
        <div className="mt-3.5 flex flex-wrap items-center justify-center gap-2 text-xs">
          <span className="text-[#94A3B8] font-semibold text-[11px] self-center">Popular:</span>
          {searchExamples.map((term) => (
            <a
              key={term}
              href={`/${country}/search?q=${encodeURIComponent(term)}`}
              className="px-3 py-1.5 rounded-lg bg-[#091217] hover:bg-[#0f1c24] border border-[#162633] hover:border-[#00D27A]/50 text-[#CBD5E1] hover:text-[#00E6A2] text-[11px] font-medium transition-colors touch-target inline-flex items-center justify-center"
            >
              {term}
            </a>
          ))}
        </div>

        {/* Micro Value Proposition Badges */}
        <div className="mt-6 pt-4 border-t border-[#162633]/80 grid grid-cols-3 gap-2 max-w-md mx-auto text-[10px] sm:text-xs text-[#CBD5E1]">
          <div className="flex items-center justify-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-[#00D27A] shrink-0" />
            <span className="truncate">Store Direct</span>
          </div>
          <div className="flex items-center justify-center gap-1">
            <TrendingDown className="w-3.5 h-3.5 text-[#00C996] shrink-0" />
            <span className="truncate">90D Verified Drops</span>
          </div>
          <div className="flex items-center justify-center gap-1">
            <Bell className="w-3.5 h-3.5 text-[#00E6A2] shrink-0" />
            <span className="truncate">Instant Alerts</span>
          </div>
        </div>
      </div>
    </section>
  );
}
