'use client';

import React from 'react';
import { useCountry } from '@/context/CountryContext';
import { Zap, Clock, Store } from 'lucide-react';

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
    { id: 'd-1', title: 'Sony WH-1000XM5 Wireless Headphones', slug: 'sony-wh-1000xm5-wireless-anc-headphones', store: country === 'ae' ? 'Amazon UAE' : 'Amazon US', oldPrice: country === 'ae' ? 1460 : 399, newPrice: country === 'ae' ? 1204 : 328, timeAgo: '4 min ago' },
    { id: 'd-2', title: 'Apple iPhone 16 Pro Max 256GB', slug: 'iphone-16-pro-max-256gb', store: country === 'ae' ? 'Amazon UAE' : 'Best Buy', oldPrice: country === 'ae' ? 4400 : 1199, newPrice: country === 'ae' ? 4033 : 1099, timeAgo: '18 min ago' },
    { id: 'd-3', title: 'Sony PlayStation 5 Pro 2TB Console', slug: 'playstation-5-pro-2tb', store: country === 'ae' ? 'Sharaf DG' : 'Walmart', oldPrice: country === 'ae' ? 2750 : 749, newPrice: country === 'ae' ? 2492 : 679, timeAgo: '32 min ago' },
    { id: 'd-4', title: 'Samsung Galaxy S24 Ultra 512GB', slug: 'samsung-galaxy-s24-ultra-512gb', store: country === 'ae' ? 'Noon UAE' : 'Amazon US', oldPrice: country === 'ae' ? 5200 : 1419, newPrice: country === 'ae' ? 4217 : 1149, timeAgo: '51 min ago' },
  ];

  return (
    <section className="py-8 sm:py-12 bg-[#F8FAF9] border-t border-[#E2EBE7]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-5">
          <div>
            <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#08784B]">
              <Zap className="w-3.5 h-3.5 fill-[#08784B]" />
              <span>Fresh activity</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-[#102027] mt-1">Recently dropped prices</h2>
            <p className="text-xs text-[#64767E] mt-0.5">Recent price changes from available store data.</p>
          </div>
          <span className="text-[11px] text-[#73858D] hidden sm:flex items-center gap-1">
            <Clock className="w-3 h-3 text-[#08784B]" /> Updated as new data arrives
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
          {drops.map((drop) => {
            const discountPercent = Math.round(((drop.oldPrice - drop.newPrice) / drop.oldPrice) * 100);
            return (
              <a key={drop.id} href={`/${country}/product/${drop.slug}`} className="p-4 rounded-2xl bg-white border border-[#DDE7E3] hover:border-[#A9CBBE] hover:shadow-[0_10px_24px_rgba(29,71,57,.07)] transition-all flex flex-col justify-between group">
                <div>
                  <div className="flex items-center justify-between text-[10px] text-[#73858D] mb-1.5">
                    <span className="flex items-center gap-1 font-semibold text-[#20343C]">
                      <Store className="w-3 h-3 text-[#08784B]" /> {drop.store}
                    </span>
                    <span className="text-[#08784B] font-bold">{drop.timeAgo}</span>
                  </div>
                  <h3 className="font-bold text-xs text-[#102027] group-hover:text-[#08784B] transition-colors line-clamp-1">{drop.title}</h3>
                </div>
                <div className="mt-3 pt-2.5 border-t border-[#E4ECE8] flex items-baseline justify-between">
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-base font-extrabold text-[#08784B]">{formatLocalPrice(drop.newPrice)}</span>
                    <span className="text-[10px] text-[#8A999F] line-through font-medium">{formatLocalPrice(drop.oldPrice)}</span>
                  </div>
                  <span className="px-2 py-0.5 rounded text-[10px] font-extrabold bg-[#EEF8F3] text-[#08784B] border border-[#CFE6DC]">-{discountPercent}%</span>
                </div>
              </a>
            );
          })}
        </div>
      </div>
    </section>
  );
}
