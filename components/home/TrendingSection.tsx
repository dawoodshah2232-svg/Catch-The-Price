'use client';

import React from 'react';
import { Product } from '@/lib/types';
import { ProductCard } from '@/components/search/ProductCard';
import { Sparkles, ArrowRight } from 'lucide-react';
import { useCountry } from '@/context/CountryContext';

interface TrendingSectionProps {
  products: Product[];
}

export function TrendingSection({ products }: TrendingSectionProps) {
  const { country } = useCountry();

  return (
    <section className="py-8 sm:py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-t border-[#162633]">
      <div className="flex items-end justify-between mb-5">
        <div>
          <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#00E6A2]">
            <Sparkles className="w-4 h-4" />
            <span>High User Volume</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-[#F8FAFC] mt-1">Trending Now</h2>
          <p className="text-xs text-[#CBD5E1] mt-0.5">
            Products shoppers are actively price-tracking today
          </p>
        </div>

        <a
          href={`/${country}/search?sort=trending`}
          className="text-xs font-bold text-[#00E6A2] hover:text-[#00D27A] flex items-center gap-1 transition-colors"
        >
          <span>Explore Trending</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </a>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
}
