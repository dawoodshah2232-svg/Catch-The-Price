'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import { useCountry } from '@/context/CountryContext';
import { BrandLogo } from '@/components/common/BrandLogo';
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
  ];

  return (
    <header className="sticky top-0 z-40 w-full bg-[#071015]/95 backdrop-blur-md border-b border-[#162633] transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="hidden lg:flex items-center justify-between h-[72px] gap-6">
          <div className="shrink-0 flex items-center">
            <BrandLogo size="md" variant="full" />
          </div>

          <div className="flex-1 max-w-md xl:max-w-lg">
            <SearchBar isHero={false} />
          </div>

          <nav className="flex items-center gap-1 text-xs font-semibold text-[#CBD5E1]">
            {desktopNav.map((item) => {
              const isActive = pathname === item.href || (item.href.includes('/blog') && pathname?.startsWith(`/${country}/blog`)) || pathname?.startsWith(item.href);
              return (
                <a
                  key={item.label}
                  href={item.href}
                  className={`px-2.5 xl:px-3 py-2 rounded-xl transition-colors hover:text-white hover:bg-[#0f1c24] ${
                    isActive ? 'text-[#00D27A] font-bold bg-[#00D27A]/10' : ''
                  }`}
                >
                  {item.label}
                </a>
              );
            })}
          </nav>

          <div className="flex items-center gap-2">
            <CountrySwitcher />

            <a
              href={`/${country}/account?tab=saved`}
              className="p-2.5 rounded-xl bg-[#091217] hover:bg-[#0f1c24] border border-[#162633] hover:border-[#203648] text-[#CBD5E1] hover:text-white transition-colors relative touch-target flex items-center justify-center"
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
              className="p-2.5 rounded-xl bg-[#091217] hover:bg-[#0f1c24] border border-[#162633] hover:border-[#203648] text-[#CBD5E1] hover:text-white transition-colors relative touch-target flex items-center justify-center"
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

        {/* Mobile: intentionally simple and app-like. Logo left, market + account right. */}
        <div className="lg:hidden py-2.5 space-y-2.5">
          <div className="flex items-center justify-between gap-2 min-w-0">
            <div className="min-w-0 flex-1 overflow-hidden">
              <BrandLogo variant="full" size="sm" className="max-w-full" />
            </div>

            <div className="flex-1 max-w-2xl">
              <SearchBar isHero={false} />
            </div>

            <nav className="hidden xl:flex items-center gap-1 text-[12px] font-semibold text-[#C8D4D8] whitespace-nowrap">
              {desktopNav.map((item) => {
                const isActive =
                  pathname === item.href ||
                  (item.href.includes('/blog') && pathname?.startsWith(`/${country}/blog`)) ||
                  pathname?.startsWith(item.href);

                return (
                  <a
                    key={item.label}
                    href={item.href}
                    className={`px-3 py-2.5 rounded-xl transition-colors ${
                      isActive
                        ? 'text-[#63E6AE] bg-[#0E241E]'
                        : 'hover:text-white hover:bg-[#0D1B21]'
                    }`}
                  >
                    {item.label}
                  </a>
                );
              })}
            </nav>

            <div className="flex items-center gap-2 shrink-0">
              <CountrySwitcher />

              <a
                href={`/${country}/account?tab=saved`}
                className="w-11 h-11 rounded-xl bg-[#0A151A] hover:bg-[#102128] border border-[#1A3039] hover:border-[#28434D] text-[#C8D4D8] hover:text-white transition-colors relative flex items-center justify-center"
                aria-label="Saved Products"
                title="Saved Products"
              >
                <Bookmark className="w-[17px] h-[17px]" />
                {savedProductIds.length > 0 && (
                  <span className="absolute -top-1 -right-1 min-w-4 h-4 px-1 rounded-full bg-[#00D27A] text-[#071015] font-extrabold text-[9px] flex items-center justify-center">
                    {savedProductIds.length}
                  </span>
                )}
              </a>

              <a
                href={`/${country}/account?tab=alerts`}
                className="w-11 h-11 rounded-xl bg-[#0A151A] hover:bg-[#102128] border border-[#1A3039] hover:border-[#28434D] text-[#C8D4D8] hover:text-white transition-colors relative flex items-center justify-center"
                aria-label="Price Alerts"
                title="Price Alerts"
              >
                <Bell className="w-[17px] h-[17px]" />
                {alerts.length > 0 && (
                  <span className="absolute -top-1 -right-1 min-w-4 h-4 px-1 rounded-full bg-[#00D27A] text-[#071015] font-extrabold text-[9px] flex items-center justify-center">
                    {alerts.length}
                  </span>
                )}
              </a>

              <a
                href={`/${country}/account`}
                className="h-11 px-3.5 rounded-xl bg-[#0A151A] hover:bg-[#102128] border border-[#1A3039] hover:border-[#28434D] text-xs font-semibold text-white transition-colors flex items-center gap-2"
              >
                <User className="w-4 h-4 text-[#63E6AE]" />
                <span className="hidden 2xl:inline">Account</span>
              </a>
            </div>
          </div>
        </div>
      </header>

      <div className="lg:hidden bg-[#071015] border-b border-[#17303A] px-3.5 min-[390px]:px-4 h-[58px] flex items-center justify-between gap-3">
        <div className="min-w-0 flex-1 overflow-hidden flex items-center">
          <BrandLogo variant="full" size="md" className="max-w-full" />
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <CountrySwitcher compact />
          <a
            href={`/${country}/account`}
            className="w-10 h-10 rounded-xl bg-[#0A151A] border border-[#1A3039] text-[#C8D4D8] hover:text-white flex items-center justify-center"
            aria-label="Account"
          >
            <User className="w-4 h-4 text-[#63E6AE]" />
          </a>
        </div>
      </div>

      <div className="lg:hidden sticky top-0 z-50 bg-[#071015]/98 backdrop-blur-xl border-b border-[#17303A] px-3.5 min-[390px]:px-4 py-2.5 shadow-[0_8px_18px_rgba(1,10,14,0.12)]">
        <SearchBar isHero={false} />
      </div>
    </>
  );
}
