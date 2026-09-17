'use client';

import React from 'react';
import { useCountry } from '@/context/CountryContext';
import { ArrowRight, Gamepad2, Laptop, Smartphone } from 'lucide-react';

export function PromoBannerRow() {
  const { country } = useCountry();
  const promos = [
    { title: 'Latest Smartphones', text: 'Compare. Save. Upgrade.', cta: 'Shop phones', href: `/${country}/deals/phones`, Icon: Smartphone, image: '/images/banners/phones.jfif' },
    { title: 'Laptops for Work & Play', text: 'Top brands. Better prices.', cta: 'Shop laptops', href: `/${country}/deals/laptops`, Icon: Laptop, image: '/images/banners/laptops.jfif' },
    { title: 'Home & appliance deals', text: 'Compare before you buy.', cta: 'Shop deals', href: `/${country}/deals/all`, Icon: Gamepad2, image: '/images/banners/appliances.jfif' },
  ];
  return <section className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 pb-6">
    <div className="grid md:grid-cols-3 gap-4">
      {promos.map(({title,text,cta,href,Icon,image}) => <a key={title} href={href} className="group relative h-[192px] overflow-hidden rounded-2xl bg-[#10231c] p-5 sm:p-6 shadow-[0_12px_26px_rgba(15,43,31,.12)] transition-transform duration-300 hover:-translate-y-1">
        <img src={image} alt="" className="absolute inset-0 h-full w-full object-cover object-[72%_center] saturate-[1.08] transition-transform duration-500 group-hover:scale-105" />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(5,57,38,.92)_0%,rgba(11,96,63,.68)_44%,rgba(17,121,82,.10)_100%)]" aria-hidden="true" />
        <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-[#04281a]/35 to-transparent" aria-hidden="true" />
        <div className="relative z-10 flex h-full max-w-[66%] flex-col items-start"><div className="text-[17px] sm:text-[20px] font-black leading-tight tracking-[-.03em] text-white">{title}</div><div className="mt-2 text-[12px] font-medium leading-relaxed text-white/85">{text}</div><span className="mt-auto inline-flex items-center gap-1.5 rounded-lg bg-white px-3.5 py-2 text-[10px] font-extrabold uppercase tracking-wide text-[#08784b] shadow-sm transition-colors group-hover:bg-[#8ff5c4]">{cta}<ArrowRight className="w-3.5 h-3.5"/></span></div>
        <div className="sr-only"><Icon /></div>
      </a>)}
    </div>
  </section>;
}
