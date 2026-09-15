'use client';

import React from 'react';
import { useCountry } from '@/context/CountryContext';
import { Product } from '@/lib/types';
import { Zap, Clock, Store, History } from 'lucide-react';

interface RecentlyDroppedSectionProps {
  products: Product[];
}

function recentDrop(product: Product) {
  const history = [...(product.priceHistory || [])]
    .filter((point) => Number.isFinite(point.price) && point.price > 0)
    .sort((a, b) => a.date.localeCompare(b.date));

  if (history.length < 2) return null;
  const previous = history[history.length - 2];
  const latest = history[history.length - 1];
  if (latest.price >= previous.price) return null;

  return {
    product,
    previousPrice: previous.price,
    currentPrice: latest.price,
    checkedAt: product.priceLastChecked || latest.date,
  };
}

function formatCheckedAt(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return 'Recently checked';
  return new Intl.DateTimeFormat('en', {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  }).format(date);
}

export function RecentlyDroppedSection({ products }: RecentlyDroppedSectionProps) {
  const { country, formatLocalPrice } = useCountry();
  const drops = products
    .map(recentDrop)
    .filter((item): item is NonNullable<ReturnType<typeof recentDrop>> => Boolean(item))
    .sort((a, b) => new Date(b.checkedAt).getTime() - new Date(a.checkedAt).getTime())
    .slice(0, 4);

  return (
    <section className="py-8 sm:py-12 bg-[#F8FAF9] border-t border-[#E2EBE7]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-5">
          <div>
            <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#08784B]">
              <Zap className="w-3.5 h-3.5 fill-[#08784B]" />
              <span>Tracked activity</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-[#102027] mt-1">Latest observed price drops</h2>
            <p className="text-xs text-[#64767E] mt-0.5">Only changes supported by stored price observations are shown here.</p>
          </div>
          <span className="text-[11px] text-[#73858D] hidden sm:flex items-center gap-1">
            <Clock className="w-3 h-3 text-[#08784B]" /> Updated as approved source data arrives
          </span>
        </div>

        {drops.length === 0 ? (
          <div className="rounded-[26px] bg-white border border-[#DDE7E3] p-5 sm:p-7 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-[0_10px_24px_rgba(29,71,57,.04)]">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-2xl bg-[#EEF8F3] border border-[#CFE6DC] text-[#08784B] flex items-center justify-center shrink-0"><History className="w-5 h-5" /></div>
              <div>
                <h3 className="text-sm font-extrabold text-[#102027]">Price history is still building</h3>
                <p className="text-xs text-[#64767E] mt-1 max-w-2xl leading-relaxed">We will show recent drops after at least two genuine observations exist for the same product and market. No artificial activity is inserted here.</p>
              </div>
            </div>
            <a href={`/${country}/price-drops/all`} className="min-h-[42px] px-4 rounded-xl bg-[#F0FAF5] hover:bg-[#DDF8EB] border border-[#CFE6DC] text-[#08784B] text-xs font-extrabold flex items-center justify-center shrink-0">View tracked prices</a>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
            {drops.map(({ product, previousPrice, currentPrice, checkedAt }) => {
              const discountPercent = previousPrice > 0
                ? Math.round(((previousPrice - currentPrice) / previousPrice) * 100)
                : 0;

              return (
                <a key={product.id} href={`/${country}/product/${product.slug}`} className="p-4 rounded-2xl bg-white border border-[#DDE7E3] hover:border-[#A9CBBE] hover:shadow-[0_10px_24px_rgba(29,71,57,.07)] transition-all flex flex-col justify-between group">
                  <div>
                    <div className="flex items-center justify-between gap-2 text-[10px] text-[#73858D] mb-1.5">
                      <span className="flex items-center gap-1 font-semibold text-[#20343C] truncate">
                        <Store className="w-3 h-3 text-[#08784B] shrink-0" /> {product.bestMerchantName}
                      </span>
                      <span className="text-[#08784B] font-bold whitespace-nowrap">{formatCheckedAt(checkedAt)}</span>
                    </div>
                    <h3 className="font-bold text-xs text-[#102027] group-hover:text-[#08784B] transition-colors line-clamp-2">{product.title}</h3>
                  </div>
                  <div className="mt-3 pt-2.5 border-t border-[#E4ECE8] flex items-end justify-between gap-2">
                    <div>
                      <div className="text-base font-extrabold text-[#08784B]">{formatLocalPrice(currentPrice)}</div>
                      <div className="text-[10px] text-[#8A999F] line-through font-medium">{formatLocalPrice(previousPrice)}</div>
                    </div>
                    {discountPercent > 0 && <span className="px-2 py-0.5 rounded text-[10px] font-extrabold bg-[#EEF8F3] text-[#08784B] border border-[#CFE6DC]">-{discountPercent}%</span>}
                  </div>
                </a>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
