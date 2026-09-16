'use client';

import React from 'react';
import { useCountry } from '@/context/CountryContext';
import { ArrowRight, BellRing, Scale, ShieldCheck, Store } from 'lucide-react';

export function Hero() {
  const { country } = useCountry();
  const categoryBanners = [
    { title: 'Phones', image: '/images/banners/phones.jfif' },
    { title: 'Laptops', image: '/images/banners/laptops.jfif' },
    { title: 'Appliances', image: '/images/banners/appliances.jfif' },
  ];
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
          <div className="relative min-h-[390px] sm:min-h-[420px] lg:min-h-[440px] overflow-hidden rounded-xl border border-[#dce6e1] bg-[#d4efe5] shadow-[0_12px_30px_rgba(13,68,46,.08)]">
            <img src="/images/banners/hero.jfif" alt="A selection of technology products" className="absolute inset-0 h-full w-full object-cover object-[72%_center]" />
            <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(244,253,249,.98)_0%,rgba(244,253,249,.96)_42%,rgba(244,253,249,.48)_63%,rgba(244,253,249,.04)_100%)] sm:bg-[linear-gradient(90deg,rgba(244,253,249,.98)_0%,rgba(244,253,249,.92)_42%,rgba(244,253,249,.24)_66%,rgba(244,253,249,0)_100%)]" />
            <div className="relative z-10 flex min-h-[390px] sm:min-h-[420px] lg:min-h-[440px] items-center">
              <div className="w-full sm:w-[64%] lg:w-[56%] pl-5 sm:pl-9 lg:pl-12 pr-5 py-8 sm:py-10">
                <p className="mb-3 text-[10px] sm:text-[11px] font-extrabold uppercase tracking-[.18em] text-[#087f4e]">Compare. Track. Save.</p>
                <h1 className="text-[39px] sm:text-[52px] lg:text-[60px] leading-[.96] tracking-[-.055em] font-black text-[#111a1e] drop-shadow-[0_1px_0_rgba(255,255,255,.9)]">Better Prices.<br/>Smarter Choices.</h1>
                <p className="mt-4 max-w-[470px] text-[13px] sm:text-[15px] leading-relaxed font-medium text-[#3f5357]">Compare prices from top retailers in the UAE and USA and save on everything you love.</p>
                <a href={`/${country}/deals/all`} className="mt-6 h-11 sm:h-12 px-6 rounded-md bg-[#0a8753] hover:bg-[#076c43] shadow-[0_5px_12px_rgba(7,108,67,.2)] text-white text-xs sm:text-sm font-extrabold inline-flex items-center gap-2 transition-colors">Shop Top Deals <ArrowRight className="w-4 h-4"/></a>
                <div className="mt-6 grid max-w-[510px] grid-cols-3 gap-2 sm:gap-3">
                  {categoryBanners.map(({ title, image }) => (
                    <a key={title} href={`/${country}/deals/all`} className="group relative h-14 sm:h-16 overflow-hidden rounded-lg border border-white/70 shadow-sm">
                      <img src={image} alt={`${title} deals`} className="h-full w-full object-cover object-right transition-transform duration-300 group-hover:scale-105" />
                      <span className="absolute inset-0 flex items-end bg-gradient-to-t from-black/65 via-black/5 to-transparent px-2 pb-1.5 text-[10px] sm:text-[11px] font-extrabold text-white">{title}</span>
                    </a>
                  ))}
                </div>
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
