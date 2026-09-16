'use client';

import React from 'react';
import { useCountry } from '@/context/CountryContext';
import { ArrowRight, BellRing, Scale, ShieldCheck, Store, TrendingDown } from 'lucide-react';

export function Hero() {
  const { country } = useCountry();
  const benefits = [
    { Icon: Store, title: 'Compare stores', text: 'See available retailer prices together.' },
    { Icon: TrendingDown, title: 'Catch real drops', text: 'Price history helps expose genuine savings.' },
    { Icon: BellRing, title: 'Track prices', text: 'Save products and set your target price.' },
    { Icon: ShieldCheck, title: 'Shop with context', text: 'Check the deal before retailer checkout.' },
  ];

  return (
    <section className="bg-[#f5f6f7] border-b border-[#e3e6e8] py-4 sm:py-5">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-[1fr_300px] gap-3 sm:gap-4">
          <div className="relative min-h-[270px] sm:min-h-[330px] lg:min-h-[360px] overflow-hidden rounded-[10px] bg-[#dff7ed] border border-[#cdeadd]">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_78%_45%,rgba(0,210,122,.24),transparent_28%),linear-gradient(110deg,#eafaf3_0%,#d8f5e8_55%,#c9efdf_100%)]" />
            <div className="relative z-10 h-full min-h-[270px] sm:min-h-[330px] lg:min-h-[360px] flex items-center">
              <div className="w-[60%] sm:w-[54%] pl-5 sm:pl-9 lg:pl-12 py-8">
                <div className="text-[10px] sm:text-xs font-black tracking-[.16em] uppercase text-[#08784b]">Track it. Catch the drop. Pay less.</div>
                <h1 className="mt-3 text-[31px] sm:text-[44px] lg:text-[50px] leading-[.98] tracking-[-.045em] font-black text-[#101b20]">Compare prices.<br/><span className="text-[#078f57]">Catch the best deal.</span></h1>
                <p className="mt-4 max-w-[510px] text-[12px] sm:text-[14px] leading-relaxed text-[#52646a]">Search products, compare retailer prices and check price history before you buy.</p>
                <div className="mt-5 flex flex-wrap gap-2">
                  <a href={`/${country}/deals/all`} className="h-10 sm:h-11 px-5 rounded-md bg-[#087f4e] hover:bg-[#066b41] text-white text-xs sm:text-sm font-extrabold inline-flex items-center gap-2">Shop deals <ArrowRight className="w-4 h-4"/></a>
                  <a href={`/${country}/compare`} className="h-10 sm:h-11 px-5 rounded-md bg-white border border-[#bcd9cc] text-[#17322a] text-xs sm:text-sm font-extrabold inline-flex items-center gap-2"><Scale className="w-4 h-4 text-[#087f4e]"/>Compare</a>
                </div>
              </div>
              <div className="absolute right-[-4%] sm:right-[2%] top-[12%] w-[43%] h-[76%]">
                <div className="absolute right-[4%] top-[5%] w-[62%] h-[84%] rounded-[24px] border-[7px] border-[#13272d] bg-white shadow-[0_18px_36px_rgba(7,45,31,.2)] rotate-[5deg] overflow-hidden">
                  <div className="h-full p-3 bg-[#f7fbf9]">
                    <div className="h-2 w-9 mx-auto rounded-full bg-[#d1ddd8]"/>
                    <div className="mt-6 aspect-square rounded-xl bg-white border border-[#dce9e3] flex items-center justify-center"><div className="w-[55%] h-[70%] rounded-xl bg-[linear-gradient(145deg,#172a32,#4b6860)] shadow-lg"/></div>
                    <div className="mt-3 h-2 rounded bg-[#d7e1dd]"/><div className="mt-2 h-2 w-2/3 rounded bg-[#d7e1dd]"/><div className="mt-4 text-[#087f4e] font-black text-[10px]">AED 2,799</div>
                  </div>
                </div>
                <div className="absolute left-0 bottom-[3%] w-[58%] rounded-lg bg-white border border-[#cde2d8] shadow-[0_14px_28px_rgba(7,45,31,.14)] p-3 rotate-[-5deg]">
                  <div className="text-[8px] uppercase tracking-wider font-bold text-[#788984]">Price dropped</div><div className="mt-1 text-lg sm:text-xl font-black text-[#087f4e]">-18%</div><div className="mt-1 h-1.5 rounded bg-[#e3eee9]"><div className="w-[68%] h-full rounded bg-[#00c978]"/></div>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-1 gap-2.5">
            {benefits.map(({Icon,title,text}) => <a key={title} href={title === 'Track prices' ? `/${country}/account?tab=alerts` : title === 'Compare stores' ? `/${country}/compare` : `/${country}/deals/all`} className="bg-white border border-[#dfe5e2] rounded-[8px] px-3.5 py-3 flex items-center gap-3 hover:border-[#9fcbb9] transition-colors">
              <div className="w-9 h-9 rounded-full bg-[#e8f8f0] text-[#087f4e] flex items-center justify-center shrink-0"><Icon className="w-4 h-4"/></div>
              <div><div className="text-[11px] sm:text-xs font-extrabold text-[#15262d]">{title}</div><div className="mt-0.5 text-[9px] sm:text-[10px] leading-snug text-[#718079]">{text}</div></div>
            </a>)}
          </div>
        </div>
      </div>
    </section>
  );
}
