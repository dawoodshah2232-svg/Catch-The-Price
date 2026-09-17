'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import { useCountry } from '@/context/CountryContext';
import { BrandLogo } from '@/components/common/BrandLogo';
import { CountrySwitcher } from './CountrySwitcher';
import { Bookmark, User, Menu, ChevronDown, Search } from 'lucide-react';

function HeaderSearch({ country }: { country: string }) {
  return (
    <form action={`/${country}/search`} method="get" className="flex h-14 w-full items-center rounded-2xl border border-[#d6e6de] bg-white p-1.5 shadow-[0_10px_28px_rgba(0,0,0,.22)] focus-within:border-[#63d69b] focus-within:ring-2 focus-within:ring-[#63d69b]/30">
      <Search className="ml-3.5 h-5 w-5 shrink-0 text-[#087f4e]" aria-hidden="true" />
      <input name="q" type="search" placeholder="Search products, brands or models" aria-label="Search products, brands or models" className="h-full min-w-0 flex-1 bg-transparent px-3.5 text-[15px] font-medium text-[#14241e] outline-none placeholder:text-[#73827c]" />
      <button type="submit" className="inline-flex h-11 shrink-0 items-center gap-2 rounded-xl bg-[#078451] px-5 text-[13px] font-extrabold text-white shadow-[0_5px_12px_rgba(7,132,81,.28)] transition-colors hover:bg-[#056c42]">
        Search <Search className="h-3.5 w-3.5" aria-hidden="true" />
      </button>
    </form>
  );
}

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
        <div className="h-[86px] flex items-center gap-5 xl:gap-6">
          <div className="shrink-0 min-w-[244px] rounded-xl bg-white px-4 py-3 shadow-[0_6px_16px_rgba(0,0,0,.16)]"><div className="origin-left scale-[1.08]"><BrandLogo size="md" /></div></div>
          <CountrySwitcher onDark />
          <div className="flex-1 min-w-[360px]"><HeaderSearch country={country} /></div>
          <a href={`/${country}/account?tab=saved`} className="relative h-11 px-3 inline-flex items-center gap-2 text-[13px] font-bold text-[#dce8e3] hover:text-white"><Bookmark className="w-[18px] h-[18px]"/><span>Saved</span>{savedProductIds.length>0&&<span className="absolute -top-1 -right-1 min-w-4 h-4 px-1 rounded-full bg-[#65E8A8] text-[#06110C] text-[9px] font-black flex items-center justify-center">{savedProductIds.length}</span>}</a>
          <a href={`/${country}/account`} className="h-11 px-3 inline-flex items-center gap-2 text-[13px] font-bold text-[#dce8e3] hover:text-white"><User className="w-[18px] h-[18px]"/><span>Account</span></a>
        </div>
      </div>
      <div className="bg-[#0b151c] border-y border-white/[0.08]">
        <div className="max-w-[1600px] mx-auto px-5 xl:px-8 h-[52px] flex items-center justify-between gap-5">
          <nav className="flex items-center h-full overflow-x-auto scrollbar-none" aria-label="Shopping navigation">
            <a href={`/${country}/deals/all`} className="h-full pr-5 inline-flex items-center gap-2 whitespace-nowrap text-[13px] font-black text-white"><Menu className="w-[18px] h-[18px]"/>All Categories</a>
            {nav.map(item=>{const active=pathname===item.href||pathname?.startsWith(`${item.href}/`);return <a key={item.label} href={item.href} className={`h-full px-4 inline-flex items-center gap-1 whitespace-nowrap text-[13px] font-bold ${active?'text-[#68efb8]':'text-[#c6d2ce] hover:text-white'}`}>{item.label}{item.label!=='Track Prices'&&<ChevronDown className="w-3.5 h-3.5 opacity-50"/>}</a>})}
          </nav>
          <div className="shrink-0 text-[11px] font-black text-[#68efb8]">Same Products. Lower Prices.</div>
        </div>
      </div>
    </header>

    <div className="lg:hidden bg-[#081117] border-b border-[#1d3540] px-3.5 pt-[max(env(safe-area-inset-top),10px)] pb-3"><div className="h-[50px] flex items-center justify-between gap-3"><div className="rounded-xl bg-white px-3.5 py-2 shadow-[0_4px_12px_rgba(0,0,0,.14)]"><div className="origin-left scale-[1.06]"><BrandLogo size="md" className="max-w-[178px]"/></div></div><div className="flex items-center gap-1.5"><CountrySwitcher compact onDark/><a href={`/${country}/account`} className="w-11 h-11 rounded-xl border border-[#2a4957] bg-white/[0.04] flex items-center justify-center text-[#8bf3c3]"><User className="w-[18px] h-[18px]"/></a></div></div></div>
    <div className="lg:hidden sticky top-0 z-50 bg-[#081117] border-b border-[#1d3540] px-3.5 py-3 shadow-[0_8px_22px_rgba(0,0,0,.18)]"><HeaderSearch country={country} /></div>
  </>;
}
