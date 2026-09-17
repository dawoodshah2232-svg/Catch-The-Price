import React from 'react';
import { Metadata } from 'next';
import { CountryCode } from '@/lib/types';
import { COUNTRIES, DEFAULT_COUNTRY } from '@/lib/data/countries';
import { getCatalogProducts } from '@/lib/data/catalog.server';
import { ProductCard } from '@/components/search/ProductCard';
import { AdSlot } from '@/components/common/AdSlot';
import { generateBreadcrumbsJsonLd, generateItemListJsonLd, generateMerchantJsonLd } from '@/lib/seo/schema';
import { Store, ChevronRight, SlidersHorizontal, ShieldCheck, ArrowLeft } from 'lucide-react';

interface RetailerPageProps {
  params: Promise<{ country: string; slug: string }>;
}

function normalizeSlug(slug: string): string {
  return decodeURIComponent(slug).toLowerCase().replace(/[-_]+/g, ' ').trim();
}

export async function generateMetadata({ params }: RetailerPageProps): Promise<Metadata> {
  const { country: rawCountry, slug: rawSlug } = await params;
  const country = (rawCountry?.toLowerCase() in COUNTRIES ? rawCountry.toLowerCase() : DEFAULT_COUNTRY) as CountryCode;
  const info = COUNTRIES[country];
  const retailerName = normalizeSlug(rawSlug)
    .split(' ')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');

  const { isPreview } = await getCatalogProducts(country);

  return {
    title: `${retailerName} Deals & Prices in ${info.name} — CatchThePrice`,
    description: `Compare prices for items sold by ${retailerName} in ${info.name}. Verified retailer offers, price history, and price drop tracking.`,
    robots: isPreview ? { index: false, follow: false } : undefined,
    alternates: { canonical: `https://catchtheprice.com/${country}/retailer/${rawSlug}` },
    openGraph: {
      title: `${retailerName} Offers & Price Comparison in ${info.name}`,
      description: `Browse verified ${retailerName} products and live prices in ${info.name}.`,
    },
  };
}

export default async function RetailerPage({ params }: RetailerPageProps) {
  const { country: rawCountry, slug: rawSlug } = await params;
  const country = (rawCountry?.toLowerCase() in COUNTRIES ? rawCountry.toLowerCase() : DEFAULT_COUNTRY) as CountryCode;
  const countryInfo = COUNTRIES[country];
  const queryRetailer = normalizeSlug(rawSlug);

  const { products: catalogProducts, isPreview } = await getCatalogProducts(country);
  const products = catalogProducts.filter((p) =>
    p.offers.some(
      (offer) =>
        normalizeSlug(offer.merchantName) === queryRetailer ||
        offer.merchantName.toLowerCase().includes(queryRetailer) ||
        queryRetailer.includes(normalizeSlug(offer.merchantName))
    )
  );

  let retailerDisplayName = queryRetailer
    .split(' ')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');

  if (products.length > 0) {
    const matchedOffer = products[0].offers.find(
      (offer) =>
        normalizeSlug(offer.merchantName) === queryRetailer ||
        offer.merchantName.toLowerCase().includes(queryRetailer) ||
        queryRetailer.includes(normalizeSlug(offer.merchantName))
    );
    if (matchedOffer) retailerDisplayName = matchedOffer.merchantName;
  }

  const sorted = [...products].sort(
    (a, b) => b.offersCount - a.offersCount || a.currentBestPrice - b.currentBestPrice
  );

  const breadcrumbsJsonLd = !isPreview
    ? generateBreadcrumbsJsonLd([
        { name: 'Home', url: `/${country}` },
        { name: 'Retailers', url: `/${country}/search` },
        { name: retailerDisplayName, url: `/${country}/retailer/${rawSlug}` },
      ])
    : null;

  const merchantJsonLd = !isPreview
    ? generateMerchantJsonLd({
        name: retailerDisplayName,
        url: `/${country}/retailer/${rawSlug}`,
      })
    : null;

  const itemListJsonLd = !isPreview && sorted.length > 0
    ? generateItemListJsonLd({
        name: `${retailerDisplayName} Offers in ${countryInfo.name}`,
        url: `/${country}/retailer/${rawSlug}`,
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
        {merchantJsonLd && (
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(merchantJsonLd) }}
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
          <a href={`/${country}/search`} className="hover:text-[#08784B] transition-colors">Retailers</a>
          <ChevronRight className="w-3.5 h-3.5 text-[#A0AEA9]" />
          <span className="text-[#08784B] font-bold">{retailerDisplayName}</span>
        </nav>

        {/* Hero Header */}
        <section className="rounded-[28px] bg-white border border-[#DDE7E3] p-5 sm:p-7 shadow-[0_12px_34px_rgba(24,52,43,0.06)]">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-[10px] sm:text-xs font-extrabold uppercase tracking-[0.16em] text-[#0B8F58]">
                <Store className="w-4 h-4" /> Verified Retailer
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-[#102027] mt-2">
                {retailerDisplayName} in {countryInfo.name}
              </h1>
              <p className="text-xs sm:text-sm text-[#65777F] mt-2 max-w-2xl leading-relaxed">
                Browse prices and live offers from {retailerDisplayName} in {countryInfo.name}. Purchases are completed directly on the retailer website.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2 self-start sm:self-auto text-xs font-bold">
              <div className="inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-[#F3F8F6] border border-[#D8E6E0] text-[#365148]">
                <SlidersHorizontal className="w-3.5 h-3.5 text-[#0B8F58]" /> {sorted.length} offer{sorted.length === 1 ? '' : 's'} verified
              </div>
              <div className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#EAF8F1] border border-[#C5EBDA] text-[#08784B]">
                <ShieldCheck className="w-4 h-4 text-[#0B8F58]" /> Direct Retailer Link
              </div>
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
            <AdSlot slotId="retailer-catalog-bottom" format="banner" />
          </>
        ) : (
          <div className="rounded-[28px] bg-white border border-[#DDE7E3] p-12 text-center max-w-md mx-auto my-8 shadow-sm">
            <Store className="w-12 h-12 text-[#9AABA4] mx-auto mb-3 stroke-[1.5]" />
            <h3 className="text-base font-extrabold text-[#102027]">No active offers from {retailerDisplayName}</h3>
            <p className="text-xs text-[#60727A] mt-1.5 leading-relaxed">
              We periodically check retailer feeds for updated stock and pricing. Check back soon or compare alternative retailers.
            </p>
            <div className="mt-5">
              <a
                href={`/${country}/search`}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#0B8F58] text-white text-xs font-bold hover:bg-[#08784B] transition-colors"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Browse all retailers</span>
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
