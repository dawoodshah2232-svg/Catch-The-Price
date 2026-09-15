'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import { useCountry } from '@/context/CountryContext';
import { BrandLogo } from '@/components/common/BrandLogo';
import { ThemeToggle } from '@/components/common/ThemeToggle';
import { CountrySwitcher } from './CountrySwitcher';
import { SearchBar } from '@/components/search/SearchBar';
import { Bell, Bookmark, User } from 'lucide-react';

export function Header() {
  const { country, savedProductIds, alerts } = useCountry();
  const pathname = usePathname();

  const commerceNav = [
    { label: 'Deals', href: `/${country}/deals/all` },
    { label: 'Price Drops', href: `/${country}/price-drops/all` },
    { label: 'Phones', href: `/${country}/deals/phones` },
    { label: 'Laptops', href: `/${country}/deals/laptops` },
    { label: 'Gaming', href: `/${country}/deals/gaming` },
    { label: 'PC Components', href: `/${country}/deals/pc-components` },
    { label: 'TVs', href: `/${country}/deals/tvs` },
    { label: 'Compare', href: `/${country}/compare` },
    { label: 'Buying Guides', href: `/${country}/blog` },
  ];

  const iconButton = 'relative touch-target min-w-[44px] min-h-[44px] inline-flex items-center justify-center rounded-xl bg-[#0F1C24] border border-[#223743] text-[#D9E6E1] hover:text-white hover:border-[#355361] transition-colors';

  return (
    <>
      <header className="hidden lg:block sticky top-0 z-50 bg-[#071015] border-b border-[#162633] shadow-[0_8px_28px_rgba(0,0,0,.16)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="h-[72px] flex items-center gap-5">
            <div className="shrink-0 min-w-[190px]">
              <BrandLogo size="lg" variant="full" onDark />
            </div>

            <div className="flex-1 max-w-2xl">
              <SearchBar chrome />
            </div>

            <div className="flex items-center gap-2 ml-auto">
              <CountrySwitcher onDark />
              <ThemeToggle compact onDark />

              <a href={`/${country}/account?tab=saved`} className={iconButton} aria-label="Saved products" title="Saved products">
                <Bookmark className="w-4 h-4" />
                {savedProductIds.length > 0 && (
                  <span className="absolute -top-1 -right-1 min-w-4 h-4 px-1 rounded-full bg-[#00D27A] text-[#071015] font-extrabold text-[9px] flex items-center justify-center">{savedProductIds.length}</span>
                )}
              </a>

              <a href={`/${country}/account?tab=alerts`} className={iconButton} aria-label="Price alerts" title="Price alerts">
                <Bell className="w-4 h-4" />
                {alerts.length > 0 && (
                  <span className="absolute -top-1 -right-1 min-w-4 h-4 px-1 rounded-full bg-[#00D27A] text-[#071015] font-extrabold text-[9px] flex items-center justify-center">{alerts.length}</span>
                )}
              </a>

              <a href={`/${country}/account`} className="min-h-[44px] px-3 inline-flex items-center gap-2 rounded-xl bg-[#0F1C24] border border-[#223743] text-xs font-bold text-[#E7F1ED] hover:text-white hover:border-[#355361] transition-colors">
                <User className="w-4 h-4 text-[#00D27A]" />
                <span>Account</span>
              </a>
            </div>
          </div>

          <nav className="h-[38px] -mx-2 flex items-center gap-0.5 border-t border-[#13242D] overflow-x-auto scrollbar-none" aria-label="Shopping navigation">
            {commerceNav.map((item) => {
              const isActive = pathname === item.href || pathname?.startsWith(`${item.href}/`);
              return (
                <a
                  key={item.label}
                  href={item.href}
                  className={`h-full px-3 inline-flex items-center whitespace-nowrap text-[11px] font-bold transition-colors border-b-2 ${
                    isActive
                      ? 'text-[#4DE4A5] border-[#00D27A]'
                      : 'text-[#B9CAC3] border-transparent hover:text-white hover:bg-white/[0.04]'
                  }`}
                >
                  {item.label}
                </a>
              );
            })}
          </nav>
        </div>
      </header>

      <div className="lg:hidden bg-[#071015] border-b border-[#162633] px-4 pt-[max(env(safe-area-inset-top),8px)] pb-2.5">
        <div className="h-[48px] flex items-center justify-between gap-2">
          <div className="min-w-0 flex-1 overflow-hidden">
            <BrandLogo variant="full" size="md" onDark className="max-w-full" />
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            <CountrySwitcher compact onDark />
            <ThemeToggle compact onDark />
            <a href={`/${country}/account`} className={iconButton} aria-label="Account">
              <User className="w-4 h-4 text-[#00D27A]" />
            </a>
          </div>
        </div>
      </div>

      <div className="lg:hidden sticky top-0 z-50 bg-[#071015] border-b border-[#162633] px-3.5 py-2 shadow-[0_8px_22px_rgba(0,0,0,.18)]">
        <SearchBar chrome />
      </div>
    </>
  );
}
