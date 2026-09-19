'use client';
import React from 'react';
import { Product } from '@/lib/types';
import { ProductCard } from '@/components/search/ProductCard';
import { ArrowRight, Store } from 'lucide-react';
import { useCountry } from '@/context/CountryContext';
import { ProductCarousel } from './ProductCarousel';
interface BestDealsSectionProps { products: Product[]; hasRealDeals?: boolean; }
export function BestDealsSection({ products, hasRealDeals = false }: BestDealsSectionProps) {
  const { country } = useCountry();
  const title = hasRealDeals ? "Today's top deals" : "Featured UAE Flagships";
  const subtitle = hasRealDeals ? "Compare the lowest available listed prices." : "Track real-time verified prices across Amazon UAE & Noon.";
  return <section className="py-6 sm:py-7 max-w-[1600px] mx-auto px-3 sm:px-6 lg:px-8">
    <div className="flex items-center justify-between gap-3 mb-3">
      <div>
        <h2 className="text-[18px] sm:text-[21px] font-black tracking-[-.025em] text-[#17242a]">{title}</h2>
        <p className="text-[10px] sm:text-[11px] text-[#718079] mt-0.5">{subtitle}</p>
      </div>
      <a href={`/${country}/deals/all`} className="shrink-0 text-[10px] sm:text-[11px] font-extrabold text-[#08784b] flex items-center gap-1">View all <ArrowRight className="w-3.5 h-3.5"/></a>
    </div>
    {products.length === 0 ? (
      <div className="rounded-[7px] bg-white border border-[#dfe4e2] p-4 flex items-center gap-3">
        <Store className="w-5 h-5 text-[#08784b]"/>
        <div>
          <div className="text-xs font-extrabold text-[#17242a]">Deals are being prepared</div>
          <div className="text-[10px] text-[#718079] mt-0.5">Only verified or clearly marked preview listings are shown.</div>
        </div>
      </div>
    ) : (
      <ProductCarousel>{products.slice(0, 8).map(p => <div key={p.id} className="w-[230px] shrink-0 snap-start sm:w-[260px]"><ProductCard product={p} priority/></div>)}</ProductCarousel>
    )}
  </section>;
}
