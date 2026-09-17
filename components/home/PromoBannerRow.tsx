'use client';

import React from 'react';
import { useCountry } from '@/context/CountryContext';
import { ArrowRight, Gamepad2, Laptop, Smartphone } from 'lucide-react';

export function PromoBannerRow() {
  const { country } = useCountry();
  const promos = [
    { title: 'Latest Smartphones', text: 'Compare. Save. Upgrade.', cta: 'Shop phones', href: `/${country}/deals/phones`, Icon: Smartphone, image: '/images/banners/phones.jfif', tone: 'bg-[linear-gradient(105deg,#fdebf1_0%,#f7e7f0_56%,#efd9eb_100%)]' },
    { title: 'Laptops for Work & Play', text: 'Top brands. Better prices.', cta: 'Shop laptops', href: `/${country}/deals/laptops`, Icon: Laptop, image: '/images/banners/laptops.jfif', tone: 'bg-[linear-gradient(105deg,#eaf2ff_0%,#e4eeff_58%,#d9e5f8_100%)]' },
    { title: 'Home Appliances', text: 'Smarter homes for less.', cta: 'Shop appliances', href: `/${country}/deals/all`, Icon: Gamepad2, image: '/images/banners/appliances.jfif', tone: 'bg-[linear-gradient(105deg,#ffe7cd_0%,#ffe0bb_58%,#f6d1a8_100%)]' },
  ];
  return <section className="max-w-[1600px] mx-auto px-3 sm:px-6 lg:px-8 pb-5">
    <div className="grid md:grid-cols-3 gap-3">
      {promos.map(({title,text,cta,href,Icon,image,tone}) => <a key={title} href={href} className={`${tone} group relative h-[120px] overflow-hidden rounded-md border border-black/[0.035] px-5 py-4 shadow-[0_3px_9px_rgba(15,43,31,.045)] transition-all duration-200 hover:-translate-y-px hover:shadow-[0_8px_16px_rgba(15,43,31,.1)]`}>
        <img src={image} alt="" className="absolute inset-y-0 right-0 h-full w-[57%] object-cover object-right contrast-[1.03] saturate-[1.04] transition-transform duration-500 group-hover:scale-[1.035]" />
        <div className="absolute inset-y-0 right-[36%] w-[30%] bg-gradient-to-r from-current/0 to-current/[0.035]" aria-hidden="true" />
        <div className="relative z-10 flex h-full max-w-[58%] flex-col items-start"><div className="text-[16px] sm:text-[17px] font-black leading-[1.1] tracking-[-.04em] text-[#101a1e]">{title}</div><div className="mt-1 text-[10px] sm:text-[11px] font-medium leading-relaxed text-[#56676b]">{text}</div><span className="mt-auto inline-flex h-6 items-center gap-1.5 rounded-[4px] bg-[#0d2029] px-3 text-[9px] font-extrabold uppercase tracking-wide text-white shadow-[0_2px_4px_rgba(3,15,20,.14)] transition-colors group-hover:bg-[#116f42]">{cta}<ArrowRight className="w-3 h-3"/></span></div>
        <div className="sr-only"><Icon /></div>
      </a>)}
    </div>
  </section>;
}
