'use client';

import React, { useState, useMemo, use, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { useCountry } from '@/context/CountryContext';
import { getAllProducts } from '@/lib/data/products';
import { CATEGORIES } from '@/lib/data/categories';
import { MERCHANTS } from '@/lib/data/merchants';
import { ProductCard } from '@/components/search/ProductCard';
import { FilterSheet, FilterState } from '@/components/search/FilterSheet';
import { AdSlot } from '@/components/common/AdSlot';
import {
  SlidersHorizontal,
  ArrowUpDown,
  Search as SearchIcon,
  RotateCcw,
} from 'lucide-react';

interface SearchPageProps {
  params: Promise<{
    country: string;
  }>;
}

function SearchContent({ countryParam }: { countryParam: string }) {
  const searchParams = useSearchParams();
  const { country, countryInfo } = useCountry();

  const queryFromUrl = searchParams.get('q') || '';
  const initialCategory = searchParams.get('category') || '';
  const initialBrand = searchParams.get('brand') || '';

  const [searchQuery, setSearchQuery] = useState(queryFromUrl);
  const [isFilterSheetOpen, setIsFilterSheetOpen] = useState(false);
  const [sortBy, setSortBy] = useState<'deal_score' | 'price_asc' | 'price_desc' | 'biggest_drop'>('deal_score');

  const [filters, setFilters] = useState<FilterState>({
    category: initialCategory,
    brand: initialBrand,
    merchant: '',
    minPrice: '',
    maxPrice: '',
    minDiscount: '',
    minDealScore: '',
    inStockOnly: false,
  });

  const allProducts = useMemo(() => getAllProducts(country), [country]);

  // Filtering logic
  const filteredProducts = useMemo(() => {
    return allProducts.filter((product) => {
      // Keyword search
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesTitle = product.title.toLowerCase().includes(q);
        const matchesBrand = product.brand.toLowerCase().includes(q);
        const matchesCategory = product.categoryName.toLowerCase().includes(q);
        if (!matchesTitle && !matchesBrand && !matchesCategory) return false;
      }

      // Category filter
      if (filters.category && product.categorySlug !== filters.category) {
        return false;
      }

      // Brand filter
      if (filters.brand && product.brand.toLowerCase() !== filters.brand.toLowerCase()) {
        return false;
      }

      // Merchant filter
      if (filters.merchant) {
        const hasMerchant = product.offers.some(
          (o) => o.merchantName.toLowerCase() === filters.merchant.toLowerCase()
        );
        if (!hasMerchant) return false;
      }

      // Price filter
      if (filters.minPrice && product.currentBestPrice < parseFloat(filters.minPrice)) {
        return false;
      }
      if (filters.maxPrice && product.currentBestPrice > parseFloat(filters.maxPrice)) {
        return false;
      }

      // Discount filter
      if (filters.minDiscount) {
        const dropPercent =
          ((product.originalPrice - product.currentBestPrice) / product.originalPrice) * 100;
        if (dropPercent < parseFloat(filters.minDiscount)) return false;
      }

      // Deal Score filter
      if (filters.minDealScore && product.dealScore < parseInt(filters.minDealScore, 10)) {
        return false;
      }

      // In stock only
      if (filters.inStockOnly) {
        const hasStock = product.offers.some((o) => o.inStock);
        if (!hasStock) return false;
      }

      return true;
    });
  }, [allProducts, searchQuery, filters]);

  // Sorting logic
  const sortedProducts = useMemo(() => {
    const list = [...filteredProducts];
    if (sortBy === 'deal_score') {
      return list.sort((a, b) => b.dealScore - a.dealScore);
    }
    if (sortBy === 'price_asc') {
      return list.sort((a, b) => a.currentBestPrice - b.currentBestPrice);
    }
    if (sortBy === 'price_desc') {
      return list.sort((a, b) => b.currentBestPrice - a.currentBestPrice);
    }
    if (sortBy === 'biggest_drop') {
      return list.sort((a, b) => {
        const dropA = (a.originalPrice - a.currentBestPrice) / a.originalPrice;
        const dropB = (b.originalPrice - b.currentBestPrice) / b.originalPrice;
        return dropB - dropA;
      });
    }
    return list;
  }, [filteredProducts, sortBy]);

  const resetFilters = () => {
    setFilters({
      category: '',
      brand: '',
      merchant: '',
      minPrice: '',
      maxPrice: '',
      minDiscount: '',
      minDealScore: '',
      inStockOnly: false,
    });
    setSearchQuery('');
  };

  const activeFilterCount = Object.values(filters).filter((v) => Boolean(v)).length;
  const countryMerchants = MERCHANTS.filter((m) => m.country === country);
  const brands = ['Apple', 'Samsung', 'Sony', 'Google', 'LG', 'Dell', 'Valve'];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
      {/* Search Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-ctp">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-100 flex items-center gap-2">
            <span>Product Search &amp; Compare</span>
            {searchQuery && (
              <span className="text-emerald-400 font-semibold text-sm">
                for &ldquo;{searchQuery}&rdquo;
              </span>
            )}
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Showing {sortedProducts.length} verified electronics deals in {countryInfo.name}
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2.5">
          {/* Mobile Filter Sheet Trigger */}
          <button
            type="button"
            onClick={() => setIsFilterSheetOpen(true)}
            className="lg:hidden flex items-center gap-2 px-3.5 py-2 rounded-xl bg-ctp-surface border border-ctp hover:border-ctp-border-bright text-xs font-semibold text-slate-200 touch-target"
          >
            <SlidersHorizontal className="w-4 h-4 text-emerald-400" />
            <span>Filters</span>
            {activeFilterCount > 0 && (
              <span className="px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-emerald-500 text-slate-950">
                {activeFilterCount}
              </span>
            )}
          </button>

          {/* Sort Dropdown */}
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-ctp-surface border border-ctp text-xs">
            <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-transparent text-slate-200 font-medium focus:outline-none cursor-pointer text-xs"
            >
              <option value="deal_score" className="bg-slate-900 text-slate-100">
                Best Deal (Deal Score)
              </option>
              <option value="biggest_drop" className="bg-slate-900 text-slate-100">
                Biggest Price Drop %
              </option>
              <option value="price_asc" className="bg-slate-900 text-slate-100">
                Price: Low to High
              </option>
              <option value="price_desc" className="bg-slate-900 text-slate-100">
                Price: High to Low
              </option>
            </select>
          </div>
        </div>
      </div>

      {/* Main Grid with Desktop Sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 mt-6">
        {/* Desktop Filter Sidebar */}
        <aside className="hidden lg:block space-y-6 text-xs pr-4 border-r border-ctp sticky top-24 self-start max-h-[calc(100vh-7rem)] overflow-y-auto">
          <div className="flex items-center justify-between pb-3 border-b border-ctp">
            <span className="font-bold text-slate-200 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
              <SlidersHorizontal className="w-3.5 h-3.5 text-emerald-400" />
              Filter Products
            </span>
            {activeFilterCount > 0 && (
              <button
                type="button"
                onClick={resetFilters}
                className="text-[11px] text-slate-400 hover:text-emerald-400 flex items-center gap-1"
              >
                <RotateCcw className="w-3 h-3" />
                Reset
              </button>
            )}
          </div>

          {/* Categories */}
          <div>
            <h4 className="font-semibold text-slate-300 uppercase tracking-wider text-[11px] mb-2">
              Category
            </h4>
            <div className="space-y-1">
              <button
                type="button"
                onClick={() => setFilters({ ...filters, category: '' })}
                className={`w-full text-left px-2.5 py-1.5 rounded-lg transition-colors ${
                  !filters.category
                    ? 'bg-emerald-500/10 text-emerald-400 font-bold'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                All Categories
              </button>
              {CATEGORIES.map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() =>
                    setFilters({
                      ...filters,
                      category: filters.category === cat.slug ? '' : cat.slug,
                    })
                  }
                  className={`w-full text-left px-2.5 py-1.5 rounded-lg transition-colors ${
                    filters.category === cat.slug
                      ? 'bg-emerald-500/10 text-emerald-400 font-bold'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          </div>

          {/* Brands */}
          <div>
            <h4 className="font-semibold text-slate-300 uppercase tracking-wider text-[11px] mb-2">
              Brand
            </h4>
            <div className="space-y-1">
              {brands.map((b) => (
                <button
                  key={b}
                  type="button"
                  onClick={() =>
                    setFilters({ ...filters, brand: filters.brand === b ? '' : b })
                  }
                  className={`w-full text-left px-2.5 py-1.5 rounded-lg transition-colors ${
                    filters.brand === b
                      ? 'bg-emerald-500/10 text-emerald-400 font-bold'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {b}
                </button>
              ))}
            </div>
          </div>

          {/* Retailers */}
          {countryMerchants.length > 0 && (
            <div>
              <h4 className="font-semibold text-slate-300 uppercase tracking-wider text-[11px] mb-2">
                Merchant / Store
              </h4>
              <div className="space-y-1">
                {countryMerchants.map((m) => (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() =>
                      setFilters({ ...filters, merchant: filters.merchant === m.name ? '' : m.name })
                    }
                    className={`w-full text-left px-2.5 py-1.5 rounded-lg transition-colors ${
                      filters.merchant === m.name
                        ? 'bg-emerald-500/10 text-emerald-400 font-bold'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    {m.name}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* In stock checkbox */}
          <div className="pt-2 border-t border-ctp">
            <label className="flex items-center gap-2 cursor-pointer text-slate-300">
              <input
                type="checkbox"
                checked={filters.inStockOnly}
                onChange={(e) => setFilters({ ...filters, inStockOnly: e.target.checked })}
                className="w-4 h-4 accent-emerald-500 rounded"
              />
              <span>In Stock Only</span>
            </label>
          </div>
        </aside>

        {/* Results Column */}
        <div className="lg:col-span-3">
          {sortedProducts.length === 0 ? (
            <div className="p-12 text-center rounded-2xl bg-ctp-surface border border-ctp space-y-3">
              <SearchIcon className="w-10 h-10 text-slate-500 mx-auto" />
              <h3 className="text-lg font-bold text-slate-200">No matching products found</h3>
              <p className="text-xs text-slate-400 max-w-sm mx-auto">
                Try loosening your filters or searching for broader terms like &quot;Apple&quot;, &quot;Sony&quot;, or &quot;4K OLED&quot;.
              </p>
              <button
                type="button"
                onClick={resetFilters}
                className="px-4 py-2 rounded-xl bg-emerald-500 text-slate-950 font-semibold text-xs transition-all shadow-md"
              >
                Reset All Filters
              </button>
            </div>
          ) : (
            <div className="space-y-8">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3 sm:gap-6">
                {sortedProducts.slice(0, 4).map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}

                {/* In-feed Non-intrusive AdSense Slot between product rows */}
                {sortedProducts.length > 4 && (
                  <div className="col-span-2 md:col-span-3 py-2">
                    <AdSlot slotId="search-infeed-middle" format="banner" />
                  </div>
                )}

                {sortedProducts.slice(4).map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>

              {/* Bottom In-feed AdSense Slot */}
              <AdSlot slotId="search-bottom-feed" format="banner" />
            </div>
          )}
        </div>
      </div>

      {/* Mobile Filter Bottom Sheet */}
      <FilterSheet
        isOpen={isFilterSheetOpen}
        onClose={() => setIsFilterSheetOpen(false)}
        filters={filters}
        onFiltersChange={setFilters}
        onReset={resetFilters}
        totalResults={sortedProducts.length}
      />
    </div>
  );
}

export default function SearchPage({ params }: SearchPageProps) {
  const resolvedParams = use(params);

  return (
    <Suspense
      fallback={
        <div className="p-12 text-center text-xs text-slate-400">
          Loading verified search results...
        </div>
      }
    >
      <SearchContent countryParam={resolvedParams.country} />
    </Suspense>
  );
}
