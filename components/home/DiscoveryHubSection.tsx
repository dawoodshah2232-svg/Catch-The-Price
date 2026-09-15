'use client';

import React from 'react';
import { useCountry } from '@/context/CountryContext';
import { Gamepad2, Cpu, Smartphone, ArrowRight, Sparkles, GitCompareArrows } from 'lucide-react';

const cards = [
  { title: 'Gaming Deal Zone', text: 'Gaming laptops, GPUs, consoles and accessories worth watching.', query: 'gaming', icon: Gamepad2 },
  { title: 'Build a Better PC', text: 'Compare CPUs, graphics cards and components before you buy.', query: 'gpu', icon: Cpu },
  { title: 'Phone Upgrade Guide', text: 'Compare flagship phones, storage options and current price gaps.', query: 'phone', icon: Smartphone },
];

export function DiscoveryHubSection() {
  const { country } = useCountry();

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10">
      <div className="relative rounded-[30px] ui-surface border p-4 sm:p-6 lg:p-8 overflow-hidden ui-shadow">
        <div className="absolute inset-0 pointer-events-none opacity-60">
          <div className="absolute -right-20 -top-24 w-80 h-80 rounded-full bg-[#00D27A]/10 blur-[85px]" />
          <div className="absolute left-[18%] -bottom-28 w-72 h-72 rounded-full bg-[#00C996]/7 blur-[90px]" />
        </div>

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4 mb-5 sm:mb-7">
          <div>
            <div className="inline-flex items-center gap-1.5 text-[10px] sm:text-xs font-extrabold uppercase tracking-[0.18em] text-[#0B8F58]">
              <Sparkles className="w-3.5 h-3.5" /> Shop by intent
            </div>
            <h2 className="mt-2 text-xl sm:text-3xl font-extrabold ui-text leading-tight">Not sure what to buy? Start here.</h2>
            <p className="mt-1.5 text-xs sm:text-sm ui-secondary max-w-2xl leading-relaxed">
              Explore guided buying paths instead of scrolling through endless product cards.
            </p>
          </div>

          <a href={`/${country}/search`} className="inline-flex items-center gap-2 text-xs font-extrabold text-[#0B8F58] hover:text-[#08784B] transition-colors">
            Browse all products <ArrowRight className="w-4 h-4" />
          </a>
        </div>

        <div className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4">
          {cards.map((card, index) => {
            const Icon = card.icon;
            return (
              <a
                key={card.title}
                href={`/${country}/search?q=${encodeURIComponent(card.query)}`}
                className="group relative min-h-[158px] rounded-2xl ui-soft border p-4 sm:p-5 overflow-hidden hover:border-[#9CCFBA] hover:-translate-y-0.5 transition-all"
              >
                <div className="absolute -right-10 -top-10 w-28 h-28 rounded-full bg-[#00D27A]/8 blur-2xl group-hover:bg-[#00D27A]/14 transition-colors" />
                <div className="w-10 h-10 rounded-xl bg-[#EAF8F1] border border-[#CFE9DD] flex items-center justify-center text-[#0B8F58]">
                  <Icon className="w-5 h-5" />
                </div>
                <h3 className="mt-4 text-sm sm:text-base font-extrabold ui-text">{card.title}</h3>
                <p className="mt-1.5 text-[11px] sm:text-xs ui-secondary leading-relaxed max-w-[30ch]">{card.text}</p>
                <div className="mt-4 flex items-center gap-1 text-[11px] font-extrabold text-[#0B8F58]">
                  Explore <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                </div>
                <span className="absolute top-4 right-4 text-[10px] ui-muted font-mono">0{index + 1}</span>
              </a>
            );
          })}
        </div>

        <div className="relative z-10 mt-4 rounded-2xl ui-soft border p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#EAF8F1] border border-[#CFE9DD] flex items-center justify-center shrink-0">
              <GitCompareArrows className="w-5 h-5 text-[#0B8F58]" />
            </div>
            <div>
              <h3 className="text-sm font-extrabold ui-text">Compare before you buy</h3>
              <p className="text-[11px] sm:text-xs ui-secondary mt-1">Compare prices, specifications and nearby alternatives in one place.</p>
            </div>
          </div>
          <a
            href={`/${country}/compare`}
            className="min-h-[42px] px-4 rounded-xl bg-[#0B8F58] text-white text-xs font-extrabold inline-flex items-center justify-center gap-2 whitespace-nowrap hover:bg-[#08784B] transition-colors"
          >
            Start comparing <ArrowRight className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>
    </section>
  );
}
