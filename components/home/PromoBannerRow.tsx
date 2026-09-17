'use client';

import React from 'react';
import { useCountry } from '@/context/CountryContext';
import { ArrowRight, Gamepad2, Laptop, Smartphone } from 'lucide-react';

export function PromoBannerRow() {
  const { country } = useCountry();
  const promos = [
    { title: 'Latest Smartphones', text: 'Compare. Save. Upgrade.', cta: 'Shop phones', href: `/${country}/deals/phones`, Icon: Smartphone, image: '/images/banners/phones.jfif', tone: 'bg-[#f7e9ef]' },
    { title: 'Laptops for Work & Play', text: 'Top brands. Better prices.', cta: 'Shop laptops', href: `/${country}/deals/laptops`, Icon: Laptop, image: '/images/banners/laptops.jfif', tone: 'bg-[#e5efff]' },
    { title: 'Home Appliances', text: 'Smarter homes for less.', cta: 'Shop appliances', href: `/${country}/deals/all`, Icon: Gamepad2, image: '/images/banners/appliances.jfif', tone: 'bg-[#ffe1bd]' },
  ];
  return <section className="max-w-[1600px] mx-auto px-3 sm:px-6 lg:px-8 pb-5">
    <div className="grid md:grid-cols-3 gap-3">
      {promos.map(({title,text,cta,href,Icon,image,tone}) => <a key={title} href={href} className={`${tone} group relative h-[120px] overflow-hidden rounded-md border border-black/[0.03] p-5 shadow-[0_3px_8px_rgba(15,43,31,.04)] transition-shadow hover:shadow-[0_8px_16px_rgba(15,43,31,.1)]`}>
        <img src={image} alt="" className="absolute inset-y-0 right-0 h-full w-[58%] object-cover object-right transition-transform duration-500 group-hover:scale-105" />
        <div className="absolute inset-y-0 right-[30%] w-[48%] bg-gradient-to-r from-transparent via-current to-transparent opacity-[0.035]" aria-hidden="true" />
        <div className="relative z-10 flex h-full max-w-[60%] flex-col items-start"><div className="text-[16px] sm:text-[18px] font-black leading-tight tracking-[-.035em] text-[#111c20]">{title}</div><div className="mt-1 text-[11px] font-medium leading-relaxed text-[#55666a]">{text}</div><span className="mt-auto inline-flex items-center gap-1.5 rounded bg-[#0d2029] px-3 py-1.5 text-[9px] font-extrabold uppercase tracking-wide text-white transition-colors group-hover:bg-[#168c50]">{cta}<ArrowRight className="w-3 h-3"/></span></div>
        <div className="sr-only"><Icon /></div>
      </a>)}
    </div>
  </section>;
}
