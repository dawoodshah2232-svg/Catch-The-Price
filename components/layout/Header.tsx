'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import { useCountry } from '@/context/CountryContext';
import { BrandLogo } from '@/components/common/BrandLogo';
import { CountrySwitcher } from './CountrySwitcher';
import { SearchBar } from '@/components/search/SearchBar';
import {
  Flame,
  TrendingDown,
  LayoutGrid,
  Bell,
  Bookmark,
  User,
} from 'lucide-react';

export function Header() {
  const { country, savedProductIds, alerts } = useCountry();
  const pathname = usePathname();

  const desktopNav = [
    { label: 'Deals', href: `/${country}/deals/all`, icon: Flame },
    { label: 'Price Drops', href: `/${country}/price-drops/all`, icon: TrendingDown },
    { label: 'Categories', href: `/${country}#categories`, icon: LayoutGrid },
    { label: 'Track Prices', href: `/${country}/account?tab=alerts`, icon: Bell },
  ];

  return (
    <header className="sticky top-0 z-40 w-full bg-[#071015]/95 backdrop-blur-md border-b border-[#162633] transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* =========================================================================
            DESKTOP HEADER LAYOUT
            Left: Logo | Center: Search | Nav: Deals, Drops, Categories, Track | Right: Country, Saved, Alerts, Account
            ========================================================================= */}
        <div className="hidden lg:flex items-center justify-between h-16 gap-6">
          {/* Left: Logo */}
          <div className="shrink-0 flex items-center">
            <BrandLogo size="md" variant="full" />
          </div>

          {/* Center: Search */}
          <div className="flex-1 max-w-md xl:max-w-lg">
            <SearchBar isHero={false} />
          </div>

          {/* Navigation Links */}
          <nav className="flex items-center gap-1 text-xs font-semibold text-[#8E9DAE]">
            {desktopNav.map((item) => {
              const isActive = pathname?.startsWith(item.href);
              return (
                <a
                  key={item.label}
                  href={item.href}
                  className={`px-3 py-2 rounded-xl transition-colors hover:text-white hover:bg-[#0f1c24] ${
                    isActive ? 'text-[#00D27A] font-bold bg-[#00D27A]/10' : ''
                  }`}
                >
                  {item.label}
                </a>
              );
            })}
          </nav>

          {/* Right: Country, Saved, Alerts, Account */}
          <div className="flex items-center gap-2">
            <CountrySwitcher />

            <a
              href={`/${country}/account?tab=saved`}
              className="p-2.5 rounded-xl bg-[#091217] hover:bg-[#0f1c24] border border-[#162633] hover:border-[#203648] text-[#8E9DAE] hover:text-white transition-colors relative touch-target flex items-center justify-center"
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
              className="p-2.5 rounded-xl bg-[#091217] hover:bg-[#0f1c24] border border-[#162633] hover:border-[#203648] text-[#8E9DAE] hover:text-white transition-colors relative touch-target flex items-center justify-center"
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
              className="flex items-center gap-2 px-3 py-2 rounded-xl bg-[#091217] hover:bg-[#0f1c24] border border-[#162633] hover:border-[#203648] text-xs font-semibold text-[#F8FAFC] transition-colors touch-target"
            >
              <User className="w-4 h-4 text-[#00D27A]" />
              <span>Account</span>
            </a>
          </div>
        </div>

        {/* =========================================================================
            MOBILE HEADER LAYOUT (CRITICAL REQUIREMENT)
            Top: logo symbol / compact logo | country selector | profile/account
            Below: large product search.
            ========================================================================= */}
        <div className="lg:hidden py-2.5 space-y-2.5">
          {/* Top row */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <BrandLogo variant="symbol" size="md" />
              <div className="font-extrabold text-sm tracking-tight text-white flex items-center">
                <span>Catch</span>
                <span className="text-[#00D27A]">ThePrice</span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <CountrySwitcher compact={true} />
              <a
                href={`/${country}/account`}
                className="p-2 rounded-xl bg-[#091217] border border-[#162633] text-[#8E9DAE] hover:text-white touch-target flex items-center justify-center"
                aria-label="Account"
              >
                <User className="w-4 h-4 text-[#00D27A]" />
              </a>
            </div>
          </div>

          {/* Below top row: Large Product Search */}
          <div className="w-full">
            <SearchBar isHero={false} />
          </div>
        </div>
      </div>
    </header>
  );
}
