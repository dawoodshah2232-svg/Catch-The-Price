'use client';

import React, { useState } from 'react';
import Link from 'next/navigation';
import { usePathname } from 'next/navigation';
import { useCountry } from '@/context/CountryContext';
import { BrandLogo } from '@/components/common/BrandLogo';
import { CountrySwitcher } from './CountrySwitcher';
import { SearchBar } from '@/components/search/SearchBar';
import {
  Flame,
  LayoutGrid,
  TrendingDown,
  Bell,
  Bookmark,
  User,
  Search,
  X,
} from 'lucide-react';

export function Header() {
  const { country, savedProductIds, alerts } = useCountry();
  const pathname = usePathname();
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);

  const navLinks = [
    { label: 'Deals', href: `/${country}/deals/all`, icon: Flame },
    { label: 'Categories', href: `/${country}#categories`, icon: LayoutGrid },
    { label: 'Price Drops', href: `/${country}/price-drops/all`, icon: TrendingDown },
    {
      label: 'Alerts',
      href: `/${country}/account?tab=alerts`,
      icon: Bell,
      badge: alerts.length > 0 ? alerts.length : null,
    },
    {
      label: 'Saved',
      href: `/${country}/account?tab=saved`,
      icon: Bookmark,
      badge: savedProductIds.length > 0 ? savedProductIds.length : null,
    },
  ];

  return (
    <header className="sticky top-0 z-40 w-full bg-ctp-surface/95 backdrop-blur-md border-b border-ctp transition-all">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14 sm:h-16 gap-3">
          {/* Logo */}
          <div className="shrink-0 flex items-center">
            <BrandLogo size="md" />
          </div>

          {/* Desktop Search Bar */}
          <div className="hidden md:flex flex-1 max-w-md lg:max-w-lg mx-4">
            <SearchBar isHero={false} />
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden xl:flex items-center gap-1.5 text-xs font-medium text-slate-300">
            {navLinks.map((item) => {
              const Icon = item.icon;
              const isActive = pathname?.startsWith(item.href);
              return (
                <a
                  key={item.label}
                  href={item.href}
                  className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg transition-colors hover:bg-slate-800/60 hover:text-white ${
                    isActive ? 'text-emerald-400 font-semibold bg-emerald-500/10' : ''
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{item.label}</span>
                  {item.badge !== null && (
                    <span className="ml-0.5 px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-emerald-500 text-slate-950">
                      {item.badge}
                    </span>
                  )}
                </a>
              );
            })}
          </nav>

          {/* Right Action Cluster (Country + Account) */}
          <div className="flex items-center gap-2">
            {/* Mobile Search Button */}
            <button
              type="button"
              onClick={() => setMobileSearchOpen(!mobileSearchOpen)}
              className="md:hidden p-2 rounded-lg bg-ctp-surface border border-ctp text-slate-300 hover:text-white touch-target flex items-center justify-center"
              aria-label="Open search"
            >
              {mobileSearchOpen ? <X className="w-5 h-5" /> : <Search className="w-5 h-5" />}
            </button>

            {/* Country & Currency Switcher */}
            <CountrySwitcher />

            {/* Account Link */}
            <a
              href={`/${country}/account`}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-ctp-surface hover:bg-slate-800/70 border border-ctp hover:border-ctp-border-bright text-xs font-medium text-slate-200 transition-colors touch-target"
              aria-label="User Account"
            >
              <User className="w-4 h-4 text-emerald-400" />
              <span className="hidden sm:inline">Account</span>
            </a>
          </div>
        </div>

        {/* Mobile Search Expandable Tray */}
        {mobileSearchOpen && (
          <div className="md:hidden py-3 border-t border-ctp animate-in slide-in-from-top duration-200">
            <SearchBar
              isHero={false}
              autoFocus={true}
              onSearchSubmitted={() => setMobileSearchOpen(false)}
            />
          </div>
        )}
      </div>
    </header>
  );
}
