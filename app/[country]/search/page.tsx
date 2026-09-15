'use client';

import React, { Suspense, use, useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { Product } from '@/lib/types';
import { useCountry } from '@/context/CountryContext';
import { ProductCard } from '@/components/search/ProductCard';
import { AdSlot } from '@/components/common/AdSlot';
import { ArrowUpDown, RotateCcw, Search as SearchIcon, SlidersHorizontal } from 'lucide-react';

interface SearchPageProps {
  params: Promise<{ country: string }>;
}

type SortBy = 'deal_score' | 'price_asc' | 'price_desc' | 'biggest_drop';

function SearchContent() {
  const searchParams = useSearchParams();
  const { country, countryInfo } = useCountry();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);
  const [isPreview, setIsPreview] = useState(false);
  const [filtersOpen, setFiltersOpen] = useState(false);

  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '');
  const [category, setCategory] = useState(searchParams.get('category') || '');
  const [brand, setBrand] = useState(searchParams.get('brand') || '');
  const [merchant, setMerchant] = useState('');
  const [sortBy, setSortBy] = useState<SortBy>('deal_score');

  useEffect(() => {
    let active = true;
    setLoading(true);
    setLoadError(false);

    fetch(`/api/catalog?country=${encodeURIComponent(country)}`, { cache: 'no-store' })
      .then(async (response) => {
        if (!response.ok) throw new Error('Catalog request failed');
        return response.json();
      })
      .then((payload) => {
        if (!active) return;
        setProducts(Array.isArray(payload.products) ? payload.products : []);
        setIsPreview(Boolean(payload.isPreview));
      })
      .catch(() => {
        if (!active) return;
        setProducts([]);
        setLoadError(true);
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [country]);

  const categories = useMemo(
    () => [...new Map(products.map((p) => [p.categorySlug, p.categoryName])).entries()],
    [products]
  );
  const brands = useMemo(() => [...new Set(products.map((p) => p.brand))].sort(), [products]);
  const merchants = useMemo(
    () => [...new Set(products.flatMap((p) => p.offers.map((o) => o.merchantName)))].sort(),
    [products]
  );

  const results = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    const filtered = products.filter((product) => {
      if (q) {
        const haystack = `${product.title} ${product.brand} ${product.categoryName}`.toLowerCase();
        if (!haystack.includes(q)) return false;
      }
      if (category && product.categorySlug !== category) return false;
      if (brand && product.brand !== brand) return false;
      if (merchant && !product.offers.some((offer) => offer.merchantName === merchant)) return false;
      return true;
    });

    return [...filtered].sort((a, b) => {
      if (sortBy === 'price_asc') return a.currentBestPrice - b.currentBestPrice;
      if (sortBy === 'price_desc') return b.currentBestPrice - a.currentBestPrice;
      if (sortBy === 'biggest_drop') {
        const aDrop = a.originalPrice > 0 ? (a.originalPrice - a.currentBestPrice) / a.originalPrice : 0;
        const bDrop = b.originalPrice > 0 ? (b.originalPrice - b.currentBestPrice) / b.originalPrice : 0;
        return bDrop - aDrop;
      }
      return (b.dealScore || 0) - (a.dealScore || 0);
    });
  }, [products, searchQuery, category, brand, merchant, sortBy]);

  const reset = () => {
    setSearchQuery('');
    setCategory('');
    setBrand('');
    setMerchant('');
    setSortBy('deal_score');
  };

  const selectClass =
    'h-11 w-full rounded-xl bg-white border border-[#D7E3DE] px-3 text-sm text-[#20343C] outline-none focus:border-[#0B8F58]';

  const filterPanel = (
    <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-1 gap-3">
      <select value={category} onChange={(e) => setCategory(e.target.value)} className={selectClass}>
        <option value="">All categories</option>
        {categories.map(([slug, name]) => <option key={slug} value={slug}>{name}</option>)}
      </select>
      <select value={brand} onChange={(e) => setBrand(e.target.value)} className={selectClass}>
        <option value="">All brands</option>
        {brands.map((item) => <option key={item} value={item}>{item}</option>)}
      </select>
      <select value={merchant} onChange={(e) => setMerchant(e.target.value)} className={selectClass}>
        <option value="">All retailers</option>
        {merchants.map((item) => <option key={item} value={item}>{item}</option>)}
      </select>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#F4F7F6]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
        <div className="flex flex-col gap-3 sm:gap-4 pb-5 border-b border-[#DDE7E3]">
          <div className="flex flex-row items-end justify-between gap-3">
            <div className="min-w-0">
              <h1 className="text-lg sm:text-2xl font-extrabold text-[#102027] truncate">
                {searchQuery ? `Results for “${searchQuery}”` : 'Search & compare'}
              </h1>
              <p className="text-[11px] sm:text-xs text-[#73858D] mt-1">
                {loading ? 'Loading products…' : `${results.length} products in ${countryInfo.name}`}
                {isPreview ? ' · Preview data' : ''}
              </p>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={() => setFiltersOpen((value) => !value)}
                className="lg:hidden h-10 px-3 rounded-xl bg-white border border-[#D7E3DE] text-xs font-bold text-[#31474F] flex items-center gap-1.5 shadow-sm"
              >
                <SlidersHorizontal className="w-4 h-4 text-[#08784B]" /> Filters
              </button>
              <div className="h-10 px-2.5 rounded-xl bg-white border border-[#D7E3DE] flex items-center gap-1.5 shadow-sm">
                <ArrowUpDown className="w-3.5 h-3.5 text-[#73858D]" />
                <select value={sortBy} onChange={(e) => setSortBy(e.target.value as SortBy)} className="bg-transparent text-xs font-semibold text-[#31474F] outline-none max-w-[116px] sm:max-w-none">
                  <option value="deal_score">Best match</option>
                  <option value="biggest_drop">Biggest drop</option>
                  <option value="price_asc">Price: low</option>
                  <option value="price_desc">Price: high</option>
                </select>
              </div>
            </div>
          </div>

          <label className="hidden lg:flex h-12 rounded-2xl bg-white border border-[#D7E3DE] items-center gap-3 px-4 focus-within:border-[#0B8F58] focus-within:ring-2 focus-within:ring-[#00D27A]/10 shadow-sm">
            <SearchIcon className="w-5 h-5 text-[#73858D] shrink-0" />
            <input value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Search products, brands or models…" className="w-full bg-transparent outline-none text-sm text-[#102027] placeholder:text-[#8A9A9F]" />
          </label>
        </div>

        {filtersOpen && <div className="lg:hidden mt-3 p-3 rounded-2xl bg-[#EEF4F1] border border-[#D7E3DE]">{filterPanel}</div>}

        <div className="grid grid-cols-1 lg:grid-cols-[220px_minmax(0,1fr)] gap-6 mt-5 sm:mt-6">
          <aside className="hidden lg:block sticky top-24 self-start p-4 rounded-2xl bg-white border border-[#DDE7E3] space-y-4 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs font-extrabold uppercase tracking-wider text-[#31474F]">Filters</span>
              <button type="button" onClick={reset} className="text-xs text-[#73858D] hover:text-[#08784B] flex items-center gap-1"><RotateCcw className="w-3 h-3" /> Reset</button>
            </div>
            {filterPanel}
          </aside>

          <section className="min-w-0">
            {loading ? (
              <div className="py-20 text-center text-sm text-[#73858D]">Loading catalog…</div>
            ) : loadError ? (
              <div className="py-16 px-6 text-center rounded-2xl bg-white border border-[#DDE7E3]">
                <h2 className="font-bold text-[#102027]">Search is temporarily unavailable</h2>
                <p className="text-sm text-[#73858D] mt-2">Please try again shortly.</p>
              </div>
            ) : results.length === 0 ? (
              <div className="py-16 px-6 text-center rounded-2xl bg-white border border-[#DDE7E3]">
                <SearchIcon className="w-9 h-9 text-[#9AABA4] mx-auto" />
                <h2 className="font-bold text-[#102027] mt-3">No matching products yet</h2>
                <p className="text-sm text-[#73858D] mt-2">Try another search or clear the filters.</p>
                <button type="button" onClick={reset} className="mt-4 h-11 px-4 rounded-xl bg-[#EAF5F0] text-[#08784B] border border-[#CFE3DB] text-sm font-extrabold">Clear filters</button>
              </div>
            ) : (
              <div className="space-y-8">
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2.5 sm:gap-5">
                  {results.slice(0, 6).map((product) => <ProductCard key={product.id} product={product} />)}
                  {results.length > 6 && <div className="col-span-2 md:col-span-3"><AdSlot slotId="search-infeed-middle" format="banner" /></div>}
                  {results.slice(6).map((product) => <ProductCard key={product.id} product={product} />)}
                </div>
                <AdSlot slotId="search-bottom-feed" format="banner" />
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}

export default function SearchPage({ params }: SearchPageProps) {
  use(params);
  return <Suspense fallback={<div className="p-12 text-center text-sm text-[#73858D]">Loading search…</div>}><SearchContent /></Suspense>;
}
