'use client';

import React from 'react';
import { useCountry } from '@/context/CountryContext';
import { ShieldCheck, TrendingDown, ArrowRight, AlertTriangle, CheckCircle2, Sliders, History } from 'lucide-react';

export function BuyingInsightBlock() {
  const { country } = useCountry();

  return (
    <section className="py-10 sm:py-14 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-t border-[#DDE7E3]">
      <div className="rounded-3xl bg-gradient-to-b from-[#09141c] to-[#071015] border border-[#1b2d3c] p-6 sm:p-10 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#00D27A]/5 rounded-full blur-3xl pointer-events-none" />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
          <div className="lg:col-span-7 space-y-4">
            <span className="text-xs font-bold uppercase tracking-wider text-[#00D27A] flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4" /> Shopping intelligence
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#F8FAFC] tracking-tight leading-tight">
              A discount label is not the same as a good price
            </h2>
            <p className="text-sm text-[#CBD5E1] leading-relaxed">
              CatchThePrice is designed to separate a retailer&apos;s reference price from the price history we have actually observed. When enough genuine data exists, shoppers can compare current listings, stored observations and competing retailers before deciding.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
              <div className="p-3.5 rounded-2xl bg-[#071015] border border-[#162633]">
                <div className="text-[#00D27A] font-bold text-xs flex items-center gap-1 mb-1">
                  <History className="w-3.5 h-3.5" /> Stored history
                </div>
                <p className="text-[11px] text-[#94A3B8] leading-snug">Historical claims appear only after enough genuine price observations are stored.</p>
              </div>

              <div className="p-3.5 rounded-2xl bg-[#071015] border border-[#162633]">
                <div className="text-[#00D27A] font-bold text-xs flex items-center gap-1 mb-1">
                  <Sliders className="w-3.5 h-3.5" /> Cross-store comparison
                </div>
                <p className="text-[11px] text-[#94A3B8] leading-snug">Compare active listings for the exact product and market instead of relying on one store.</p>
              </div>

              <div className="p-3.5 rounded-2xl bg-[#071015] border border-[#162633]">
                <div className="text-[#00D27A] font-bold text-xs flex items-center gap-1 mb-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Source transparency
                </div>
                <p className="text-[11px] text-[#94A3B8] leading-snug">Missing or unverified information stays unavailable rather than being invented.</p>
              </div>
            </div>

            <div className="pt-2">
              <a
                href={`/${country}/price-drops/all`}
                className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-[#00D27A] hover:bg-[#00E6A2] text-[#071015] font-extrabold text-xs transition-all shadow-lg touch-target"
              >
                <span>Explore tracked price changes</span>
                <ArrowRight className="w-4 h-4 stroke-[2.5]" />
              </a>
            </div>
          </div>

          <div className="lg:col-span-5 space-y-3.5">
            <div className="p-4 rounded-2xl bg-[#0b1419] border border-amber-500/20 space-y-2">
              <div className="flex items-center gap-1.5 text-amber-300 font-bold text-xs">
                <AlertTriangle className="w-3.5 h-3.5" /> Reference price
              </div>
              <p className="text-xs text-[#CBD5E1] leading-relaxed">
                A crossed-out price can be useful context, but by itself it does not prove that today&apos;s price is unusually low.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-[#0b1b16] border border-[#00D27A]/30 space-y-2 ring-1 ring-[#00D27A]/20">
              <div className="flex items-center gap-1.5 text-[#00D27A] font-bold text-xs">
                <TrendingDown className="w-3.5 h-3.5" /> What we can verify
              </div>
              <p className="text-xs text-[#CBD5E1] leading-relaxed">
                Current merchant listings, timestamps, stored price observations and structured specifications are shown only when the underlying source data exists.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
