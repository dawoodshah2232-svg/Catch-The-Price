'use client';

import React from 'react';
import { useCountry } from '@/context/CountryContext';
import { ArrowRight, Gamepad2, Laptop, Smartphone } from 'lucide-react';

export function PromoBannerRow() {
  const { country } = useCountry();
  const promos = [
    { title: 'Latest Smartphones', text: 'Compare. Save. Upgrade.', cta: 'Shop phones', href: `/${country}/deals/phones`, Icon: Smartphone, tone: 'bg-[#e9f7f1]' },
    { title: 'Laptops for Work & Play', text: 'Top brands. Better prices.', cta: 'Shop laptops', href: `/${country}/deals/laptops`, Icon: Laptop, tone: 'bg-[#eef3fb]' },
    { title: 'Gaming & PC Deals', text: 'GPUs, consoles and more.', cta: 'Shop gaming', href: `/${country}/deals/gaming`, Icon: Gamepad2, tone: 'bg-[#f4effb]' },
  ];
  return <section className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 pb-6">
    <div className="grid md:grid-cols-3 gap-3">
      {promos.map(({title,text,cta,href,Icon,tone}) => <a key={title} href={href} className={`${tone} relative overflow-hidden min-h-[126px] rounded-[9px] border border-black/5 p-5 group`}>
        <div className="relative z-10 max-w-[70%]"><div className="text-[16px] sm:text-[18px] font-black tracking-[-.02em] text-[#17242a]">{title}</div><div className="mt-1 text-[11px] text-[#68777c]">{text}</div><div className="mt-4 inline-flex items-center gap-1 text-[10px] font-extrabold text-[#08784b] uppercase tracking-wide">{cta}<ArrowRight className="w-3 h-3"/></div></div>
        <div className="absolute right-4 bottom-2 w-20 h-20 rounded-full bg-white/70 flex items-center justify-center group-hover:scale-105 transition-transform"><Icon className="w-10 h-10 text-[#263a40]"/></div>
      </a>)}
    </div>
  </section>;
}
