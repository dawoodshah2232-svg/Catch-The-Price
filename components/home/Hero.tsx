'use client';

import React from 'react';
import { useCountry } from '@/context/CountryContext';
import { ArrowRight, Scale, TrendingDown, Store, BellRing, BarChart3 } from 'lucide-react';

export function Hero() {
  const { country } = useCountry();

  const features = [
    { Icon: TrendingDown, title: 'Live price tracking', text: 'See current approved retailer prices.' },
    { Icon: Scale, title: 'Smart comparison', text: 'Compare exact products and offers.' },
    { Icon: BellRing, title: 'Price drop alerts', text: 'Track products and target prices.' },
    { Icon: BarChart3, title: 'Real price history', text: 'History appears only from stored observations.' },
  ];

  return (
    <section className="relative overflow-hidden bg-[linear-gradient(115deg,#F7FBF9_0%,#EEF7F2_50%,#E6F3ED_100%)] border-b border-[#DCE8E3]">
      <div className="absolute -top-24 right-[5%] w-[420px] h-[300px] rounded-full bg-[#00D27A]/10 blur-[90px] pointer-events-none" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-9 sm:py-12 lg:py-14 relative z-10">
        <div className="grid lg:grid-cols-[1.05fr_.95fr] gap-8 lg:gap-12 items-center">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-2 rounded-full bg-white border border-[#CFE3DA] text-[10px] sm:text-[11px] font-extrabold text-[#0B8F58] uppercase tracking-[0.14em] shadow-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-[#00D27A]" />
              TRACK IT. CATCH THE DROP. PAY LESS.
            </div>

            <h1 className="mt-5 text-[36px] min-[390px]:text-[42px] sm:text-5xl lg:text-[58px] font-black tracking-[-0.045em] text-[#102027] leading-[0.98]">
              Better Prices.<br />
              <span className="text-[#0B8F58]">Smarter Choices.</span>
            </h1>

            <p className="mt-5 text-[14px] sm:text-[17px] text-[#52636B] max-w-xl leading-relaxed">
              Compare prices across available stores, track genuine price drops, and know when it is the right time to buy.
            </p>

            <div className="mt-6 flex flex-col min-[390px]:flex-row gap-3">
              <a href={`/${country}/deals/all`} className="min-h-[48px] px-6 rounded-xl bg-[#0B8F58] hover:bg-[#08784B] text-white font-extrabold text-sm inline-flex items-center justify-center gap-2 shadow-[0_8px_20px_rgba(11,143,88,.18)]">
                Explore deals <ArrowRight className="w-4 h-4" />
              </a>
              <a href={`/${country}/compare`} className="min-h-[48px] px-6 rounded-xl bg-white border border-[#C9DCD4] text-[#20343C] hover:border-[#9FCBB9] font-extrabold text-sm inline-flex items-center justify-center gap-2 shadow-sm">
                <Scale className="w-4 h-4 text-[#0B8F58]" /> Compare products
              </a>
            </div>

            <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-2 text-[11px] sm:text-xs text-[#667A72] font-semibold">
              <span className="inline-flex items-center gap-1.5"><Store className="w-3.5 h-3.5 text-[#0B8F58]" /> Retailer checkout</span>
              <span className="inline-flex items-center gap-1.5"><TrendingDown className="w-3.5 h-3.5 text-[#0B8F58]" /> Genuine drops only</span>
            </div>
          </div>

          <div className="relative">
            <div className="rounded-[28px] sm:rounded-[32px] bg-[linear-gradient(145deg,#0A2B22_0%,#0A1C23_55%,#071319_100%)] border border-[#17382E] shadow-[0_30px_70px_rgba(7,19,25,.22)] p-4 sm:p-5 lg:p-6 overflow-hidden">
              <div className="absolute top-0 right-0 w-48 h-48 bg-[#00D27A]/12 blur-[70px] rounded-full" />
              <div className="relative">
                <div className="text-[10px] uppercase tracking-[0.16em] font-extrabold text-[#67EFB8]">Shop smarter with CatchThePrice</div>
                <h2 className="mt-2 text-xl sm:text-2xl font-extrabold text-white">Everything you need before checkout.</h2>
                <p className="mt-2 text-xs text-[#AFC1BA] leading-relaxed max-w-md">A clean shopping intelligence layer between discovery and the retailer.</p>

                <div className="grid grid-cols-2 gap-3 mt-5">
                  {features.map(({ Icon, title, text }) => (
                    <div key={title} className="rounded-2xl bg-white/[0.96] border border-white/10 p-3.5 sm:p-4 min-h-[122px] shadow-sm">
                      <div className="w-9 h-9 rounded-xl bg-[#EAF8F1] border border-[#CFE8DC] text-[#0B8F58] flex items-center justify-center">
                        <Icon className="w-4.5 h-4.5" />
                      </div>
                      <div className="mt-3 text-[12px] sm:text-[13px] font-extrabold text-[#102027] leading-tight">{title}</div>
                      <div className="mt-1 text-[10px] sm:text-[11px] text-[#6A7B74] leading-relaxed">{text}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
