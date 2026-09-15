'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import { useCountry } from '@/context/CountryContext';
import { BrandLogo } from '@/components/common/BrandLogo';
import { ThemeToggle } from '@/components/common/ThemeToggle';
import { CountrySwitcher } from './CountrySwitcher';
import { SearchBar } from '@/components/search/SearchBar';
import { Flame, TrendingDown, LayoutGrid, Bell, Bookmark, User, BookOpen } from 'lucide-react';

export function Header() {
  const { country, savedProductIds, alerts } = useCountry();
  const pathname = usePathname();

  const desktopNav = [
    { label: 'Deals', href: `/${country}/deals/all`, icon: Flame },
    { label: 'Price Drops', href: `/${country}/price-drops/all`, icon: TrendingDown },
    { label: 'Categories', href: `/${country}#categories`, icon: LayoutGrid },
    { label: 'Blog', href: `/${country}/blog`, icon: BookOpen },
    { label: 'Track Prices', href: `/${country}/account?tab=alerts`, icon: Bell },
  ];

  return (
    <>
      <header className="hidden lg:block sticky top-0 z-40 w-full ui-header backdrop-blur-xl border-b transition-colors shadow-[0_4px_24px_rgba(24,52,43,0.05)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-[76px] gap-5">
            <div className="shrink-0 flex items-center min-w-[190px]">
              <BrandLogo size="lg" variant="full" />
            </div>

            <div className="flex-1 max-w-xl">
              <SearchBar isHero={false} />
            </div>

            <nav className="flex items-center gap-1 text-xs font-semibold ui-secondary">
              {desktopNav.map((item) => {
                const isActive = pathname === item.href || (item.href.includes('/blog') && pathname?.startsWith(`/${country}/blog`)) || pathname?.startsWith(item.href);
                return (
                  <a
                    key={item.label}
                    href={item.href}
                    className={`px-2.5 xl:px-3 py-2 rounded-xl transition-colors hover:text-[#0B8F58] hover:bg-[#EAF8F1] ${
                      isActive ? 'text-[#0B8F58] font-bold bg-[#EAF8F1]' : ''
                    }`}
                  >
                    {item.label}
                  </a>
                );
              })}
            </nav>

            <div className="flex items-center gap-2">
              <CountrySwitcher />
              <ThemeToggle compact />

              <a
                href={`/${country}/account?tab=saved`}
                className="p-2.5 rounded-xl ui-surface border hover:border-[#9CCFBA] ui-secondary hover:text-[#0B8F58] transition-colors relative touch-target flex items-center justify-center"
                aria-label="Saved Products"
                title="Saved Products"
              >
                <Bookmark className="w-4 h-4" />
                {savedProductIds.length > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#00D27A] text-[#071015] font-extrabold text-[10px] flex items-center justify-center">
                    {savedProductIds.length}
                  </span>
                )}
              </a>

              <a
                href={`/${country}/account?tab=alerts`}
                className="p-2.5 rounded-xl ui-surface border hover:border-[#9CCFBA] ui-secondary hover:text-[#0B8F58] transition-colors relative touch-target flex items-center justify-center"
                aria-label="Price Alerts"
                title="Price Alerts"
              >
                <Bell className="w-4 h-4" />
                {alerts.length > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#00D27A] text-[#071015] font-extrabold text-[10px] flex items-center justify-center">
                    {alerts.length}
                  </span>
                )}
              </a>

              <a
                href={`/${country}/account`}
                className="flex items-center gap-2 px-3 py-2 rounded-xl ui-surface border hover:border-[#9CCFBA] text-xs font-semibold ui-text transition-colors touch-target"
              >
                <User className="w-4 h-4 text-[#0B8F58]" />
                <span>Account</span>
              </a>
            </div>
          </div>
        </div>
      </header>

      <div className="lg:hidden w-full">
        <div className="ui-header border-b transition-colors">
          <div className="max-w-7xl mx-auto px-4 py-2.5 flex items-center justify-between gap-2 min-w-0">
            <div className="min-w-0 flex-1 overflow-hidden">
              <BrandLogo variant="full" size="md" className="max-w-full" />
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <CountrySwitcher compact />
              <ThemeToggle compact />
              <a
                href={`/${country}/account`}
                className="p-2 rounded-xl ui-surface border ui-secondary hover:text-[#0B8F58] touch-target flex items-center justify-center"
                aria-label="Account"
              >
                <User className="w-4 h-4 text-[#0B8F58]" />
              </a>
            </div>
          </div>
        </div>

        <div className="sticky top-0 z-40 ui-header/95 backdrop-blur-xl border-b shadow-[0_4px_18px_rgba(24,52,43,0.06)]">
          <div className="max-w-7xl mx-auto px-4 py-2">
            <SearchBar isHero={false} />
          </div>
        </div>
      </div>
    </>
  );
}
