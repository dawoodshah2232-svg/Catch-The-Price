import React from 'react';
import { Metadata } from 'next';
import { CountryCode } from '@/lib/types';
import { COUNTRIES, DEFAULT_COUNTRY } from '@/lib/data/countries';
import { CATEGORIES, getCategoryBySlug } from '@/lib/data/categories';
import { getCatalogProducts } from '@/lib/data/catalog.server';
import { ProductCard } from '@/components/search/ProductCard';
import { AdSlot } from '@/components/common/AdSlot';
import { Flame, ChevronRight, SlidersHorizontal } from 'lucide-react';

interface DealsCategoryPageProps {
  params: Promise<{ country: string; category: string }>;
}

export async function generateMetadata({ params }: DealsCategoryPageProps): Promise<Metadata> {
  const { country: rawCountry, category: catSlug } = await params;
  const country = (rawCountry?.toLowerCase() in COUNTRIES ? rawCountry.toLowerCase() : DEFAULT_COUNTRY) as CountryCode;
  const info = COUNTRIES[country];
  const cat = getCategoryBySlug(catSlug);
  const catName = cat?.name || 'Electronics';
  const { isPreview } = await getCatalogProducts(country);

  return {
    title: `Best ${catName} Deals in ${info.name} — CatchThePrice`,
    description: `Browse currently listed ${catName} offers in ${info.name} and compare eligible retailer prices when available.`,
    robots: isPreview ? { index: false, follow: false } : undefined,
    alternates: { canonical: `https://catchtheprice.com/${country}/deals/${catSlug}` },
  };
}

export default async function DealsCategoryPage({ params }: DealsCategoryPageProps) {
  const { country: rawCountry, category: catSlug } = await params;
  const country = (rawCountry?.toLowerCase() in COUNTRIES ? rawCountry.toLowerCase() : DEFAULT_COUNTRY) as CountryCode;
  const countryInfo = COUNTRIES[country];
  const isAll = catSlug === 'all';
  const category = getCategoryBySlug(catSlug);
  const { products: catalogProducts, isPreview } = await getCatalogProducts(country);
  const products = isAll ? catalogProducts : catalogProducts.filter((p) => p.categorySlug.toLowerCase() === catSlug.toLowerCase());
  const sorted = [...products].sort((a, b) => {
    const aDrop = a.originalPrice > 0 ? (a.originalPrice - a.currentBestPrice) / a.originalPrice : 0;
    const bDrop = b.originalPrice > 0 ? (b.originalPrice - b.currentBestPrice) / b.originalPrice : 0;
    return bDrop - aDrop;
  });

  const breadcrumbJsonLd = !isPreview ? {
    '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: `https://catchtheprice.com/${country}` },
      { '@type': 'ListItem', position: 2, name: 'Deals', item: `https://catchtheprice.com/${country}/deals/all` },
      { '@type': 'ListItem', position: 3, name: category?.name || 'All Deals', item: `https://catchtheprice.com/${country}/deals/${catSlug}` },
    ],
  } : null;

  return (
    <div className="min-h-screen bg-[#F4F7F6]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 sm:py-8 space-y-5 sm:space-y-6">
        {breadcrumbJsonLd && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />}


        <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-[11px] sm:text-xs text-[#73858D] overflow-x-auto whitespace-nowrap">
          <a href={`/${country}`} className="hover:text-[#08784B]">Home</a>
          <ChevronRight className="w-3.5 h-3.5 text-[#A0AEA9]" />
          <span>Deals</span>
          <ChevronRight className="w-3.5 h-3.5 text-[#A0AEA9]" />
          <span className="text-[#08784B] font-bold">{category?.name || 'All Deals'}</span>
        </nav>

        <section className="rounded-[28px] bg-white border border-[#DDE7E3] p-5 sm:p-7 shadow-[0_12px_34px_rgba(24,52,43,0.06)]">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-[10px] sm:text-xs font-extrabold uppercase tracking-[0.16em] text-[#0B8F58]">
                <Flame className="w-4 h-4" /> Price discovery
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-[#102027] mt-2">
                {category ? `${category.name} Deals` : 'Electronics Deals'} in {countryInfo.name}
              </h1>
              <p className="text-xs sm:text-sm text-[#65777F] mt-2 max-w-2xl leading-relaxed">
                {category?.description || 'Compare currently eligible retailer listings for exact products available in this market.'}
              </p>
            </div>
            <div className="self-start sm:self-auto inline-flex items-center gap-2 text-xs px-3 py-2 rounded-xl bg-[#F3F8F6] border border-[#D8E6E0] text-[#365148] font-bold">
              <SlidersHorizontal className="w-3.5 h-3.5 text-[#0B8F58]" /> {sorted.length} eligible product{sorted.length === 1 ? '' : 's'}
            </div>
          </div>
        </section>

        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          <a href={`/${country}/deals/all`} className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap border transition-all ${isAll ? 'bg-[#0B8F58] text-white border-[#0B8F58]' : 'bg-white border-[#DDE7E3] text-[#52636B] hover:border-[#BFD2CA]'}`}>All Deals</a>
          {CATEGORIES.map((item) => {
            const active = item.slug === catSlug;
            return <a key={item.id} href={`/${country}/deals/${item.slug}`} className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap border transition-all ${active ? 'bg-[#0B8F58] text-white border-[#0B8F58]' : 'bg-white border-[#DDE7E3] text-[#52636B] hover:border-[#BFD2CA]'}`}>{item.name}</a>;
          })}
        </div>

        {sorted.length > 0 ? (
          <>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2.5 sm:gap-5 pt-1">
              {sorted.map((product) => <ProductCard key={product.id} product={product} />)}
            </div>
            <AdSlot slotId="category-deals-bottom" format="banner" />
          </>
        ) : (
          <div className="rounded-[26px] border border-[#DDE7E3] bg-white px-5 py-12 text-center shadow-[0_10px_28px_rgba(24,52,43,0.04)]">
            <h2 className="text-lg font-extrabold text-[#102027]">No eligible offers are published here yet.</h2>
            <p className="mt-2 text-sm text-[#73858D] max-w-xl mx-auto leading-relaxed">
              CatchThePrice only lists a product after its market, exact variant, retailer destination and current offer are available from an approved source.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
