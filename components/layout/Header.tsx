'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import { useCountry } from '@/context/CountryContext';
import { BrandLogo } from '@/components/common/BrandLogo';
import { CountrySwitcher } from './CountrySwitcher';
import { SearchBar } from '@/components/search/SearchBar';
import { Bookmark, User, Scale, Menu, ChevronDown } from 'lucide-react';

export function Header() {
  const { country, savedProductIds } = useCountry();
  const pathname = usePathname();
  const nav = [
    { label: "Today's Deals", href: `/${country}/deals/all` },
    { label: 'Price Drops', href: `/${country}/price-drops/all` },
    { label: 'Compare', href: `/${country}/compare` },
    { label: 'Guides', href: `/${country}/blog` },
    { label: 'News & Tips', href: `/${country}/blog` },
    { label: 'Track Prices', href: `/${country}/account?tab=alerts` },
  ];

  return <>
    <header className="hidden lg:block sticky top-0 z-50 bg-[#071117] text-white shadow-[0_6px_22px_rgba(0,0,0,.18)]">
      <div className="max-w-[1600px] mx-auto px-5 xl:px-8">
        <div className="h-[76px] flex items-center gap-4 xl:gap-5">
          <div className="shrink-0 min-w-[215px]"><BrandLogo size="md" onDark /></div>
          <CountrySwitcher onDark />
          <div className="flex-1 min-w-[360px]"><SearchBar chrome /></div>
          <a href={`/${country}/account?tab=saved`} className="relative h-11 px-3 inline-flex items-center gap-2 text-[13px] font-bold text-[#dce8e3] hover:text-white"><Bookmark className="w-[18px] h-[18px]"/><span>Saved</span>{savedProductIds.length>0&&<span className="absolute -top-1 -right-1 min-w-4 h-4 px-1 rounded-full bg-[#65E8A8] text-[#06110C] text-[9px] font-black flex items-center justify-center">{savedProductIds.length}</span>}</a>
          <a href={`/${country}/compare`} className="h-11 px-3 inline-flex items-center gap-2 text-[13px] font-bold text-[#dce8e3] hover:text-white"><Scale className="w-[18px] h-[18px]"/><span>Compare</span></a>
          <a href={`/${country}/account`} className="h-11 px-3 inline-flex items-center gap-2 text-[13px] font-bold text-[#dce8e3] hover:text-white"><User className="w-[18px] h-[18px]"/><span>Account</span></a>
        </div>
      </div>
      <div className="bg-[#0b151c] border-y border-white/[0.07]">
        <div className="max-w-[1600px] mx-auto px-5 xl:px-8 h-[50px] flex items-center justify-between gap-5">
          <nav className="flex items-center h-full overflow-x-auto scrollbar-none" aria-label="Shopping navigation">
            <a href={`/${country}/deals/all`} className="h-full pr-5 inline-flex items-center gap-2 whitespace-nowrap text-[13px] font-black text-white"><Menu className="w-[18px] h-[18px]"/>All Categories</a>
            {nav.map(item=>{const active=pathname===item.href||pathname?.startsWith(`${item.href}/`);return <a key={item.label} href={item.href} className={`h-full px-4 inline-flex items-center gap-1 whitespace-nowrap text-[13px] font-bold ${active?'text-[#68efb8]':'text-[#c6d2ce] hover:text-white'}`}>{item.label}{item.label!=='Track Prices'&&<ChevronDown className="w-3.5 h-3.5 opacity-50"/>}</a>})}
          </nav>
          <div className="shrink-0 text-[11px] font-black text-[#68efb8]">Same Products. Lower Prices.</div>
        </div>
      </div>
    </header>

    <div className="lg:hidden bg-[#081117] border-b border-[#152630] px-3.5 pt-[max(env(safe-area-inset-top),8px)] pb-2.5"><div className="h-[46px] flex items-center justify-between gap-2"><BrandLogo size="md" onDark className="max-w-[190px]"/><div className="flex items-center gap-1.5"><CountrySwitcher compact onDark/><a href={`/${country}/account`} className="w-10 h-10 rounded-xl border border-[#223743] flex items-center justify-center text-[#67EFB8]"><User className="w-4 h-4"/></a></div></div></div>
    <div className="lg:hidden sticky top-0 z-50 bg-[#081117] border-b border-[#152630] px-3.5 py-2 shadow-[0_8px_22px_rgba(0,0,0,.18)]"><SearchBar chrome/></div>
  </>;
}
