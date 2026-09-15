'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { Product } from '@/lib/types';
import { useCountry } from '@/context/CountryContext';
import { getRecentlyViewedSlugs } from '@/lib/recentlyViewed/client';
import { ProductCard } from '@/components/search/ProductCard';
import { Clock3, ArrowRight } from 'lucide-react';

export function RecentlyViewedSection() {
  const { country } = useCountry();
  const [catalog, setCatalog] = useState<Product[]>([]);
  const [slugs, setSlugs] = useState<string[]>([]);

  useEffect(() => {
    let active = true;
    const refreshSlugs = () => {
      if (active) setSlugs(getRecentlyViewedSlugs(country));
    };
    refreshSlugs();
    window.addEventListener('ctp:recently-viewed-updated', refreshSlugs);

    fetch(`/api/catalog?country=${encodeURIComponent(country)}`, { cache: 'no-store' })
      .then(async (response) => (response.ok ? response.json() : { products: [] }))
      .then((payload) => {
        if (active) setCatalog(Array.isArray(payload.products) ? payload.products : []);
      })
      .catch(() => {
        if (active) setCatalog([]);
      });

    return () => {
      active = false;
      window.removeEventListener('ctp:recently-viewed-updated', refreshSlugs);
    };
  }, [country]);

  const recentProducts = useMemo(() => {
    const bySlug = new Map(catalog.map((product) => [product.slug.toLowerCase(), product]));
    return slugs.map((slug) => bySlug.get(slug.toLowerCase())).filter((product): product is Product => Boolean(product)).slice(0, 4);
  }, [catalog, slugs]);

  if (recentProducts.length === 0) return null;

  return (
    <section className="py-7 sm:py-10 border-t border-[#E1E9E6]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between gap-3 mb-4 sm:mb-5">
          <div>
            <div className="flex items-center gap-1.5 text-[10px] sm:text-xs font-extrabold uppercase tracking-[0.14em] text-[#08784B]">
              <Clock3 className="w-4 h-4" />
              <span>Continue shopping</span>
            </div>
            <h2 className="mt-1 text-xl sm:text-2xl font-extrabold text-[#102027]">Recently viewed</h2>
            <p className="text-[11px] sm:text-xs text-[#73858D] mt-1">Stored only on this device for a faster return to products you opened.</p>
          </div>
          <a href={`/${country}/account?tab=recent`} className="text-[11px] sm:text-xs font-extrabold text-[#08784B] hover:text-[#045E3A] inline-flex items-center gap-1 shrink-0">
            View history <ArrowRight className="w-3.5 h-3.5" />
          </a>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-5">
          {recentProducts.map((product) => <ProductCard key={product.id} product={product} />)}
        </div>
      </div>
    </section>
  );
}
