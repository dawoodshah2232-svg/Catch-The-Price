'use client';

import React from 'react';
import { useCountry } from '@/context/CountryContext';
import { ArrowRight, Gamepad2, Laptop, Smartphone } from 'lucide-react';

export function PromoBannerRow() {
  const { country } = useCountry();
  const promos = [
    { title: 'Latest Smartphones', text: 'Compare. Save. Upgrade.', cta: 'Shop phones', href: `/${country}/deals/phones`, Icon: Smartphone, image: '/images/banners/phones.jfif', tone: 'bg-[#e9f7f1]' },
    { title: 'Laptops for Work & Play', text: 'Top brands. Better prices.', cta: 'Shop laptops', href: `/${country}/deals/laptops`, Icon: Laptop, image: '/images/banners/laptops.jfif', tone: 'bg-[#eef3fb]' },
    { title: 'Home & appliance deals', text: 'Compare before you buy.', cta: 'Shop deals', href: `/${country}/deals/all`, Icon: Gamepad2, image: '/images/banners/appliances.jfif', tone: 'bg-[#f4effb]' },
  ];
  return <section className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 pb-6">
    <div className="grid md:grid-cols-3 gap-3">
      {promos.map(({title,text,cta,href,Icon,image,tone}) => <a key={title} href={href} className={`${tone} relative overflow-hidden min-h-[144px] rounded-[9px] border border-black/5 p-5 group`}>
        <img src={image} alt="" className="absolute inset-y-0 right-0 h-full w-[46%] object-cover transition-transform duration-300 group-hover:scale-105" />
        <div className="absolute inset-y-0 right-0 w-[58%] bg-[linear-gradient(90deg,currentColor_0%,transparent_70%)] opacity-[0.06]" aria-hidden="true" />
        <div className="relative z-10 max-w-[62%]"><div className="text-[16px] sm:text-[18px] font-black tracking-[-.02em] text-[#17242a]">{title}</div><div className="mt-1 text-[11px] text-[#68777c]">{text}</div><div className="mt-4 inline-flex items-center gap-1 text-[10px] font-extrabold text-[#08784b] uppercase tracking-wide">{cta}<ArrowRight className="w-3 h-3"/></div></div>
        <div className="sr-only"><Icon /></div>
      </a>)}
    </div>
  </section>;
}
