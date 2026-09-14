import React from 'react';
import { Metadata } from 'next';
import { CountryCode } from '@/lib/types';
import { COUNTRIES, DEFAULT_COUNTRY } from '@/lib/data/countries';
import { CATEGORIES, getCategoryBySlug } from '@/lib/data/categories';
import { getAllProducts, getProductsByCategory } from '@/lib/data/products';
import { ProductCard } from '@/components/search/ProductCard';
import { AdSlot } from '@/components/common/AdSlot';
import { Flame, ChevronRight, ArrowRight } from 'lucide-react';

interface DealsCategoryPageProps {
  params: Promise<{
    country: string;
    category: string;
  }>;
}

export async function generateMetadata({ params }: DealsCategoryPageProps): Promise<Metadata> {
  const { country: rawCountry, category: catSlug } = await params;
  const country = (rawCountry?.toLowerCase() in COUNTRIES ? rawCountry.toLowerCase() : DEFAULT_COUNTRY) as CountryCode;
  const info = COUNTRIES[country];
  const cat = getCategoryBySlug(catSlug);
  const catName = cat?.name || 'All Tech';

  return {
    title: `Best ${catName} Deals in ${info.name} — CatchThePrice`,
    description: `Browse verified ${catName} deals in ${info.name}. Save big with historical price tracking, Deal Scores, and multi-store price comparisons.`,
    alternates: {
      canonical: `https://catchtheprice.com/${country}/deals/${catSlug}`,
    },
  };
}

export default async function DealsCategoryPage({ params }: DealsCategoryPageProps) {
  const { country: rawCountry, category: catSlug } = await params;
  const country = (rawCountry?.toLowerCase() in COUNTRIES ? rawCountry.toLowerCase() : DEFAULT_COUNTRY) as CountryCode;
  const countryInfo = COUNTRIES[country];

  const isAll = catSlug === 'all';
  const category = getCategoryBySlug(catSlug);
  const products = isAll ? getAllProducts(country) : getProductsByCategory(catSlug, country);

  // Sort by Deal Score descending
  const sorted = [...products].sort((a, b) => b.dealScore - a.dealScore);

  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: `https://catchtheprice.com/${country}`,
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Deals',
        item: `https://catchtheprice.com/${country}/deals/all`,
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: category?.name || 'All Deals',
        item: `https://catchtheprice.com/${country}/deals/${catSlug}`,
      },
    ],
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      {/* Breadcrumbs */}
      <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs text-slate-400">
        <a href={`/${country}`} className="hover:text-white transition-colors">
          Home
        </a>
        <ChevronRight className="w-3.5 h-3.5 text-slate-500" />
        <span className="text-slate-300 font-medium">Deals</span>
        <ChevronRight className="w-3.5 h-3.5 text-slate-500" />
        <span className="text-emerald-400 font-semibold">{category?.name || 'All Deals'}</span>
      </nav>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-ctp">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-400">
            <Flame className="w-4 h-4" />
            <span>Curated Deals</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-100 mt-1">
            {category ? `Best ${category.name} Deals` : 'Top Electronics Deals'} in {countryInfo.name}
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl">
            {category?.description ||
              'Compare verified electronics discounts with authentic 90-day price histories.'}
          </p>
        </div>

        <span className="text-xs px-3 py-1 rounded-xl bg-slate-900 border border-ctp text-slate-300 font-medium self-start sm:self-auto">
          {sorted.length} Active Deals
        </span>
      </div>

      {/* Category Pills Bar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2">
        <a
          href={`/${country}/deals/all`}
          className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
            isAll
              ? 'bg-emerald-500 text-slate-950 font-bold shadow-md'
              : 'bg-ctp-surface border border-ctp text-slate-300 hover:text-white'
          }`}
        >
          All Deals
        </a>
        {CATEGORIES.map((c) => {
          const isActive = c.slug === catSlug;
          return (
            <a
              key={c.id}
              href={`/${country}/deals/${c.slug}`}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                isActive
                  ? 'bg-emerald-500 text-slate-950 font-bold shadow-md'
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

      {/* Ad Placement */}
      <AdSlot slotId="category-deals-bottom" format="banner" />
    </div>
  );
}
