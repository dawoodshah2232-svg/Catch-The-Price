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
          <div className="relative min-h-[430px] sm:min-h-[450px] lg:min-h-[480px] overflow-hidden rounded-2xl border border-[#cfe0d7] bg-[#d4efe5] shadow-[0_18px_40px_rgba(13,68,46,.12)]">
            <img src="/images/banners/hero.jfif" alt="A selection of technology products" className="absolute inset-0 h-full w-full object-cover object-[72%_center] contrast-[1.05] saturate-[1.08]" />
            <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(241,252,246,.98)_0%,rgba(241,252,246,.94)_39%,rgba(241,252,246,.42)_59%,rgba(241,252,246,.04)_76%)] sm:bg-[linear-gradient(90deg,rgba(241,252,246,.98)_0%,rgba(241,252,246,.89)_42%,rgba(241,252,246,.18)_66%,rgba(241,252,246,0)_82%)]" />
            <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-[#0a3524]/10 to-transparent" />
            <div className="relative z-10 flex min-h-[430px] sm:min-h-[450px] lg:min-h-[480px] items-center">
              <div className="w-full sm:w-[64%] lg:w-[56%] pl-5 sm:pl-9 lg:pl-12 pr-5 py-8 sm:py-10">
                <p className="mb-3 text-[10px] sm:text-[11px] font-extrabold uppercase tracking-[.18em] text-[#087f4e]">Compare. Track. Save.</p>
                <h1 className="text-[40px] sm:text-[54px] lg:text-[62px] leading-[.94] tracking-[-.06em] font-black text-[#111a1e] drop-shadow-[0_1px_0_rgba(255,255,255,.9)]">Better Prices.<br/>Smarter Choices.</h1>
                <p className="mt-4 max-w-[470px] text-[13px] sm:text-[15px] leading-relaxed font-medium text-[#3f5357]">Compare prices from top retailers in the UAE and USA and save on everything you love.</p>
                <a href={`/${country}/deals/all`} className="mt-7 h-[54px] px-7 sm:px-8 rounded-xl bg-[#078451] hover:bg-[#056c42] shadow-[0_12px_22px_rgba(7,108,67,.30)] text-white text-[13px] sm:text-sm font-extrabold inline-flex items-center gap-2.5 transition-all hover:-translate-y-0.5">Shop Top Deals <ArrowRight className="w-[18px] h-[18px]"/></a>
                <div className="mt-7 max-w-[510px] border-t border-[#195d43]/15 pt-4">
                  <p className="mb-2.5 text-[10px] font-extrabold uppercase tracking-[.14em] text-[#53726a]">Explore popular categories</p>
                  <div className="grid grid-cols-3 gap-2.5 sm:gap-4">
                  {categoryBanners.map(({ title, image }) => (
                    <a key={title} href={`/${country}/deals/all`} className="group relative h-[66px] sm:h-[78px] overflow-hidden rounded-xl border border-white/90 shadow-[0_5px_14px_rgba(7,54,35,.12)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_10px_18px_rgba(7,54,35,.2)]">
                      <img src={image} alt={`${title} deals`} className="h-full w-full object-cover object-right transition-transform duration-500 group-hover:scale-110" />
                      <span className="absolute inset-0 flex items-end bg-gradient-to-t from-black/70 via-black/8 to-transparent px-2.5 pb-2 text-[10px] sm:text-[11px] font-extrabold text-white">{title}</span>
                    </a>
                  ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-1 gap-3">
            {benefits.map(({Icon,title,text}) => <a key={title} href={title === 'Track Prices' ? `/${country}/account?tab=alerts` : title === 'Compare Products' ? `/${country}/compare` : `/${country}/deals/all`} className="bg-white border border-[#dfe5e2] rounded-xl px-4 py-4 flex items-center gap-3 hover:border-[#9fcbb9] hover:shadow-sm transition-all">
              <div className="w-10 h-10 rounded-full bg-[#dcf6e8] text-[#087f4e] flex items-center justify-center shrink-0"><Icon className="w-4.5 h-4.5"/></div>
              <div><div className="text-[12px] sm:text-[13px] font-black text-[#17252b]">{title}</div><div className="mt-0.5 text-[10px] sm:text-[11px] leading-snug text-[#6f7f79]">{text}</div></div>
            </a>)}
          </div>
        </div>
      </div>
    </section>
  );
}
