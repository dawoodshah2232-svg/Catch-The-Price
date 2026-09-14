import React from 'react';
import { Metadata } from 'next';
import { CountryCode } from '@/lib/types';
import { COUNTRIES, DEFAULT_COUNTRY } from '@/lib/data/countries';
import { CATEGORIES, getCategoryBySlug } from '@/lib/data/categories';
import { getAllProducts, getProductsByCategory } from '@/lib/data/products';
import { ProductCard } from '@/components/search/ProductCard';
import { AdSlot } from '@/components/common/AdSlot';
import { TrendingDown, ChevronRight } from 'lucide-react';

interface PriceDropsPageProps {
  params: Promise<{
    country: string;
    category: string;
  }>;
}

export async function generateMetadata({ params }: PriceDropsPageProps): Promise<Metadata> {
  const { country: rawCountry, category: catSlug } = await params;
  const country = (rawCountry?.toLowerCase() in COUNTRIES ? rawCountry.toLowerCase() : DEFAULT_COUNTRY) as CountryCode;
  const info = COUNTRIES[country];
  const cat = getCategoryBySlug(catSlug);
  const catName = cat?.name || 'Electronics';

  return {
    title: `Biggest ${catName} Price Drops in ${info.name} — CatchThePrice`,
    description: `Track major ${catName} price drops in ${info.name}. Save up to 25% or more across verified authorized retailers.`,
    alternates: {
      canonical: `https://catchtheprice.com/${country}/price-drops/${catSlug}`,
    },
  };
}

export default async function PriceDropsCategoryPage({ params }: PriceDropsPageProps) {
  const { country: rawCountry, category: catSlug } = await params;
  const country = (rawCountry?.toLowerCase() in COUNTRIES ? rawCountry.toLowerCase() : DEFAULT_COUNTRY) as CountryCode;
  const countryInfo = COUNTRIES[country];

  const isAll = catSlug === 'all';
  const category = getCategoryBySlug(catSlug);
  const products = isAll ? getAllProducts(country) : getProductsByCategory(catSlug, country);

  // Sort by price drop percentage descending
  const sorted = [...products].sort((a, b) => {
    const dropA = (a.originalPrice - a.currentBestPrice) / a.originalPrice;
    const dropB = (b.originalPrice - b.currentBestPrice) / b.originalPrice;
    return dropB - dropA;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6">
      {/* Breadcrumbs */}
      <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs text-slate-400">
        <a href={`/${country}`} className="hover:text-white transition-colors">
          Home
        </a>
        <ChevronRight className="w-3.5 h-3.5 text-slate-500" />
        <span className="text-slate-300 font-medium">Price Drops</span>
        <ChevronRight className="w-3.5 h-3.5 text-slate-500" />
        <span className="text-cyan-400 font-semibold">{category?.name || 'All Drops'}</span>
      </nav>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-ctp">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-cyan-400">
            <TrendingDown className="w-4 h-4" />
            <span>Deep Price Reductions</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-100 mt-1">
            {category ? `Biggest ${category.name} Price Drops` : 'Biggest Electronics Price Drops'} in {countryInfo.name}
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl">
            Sorted by greatest percentage drop from manufacturer list price. Verified against 90-day averages.
          </p>
        </div>

        <span className="text-xs px-3 py-1 rounded-xl bg-slate-900 border border-ctp text-cyan-400 font-medium self-start sm:self-auto">
          {sorted.length} Drops Detected
        </span>
      </div>

      {/* Category Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2">
        <a
          href={`/${country}/price-drops/all`}
          className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
            isAll
              ? 'bg-cyan-500 text-slate-950 font-bold shadow-md'
              : 'bg-ctp-surface border border-ctp text-slate-300 hover:text-white'
          }`}
        >
          All Drops
        </a>
        {CATEGORIES.map((c) => {
          const isActive = c.slug === catSlug;
          return (
            <a
              key={c.id}
              href={`/${country}/price-drops/${c.slug}`}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                isActive
                  ? 'bg-cyan-500 text-slate-950 font-bold shadow-md'
                  : 'bg-ctp-surface border border-ctp text-slate-300 hover:text-white'
              }`}
            >
              {c.name}
            </a>
          );
        })}
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6 pt-2">
        {sorted.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      {/* Ad Slot */}
      <AdSlot slotId="price-drops-bottom" format="banner" />
    </div>
  );
}
