'use client';

import React from 'react';
import { useCountry } from '@/context/CountryContext';
import {
  ArrowRight,
  Scale,
  TrendingDown,
  Store,
  BellRing,
  Smartphone,
  Laptop,
  Headphones,
  Watch,
  Sparkles,
  MapPin,
} from 'lucide-react';

export function Hero() {
  const { country } = useCountry();

  const features = [
    { Icon: BellRing, title: 'Track Prices', text: 'Watch products and target prices.' },
    { Icon: Scale, title: 'Compare Products', text: 'Compare exact variants side by side.' },
    { Icon: Sparkles, title: 'Shop Smarter', text: 'Use verified price context before checkout.' },
    { Icon: MapPin, title: 'UAE & USA', text: 'Focused launch markets with local listings.' },
  ];

  return (
    <section className="relative overflow-hidden border-b border-[#D9E9E2] bg-[linear-gradient(110deg,#F2FBF7_0%,#EAF7F1_54%,#DDF3E8_100%)]">
      <div className="absolute -top-24 right-[10%] h-[360px] w-[440px] rounded-full bg-[#00D27A]/10 blur-[90px] pointer-events-none" />
      <div className="absolute -bottom-32 left-[42%] h-[300px] w-[300px] rounded-full bg-white/70 blur-[90px] pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-11 lg:py-12">
        <div className="grid lg:grid-cols-[.9fr_1.1fr] gap-8 lg:gap-10 items-center">
          <div className="max-w-xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-[#C9E3D7] bg-white/85 px-3.5 py-2 text-[10px] sm:text-[11px] font-extrabold uppercase tracking-[0.14em] text-[#0B8F58] shadow-sm">
              <span className="h-1.5 w-1.5 rounded-full bg-[#00D27A]" />
              TRACK IT. CATCH THE DROP. PAY LESS.
            </div>

            <h1 className="mt-5 text-[38px] min-[390px]:text-[44px] sm:text-[54px] lg:text-[62px] font-black tracking-[-0.055em] text-[#102027] leading-[0.95]">
              Better Prices.<br />
              <span className="text-[#0B8F58]">Smarter Choices.</span>
            </h1>

            <p className="mt-5 text-[14px] sm:text-[17px] text-[#52636B] max-w-xl leading-relaxed">
              Compare available retailer prices, track genuine drops, and make a better buying decision before checkout.
            </p>

            <div className="mt-6 flex flex-col min-[390px]:flex-row gap-3">
              <a href={`/${country}/deals/all`} className="min-h-[48px] px-6 rounded-xl bg-[#0B8F58] hover:bg-[#08784B] text-white font-extrabold text-sm inline-flex items-center justify-center gap-2 shadow-[0_9px_24px_rgba(11,143,88,.20)]">
                Shop Top Deals <ArrowRight className="w-4 h-4" />
              </a>
              <a href={`/${country}/compare`} className="min-h-[48px] px-6 rounded-xl bg-white/90 border border-[#C9DCD4] text-[#20343C] hover:border-[#9FCBB9] font-extrabold text-sm inline-flex items-center justify-center gap-2 shadow-sm">
                <Scale className="w-4 h-4 text-[#0B8F58]" /> Compare Products
              </a>
            </div>

            <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-2 text-[11px] sm:text-xs text-[#667A72] font-semibold">
              <span className="inline-flex items-center gap-1.5"><Store className="w-3.5 h-3.5 text-[#0B8F58]" /> Retailer checkout</span>
              <span className="inline-flex items-center gap-1.5"><TrendingDown className="w-3.5 h-3.5 text-[#0B8F58]" /> Genuine drops only</span>
            </div>
          </div>

          <div className="grid min-[760px]:grid-cols-[1fr_210px] gap-4 sm:gap-5 items-stretch">
            <div className="relative min-h-[330px] sm:min-h-[390px] rounded-[28px] border border-white/80 bg-white/45 shadow-[0_28px_70px_rgba(32,72,56,.12)] overflow-hidden">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_62%_36%,rgba(0,210,122,.18),transparent_32%),radial-gradient(circle_at_26%_76%,rgba(255,255,255,.85),transparent_38%)]" />

              <div className="absolute left-[8%] top-[13%] w-[62%] sm:w-[64%] rounded-[18px] border border-[#BDD9CD] bg-[#0D1B21] p-2.5 shadow-[0_22px_46px_rgba(5,23,29,.22)] rotate-[-2deg]">
                <div className="rounded-[12px] bg-[linear-gradient(135deg,#ECF8F2,#D7F0E4)] aspect-[16/9] flex items-center justify-center relative overflow-hidden">
                  <div className="absolute inset-x-7 top-7 h-2 rounded-full bg-[#0B8F58]/15" />
                  <div className="absolute inset-x-10 top-12 h-2 rounded-full bg-[#0B8F58]/10" />
                  <div className="grid grid-cols-3 gap-2 w-[72%] mt-8">
                    <div className="h-12 rounded-lg bg-white border border-[#D5E8DF]" />
                    <div className="h-12 rounded-lg bg-white border border-[#D5E8DF]" />
                    <div className="h-12 rounded-lg bg-white border border-[#D5E8DF]" />
                  </div>
                </div>
                <div className="mx-auto mt-2 h-2 w-[44%] rounded-b-lg bg-[#21343B]" />
              </div>

              <div className="absolute right-[8%] top-[11%] h-[48%] w-[27%] min-w-[82px] rounded-[22px] border-[5px] border-[#13272D] bg-white shadow-[0_18px_38px_rgba(8,28,34,.22)] rotate-[5deg] overflow-hidden">
                <div className="h-full bg-[linear-gradient(180deg,#E7F7EF,#F9FCFA)] p-2.5 flex flex-col">
                  <div className="h-2.5 w-9 rounded-full bg-[#0B8F58]/20 mx-auto" />
                  <div className="mt-5 h-12 rounded-xl bg-white border border-[#D5E8DF] flex items-center justify-center"><Smartphone className="w-7 h-7 text-[#0B8F58]" /></div>
                  <div className="mt-2 h-2 rounded-full bg-[#0B8F58]/15" />
                  <div className="mt-1.5 h-2 w-2/3 rounded-full bg-[#0B8F58]/10" />
                  <div className="mt-auto h-8 rounded-lg bg-[#0B8F58] text-white text-[7px] font-extrabold flex items-center justify-center">TRACK PRICE</div>
                </div>
              </div>

              <div className="absolute left-[12%] bottom-[10%] w-[35%] rounded-[20px] border border-white bg-white/95 p-3 shadow-[0_16px_36px_rgba(19,55,43,.16)] rotate-[3deg]">
                <div className="flex items-center gap-2">
                  <div className="h-11 w-11 rounded-2xl bg-[#E8F7F0] flex items-center justify-center"><Headphones className="w-6 h-6 text-[#0B8F58]" /></div>
                  <div className="min-w-0 flex-1">
                    <div className="h-2.5 rounded-full bg-[#19323A]/15" />
                    <div className="mt-2 h-2 w-2/3 rounded-full bg-[#0B8F58]/15" />
                  </div>
                </div>
              </div>

              <div className="absolute right-[19%] bottom-[8%] h-[92px] w-[92px] rounded-[28px] border border-[#CFE4DA] bg-[#F8FCFA] shadow-[0_15px_30px_rgba(19,55,43,.12)] flex items-center justify-center rotate-[-8deg]">
                <Watch className="w-10 h-10 text-[#0B8F58]" />
              </div>

              <div className="absolute left-[7%] top-[6%] rounded-full bg-white px-3 py-1.5 border border-[#CBE3D7] shadow-sm text-[9px] font-extrabold text-[#0B8F58] inline-flex items-center gap-1.5">
                <Laptop className="w-3.5 h-3.5" /> Compare before checkout
              </div>
            </div>

            <div className="grid grid-cols-2 min-[760px]:grid-cols-1 gap-2.5 sm:gap-3">
              {features.map(({ Icon, title, text }) => (
                <a key={title} href={title === 'Compare Products' ? `/${country}/compare` : title === 'Track Prices' ? `/${country}/account?tab=alerts` : `/${country}/deals/all`} className="group rounded-[18px] border border-[#D2E5DC] bg-white/88 p-3.5 sm:p-4 shadow-[0_8px_24px_rgba(19,55,43,.07)] hover:border-[#A8D4C0] hover:-translate-y-0.5 transition-all">
                  <div className="w-9 h-9 rounded-xl bg-[#EAF8F1] border border-[#CFE8DC] text-[#0B8F58] flex items-center justify-center"><Icon className="w-4.5 h-4.5" /></div>
                  <div className="mt-3 text-[11px] sm:text-[12px] font-extrabold text-[#102027] leading-tight">{title}</div>
                  <div className="mt-1 text-[9px] sm:text-[10px] text-[#6A7B74] leading-relaxed">{text}</div>
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
