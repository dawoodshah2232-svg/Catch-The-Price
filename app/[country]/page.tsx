import React from 'react';
import { Metadata } from 'next';
import { CountryCode } from '@/lib/types';
import { COUNTRIES, DEFAULT_COUNTRY } from '@/lib/data/countries';
import { getHomepageCatalog, isPreviewCatalogEnabled } from '@/lib/data/catalog.server';
import { Hero } from '@/components/home/Hero';
import { BestDealsSection } from '@/components/home/BestDealsSection';
import { BiggestPriceDropsSection } from '@/components/home/BiggestPriceDropsSection';
import { CategoryGrid } from '@/components/home/CategoryGrid';
import { TrendingSection } from '@/components/home/TrendingSection';
import { PriceIntelligenceSection } from '@/components/home/PriceIntelligenceSection';
import { CountrySection } from '@/components/home/CountrySection';
import { RecentlyDroppedSection } from '@/components/home/RecentlyDroppedSection';
import { PriceAlertCTASection } from '@/components/home/PriceAlertCTASection';
import { DiscoveryHubSection } from '@/components/home/DiscoveryHubSection';
import { AdSlot } from '@/components/common/AdSlot';

interface HomePageProps {
  params: Promise<{ country: string }>;
}

export async function generateMetadata({ params }: HomePageProps): Promise<Metadata> {
  const { country: rawCountry } = await params;
  const country = (rawCountry?.toLowerCase() in COUNTRIES ? rawCountry.toLowerCase() : DEFAULT_COUNTRY) as CountryCode;
  const info = COUNTRIES[country];
  const isPreview = isPreviewCatalogEnabled();

  return {
    title: `CatchThePrice ${info.name} — TRACK IT. CATCH THE DROP. PAY LESS.`,
    description: `Smarter Shopping for a Brighter Tomorrow. Compare prices across trusted stores in ${info.name}, track price drops and buy when the price is right.`,
    robots: isPreview ? { index: false, follow: false } : undefined,
    alternates: {
      canonical: `https://catchtheprice.com/${country}`,
      languages: {
        'en-AE': 'https://catchtheprice.com/ae',
        'en-US': 'https://catchtheprice.com/us',
      },
    },
  };
}

export default async function HomePage({ params }: HomePageProps) {
  const { country: rawCountry } = await params;
  const country = (rawCountry?.toLowerCase() in COUNTRIES ? rawCountry.toLowerCase() : DEFAULT_COUNTRY) as CountryCode;
  const { products, topDeals, biggestDrops, trending, isPreview } = await getHomepageCatalog(country);
  const hasLiveOrPreviewCatalog = products.length > 0;

  return (
    <div className="min-h-screen bg-[#F4F7F6]">
      {isPreview && (
        <div className="border-b border-amber-300 bg-amber-50 px-4 py-2 text-center text-[11px] sm:text-xs font-semibold text-amber-900">
          Development preview: product prices, retailer offers and history on this Vercel build are sample data for UI testing only.
        </div>
      )}

      <Hero />

      {hasLiveOrPreviewCatalog ? (
        <>
          <BestDealsSection products={topDeals} />
          <DiscoveryHubSection />

          <div className="max-w-5xl mx-auto px-4 py-2">
            <AdSlot slotId="home-after-deals" format="banner" />
          </div>

          {biggestDrops.length > 0 && <BiggestPriceDropsSection products={biggestDrops} />}
          <CategoryGrid />
          {trending.length > 0 && <TrendingSection products={trending} />}
          <PriceIntelligenceSection />
          <CountrySection />
          <RecentlyDroppedSection />
          <PriceAlertCTASection />
        </>
      ) : (
        <>
          <section className="max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
            <div className="rounded-3xl border border-[#DDE7E3] bg-white p-6 sm:p-8 text-center shadow-[0_8px_28px_rgba(25,55,45,0.06)]">
              <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#008D56]">Catalog setup in progress</p>
              <h2 className="mt-2 text-xl sm:text-2xl font-extrabold text-[#102027]">Live retailer data is being connected.</h2>
              <p className="mt-2 text-sm text-[#52636B] max-w-2xl mx-auto leading-relaxed">
                CatchThePrice will only publish products when the exact variant, retailer destination, current price and source rights are verified. We do not generate placeholder prices on the production site.
              </p>
            </div>
          </section>
          <DiscoveryHubSection />
          <CategoryGrid />
          <CountrySection />
        </>
      )}
    </div>
  );
}
