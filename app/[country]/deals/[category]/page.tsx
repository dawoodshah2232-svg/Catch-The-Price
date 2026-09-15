import React from 'react';
import { Metadata } from 'next';
import { CountryCode } from '@/lib/types';
import { COUNTRIES, DEFAULT_COUNTRY } from '@/lib/data/countries';
import { CATEGORIES, getCategoryBySlug } from '@/lib/data/categories';
import { getCatalogProducts, isPreviewCatalogEnabled } from '@/lib/data/catalog.server';
import { ProductCard } from '@/components/search/ProductCard';
import { AdSlot } from '@/components/common/AdSlot';
import { Flame, ChevronRight } from 'lucide-react';

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
  const catName = cat?.name || 'Electronics';
  const isPreview = isPreviewCatalogEnabled();

  return {
    title: `Best ${catName} Deals in ${info.name} — CatchThePrice`,
    description: `Browse currently listed ${catName} offers in ${info.name} and compare eligible retailer prices when available.`,
    robots: isPreview ? { index: false, follow: false } : undefined,
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
  const { products: catalogProducts, isPreview } = await getCatalogProducts(country);
  const products = isAll
    ? catalogProducts
    : catalogProducts.filter((product) => product.categorySlug.toLowerCase() === catSlug.toLowerCase());

  const sorted = [...products].sort((a, b) => {
    const aDrop = a.originalPrice > 0 ? (a.originalPrice - a.currentBestPrice) / a.originalPrice : 0;
    const bDrop = b.originalPrice > 0 ? (b.originalPrice - b.currentBestPrice) / b.originalPrice : 0;
    return bDrop - aDrop;
  });

  const breadcrumbJsonLd = !isPreview
    ? {
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
      }
    : null;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6">
      {breadcrumbJsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
        />
      )}

      {isPreview && (
        <div className="rounded-2xl border border-amber-400/25 bg-amber-400/10 px-4 py-3 text-xs text-amber-100">
          Development preview: sample products and prices on this Vercel build are for UI testing only.
        </div>
      )}

      <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs text-slate-400">
        <a href={`/${country}`} className="hover:text-white transition-colors">
          Home
        </a>
        <ChevronRight className="w-3.5 h-3.5 text-slate-500" />
        <span className="text-slate-300 font-medium">Deals</span>
        <ChevronRight className="w-3.5 h-3.5 text-slate-500" />
        <span className="text-emerald-400 font-semibold">{category?.name || 'All Deals'}</span>
      </nav>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-ctp">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-400">
            <Flame className="w-4 h-4" />
            <span>Price discovery</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-100 mt-1">
            {category ? `${category.name} Deals` : 'Electronics Deals'} in {countryInfo.name}
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl">
            {category?.description || 'Compare currently eligible retailer listings for the exact products available in this market.'}
          </p>
        </div>

        <span className="text-xs px-3 py-1 rounded-xl bg-slate-900 border border-ctp text-slate-300 font-medium self-start sm:self-auto">
          {sorted.length} eligible product{sorted.length === 1 ? '' : 's'}
        </span>
      </div>

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
        {CATEGORIES.map((item) => {
          const isActive = item.slug === catSlug;
          return (
            <a
              key={item.id}
              href={`/${country}/deals/${item.slug}`}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                isActive
                  ? 'bg-emerald-500 text-slate-950 font-bold shadow-md'
                  : 'bg-ctp-surface border border-ctp text-slate-300 hover:text-white'
              }`}
            >
              {item.name}
            </a>
          );
        })}
      </div>

      {sorted.length > 0 ? (
        <>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6 pt-2">
            {sorted.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
          <AdSlot slotId="category-deals-bottom" format="banner" />
        </>
      ) : (
        <div className="rounded-3xl border border-[#162633] bg-[#091217] px-5 py-10 text-center">
          <h2 className="text-lg font-bold text-[#F8FAFC]">No eligible offers are published here yet.</h2>
          <p className="mt-2 text-sm text-[#94A3B8] max-w-xl mx-auto">
            CatchThePrice only lists a product after its market, exact variant, retailer destination and current offer are available from an approved source.
          </p>
        </div>
      )}
    </div>
  );
}
