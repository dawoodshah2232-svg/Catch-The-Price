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
      {promos.map(({title,text,cta,href,Icon,image}) => <a key={title} href={href} className="group relative min-h-[180px] overflow-hidden rounded-2xl bg-[#10231c] p-5 sm:p-6 shadow-[0_10px_24px_rgba(15,43,31,.1)]">
        <img src={image} alt="" className="absolute inset-0 h-full w-full object-cover object-right transition-transform duration-500 group-hover:scale-105" />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(7,28,19,.96)_0%,rgba(7,28,19,.78)_44%,rgba(7,28,19,.12)_100%)]" aria-hidden="true" />
        <div className="relative z-10 flex h-full min-h-[132px] max-w-[68%] flex-col items-start"><div className="text-[17px] sm:text-[19px] font-black leading-tight tracking-[-.025em] text-white">{title}</div><div className="mt-2 text-[12px] font-medium leading-relaxed text-white/75">{text}</div><span className="mt-auto inline-flex items-center gap-1.5 rounded-md bg-[#5ee7a2] px-3 py-2 text-[10px] font-extrabold uppercase tracking-wide text-[#062516] transition-colors group-hover:bg-white">{cta}<ArrowRight className="w-3.5 h-3.5"/></span></div>
        <div className="sr-only"><Icon /></div>
      </a>)}
    </div>
  </section>;
}
