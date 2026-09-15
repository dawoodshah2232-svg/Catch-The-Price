'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import { useCountry } from '@/context/CountryContext';
import { Home, LayoutGrid, ArrowRightLeft, Bookmark } from 'lucide-react';

export function MobileBottomNav() {
  const { country, savedProductIds } = useCountry();
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
      id: 'categories',
      label: 'Categories',
      href: `/${country}#categories`,
      icon: LayoutGrid,
      isActive: false,
    },
    {
      id: 'compare',
      label: 'Compare',
      href: `/${country}/compare`,
      icon: ArrowRightLeft,
      isActive: pathname?.startsWith(`/${country}/compare`),
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
    <div className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/97 backdrop-blur-xl border-t border-[#DDE7E3] px-2 pb-[env(safe-area-inset-bottom,8px)] pt-1 shadow-[0_-8px_26px_rgba(24,52,43,0.08)]">
      <nav className="grid grid-cols-4 items-center">
        {items.map((item) => {
          const Icon = item.icon;
          return (
            <a
              key={item.id}
              href={item.href}
              className={`flex flex-col items-center justify-center py-1.5 min-h-[52px] touch-target rounded-xl transition-all relative ${
                item.isActive ? 'text-[#08784B] font-extrabold' : 'text-[#65777F] hover:text-[#20343C]'
              }`}
            >
              <div className="relative flex items-center justify-center">
                <Icon
                  className={`w-5 h-5 transition-transform duration-150 ${
                    item.isActive ? 'scale-105 text-[#08784B]' : 'text-[#65777F]'
                  }`}
                />
                {item.badge !== null && item.badge !== undefined && (
                  <span className="absolute -top-1 -right-2.5 px-1.5 py-0.5 rounded-full text-[9px] font-extrabold bg-[#0B8F58] text-white ring-2 ring-white">
                    {item.badge}
                  </span>
                )}
              </div>
              <span className="text-[10px] mt-1 tracking-tight">{item.label}</span>
              {item.isActive && (
                <span className="absolute bottom-0 w-7 h-0.5 rounded-full bg-[#0B8F58]" />
              )}
            </a>
          );
        })}
      </nav>
    </div>
  );
}
