'use client';

import React from 'react';
import { useCountry } from '@/context/CountryContext';
import { getProductBySlug } from '@/lib/data/products';
import { ArrowRight, Scale } from 'lucide-react';

export function SmartComparisonBlock() {
  const { country, formatLocalPrice } = useCountry();
  const iphone = getProductBySlug('iphone-16-pro-max-256gb', country);
  const samsung = getProductBySlug('samsung-galaxy-s24-ultra-512gb', country);
  if (!iphone || !samsung) return null;

  const items = [iphone, samsung];

  return (
    <section className="py-10 sm:py-14 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-t border-[#DDE7E3]">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 mb-7">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-[#08784B] flex items-center gap-1.5">
            <Scale className="w-3.5 h-3.5" /> Smart comparison
          </span>
          <h2 className="text-xl sm:text-2xl font-extrabold text-[#102027] mt-1.5">
            Compare popular choices side by side
          </h2>
        </div>
        <p className="text-xs text-[#64767E] max-w-md">
          Compare current listed prices and key specifications before choosing where to buy.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
        {items.map((product) => (
          <div key={product.id} className="rounded-3xl bg-white border border-[#DDE7E3] hover:border-[#A9CBBE] transition-all p-5 sm:p-6 flex flex-col justify-between shadow-[0_10px_30px_rgba(29,71,57,.06)]">
            <div>
              <div className="text-xs font-bold text-[#08784B] uppercase tracking-wider mb-4">{product.brand}</div>
              <div className="flex items-center gap-4 mb-4">
                <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-[#F7FAF8] border border-[#E2EBE7] p-2 shrink-0 flex items-center justify-center">
                  <img src={product.imageUrl} alt={product.title} className="max-h-full max-w-full object-contain" />
                </div>
                <div className="min-w-0">
                  <h3 className="text-sm sm:text-base font-bold text-[#102027] leading-snug line-clamp-2">{product.title}</h3>
                  <div className="mt-2 flex items-baseline gap-2">
                    <span className="text-xl sm:text-2xl font-extrabold text-[#08784B]">{formatLocalPrice(product.currentBestPrice)}</span>
                    {product.originalPrice > product.currentBestPrice && (
                      <span className="text-xs text-[#8A999F] line-through font-medium">{formatLocalPrice(product.originalPrice)}</span>
                    )}
                  </div>
                  <span className="text-[11px] text-[#73858D] mt-0.5 block">{product.offersCount} current store listing{product.offersCount === 1 ? '' : 's'}</span>
                </div>
              </div>

              <div className="space-y-2 py-3 border-t border-[#E4ECE8] text-xs">
                {Object.entries(product.specs).slice(0, 3).map(([key, value]) => (
                  <div key={key} className="flex items-center justify-between gap-4">
                    <span className="text-[#73858D] capitalize">{key.replace(/_/g, ' ')}:</span>
                    <span className="font-semibold text-[#20343C] text-right">{value}</span>
                  </div>
                ))}
              </div>
            </div>

            <a href={`/${country}/product/${product.slug}`} className="mt-4 w-full py-2.5 px-4 rounded-xl bg-[#F0FAF5] hover:bg-[#DDF8EB] text-[#08784B] border border-[#CFE6DC] hover:border-[#9FD2BC] font-bold text-xs flex items-center justify-center gap-2 transition-all">
              <span>View product & prices</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </a>
          </div>
        ))}
      </div>
    </section>
  );
}
