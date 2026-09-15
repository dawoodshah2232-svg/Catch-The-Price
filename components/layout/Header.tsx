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

  return (
    <>
      <header className="hidden lg:block sticky top-0 z-50 bg-[#081117] text-white shadow-[0_8px_26px_rgba(0,0,0,.16)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="h-[64px] flex items-center gap-4">
            <div className="shrink-0 min-w-[190px]"><BrandLogo size="md" onDark /></div>
            <CountrySwitcher onDark />
            <div className="flex-1"><SearchBar chrome /></div>
            <a href={`/${country}/account?tab=saved`} className="relative min-h-[42px] px-3 rounded-xl inline-flex items-center gap-2 text-xs font-bold text-[#D7E2DE] hover:text-white hover:bg-white/[0.05]">
              <Bookmark className="w-4 h-4" /><span>Saved</span>
              {savedProductIds.length > 0 && <span className="absolute -top-1 -right-1 min-w-4 h-4 px-1 rounded-full bg-[#65E8A8] text-[#06110C] text-[9px] font-extrabold flex items-center justify-center">{savedProductIds.length}</span>}
            </a>
            <a href={`/${country}/compare`} className="min-h-[42px] px-3 rounded-xl inline-flex items-center gap-2 text-xs font-bold text-[#D7E2DE] hover:text-white hover:bg-white/[0.05]"><Scale className="w-4 h-4" /><span>Compare</span></a>
            <a href={`/${country}/account`} className="min-h-[42px] px-3 rounded-xl inline-flex items-center gap-2 text-xs font-bold text-[#D7E2DE] hover:text-white hover:bg-white/[0.05]"><User className="w-4 h-4" /><span>Account</span></a>
          </div>
        </div>

        <div className="border-t border-white/[0.07] border-b border-white/[0.06] bg-[#0B151C]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-[42px] flex items-center justify-between gap-4">
            <nav className="flex items-center h-full overflow-x-auto scrollbar-none" aria-label="Shopping navigation">
              <a href={`/${country}/deals/all`} className="h-full px-3 inline-flex items-center gap-2 whitespace-nowrap text-[11px] font-extrabold text-white"><Menu className="w-4 h-4" />All Categories</a>
              {nav.map((item) => {
                const active = pathname === item.href || pathname?.startsWith(`${item.href}/`);
                return <a key={item.label} href={item.href} className={`h-full px-3 inline-flex items-center gap-1 whitespace-nowrap text-[11px] font-bold transition-colors ${active ? 'text-[#67EFB8]' : 'text-[#C0CEC9] hover:text-white'}`}>{item.label}{item.label !== 'Track Prices' && <ChevronDown className="w-3 h-3 opacity-50" />}</a>;
              })}
            </nav>
            <div className="shrink-0 text-[10px] font-extrabold text-[#67EFB8]">Same Products. Lower Prices.</div>
          </div>
        </div>
      </header>

      <div className="lg:hidden bg-[#081117] border-b border-[#152630] px-3.5 pt-[max(env(safe-area-inset-top),8px)] pb-2.5">
        <div className="h-[46px] flex items-center justify-between gap-2">
          <BrandLogo size="md" onDark className="max-w-[190px]" />
          <div className="flex items-center gap-1.5"><CountrySwitcher compact onDark /><a href={`/${country}/account`} className="w-10 h-10 rounded-xl border border-[#223743] flex items-center justify-center text-[#67EFB8]"><User className="w-4 h-4" /></a></div>
        </div>
      </div>
      <div className="lg:hidden sticky top-0 z-50 bg-[#081117] border-b border-[#152630] px-3.5 py-2 shadow-[0_8px_22px_rgba(0,0,0,.18)]"><SearchBar chrome /></div>
    </>
  );
}
