'use client';

import React from 'react';
import { useCountry } from '@/context/CountryContext';
import { ShieldCheck, TrendingDown, ArrowRight, AlertTriangle, CheckCircle2, Sliders } from 'lucide-react';

export function BuyingInsightBlock() {
  const { country } = useCountry();

  return (
    <section className="py-10 sm:py-14 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-t border-[#162633]">
      <div className="rounded-3xl bg-gradient-to-b from-[#09141c] to-[#071015] border border-[#1b2d3c] p-6 sm:p-10 relative overflow-hidden">
        {/* Subtle decorative glow */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#00D27A]/5 rounded-full blur-3xl pointer-events-none" />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
          {/* Left Column: Explanation */}
          <div className="lg:col-span-7 space-y-4">
            <span className="text-xs font-bold uppercase tracking-wider text-[#00D27A] flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4" /> Shopping Intelligence
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#F8FAFC] tracking-tight leading-tight">
              Why a &ldquo;40% Off&rdquo; Sticker is Often Misleading
            </h2>
            <p className="text-sm text-[#CBD5E1] leading-relaxed">
              Retailers frequently inflate reference prices right before promotional events. The CatchThePrice{' '}
              <strong className="text-[#00D27A]">Deal Score™</strong> evaluates true 90-day price floors, multi-store spreads, and warranty legitimacy to show you genuine discounts.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
              <div className="p-3.5 rounded-2xl bg-[#071015] border border-[#162633]">
                <div className="text-[#00D27A] font-bold text-xs flex items-center gap-1 mb-1">
                  <TrendingDown className="w-3.5 h-3.5" /> 90-Day Floor
                </div>
                <p className="text-[11px] text-[#94A3B8] leading-snug">
                  Benchmarked against actual daily prices, never theoretical MSRPs.
                </p>
              </div>

              <div className="p-3.5 rounded-2xl bg-[#071015] border border-[#162633]">
                <div className="text-[#00D27A] font-bold text-xs flex items-center gap-1 mb-1">
                  <Sliders className="w-3.5 h-3.5" /> Cross-Store Spread
                </div>
                <p className="text-[11px] text-[#94A3B8] leading-snug">
                  Real-time price difference across all authorized local competitors.
                </p>
              </div>

              <div className="p-3.5 rounded-2xl bg-[#071015] border border-[#162633]">
                <div className="text-[#00D27A] font-bold text-xs flex items-center gap-1 mb-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Genuine Stock
                </div>
                <p className="text-[11px] text-[#94A3B8] leading-snug">
                  Zero bait-and-switch. In-stock confirmation with localized warranties.
                </p>
              </div>
            </div>

            <div className="pt-2">
              <a
                href={`/${country}/price-drops/all`}
                className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-[#00D27A] hover:bg-[#00E6A2] text-[#071015] font-extrabold text-xs transition-all shadow-lg touch-target"
              >
                <span>Browse Verified Real Drops</span>
                <ArrowRight className="w-4 h-4 stroke-[2.5]" />
              </a>
            </div>
          </div>

          {/* Right Column: Visual Contrast Card */}
          <div className="lg:col-span-5 space-y-3.5">
            {/* Fake Deal Card */}
            <div className="p-4 rounded-2xl bg-[#0b1419] border border-red-500/20 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="flex items-center gap-1.5 text-red-400 font-bold">
                  <AlertTriangle className="w-3.5 h-3.5" /> Typical Retail Trick
                </span>
                <span className="px-2 py-0.5 rounded text-[10px] font-extrabold bg-red-500/15 text-red-400 border border-red-500/30">
                  Deal Score 52/100
                </span>
              </div>
              <p className="text-xs text-[#CBD5E1]">
                Claimed: &ldquo;Save 35% Today!&rdquo; (MSRP was quietly raised 3 days ago).
              </p>
              <div className="text-[11px] text-[#94A3B8] font-mono">
                Real savings vs 30-day average: <span className="text-red-400 font-bold">$0.00</span>
              </div>
            </div>

            {/* True Deal Score Card */}
            <div className="p-4 rounded-2xl bg-[#0b1b16] border border-[#00D27A]/30 space-y-2 ring-1 ring-[#00D27A]/20">
              <div className="flex items-center justify-between text-xs">
                <span className="flex items-center gap-1.5 text-[#00D27A] font-bold">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Verified CatchThePrice Drop
                </span>
                <span className="px-2 py-0.5 rounded text-[10px] font-extrabold bg-[#00D27A]/20 text-[#00D27A] border border-[#00D27A]/40">
                  Deal Score 96/100
                </span>
              </div>
              <p className="text-xs text-[#CBD5E1]">
                Lowest price in 120 days across all certified authorized retailers.
              </p>
              <div className="text-[11px] text-[#CBD5E1] font-mono">
                Real net savings: <span className="text-[#00D27A] font-bold">Verified All-Time Low</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
