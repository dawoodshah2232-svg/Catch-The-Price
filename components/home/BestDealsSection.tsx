'use client';

import React from 'react';
import { Product } from '@/lib/types';
import { ProductCard } from '@/components/search/ProductCard';
import { Flame, ArrowRight } from 'lucide-react';
import { useCountry } from '@/context/CountryContext';

interface BestDealsSectionProps {
  products: Product[];
}

export function BestDealsSection({ products }: BestDealsSectionProps) {
  const { country, countryInfo } = useCountry();

  return (
    <section className="py-7 sm:py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex items-start justify-between gap-3 mb-4 sm:mb-6">
        <div className="min-w-0">
          <div className="flex items-center gap-1.5 text-[10px] sm:text-xs font-extrabold uppercase tracking-[0.12em] text-[#08784B]">
            <Flame className="w-4 h-4 shrink-0" />
            <span>Worth checking</span>
          </div>
          <h2 className="text-[20px] sm:text-2xl font-extrabold text-[#102027] mt-1 leading-tight">
            Best prices in {countryInfo.name}
          </h2>
          <p className="text-[11px] sm:text-xs text-[#64767E] mt-1">
            Compare the strongest current listings across available stores.
          </p>
        </div>

        <a
          href={`/${country}/deals/all`}
          className="shrink-0 mt-5 sm:mt-6 text-[11px] sm:text-xs font-extrabold text-[#08784B] hover:text-[#045E3A] flex items-center gap-1 transition-colors"
        >
          <span className="hidden min-[380px]:inline">View all</span>
          <span className="min-[380px]:hidden">All</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </a>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-5 w-full">
        {products.map((product) => (
          <div key={product.id} className="min-w-0 w-full">
            <ProductCard product={product} priority={true} />
          </div>
        ))}
      </div>
    </section>
  );
}
