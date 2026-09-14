'use client';

import React from 'react';
import { useCountry } from '@/context/CountryContext';
import { Zap, Clock, ArrowRight, Store } from 'lucide-react';

interface DroppedItem {
  id: string;
  title: string;
  slug: string;
  store: string;
  oldPrice: number;
  newPrice: number;
  timeAgo: string;
}

export function RecentlyDroppedSection() {
  const { country, formatLocalPrice } = useCountry();

  const drops: DroppedItem[] = [
    {
      id: 'd-1',
      title: 'Sony WH-1000XM5 Wireless Headphones',
      slug: 'sony-wh-1000xm5-wireless-anc-headphones',
      store: country === 'ae' ? 'Amazon UAE' : 'Amazon US',
      oldPrice: country === 'ae' ? 1460 : 399,
      newPrice: country === 'ae' ? 1204 : 328,
      timeAgo: '4 min ago',
    },
    {
      id: 'd-2',
      title: 'Apple iPhone 16 Pro Max 256GB',
      slug: 'iphone-16-pro-max-256gb',
      store: country === 'ae' ? 'Amazon UAE' : 'Best Buy',
      oldPrice: country === 'ae' ? 4400 : 1199,
      newPrice: country === 'ae' ? 4033 : 1099,
      timeAgo: '18 min ago',
    },
    {
      id: 'd-3',
      title: 'Sony PlayStation 5 Pro 2TB Console',
      slug: 'playstation-5-pro-2tb',
      store: country === 'ae' ? 'Sharaf DG' : 'Walmart',
      oldPrice: country === 'ae' ? 2750 : 749,
      newPrice: country === 'ae' ? 2492 : 679,
      timeAgo: '32 min ago',
    },
    {
      id: 'd-4',
      title: 'Samsung Galaxy S24 Ultra 512GB',
      slug: 'samsung-galaxy-s24-ultra-512gb',
      store: country === 'ae' ? 'Noon UAE' : 'Amazon US',
      oldPrice: country === 'ae' ? 5200 : 1419,
      newPrice: country === 'ae' ? 4217 : 1149,
      timeAgo: '51 min ago',
    },
  ];

  return (
    <section className="py-8 sm:py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-t border-[#162633]">
      <div className="flex items-end justify-between mb-5">
        <div>
          <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#00D27A]">
            <Zap className="w-3.5 h-3.5 fill-[#00D27A]" />
            <span>Fresh Activity</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-[#F8FAFC] mt-1">
            Recently Dropped Prices
          </h2>
          <p className="text-xs text-[#CBD5E1] mt-0.5">
            Real-time price declines captured across monitored merchant feeds
          </p>
        </div>

        <span className="text-[11px] text-[#94A3B8] hidden sm:flex items-center gap-1">
          <Clock className="w-3 h-3 text-[#00D27A]" />
          <span>Updated continuously</span>
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        {drops.map((drop) => {
          const discountPercent = Math.round(
            ((drop.oldPrice - drop.newPrice) / drop.oldPrice) * 100
          );

          return (
            <a
              key={drop.id}
              href={`/${country}/product/${drop.slug}`}
              className="p-4 rounded-2xl bg-[#091217] border border-[#162633] hover:border-[#00D27A]/40 transition-all flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center justify-between text-[10px] text-[#CBD5E1] mb-1.5">
                  <span className="flex items-center gap-1 font-semibold text-[#F8FAFC]">
                    <Store className="w-3 h-3 text-[#00D27A]" />
                    {drop.store}
                  </span>
                  <span className="text-[#00D27A] font-bold">{drop.timeAgo}</span>
                </div>

                <h3 className="font-bold text-xs text-[#F8FAFC] group-hover:text-[#00E6A2] transition-colors line-clamp-1">
                  {drop.title}
                </h3>
              </div>

              <div className="mt-3 pt-2.5 border-t border-[#162633] flex items-baseline justify-between">
                <div className="flex items-baseline gap-1.5">
                  <span className="text-base font-extrabold text-[#00D27A]">
                    {formatLocalPrice(drop.newPrice)}
                  </span>
                  <span className="text-[10px] text-[#94A3B8] line-through font-medium">
                    {formatLocalPrice(drop.oldPrice)}
                  </span>
                </div>

                <span className="px-2 py-0.5 rounded text-[10px] font-extrabold bg-[#00D27A]/15 text-[#00D27A]">
                  -{discountPercent}%
                </span>
              </div>
            </a>
          );
        })}
      </div>
    </section>
  );
}
