'use client';

import React from 'react';
import { Product } from '@/lib/types';
import { ProductCard } from '@/components/search/ProductCard';
import { Flame, ArrowRight, Store } from 'lucide-react';
import { useCountry } from '@/context/CountryContext';

interface BestDealsSectionProps {
  products: Product[];
}

export function BestDealsSection({ products }: BestDealsSectionProps) {
  const { country } = useCountry();

  return (
    <section className="py-8 sm:py-11 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex items-end justify-between gap-3 mb-4 sm:mb-6">
        <div className="min-w-0">
          <div className="flex items-center gap-1.5 text-[10px] sm:text-xs font-extrabold uppercase tracking-[0.12em] text-[#08784B]">
            <Flame className="w-4 h-4 shrink-0" />
            <span>Updated from available listings</span>
          </div>
          <h2 className="text-[22px] sm:text-[28px] font-black tracking-[-0.03em] text-[#102027] mt-1 leading-tight">Today&apos;s Top Deals</h2>
          <p className="text-[11px] sm:text-xs text-[#64767E] mt-1">A faster way to scan the best current prices we can actually verify.</p>
        </div>

        <a href={`/${country}/deals/all`} className="shrink-0 text-[11px] sm:text-xs font-extrabold text-[#08784B] hover:text-[#045E3A] flex items-center gap-1">
          View all <ArrowRight className="w-3.5 h-3.5" />
        </a>
      </div>

      {products.length === 0 ? (
        <div className="rounded-[24px] bg-white border border-[#DDE7E3] p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-[0_8px_24px_rgba(25,55,45,0.04)]">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#EEF8F3] border border-[#CFE6DC] text-[#08784B] flex items-center justify-center shrink-0"><Store className="w-5 h-5" /></div>
            <div>
              <h3 className="text-sm font-extrabold text-[#102027]">Live retailer deals are being prepared</h3>
              <p className="text-xs text-[#64767E] mt-1 leading-relaxed max-w-2xl">CatchThePrice only shows production deals after an approved source supplies an exact product, current price and valid retailer destination.</p>
            </div>
          </div>
          <a href={`/${country}/blog`} className="min-h-[42px] px-4 rounded-xl bg-[#F0FAF5] hover:bg-[#DDF8EB] border border-[#CFE6DC] text-[#08784B] text-xs font-extrabold inline-flex items-center justify-center gap-1.5 shrink-0">Read buying guides <ArrowRight className="w-3.5 h-3.5" /></a>
        </div>
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-5 w-full">
          {products.map((product) => <div key={product.id} className="min-w-0 w-full"><ProductCard product={product} priority /></div>)}
        </div>
      )}
    </section>
  );
}
