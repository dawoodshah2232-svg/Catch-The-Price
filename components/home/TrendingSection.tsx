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
  if (products.length === 0) return null;

  return (
    <section className="py-8 sm:py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-t border-[#E1E9E6]">
      <div className="flex items-end justify-between gap-3 mb-5">
        <div>
          <div className="flex items-center gap-1.5 text-[10px] sm:text-xs font-extrabold uppercase tracking-[0.12em] text-[#08784B]">
            <Sparkles className="w-4 h-4" />
            <span>Popular right now</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-[#102027] mt-1">Trending products</h2>
          <p className="text-[11px] sm:text-xs text-[#64767E] mt-0.5">
            Products getting attention in the current catalog.
          </p>
        </div>

        <a
          href={`/${country}/search`}
          className="text-[11px] sm:text-xs font-extrabold text-[#08784B] hover:text-[#045E3A] flex items-center gap-1 transition-colors"
        >
          <span className="hidden min-[390px]:inline">Explore more</span>
          <span className="min-[390px]:hidden">More</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </a>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-5">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
}
