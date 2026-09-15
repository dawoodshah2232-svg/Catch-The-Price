'use client';

import React from 'react';
import { Product } from '@/lib/types';
import { useCountry } from '@/context/CountryContext';
import { ArrowRight } from 'lucide-react';

interface PopularBrandsSectionProps { products: Product[]; }

function topBrands(products: Product[]) {
  const counts = new Map<string, number>();
  products.forEach((product) => {
    const brand = product.brand?.trim();
    if (!brand || brand.toLowerCase() === 'unknown brand') return;
    counts.set(brand, (counts.get(brand) || 0) + 1);
  });
  return [...counts.entries()].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0])).slice(0, 10);
}

export function PopularBrandsSection({ products }: PopularBrandsSectionProps) {
  const { country } = useCountry();
  const brands = topBrands(products);
  if (brands.length === 0) return null;

  return (
    <section className="py-7 sm:py-9 border-y border-[#E1E9E6] bg-[#F8FAF9]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between gap-4 mb-4">
          <div>
            <div className="text-[10px] sm:text-xs font-extrabold uppercase tracking-[0.14em] text-[#08784B]">Popular Brands</div>
            <h2 className="mt-1 text-xl sm:text-2xl font-black tracking-[-0.02em] text-[#102027]">Shop trusted names faster</h2>
          </div>
          <a href={`/${country}/search`} className="text-[11px] sm:text-xs font-extrabold text-[#08784B] hover:text-[#045E3A] inline-flex items-center gap-1 shrink-0">All products <ArrowRight className="w-3.5 h-3.5" /></a>
        </div>

        <div className="flex gap-2.5 overflow-x-auto pb-1 scrollbar-none sm:grid sm:grid-cols-5 lg:grid-cols-10 sm:overflow-visible">
          {brands.map(([brand]) => (
            <a key={brand} href={`/${country}/search?q=${encodeURIComponent(brand)}`} className="shrink-0 w-[118px] sm:w-auto min-h-[70px] rounded-2xl bg-white border border-[#DDE7E3] hover:border-[#B7D4C8] hover:shadow-[0_8px_20px_rgba(24,52,43,.06)] transition-all px-3 py-3 flex items-center justify-center text-center">
              <span className="text-[13px] sm:text-[14px] font-black tracking-[-0.02em] text-[#20343C] leading-tight line-clamp-2">{brand}</span>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
