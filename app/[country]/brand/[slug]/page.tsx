import React from 'react';
import { Metadata } from 'next';
import { CountryCode } from '@/lib/types';
import { COUNTRIES, DEFAULT_COUNTRY } from '@/lib/data/countries';
import { getCatalogProducts } from '@/lib/data/catalog.server';
import { ProductCard } from '@/components/search/ProductCard';
import { AdSlot } from '@/components/common/AdSlot';
import { generateBreadcrumbsJsonLd, generateItemListJsonLd, generateBrandJsonLd } from '@/lib/seo/schema';
import { Tag, ChevronRight, SlidersHorizontal, ArrowLeft } from 'lucide-react';

interface BrandPageProps {
  params: Promise<{ country: string; slug: string }>;
}

function normalizeSlug(slug: string): string {
  return decodeURIComponent(slug).toLowerCase().replace(/[-_]+/g, ' ').trim();
}

export async function generateMetadata({ params }: BrandPageProps): Promise<Metadata> {
  const { country: rawCountry, slug: rawSlug } = await params;
  const country = (rawCountry?.toLowerCase() in COUNTRIES ? rawCountry.toLowerCase() : DEFAULT_COUNTRY) as CountryCode;
  const info = COUNTRIES[country];
  const brandName = normalizeSlug(rawSlug)
    .split(' ')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');

  const { isPreview } = await getCatalogProducts(country);

  return {
    title: `${brandName} Prices & Deals in ${info.name} — CatchThePrice`,
    description: `Compare prices across all ${brandName} products from authorized retailers in ${info.name}. Track historical price changes and get price-drop alerts.`,
    robots: isPreview ? { index: false, follow: false } : undefined,
    alternates: { canonical: `https://catchtheprice.com/${country}/brand/${rawSlug}` },
    openGraph: {
      title: `${brandName} Price Comparison in ${info.name}`,
      description: `Find the lowest prices and best retailer deals for ${brandName} in ${info.name}.`,
    },
  };
}

export default async function BrandPage({ params }: BrandPageProps) {
  const { country: rawCountry, slug: rawSlug } = await params;
  const country = (rawCountry?.toLowerCase() in COUNTRIES ? rawCountry.toLowerCase() : DEFAULT_COUNTRY) as CountryCode;
  const countryInfo = COUNTRIES[country];
  const queryBrand = normalizeSlug(rawSlug);

  const { products: catalogProducts, isPreview } = await getCatalogProducts(country);
  const products = catalogProducts.filter(
    (p) => p.brand.toLowerCase() === queryBrand || normalizeSlug(p.brand) === queryBrand
  );

  const brandDisplayName =
    products.length > 0
      ? products[0].brand
      : queryBrand
          .split(' ')
          .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
          .join(' ');

  const sorted = [...products].sort(
    (a, b) => b.offersCount - a.offersCount || a.currentBestPrice - b.currentBestPrice
  );

  const prices = sorted.map((p) => p.currentBestPrice).filter((p) => p > 0);
  const minPrice = prices.length ? Math.min(...prices) : 0;
  const maxPrice = prices.length ? Math.max(...prices) : 0;

  const breadcrumbsJsonLd = !isPreview
    ? generateBreadcrumbsJsonLd([
        { name: 'Home', url: `/${country}` },
        { name: 'Brands', url: `/${country}/search` },
        { name: brandDisplayName, url: `/${country}/brand/${rawSlug}` },
      ])
    : null;

  const brandJsonLd = !isPreview
    ? generateBrandJsonLd({
        name: brandDisplayName,
        url: `/${country}/brand/${rawSlug}`,
        description: `Compare ${brandDisplayName} prices in ${countryInfo.name}`,
      })
    : null;

  const itemListJsonLd = !isPreview && sorted.length > 0
    ? generateItemListJsonLd({
        name: `${brandDisplayName} Products in ${countryInfo.name}`,
        url: `/${country}/brand/${rawSlug}`,
        products: sorted.slice(0, 30),
        country,
      })
    : null;

  return (
    <div className="min-h-screen bg-[#F4F7F6] pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 sm:py-8 space-y-5 sm:space-y-6">
        {breadcrumbsJsonLd && (
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbsJsonLd) }}
          />
        )}
        {brandJsonLd && (
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(brandJsonLd) }}
          />
        )}
        {itemListJsonLd && (
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListJsonLd) }}
          />
        )}

        {/* Breadcrumb Navigation */}
        <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-[11px] sm:text-xs text-[#73858D] overflow-x-auto whitespace-nowrap scrollbar-none">
          <a href={`/${country}`} className="hover:text-[#08784B] transition-colors">Home</a>
          <ChevronRight className="w-3.5 h-3.5 text-[#A0AEA9]" />
          <a href={`/${country}/search`} className="hover:text-[#08784B] transition-colors">Brands</a>
          <ChevronRight className="w-3.5 h-3.5 text-[#A0AEA9]" />
          <span className="text-[#08784B] font-bold">{brandDisplayName}</span>
        </nav>

        {/* Hero Header */}
        <section className="rounded-[28px] bg-white border border-[#DDE7E3] p-5 sm:p-7 shadow-[0_12px_34px_rgba(24,52,43,0.06)]">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-[10px] sm:text-xs font-extrabold uppercase tracking-[0.16em] text-[#0B8F58]">
                <Tag className="w-4 h-4" /> Brand Price Intelligence
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-[#102027] mt-2">
                {brandDisplayName} in {countryInfo.name}
              </h1>
              <p className="text-xs sm:text-sm text-[#65777F] mt-2 max-w-2xl leading-relaxed">
                Compare genuine retailer prices for {brandDisplayName} devices, laptops, phones, and audio equipment across verified stores in {countryInfo.name}.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2 self-start sm:self-auto text-xs font-bold">
              <div className="inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-[#F3F8F6] border border-[#D8E6E0] text-[#365148]">
                <SlidersHorizontal className="w-3.5 h-3.5 text-[#0B8F58]" /> {sorted.length} model{sorted.length === 1 ? '' : 's'} tracked
              </div>
              {minPrice > 0 && maxPrice > 0 && (
                <div className="px-3 py-2 rounded-xl bg-[#EAF8F1] border border-[#C5EBDA] text-[#08784B]">
                  From {countryInfo.currency} {minPrice} to {countryInfo.currency} {maxPrice}
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Product Grid or Honest Empty State */}
        {sorted.length > 0 ? (
          <>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2.5 sm:gap-5 pt-1">
              {sorted.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
            <AdSlot slotId="brand-catalog-bottom" format="banner" />
          </>
        ) : (
          <div className="rounded-[28px] bg-white border border-[#DDE7E3] p-12 text-center max-w-md mx-auto my-8 shadow-sm">
            <Tag className="w-12 h-12 text-[#9AABA4] mx-auto mb-3 stroke-[1.5]" />
            <h3 className="text-base font-extrabold text-[#102027]">No active {brandDisplayName} products currently listed</h3>
            <p className="text-xs text-[#60727A] mt-1.5 leading-relaxed">
              We only display verified products with live retailer offers in {countryInfo.name}. Search our full catalog or check back soon.
            </p>
            <div className="mt-5">
              <a
                href={`/${country}/search`}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#0B8F58] text-white text-xs font-bold hover:bg-[#08784B] transition-colors"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Search all products</span>
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
