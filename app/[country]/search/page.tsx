'use client';

import React, { Suspense, use, useEffect, useMemo, useRef, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { Product } from '@/lib/types';
import { useCountry } from '@/context/CountryContext';
import { ProductCard } from '@/components/search/ProductCard';
import { AdSlot } from '@/components/common/AdSlot';
import { sendAnalyticsEvent } from '@/lib/analytics/client';
import { ArrowDown, ArrowUpDown, RotateCcw, Search as SearchIcon, SlidersHorizontal } from 'lucide-react';

interface SearchPageProps {
  params: Promise<{ country: string }>;
}

type SortBy = 'relevance' | 'price_asc' | 'price_desc' | 'biggest_drop';
const PAGE_SIZE = 24;

function relevanceScore(product: Product, query: string) {
  const q = query.trim().toLowerCase();
  if (!q) return 0;

  const title = product.title.toLowerCase();
  const brand = product.brand.toLowerCase();
  const category = product.categoryName.toLowerCase();
  const specText = Object.values(product.specs || {}).join(' ').toLowerCase();
  let score = 0;

  if (title === q) score += 100;
  if (title.startsWith(q)) score += 55;
  if (title.includes(q)) score += 35;
  if (brand === q) score += 30;
  else if (brand.includes(q)) score += 20;
  if (category.includes(q)) score += 12;
  if (specText.includes(q)) score += 8;

  const tokens = q.split(/\s+/).filter(Boolean);
  for (const token of tokens) {
    if (title.includes(token)) score += 6;
    if (brand.includes(token)) score += 4;
    if (specText.includes(token)) score += 2;
  }

  return score;
}

function SearchContent() {
  const searchParams = useSearchParams();
  const { country, countryInfo } = useCountry();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);
  const [isPreview, setIsPreview] = useState(false);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const lastSearchSignature = useRef('');

  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '');
  const [category, setCategory] = useState(searchParams.get('category') || '');
  const [brand, setBrand] = useState(searchParams.get('brand') || '');
  const [merchant, setMerchant] = useState('');
  const [sortBy, setSortBy] = useState<SortBy>('relevance');

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

  useEffect(() => {
    setVisibleCount(PAGE_SIZE);
  }, [searchQuery, category, brand, merchant, sortBy, country]);

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
        const specText = Object.values(product.specs || {}).join(' ');
        const haystack = `${product.title} ${product.brand} ${product.categoryName} ${specText}`.toLowerCase();
        const tokens = q.split(/\s+/).filter(Boolean);
        if (!tokens.every((token) => haystack.includes(token))) return false;
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

      const relevanceDifference = relevanceScore(b, q) - relevanceScore(a, q);
      if (relevanceDifference !== 0) return relevanceDifference;
      if (a.offersCount !== b.offersCount) return b.offersCount - a.offersCount;
      return a.currentBestPrice - b.currentBestPrice;
    });
  }, [products, searchQuery, category, brand, merchant, sortBy]);

  const visibleResults = results.slice(0, visibleCount);
  const remaining = Math.max(0, results.length - visibleResults.length);

  useEffect(() => {
    if (loading || loadError || isPreview) return;

    const query = searchQuery.trim();
    if (query.length < 2) return;

    const signature = `${country}|${query.toLowerCase()}|${category}|${brand}|${merchant}|${results.length}`;
    const timer = window.setTimeout(() => {
      if (lastSearchSignature.current === signature) return;
      lastSearchSignature.current = signature;
      void sendAnalyticsEvent({
        eventType: 'search',
        country,
        path: `/${country}/search`,
        searchQuery: query,
        resultCount: results.length,
      });
    }, 800);

    return () => window.clearTimeout(timer);
  }, [brand, category, country, isPreview, loadError, loading, merchant, results.length, searchQuery]);

  const reset = () => {
    setSearchQuery('');
    setCategory('');
    setBrand('');
    setMerchant('');
    setSortBy('relevance');
    setVisibleCount(PAGE_SIZE);
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
                  <option value="relevance">Best match</option>
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

        {filtersOpen && (
          <div className="lg:hidden mt-3 p-3 rounded-2xl bg-[#EEF4F1] border border-[#D7E3DE]">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-extrabold text-[#31474F]">Refine results</span>
              <button type="button" onClick={reset} className="text-[11px] text-[#73858D] hover:text-[#08784B] flex items-center gap-1"><RotateCcw className="w-3 h-3" /> Reset</button>
            </div>
            {filterPanel}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-[220px_minmax(0,1fr)] gap-6 mt-5 sm:mt-6">
          <aside className="hidden lg:block sticky top-32 self-start p-4 rounded-2xl bg-white border border-[#DDE7E3] space-y-4 shadow-sm">
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
              <div className="space-y-6 sm:space-y-8">
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2.5 sm:gap-5">
                  {visibleResults.slice(0, 6).map((product) => <ProductCard key={product.id} product={product} />)}
                  {visibleResults.length > 6 && <div className="col-span-2 md:col-span-3"><AdSlot slotId="search-infeed-middle" format="banner" /></div>}
                  {visibleResults.slice(6).map((product) => <ProductCard key={product.id} product={product} />)}
                </div>

                {remaining > 0 && (
                  <div className="flex justify-center pt-1">
                    <button
                      type="button"
                      onClick={() => setVisibleCount((count) => Math.min(results.length, count + PAGE_SIZE))}
                      className="min-h-[46px] px-5 rounded-xl bg-white border border-[#CFE0DA] hover:border-[#9FCBB9] text-[#20343C] font-extrabold text-xs sm:text-sm inline-flex items-center justify-center gap-2 shadow-sm"
                    >
                      Show more products <span className="text-[#73858D]">({remaining})</span> <ArrowDown className="w-4 h-4 text-[#0B8F58]" />
                    </button>
                  </div>
                )}

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
