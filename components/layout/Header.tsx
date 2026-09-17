'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import { useCountry } from '@/context/CountryContext';
import { CountrySwitcher } from './CountrySwitcher';
import { Heart, User, Scale, Menu, ChevronDown, Search } from 'lucide-react';

function HeaderSearch({ country }: { country: string }) {
  return (
    <form action={`/${country}/search`} method="get" className="flex h-11 w-full items-center rounded-md border border-[#d6e6de] bg-white p-1 shadow-[0_5px_14px_rgba(0,0,0,.16)] focus-within:border-[#63d69b] focus-within:ring-2 focus-within:ring-[#63d69b]/30">
      <Search className="ml-3 h-[18px] w-[18px] shrink-0 text-[#2e4a3e]" aria-hidden="true" />
      <input name="q" type="search" placeholder="Search for products, brands or categories..." aria-label="Search products, brands or models" className="h-full min-w-0 flex-1 bg-transparent px-3 text-[13px] font-medium text-[#14241e] outline-none placeholder:text-[#73827c]" />
      <button type="submit" aria-label="Search" className="inline-flex h-9 w-10 shrink-0 items-center justify-center rounded bg-[#64e9a6] text-[#062516] transition-colors hover:bg-[#8af3be]">
        <Search className="h-[18px] w-[18px]" aria-hidden="true" />
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
    <header className="hidden lg:block sticky top-0 z-50 bg-black text-white shadow-[0_6px_22px_rgba(0,0,0,.18)]">
      <div className="max-w-[1600px] mx-auto px-5 xl:px-8">
        <div className="h-[66px] flex items-center gap-4 xl:gap-5">
          <a href={`/${country}`} aria-label="CatchThePrice Home" className="shrink-0 flex h-[58px] w-[214px] items-center"><img src="/images/catch-the-price-logo.png" alt="CatchThePrice" className="h-full w-full object-contain" /></a>
          <div className="w-[104px] shrink-0 overflow-hidden rounded-md"><CountrySwitcher onDark /></div>
          <div className="flex-1 min-w-[360px]"><HeaderSearch country={country} /></div>
          <a href={`/${country}/account?tab=saved`} className="relative h-11 px-3 inline-flex items-center gap-2 !text-[#e9f1ee] text-[12px] font-bold hover:!text-white"><Heart className="w-[18px] h-[18px]"/><span>Saved</span>{savedProductIds.length>0&&<span className="absolute -top-1 -right-1 min-w-4 h-4 px-1 rounded-full bg-[#65E8A8] text-[#06110C] text-[9px] font-black flex items-center justify-center">{savedProductIds.length}</span>}</a>
          <a href={`/${country}/compare`} className="h-11 px-3 inline-flex items-center gap-2 !text-[#e9f1ee] text-[12px] font-bold hover:!text-white"><Scale className="w-[18px] h-[18px]"/><span>Compare</span></a>
          <a href={`/${country}/account`} className="h-11 px-3 inline-flex items-center gap-2 !text-[#e9f1ee] text-[13px] font-bold hover:!text-white"><User className="w-[18px] h-[18px]"/><span>Account</span></a>
        </div>
      </div>
      <div className="bg-[#0b151c] border-y border-white/[0.08]">
        <div className="max-w-[1600px] mx-auto px-5 xl:px-8 h-[42px] flex items-center justify-between gap-5">
          <nav className="flex items-center h-full overflow-x-auto scrollbar-none" aria-label="Shopping navigation">
            <a href={`/${country}/deals/all`} className="h-full pr-5 inline-flex items-center gap-2 whitespace-nowrap text-[13px] font-black !text-white"><Menu className="w-[18px] h-[18px]"/>All Categories</a>
            {nav.map(item=>{const active=pathname===item.href||pathname?.startsWith(`${item.href}/`);return <a key={item.label} href={item.href} className={`h-full px-4 inline-flex items-center gap-1 whitespace-nowrap text-[13px] font-bold ${active?'!text-[#68efb8]':'!text-[#d2ddda] hover:!text-white'}`}>{item.label}{item.label!=='Track Prices'&&<ChevronDown className="w-3.5 h-3.5 opacity-50"/>}</a>})}
          </nav>
          <div className="shrink-0 text-[11px] font-black text-[#68efb8]">Same Products. Lower Prices.</div>
        </div>
      </div>
    </header>

    <div className="lg:hidden bg-black border-b border-[#1d3540] px-3.5 pt-[max(env(safe-area-inset-top),9px)] pb-2.5"><div className="h-[42px] flex items-center justify-between gap-3"><a href={`/${country}`} aria-label="CatchThePrice Home" className="h-[40px] w-[150px] shrink-0"><img src="/images/catch-the-price-logo.png" alt="CatchThePrice" className="h-full w-full object-contain" /></a><div className="flex items-center gap-1.5"><CountrySwitcher compact onDark/><a href={`/${country}/account`} className="w-10 h-10 rounded-lg border border-[#2a4957] bg-white/[0.04] flex items-center justify-center text-[#8bf3c3]"><User className="w-[17px] h-[17px]"/></a></div></div></div>
    <div className="lg:hidden sticky top-0 z-50 bg-[#081117] border-b border-[#1d3540] px-3.5 py-2.5 shadow-[0_8px_22px_rgba(0,0,0,.18)]"><HeaderSearch country={country} /></div>
  </>;
}
