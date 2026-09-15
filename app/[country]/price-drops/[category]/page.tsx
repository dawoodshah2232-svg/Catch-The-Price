import React from 'react';
import { Metadata } from 'next';
import { CountryCode, Product } from '@/lib/types';
import { COUNTRIES, DEFAULT_COUNTRY } from '@/lib/data/countries';
import { CATEGORIES, getCategoryBySlug } from '@/lib/data/categories';
import { getCatalogProducts, isPreviewCatalogEnabled } from '@/lib/data/catalog.server';
import { ProductCard } from '@/components/search/ProductCard';
import { AdSlot } from '@/components/common/AdSlot';
import { TrendingDown, ChevronRight } from 'lucide-react';

interface PriceDropsPageProps {
  params: Promise<{ country: string; category: string }>;
}

function observedDropPercent(product: Product): number {
  const history = [...(product.priceHistory || [])]
    .filter((point) => Number.isFinite(point.price) && point.price > 0)
    .sort((a, b) => a.date.localeCompare(b.date));

  if (history.length < 2) return 0;
  const previous = history[history.length - 2].price;
  const current = history[history.length - 1].price;
  if (previous <= 0 || current >= previous) return 0;
  return (previous - current) / previous;
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
    description: `See ${catName} products in ${info.name} where a newer stored price observation is lower than the previous observation for the same market.`,
    robots: isPreview ? { index: false, follow: false } : undefined,
    alternates: { canonical: `https://catchtheprice.com/${country}/price-drops/${catSlug}` },
  };
}

export default async function PriceDropsCategoryPage({ params }: PriceDropsPageProps) {
  const { country: rawCountry, category: catSlug } = await params;
  const country = (rawCountry?.toLowerCase() in COUNTRIES ? rawCountry.toLowerCase() : DEFAULT_COUNTRY) as CountryCode;
  const countryInfo = COUNTRIES[country];
  const isAll = catSlug === 'all';
  const category = getCategoryBySlug(catSlug);
  const { products: catalogProducts, isPreview } = await getCatalogProducts(country);
  const products = (isAll ? catalogProducts : catalogProducts.filter((p) => p.categorySlug.toLowerCase() === catSlug.toLowerCase()))
    .filter((p) => observedDropPercent(p) > 0);
  const sorted = [...products].sort((a, b) => observedDropPercent(b) - observedDropPercent(a));

  const breadcrumbJsonLd = !isPreview ? {
    '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: `https://catchtheprice.com/${country}` },
      { '@type': 'ListItem', position: 2, name: 'Price Drops', item: `https://catchtheprice.com/${country}/price-drops/all` },
      { '@type': 'ListItem', position: 3, name: category?.name || 'All Drops', item: `https://catchtheprice.com/${country}/price-drops/${catSlug}` },
    ],
  } : null;

  return (
    <div className="min-h-screen bg-[#F4F7F6]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 sm:py-8 space-y-5 sm:space-y-6">
        {breadcrumbJsonLd && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />}

        {isPreview && (
          <div className="rounded-2xl border border-amber-300 bg-amber-50 px-4 py-3 text-xs text-amber-900">
            Development preview: displayed reductions are sample data for interface testing only.
          </div>
        )}

        <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-[11px] sm:text-xs text-[#73858D] overflow-x-auto whitespace-nowrap">
          <a href={`/${country}`} className="hover:text-[#08784B]">Home</a>
          <ChevronRight className="w-3.5 h-3.5 text-[#A0AEA9]" />
          <span>Price Drops</span>
          <ChevronRight className="w-3.5 h-3.5 text-[#A0AEA9]" />
          <span className="text-[#08784B] font-bold">{category?.name || 'All Drops'}</span>
        </nav>

        <section className="rounded-[28px] bg-white border border-[#DDE7E3] p-5 sm:p-7 shadow-[0_12px_34px_rgba(24,52,43,0.06)]">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-[10px] sm:text-xs font-extrabold uppercase tracking-[0.16em] text-[#0B8F58]">
                <TrendingDown className="w-4 h-4" /> Observed reductions
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-[#102027] mt-2">
                {category ? `${category.name} Price Drops` : 'Electronics Price Drops'} in {countryInfo.name}
              </h1>
              <p className="text-xs sm:text-sm text-[#65777F] mt-2 max-w-2xl leading-relaxed">
                Products appear here only when the latest stored observation is lower than the previous stored observation for that product and market. A retailer reference price alone does not qualify as a historical drop.
              </p>
            </div>
            <span className="self-start sm:self-auto text-xs px-3 py-2 rounded-xl bg-[#EDF8F3] border border-[#D1EADD] text-[#08784B] font-extrabold">
              {sorted.length} observed drop{sorted.length === 1 ? '' : 's'}
            </span>
          </div>
        </section>

        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          <a href={`/${country}/price-drops/all`} className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap border transition-all ${isAll ? 'bg-[#0B8F58] text-white border-[#0B8F58]' : 'bg-white border-[#DDE7E3] text-[#52636B] hover:border-[#BFD2CA]'}`}>All Drops</a>
          {CATEGORIES.map((item) => {
            const active = item.slug === catSlug;
            return <a key={item.id} href={`/${country}/price-drops/${item.slug}`} className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap border transition-all ${active ? 'bg-[#0B8F58] text-white border-[#0B8F58]' : 'bg-white border-[#DDE7E3] text-[#52636B] hover:border-[#BFD2CA]'}`}>{item.name}</a>;
          })}
        </div>

        {sorted.length > 0 ? (
          <>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2.5 sm:gap-5 pt-1">
              {sorted.map((product) => <ProductCard key={product.id} product={product} priceContext="previous_observation" />)}
            </div>
            <AdSlot slotId="price-drops-bottom" format="banner" />
          </>
        ) : (
          <div className="rounded-[26px] border border-[#DDE7E3] bg-white px-5 py-12 text-center shadow-[0_10px_28px_rgba(24,52,43,0.04)]">
            <h2 className="text-lg font-extrabold text-[#102027]">No observed price drops are available yet.</h2>
            <p className="mt-2 text-sm text-[#73858D] max-w-xl mx-auto leading-relaxed">
              This section will populate after CatchThePrice has at least two genuine price observations for an eligible product in this market and the newer observation is lower.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
