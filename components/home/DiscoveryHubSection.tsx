'use client';

import React from 'react';
import { useCountry } from '@/context/CountryContext';
import { Gamepad2, Cpu, Smartphone, ArrowRight, Sparkles, GitCompareArrows } from 'lucide-react';

const cards = [
  {
    title: 'Gaming Deal Zone',
    text: 'Gaming laptops, GPUs, consoles and accessories worth watching.',
    query: 'gaming',
    icon: Gamepad2,
  },
  {
    title: 'Build a Better PC',
    text: 'Compare CPUs, graphics cards and components before you buy.',
    query: 'gpu',
    icon: Cpu,
  },
  {
    title: 'Phone Upgrade Guide',
    text: 'Compare flagship phones, storage options and current price gaps.',
    query: 'phone',
    icon: Smartphone,
  },
];

export function DiscoveryHubSection() {
  const { country } = useCountry();

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10">
      <div className="rounded-[28px] border border-[#19313a] bg-[radial-gradient(circle_at_top_right,rgba(0,210,122,0.14),transparent_34%),linear-gradient(135deg,#091217,#0a171c)] p-4 sm:p-6 lg:p-8 overflow-hidden">
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4 mb-5 sm:mb-7">
          <div>
            <div className="inline-flex items-center gap-1.5 text-[10px] sm:text-xs font-bold uppercase tracking-[0.18em] text-[#63efb7]">
              <Sparkles className="w-3.5 h-3.5" />
              Shop by intent
            </div>
            <h2 className="mt-2 text-xl sm:text-3xl font-extrabold text-[#F8FAFC] leading-tight">
              Not sure what to buy? Start here.
            </h2>
            <p className="mt-1.5 text-xs sm:text-sm text-[#AEBBC5] max-w-2xl leading-relaxed">
              Explore popular buying paths instead of scrolling through endless product cards.
            </p>
          </div>

          <a
            href={`/${country}/search`}
            className="inline-flex items-center gap-2 text-xs font-bold text-[#67efb8] hover:text-white transition-colors"
          >
            Browse all products <ArrowRight className="w-4 h-4" />
          </a>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4">
          {cards.map((card, index) => {
            const Icon = card.icon;
            return (
              <a
                key={card.title}
                href={`/${country}/search?q=${encodeURIComponent(card.query)}`}
                className="group relative min-h-[150px] rounded-2xl border border-[#1a3039] bg-[#0a151a]/88 p-4 sm:p-5 overflow-hidden hover:border-[#00D27A]/45 transition-all"
              >
                <div className="absolute -right-8 -top-8 w-24 h-24 rounded-full bg-[#00D27A]/10 blur-2xl group-hover:bg-[#00D27A]/20 transition-colors" />
                <div className="w-10 h-10 rounded-xl bg-[#00D27A]/10 border border-[#00D27A]/20 flex items-center justify-center text-[#58e9ad]">
                  <Icon className="w-5 h-5" />
                </div>
                <h3 className="mt-4 text-sm sm:text-base font-extrabold text-white">{card.title}</h3>
                <p className="mt-1.5 text-[11px] sm:text-xs text-[#9FB0BA] leading-relaxed max-w-[30ch]">{card.text}</p>
                <div className="mt-4 flex items-center gap-1 text-[11px] font-bold text-[#67efb8]">
                  Explore <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                </div>
                <span className="absolute top-4 right-4 text-[10px] text-[#45616f] font-mono">0{index + 1}</span>
              </a>
            );
          })}
        </div>

        <div className="mt-4 rounded-2xl border border-[#1a3039] bg-[#071015]/70 p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#0d2a23] border border-[#00D27A]/25 flex items-center justify-center shrink-0">
              <GitCompareArrows className="w-5 h-5 text-[#67efb8]" />
            </div>
            <div>
              <h3 className="text-sm font-extrabold text-white">Compare before you buy</h3>
              <p className="text-[11px] sm:text-xs text-[#9FB0BA] mt-1">Open a product to compare prices, specifications, deal score and nearby alternatives in one place.</p>
            </div>
          </div>
          <a
            href={`/${country}/search`}
            className="min-h-[42px] px-4 rounded-xl bg-[#0d2a23] border border-[#00D27A]/30 text-[#67efb8] text-xs font-extrabold inline-flex items-center justify-center gap-2 whitespace-nowrap hover:bg-[#10372d] transition-colors"
          >
            Start comparing <ArrowRight className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>
    </section>
  );
}
