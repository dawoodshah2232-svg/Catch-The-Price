'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import { useCountry } from '@/context/CountryContext';
import { BrandLogo } from '@/components/common/BrandLogo';
import { CountrySwitcher } from './CountrySwitcher';
import { Bookmark, User, Menu, ChevronDown, Search } from 'lucide-react';

function HeaderSearch({ country }: { country: string }) {
  return (
    <form action={`/${country}/search`} method="get" className="flex h-11 w-full items-center rounded-md border border-[#d6e6de] bg-white p-1 shadow-[0_5px_14px_rgba(0,0,0,.16)] focus-within:border-[#63d69b] focus-within:ring-2 focus-within:ring-[#63d69b]/30">
      <Search className="ml-3 h-[18px] w-[18px] shrink-0 text-[#2e4a3e]" aria-hidden="true" />
      <input name="q" type="search" placeholder="Search for products, brands or categories..." aria-label="Search products, brands or models" className="h-full min-w-0 flex-1 bg-transparent px-3 text-[13px] font-medium text-[#14241e] outline-none placeholder:text-[#73827c]" />
      <button type="submit" aria-label="Search" className="inline-flex h-9 shrink-0 items-center gap-1.5 rounded bg-[#64e9a6] px-3.5 text-[12px] font-extrabold text-[#062516] transition-colors hover:bg-[#8af3be]">
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
        <div className="h-[66px] flex items-center gap-4 xl:gap-5">
          <div className="shrink-0 min-w-[214px]"><div className="origin-left scale-[1.08] brightness-0 invert"><BrandLogo size="md" onDark /></div><span className="mt-0.5 block text-[9px] font-semibold tracking-tight text-[#d5e0db]">Same Products. Lower Prices.</span></div>
          <CountrySwitcher onDark />
          <div className="flex-1 min-w-[360px]"><HeaderSearch country={country} /></div>
          <a href={`/${country}/account?tab=saved`} className="relative h-11 px-3 inline-flex items-center gap-2 text-[13px] font-bold text-[#dce8e3] hover:text-white"><Bookmark className="w-[18px] h-[18px]"/><span>Saved</span>{savedProductIds.length>0&&<span className="absolute -top-1 -right-1 min-w-4 h-4 px-1 rounded-full bg-[#65E8A8] text-[#06110C] text-[9px] font-black flex items-center justify-center">{savedProductIds.length}</span>}</a>
          <a href={`/${country}/account`} className="h-11 px-3 inline-flex items-center gap-2 text-[13px] font-bold text-[#dce8e3] hover:text-white"><User className="w-[18px] h-[18px]"/><span>Account</span></a>
        </div>
      </div>
      <div className="bg-[#0b151c] border-y border-white/[0.08]">
        <div className="max-w-[1600px] mx-auto px-5 xl:px-8 h-[42px] flex items-center justify-between gap-5">
          <nav className="flex items-center h-full overflow-x-auto scrollbar-none" aria-label="Shopping navigation">
            <a href={`/${country}/deals/all`} className="h-full pr-5 inline-flex items-center gap-2 whitespace-nowrap text-[13px] font-black text-white"><Menu className="w-[18px] h-[18px]"/>All Categories</a>
            {nav.map(item=>{const active=pathname===item.href||pathname?.startsWith(`${item.href}/`);return <a key={item.label} href={item.href} className={`h-full px-4 inline-flex items-center gap-1 whitespace-nowrap text-[13px] font-bold ${active?'text-[#68efb8]':'text-[#c6d2ce] hover:text-white'}`}>{item.label}{item.label!=='Track Prices'&&<ChevronDown className="w-3.5 h-3.5 opacity-50"/>}</a>})}
          </nav>
          <div className="shrink-0 text-[11px] font-black text-[#68efb8]">Same Products. Lower Prices.</div>
        </div>
      </div>
    </header>

    <div className="lg:hidden bg-[#081117] border-b border-[#1d3540] px-3.5 pt-[max(env(safe-area-inset-top),9px)] pb-2.5"><div className="h-[42px] flex items-center justify-between gap-3"><div><div className="origin-left scale-[1.04] brightness-0 invert"><BrandLogo size="md" onDark className="max-w-[178px]"/></div></div><div className="flex items-center gap-1.5"><CountrySwitcher compact onDark/><a href={`/${country}/account`} className="w-10 h-10 rounded-lg border border-[#2a4957] bg-white/[0.04] flex items-center justify-center text-[#8bf3c3]"><User className="w-[17px] h-[17px]"/></a></div></div></div>
    <div className="lg:hidden sticky top-0 z-50 bg-[#081117] border-b border-[#1d3540] px-3.5 py-2.5 shadow-[0_8px_22px_rgba(0,0,0,.18)]"><HeaderSearch country={country} /></div>
  </>;
}
