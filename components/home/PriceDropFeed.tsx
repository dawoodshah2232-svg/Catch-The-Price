'use client';

import React from 'react';
import { useCountry } from '@/context/CountryContext';
import { TrendingDown, Zap, ArrowRight, ExternalLink } from 'lucide-react';

interface RecentDropItem {
  id: string;
  title: string;
  slug: string;
  merchant: string;
  oldPrice: number;
  newPrice: number;
  timeAgo: string;
}

export function PriceDropFeed() {
  const { country, formatLocalPrice } = useCountry();

  // Price drops adjusted for region
  const drops: RecentDropItem[] = [
    {
      id: 'drop-1',
      title: 'Apple iPhone 16 Pro Max 256GB',
      slug: 'iphone-16-pro-max-256gb',
      merchant: country === 'ae' ? 'Amazon UAE' : 'Amazon US',
      oldPrice: country === 'ae' ? 4400 : 1199,
      newPrice: country === 'ae' ? 4033 : 1099,
      timeAgo: '4m ago',
    },
    {
      id: 'drop-2',
      title: 'Samsung Galaxy S24 Ultra 512GB',
      slug: 'samsung-galaxy-s24-ultra-512gb',
      merchant: country === 'ae' ? 'Noon UAE' : 'Best Buy',
      oldPrice: country === 'ae' ? 5200 : 1419,
      newPrice: country === 'ae' ? 4217 : 1149,
      timeAgo: '18m ago',
    },
    {
      id: 'drop-3',
      title: 'Sony PlayStation 5 Pro 2TB',
      slug: 'playstation-5-pro-2tb',
      merchant: country === 'ae' ? 'Sharaf DG' : 'Walmart',
      oldPrice: country === 'ae' ? 2750 : 749,
      newPrice: country === 'ae' ? 2492 : 679,
      timeAgo: '35m ago',
    },
    {
      id: 'drop-4',
      title: 'Sony WH-1000XM5 Wireless Headphones',
      slug: 'sony-wh-1000xm5-wireless-anc-headphones',
      merchant: country === 'ae' ? 'Amazon UAE' : 'Amazon US',
      oldPrice: country === 'ae' ? 1460 : 399,
      newPrice: country === 'ae' ? 1204 : 328,
      timeAgo: '1h ago',
    },
  ];

  return (
    <div className="py-6 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="rounded-2xl bg-slate-900/60 border border-ctp p-4 sm:p-5">
        <div className="flex items-center justify-between gap-3 mb-3">
          <div className="flex items-center gap-2">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-200">
              Live Price Drop Ticker
            </span>
          </div>

          <a
            href={`/${country}/price-drops/all`}
            className="text-[11px] font-semibold text-emerald-400 hover:text-emerald-300 flex items-center gap-1"
          >
            <span>View All Drops</span>
            <ArrowRight className="w-3 h-3" />
          </a>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {drops.map((drop) => {
            const dropAmount = drop.oldPrice - drop.newPrice;
            const dropPercent = Math.round((dropAmount / drop.oldPrice) * 100);

            return (
              <a
                key={drop.id}
                href={`/${country}/product/${drop.slug}`}
                className="p-3 rounded-xl bg-ctp-surface border border-ctp hover:border-emerald-500/40 transition-all flex flex-col justify-between group"
              >
                <div className="flex items-center justify-between text-[10px] text-slate-400 mb-1">
                  <span className="text-slate-300 font-medium">{drop.merchant}</span>
                  <span className="text-emerald-400 font-semibold">{drop.timeAgo}</span>
                </div>

                <div className="text-xs font-semibold text-slate-100 group-hover:text-emerald-300 transition-colors line-clamp-1">
                  {drop.title}
                </div>

                <div className="mt-2 flex items-baseline justify-between pt-1 border-t border-ctp/40">
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-sm font-extrabold text-emerald-400">
                      {formatLocalPrice(drop.newPrice)}
                    </span>
                    <span className="text-[10px] text-slate-400 line-through">
                      {formatLocalPrice(drop.oldPrice)}
                    </span>
                  </div>

                  <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded">
                    -{dropPercent}%
                  </span>
                </div>
              </a>
            );
          })}
        </div>
      </div>
    </div>
  );
}
