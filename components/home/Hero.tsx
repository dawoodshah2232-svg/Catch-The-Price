'use client';

import React from 'react';
import { useCountry } from '@/context/CountryContext';
import { ArrowRight, BellRing, Scale, ShieldCheck, Store, TrendingDown } from 'lucide-react';

const heroProducts = [
  { src: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=320&h=420&fit=crop&q=85', cls: 'right-[27%] bottom-[10%] w-[118px] h-[180px] rotate-[-3deg] z-30' },
  { src: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=560&h=360&fit=crop&q=85', cls: 'right-[8%] top-[16%] w-[270px] h-[180px] rotate-[1deg] z-10' },
  { src: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300&h=300&fit=crop&q=85', cls: 'right-[5%] bottom-[5%] w-[118px] h-[118px] rotate-[4deg] z-40' },
  { src: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=320&h=320&fit=crop&q=85', cls: 'right-[37%] top-[12%] w-[125px] h-[125px] rotate-[-5deg] z-20' },
];

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
          <div className="relative min-h-[300px] sm:min-h-[350px] lg:min-h-[390px] overflow-hidden rounded-[10px] border border-[#dce6e1] bg-[linear-gradient(100deg,#edf9f3_0%,#dbf5e8_58%,#d4efe5_100%)]">
            <div className="absolute inset-y-0 right-0 w-[48%] bg-[radial-gradient(circle_at_55%_48%,rgba(34,134,90,.18),transparent_52%)]" />
            <div className="relative z-10 h-full min-h-[300px] sm:min-h-[350px] lg:min-h-[390px] flex items-center">
              <div className="w-[62%] sm:w-[57%] lg:w-[52%] pl-5 sm:pl-9 lg:pl-12 py-8">
                <h1 className="text-[38px] sm:text-[50px] lg:text-[58px] leading-[.98] tracking-[-.05em] font-black text-[#111a1e]">Better Prices.<br/>Smarter Choices.</h1>
                <p className="mt-4 max-w-[520px] text-[13px] sm:text-[15px] leading-relaxed text-[#52646a]">Compare prices from top retailers in the UAE and USA and save on everything you love.</p>
                <a href={`/${country}/deals/all`} className="mt-6 h-11 sm:h-12 px-6 rounded-md bg-[#0a8753] hover:bg-[#076c43] text-white text-xs sm:text-sm font-extrabold inline-flex items-center gap-2">Shop Top Deals <ArrowRight className="w-4 h-4"/></a>
              </div>
              <div className="absolute inset-y-0 right-0 w-[50%] hidden sm:block">
                {heroProducts.map((item, index) => <div key={index} className={`absolute ${item.cls} rounded-[14px] overflow-hidden bg-white shadow-[0_16px_34px_rgba(31,77,58,.18)] border border-white/80`}><img src={item.src} alt="" className="w-full h-full object-cover"/></div>)}
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
