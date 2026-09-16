'use client';

import React from 'react';
import { useCountry } from '@/context/CountryContext';
import { ArrowRight, BellRing, Scale, ShieldCheck, Store } from 'lucide-react';

export function Hero() {
  const { country } = useCountry();
  const benefits = [
    { Icon: BellRing, title: 'Track Prices', text: 'Get notified when prices drop' },
    { Icon: Scale, title: 'Compare Products', text: 'Find the best deal' },
    { Icon: ShieldCheck, title: 'Shop Smarter', text: 'Real prices. Real savings.' },
    { Icon: Store, title: 'UAE & USA', text: 'More markets coming soon' },
  ];

  return (
    <section className="bg-white py-4 sm:py-5">
      <div className="max-w-[1600px] mx-auto px-3 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-[1fr_300px] xl:grid-cols-[1fr_330px] gap-4">
          <div className="relative min-h-[300px] sm:min-h-[350px] lg:min-h-[390px] overflow-hidden rounded-[10px] border border-[#dce6e1] bg-[#d4efe5]">
            <img src="/images/banners/hero.jfif" alt="A selection of technology products" className="absolute inset-0 h-full w-full object-cover object-[68%_center]" />
            <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(237,249,243,.98)_0%,rgba(237,249,243,.93)_48%,rgba(237,249,243,.18)_100%)] sm:bg-[linear-gradient(90deg,rgba(237,249,243,.98)_0%,rgba(237,249,243,.88)_48%,rgba(237,249,243,.08)_100%)]" />
            <div className="relative z-10 h-full min-h-[300px] sm:min-h-[350px] lg:min-h-[390px] flex items-center">
              <div className="w-full sm:w-[62%] lg:w-[52%] pl-5 sm:pl-9 lg:pl-12 pr-5 py-8">
                <h1 className="text-[38px] sm:text-[50px] lg:text-[58px] leading-[.98] tracking-[-.05em] font-black text-[#111a1e]">Better Prices.<br/>Smarter Choices.</h1>
                <p className="mt-4 max-w-[520px] text-[13px] sm:text-[15px] leading-relaxed text-[#52646a]">Compare prices from top retailers in the UAE and USA and save on everything you love.</p>
                <a href={`/${country}/deals/all`} className="mt-6 h-11 sm:h-12 px-6 rounded-md bg-[#0a8753] hover:bg-[#076c43] text-white text-xs sm:text-sm font-extrabold inline-flex items-center gap-2">Shop Top Deals <ArrowRight className="w-4 h-4"/></a>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-1 gap-3">
            {benefits.map(({Icon,title,text}) => <a key={title} href={title === 'Track Prices' ? `/${country}/account?tab=alerts` : title === 'Compare Products' ? `/${country}/compare` : `/${country}/deals/all`} className="bg-white border border-[#dfe5e2] rounded-[9px] px-4 py-4 flex items-center gap-3 hover:border-[#9fcbb9] hover:shadow-sm transition-all">
              <div className="w-10 h-10 rounded-full bg-[#dcf6e8] text-[#087f4e] flex items-center justify-center shrink-0"><Icon className="w-4.5 h-4.5"/></div>
              <div><div className="text-[12px] sm:text-[13px] font-black text-[#17252b]">{title}</div><div className="mt-0.5 text-[10px] sm:text-[11px] leading-snug text-[#6f7f79]">{text}</div></div>
            </a>)}
          </div>
        </div>
      </div>
    </section>
  );
}
