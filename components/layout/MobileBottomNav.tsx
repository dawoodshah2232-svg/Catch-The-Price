'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import { useCountry } from '@/context/CountryContext';
import { Home, Search, Flame, Bell, Bookmark } from 'lucide-react';

export function MobileBottomNav() {
  const { country, savedProductIds, alerts } = useCountry();
  const pathname = usePathname();

  const items = [
    {
      id: 'home',
      label: 'Home',
      href: `/${country}`,
      icon: Home,
      isActive: pathname === `/${country}` || pathname === '/',
    },
    {
      id: 'search',
      label: 'Search',
      href: `/${country}/search`,
      icon: Search,
      isActive: pathname?.startsWith(`/${country}/search`),
    },
    {
      id: 'deals',
      label: 'Deals',
      href: `/${country}/deals/all`,
      icon: Flame,
      isActive: pathname?.startsWith(`/${country}/deals`),
    },
    {
      id: 'alerts',
      label: 'Alerts',
      href: `/${country}/account?tab=alerts`,
      icon: Bell,
      badge: alerts.length > 0 ? alerts.length : null,
      isActive: pathname?.startsWith(`/${country}/account`) && pathname.includes('tab=alerts'),
    },
    {
      id: 'saved',
      label: 'Saved',
      href: `/${country}/account?tab=saved`,
      icon: Bookmark,
      badge: savedProductIds.length > 0 ? savedProductIds.length : null,
      isActive: pathname?.startsWith(`/${country}/account`) && pathname.includes('tab=saved'),
    },
  ];

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-ctp-surface/95 backdrop-blur-lg border-t border-ctp px-2 pb-[env(safe-area-inset-bottom,8px)] pt-1 shadow-2xl">
      <nav className="flex items-center justify-around">
        {items.map((item) => {
          const Icon = item.icon;
          return (
            <a
              key={item.id}
              href={item.href}
              className={`flex flex-col items-center justify-center flex-1 py-1.5 min-h-[50px] touch-target rounded-xl transition-all relative ${
                item.isActive ? 'text-emerald-400 font-semibold' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <div className="relative flex items-center justify-center">
                <Icon
                  className={`w-5 h-5 transition-transform duration-150 ${
                    item.isActive ? 'scale-110 text-emerald-400' : 'text-slate-400'
                  }`}
                />
                {item.badge !== null && (
                  <span className="absolute -top-1 -right-2.5 px-1.5 py-0.2 rounded-full text-[9px] font-bold bg-emerald-500 text-slate-950 ring-2 ring-ctp-surface">
                    {item.badge}
                  </span>
                )}
              </div>
              <span className="text-[10px] mt-1 tracking-tight">{item.label}</span>
              {item.isActive && (
                <span className="absolute bottom-0 w-8 h-0.5 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(16,185,129,0.8)]" />
              )}
            </a>
          );
        })}
      </nav>
    </div>
  );
}
