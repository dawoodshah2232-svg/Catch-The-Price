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
      <div className="flex items-start justify-between gap-3 mb-4 sm:mb-5">
        <div className="min-w-0">
          <div className="flex items-center gap-1.5 text-[11px] sm:text-xs font-bold uppercase tracking-wider text-[#00D27A]">
            <Flame className="w-4 h-4 shrink-0" />
            <span>Curated Today</span>
          </div>
          <h2 className="text-[20px] sm:text-2xl font-bold text-[#F8FAFC] mt-1 leading-tight">
            Today&apos;s Best Deals in {countryInfo.name}
          </h2>
        </div>

        <a
          href={`/${country}/deals/all`}
          className="shrink-0 mt-5 sm:mt-6 text-[11px] sm:text-xs font-bold text-[#00D27A] hover:text-[#00E6A2] flex items-center gap-1 transition-colors"
        >
          <span className="hidden min-[380px]:inline">View All Deals</span>
          <span className="min-[380px]:hidden">All Deals</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </a>
      </div>

      {/* Mobile is a fixed two-column app-style grid. No sideways scrolling. */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6 w-full">
        {products.map((product) => (
          <div key={product.id} className="min-w-0 w-full">
            <ProductCard product={product} priority={true} />
          </div>
        ))}
      </div>
    </section>
  );
}
