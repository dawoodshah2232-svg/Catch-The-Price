'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import { useCountry } from '@/context/CountryContext';
import { Home, LayoutGrid, ArrowRightLeft, Bookmark } from 'lucide-react';

export function MobileBottomNav() {
  const { country, savedProductIds } = useCountry();
  const pathname = usePathname();

  if (pathname?.startsWith(`/${country}/product/`) || pathname?.startsWith(`/${country}/account`)) return null;

  const items = [
    { id: 'home', label: 'Home', href: `/${country}`, icon: Home, isActive: pathname === `/${country}` || pathname === '/' },
    { id: 'categories', label: 'Categories', href: `/${country}#categories`, icon: LayoutGrid, isActive: false },
    { id: 'compare', label: 'Compare', href: `/${country}/compare`, icon: ArrowRightLeft, isActive: pathname?.startsWith(`/${country}/compare`) },
    { id: 'saved', label: 'Saved', href: `/${country}/account?tab=saved`, icon: Bookmark, badge: savedProductIds.length > 0 ? savedProductIds.length : null, isActive: pathname?.startsWith(`/${country}/account`) && pathname.includes('tab=saved') },
  ];

  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-[#071015] border-t border-[#1A2B35] px-2 pb-[env(safe-area-inset-bottom,8px)] pt-1 shadow-[0_-10px_30px_rgba(0,0,0,0.22)]">
      <nav className="grid grid-cols-4 items-center max-w-lg mx-auto">
        {items.map((item) => {
          const Icon = item.icon;
          return (
            <a
              key={item.id}
              href={item.href}
              className={`flex flex-col items-center justify-center py-1.5 min-h-[54px] touch-target rounded-xl transition-all relative ${
                item.isActive ? 'text-[#67EFB8] font-extrabold bg-white/[0.04]' : 'text-[#9AAEA6] hover:text-white'
              }`}
            >
              <div className="relative flex items-center justify-center">
                <Icon className={`w-5 h-5 transition-transform duration-150 ${item.isActive ? 'scale-105 text-[#00D27A]' : ''}`} />
                {item.badge !== null && item.badge !== undefined && (
                  <span className="absolute -top-1 -right-2.5 px-1.5 py-0.5 rounded-full text-[9px] font-extrabold bg-[#00D27A] text-[#071015] ring-2 ring-[#071015]">{item.badge}</span>
                )}
              </div>
              <span className="text-[10px] mt-1 tracking-tight">{item.label}</span>
              {item.isActive && <span className="absolute bottom-0 w-7 h-0.5 rounded-full bg-[#00D27A]" />}
            </a>
          );
        })}
      </nav>
    </div>
  );
}
