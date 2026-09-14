'use client';

import React from 'react';
import { useCountry } from '@/context/CountryContext';
import { SearchBar } from '@/components/search/SearchBar';
import { Sparkles, TrendingDown, ShieldCheck, Flame, Bell, ArrowRight } from 'lucide-react';

export function Hero() {
  const { country, setCountry, countryInfo } = useCountry();

  const popularSearches = [
    'iPhone 16 Pro',
    'PlayStation 5 Pro',
    'MacBook Pro M3',
    'LG OLED TV',
    'Sony WH-1000XM5',
    'Apple Watch Ultra',
  ];

  return (
    <section className="relative overflow-hidden pt-6 pb-10 sm:pt-12 sm:pb-16 bg-gradient-to-b from-slate-950 via-ctp-surface to-ctp-base border-b border-ctp">
      {/* Glow background accent */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 max-w-4xl h-64 bg-emerald-500/10 blur-3xl pointer-events-none rounded-full" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center relative z-10">
        {/* Market Switcher Strip */}
        <div className="inline-flex items-center gap-1.5 p-1 rounded-full bg-ctp-surface border border-ctp mb-6 shadow-inner">
          <span className="text-[11px] font-semibold text-slate-400 pl-3 pr-1">Active Market:</span>
          <button
            type="button"
            onClick={() => setCountry('ae')}
            className={`px-3 py-1 rounded-full text-xs font-bold transition-all ${
              country === 'ae'
                ? 'bg-emerald-500 text-slate-950 shadow-sm'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            🇦🇪 UAE (AED)
          </button>
          <button
            type="button"
            onClick={() => setCountry('us')}
            className={`px-3 py-1 rounded-full text-xs font-bold transition-all ${
              country === 'us'
                ? 'bg-emerald-500 text-slate-950 shadow-sm'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            🇺🇸 USA (USD)
          </button>
          <button
            type="button"
            onClick={() => setCountry('uk')}
            className={`hidden sm:inline-block px-3 py-1 rounded-full text-xs font-bold transition-all ${
              country === 'uk'
                ? 'bg-emerald-500 text-slate-950 shadow-sm'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            🇬🇧 UK (GBP)
          </button>
        </div>

        {/* Hero Title */}
        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-100 leading-tight">
          Smarter Shopping for a{' '}
          <span className="text-gradient-ctp">Brighter Tomorrow.</span>
        </h1>

        {/* Supporting Text */}
        <p className="mt-3 sm:mt-4 text-sm sm:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
          Compare prices. Track drops. Save more.
        </p>

        {/* Large Search Bar */}
        <div className="mt-6 sm:mt-8 max-w-2xl mx-auto">
          <SearchBar isHero={true} />
        </div>

        {/* Popular Searches Pills */}
        <div className="mt-4 flex flex-wrap items-center justify-center gap-1.5 sm:gap-2 text-xs">
          <span className="text-slate-400 font-medium text-[11px] sm:text-xs">Trending:</span>
          {popularSearches.map((term) => (
            <a
              key={term}
              href={`/${country}/search?q=${encodeURIComponent(term)}`}
              className="px-2.5 py-1 rounded-lg bg-ctp-surface hover:bg-slate-800 border border-ctp hover:border-emerald-500/40 text-slate-300 hover:text-emerald-300 text-[11px] sm:text-xs transition-colors"
            >
              {term}
            </a>
          ))}
        </div>

        {/* Quick Jump Anchor Tabs */}
        <div className="mt-8 flex items-center justify-center gap-2 sm:gap-4 overflow-x-auto py-2">
          <a
            href={`#top-deals`}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900/80 border border-ctp hover:border-emerald-500/40 text-xs font-semibold text-slate-200 hover:text-emerald-400 whitespace-nowrap transition-all"
          >
            <Flame className="w-3.5 h-3.5 text-emerald-400" />
            <span>Top Deals</span>
          </a>
          <a
            href={`#price-drops`}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900/80 border border-ctp hover:border-emerald-500/40 text-xs font-semibold text-slate-200 hover:text-emerald-400 whitespace-nowrap transition-all"
          >
            <TrendingDown className="w-3.5 h-3.5 text-cyan-400" />
            <span>Biggest Drops</span>
          </a>
          <a
            href={`#categories`}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900/80 border border-ctp hover:border-emerald-500/40 text-xs font-semibold text-slate-200 hover:text-emerald-400 whitespace-nowrap transition-all"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Categories</span>
          </a>
          <a
            href={`/${country}/account?tab=alerts`}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900/80 border border-ctp hover:border-emerald-500/40 text-xs font-semibold text-slate-200 hover:text-emerald-400 whitespace-nowrap transition-all"
          >
            <Bell className="w-3.5 h-3.5 text-emerald-400" />
            <span>Tracked Prices</span>
          </a>
        </div>
      </div>
    </section>
  );
}
