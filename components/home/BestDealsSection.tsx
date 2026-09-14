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
    <section className="py-8 sm:py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="flex items-end justify-between mb-5">
        <div>
          <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#00D27A]">
            <Flame className="w-4 h-4" />
            <span>Curated Today</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-[#F8FAFC] mt-1">
            Today&apos;s Best Deals in {countryInfo.name}
          </h2>
        </div>

        <a
          href={`/${country}/deals/all`}
          className="text-xs font-bold text-[#00D27A] hover:text-[#00E6A2] flex items-center gap-1 transition-colors"
        >
          <span>View All Deals</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </a>
      </div>

      {/* Mobile: Horizontal Swipe Carousel | Desktop: Grid */}
      <div className="flex lg:grid lg:grid-cols-4 gap-3 sm:gap-6 overflow-x-auto snap-x-mandatory pb-3 lg:pb-0 scrollbar-none -mx-4 px-4 lg:mx-0 lg:px-0">
        {products.map((product) => (
          <div key={product.id} className="min-w-[270px] sm:min-w-[280px] lg:min-w-0 snap-start-card flex-shrink-0 lg:flex-shrink">
            <ProductCard product={product} priority={true} />
          </div>
        ))}
      </div>
    </section>
  );
}
