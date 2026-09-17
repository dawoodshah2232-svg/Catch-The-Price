'use client';

import React from 'react';
import { useCountry } from '@/context/CountryContext';
import { ArrowRight, BellRing, Grid2X2, ShieldCheck, Globe2 } from 'lucide-react';

export function Hero() {
  const { country } = useCountry();
  const benefits = [
    { Icon: BellRing, title: 'Track Prices', text: 'Get notified when prices drop' },
    { Icon: Grid2X2, title: 'Compare Products', text: 'Find the best deal' },
    { Icon: ShieldCheck, title: 'Shop Smarter', text: 'Real prices. Real savings.' },
    { Icon: Globe2, title: 'UAE & USA', text: 'More markets coming soon' },
  ];

  return (
    <section className="bg-white pt-4 pb-3 sm:pt-5 sm:pb-4">
      <div className="max-w-[1600px] mx-auto px-3 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-[minmax(0,1fr)_290px] xl:grid-cols-[minmax(0,1fr)_310px] gap-3">
          <div className="relative min-h-[320px] sm:min-h-[300px] lg:min-h-[258px] overflow-hidden rounded-md border border-[#e1e9e5] bg-[#d4efe5]">
            <img src="/images/banners/hero.jfif" alt="A selection of technology products" className="absolute inset-0 h-full w-full object-cover object-[73%_center] contrast-[1.03] saturate-[1.04]" />
            <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(241,252,246,.96)_0%,rgba(241,252,246,.90)_39%,rgba(241,252,246,.28)_61%,rgba(241,252,246,0)_80%)]" />
            <div className="relative z-10 flex min-h-[320px] sm:min-h-[300px] lg:min-h-[258px] items-center">
              <div className="w-[70%] sm:w-[52%] pl-6 sm:pl-10 pr-2 py-8">
                <h1 className="text-[37px] sm:text-[42px] lg:text-[44px] leading-[1.02] tracking-[-.055em] font-black text-[#0b161a]">Better Prices.<br/>Smarter Choices</h1>
                <p className="mt-3 max-w-[380px] text-[13px] sm:text-[14px] leading-relaxed font-medium text-[#43565a]">Compare prices from top retailers in the UAE and save on everything you love.</p>
                <a href={`/${country}/deals/all`} className="mt-4 h-10 px-5 rounded-md bg-[#168c50] hover:bg-[#087640] shadow-[0_5px_10px_rgba(13,115,65,.18)] text-white text-[12px] font-extrabold inline-flex items-center gap-2 transition-colors">Shop Top Deals <ArrowRight className="w-4 h-4"/></a>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-1 gap-2.5 rounded-md border border-white/60 bg-white/70 p-3 shadow-[0_8px_26px_rgba(16,55,37,.08)] backdrop-blur-md">
            {benefits.map(({Icon,title,text}) => <a key={title} href={title === 'Track Prices' ? `/${country}/account?tab=alerts` : title === 'Compare Products' ? `/${country}/compare` : `/${country}/deals/all`} className="group rounded-lg border border-transparent bg-white/40 px-2 py-2.5 flex items-center gap-3 transition-all hover:-translate-y-px hover:border-[#c7ead9] hover:bg-white/85 hover:shadow-[0_5px_14px_rgba(19,80,52,.09)]">
              <div className="w-10 h-10 rounded-xl bg-[linear-gradient(145deg,#e5fff0,#c8f5dd)] text-[#087f4e] flex items-center justify-center shrink-0 shadow-[inset_0_1px_0_rgba(255,255,255,.9)] transition-transform group-hover:scale-105"><Icon className="w-[19px] h-[19px]"/></div>
              <div><div className="text-[12px] sm:text-[13px] font-black text-[#17252b]">{title}</div><div className="mt-0.5 text-[10px] sm:text-[11px] leading-snug text-[#6f7f79]">{text}</div></div>
            </a>)}
          </div>
        </div>
      </div>
    </section>
  );
}
