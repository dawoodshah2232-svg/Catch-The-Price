import React from 'react';
import { Metadata } from 'next';
import { CountryCode } from '@/lib/types';
import { COUNTRIES, DEFAULT_COUNTRY } from '@/lib/data/countries';
import { CATEGORIES, getCategoryBySlug } from '@/lib/data/categories';
import { getCatalogProducts, isPreviewCatalogEnabled } from '@/lib/data/catalog.server';
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
  const isPreview = isPreviewCatalogEnabled();

  return {
    title: `${catName} Price Drops in ${info.name} — CatchThePrice`,
    description: `See eligible ${catName} listings in ${info.name} where the current retailer price is below a recorded reference price.`,
    robots: isPreview ? { index: false, follow: false } : undefined,
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
  const { products: catalogProducts, isPreview } = await getCatalogProducts(country);
  const products = (isAll
    ? catalogProducts
    : catalogProducts.filter((product) => product.categorySlug.toLowerCase() === catSlug.toLowerCase())
  ).filter((product) => product.originalPrice > product.currentBestPrice && product.originalPrice > 0);

  const sorted = [...products].sort((a, b) => {
    const dropA = (a.originalPrice - a.currentBestPrice) / a.originalPrice;
    const dropB = (b.originalPrice - b.currentBestPrice) / b.originalPrice;
    return dropB - dropA;
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
            name: 'Price Drops',
            item: `https://catchtheprice.com/${country}/price-drops/all`,
          },
          {
            '@type': 'ListItem',
            position: 3,
            name: category?.name || 'All Drops',
            item: `https://catchtheprice.com/${country}/price-drops/${catSlug}`,
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
          Development preview: displayed reductions are sample data for interface testing only.
        </div>
      )}

      <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs text-slate-400">
        <a href={`/${country}`} className="hover:text-white transition-colors">
          Home
        </a>
        <ChevronRight className="w-3.5 h-3.5 text-slate-500" />
        <span className="text-slate-300 font-medium">Price Drops</span>
        <ChevronRight className="w-3.5 h-3.5 text-slate-500" />
        <span className="text-cyan-400 font-semibold">{category?.name || 'All Drops'}</span>
      </nav>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-ctp">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-cyan-400">
            <TrendingDown className="w-4 h-4" />
            <span>Recorded reductions</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-100 mt-1">
            {category ? `${category.name} Price Drops` : 'Electronics Price Drops'} in {countryInfo.name}
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl">
            Products appear here only when an eligible current offer is below a source-backed reference price. Historical averages are not claimed until genuine observations exist.
          </p>
        </div>

        <span className="text-xs px-3 py-1 rounded-xl bg-slate-900 border border-ctp text-cyan-400 font-medium self-start sm:self-auto">
          {sorted.length} recorded drop{sorted.length === 1 ? '' : 's'}
        </span>
      </div>

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
        {CATEGORIES.map((item) => {
          const isActive = item.slug === catSlug;
          return (
            <a
              key={item.id}
              href={`/${country}/price-drops/${item.slug}`}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                isActive
                  ? 'bg-cyan-500 text-slate-950 font-bold shadow-md'
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
          <AdSlot slotId="price-drops-bottom" format="banner" />
        </>
      ) : (
        <div className="rounded-3xl border border-[#162633] bg-[#091217] px-5 py-10 text-center">
          <h2 className="text-lg font-bold text-[#F8FAFC]">No source-backed price drops are available yet.</h2>
          <p className="mt-2 text-sm text-[#94A3B8] max-w-xl mx-auto">
            This section will populate only after eligible live offers and genuine reference observations are collected for this market.
          </p>
        </div>
      )}
    </div>
  );
}
