import React from 'react';
import { Metadata } from 'next';
import { CountryCode } from '@/lib/types';
import { COUNTRIES, DEFAULT_COUNTRY } from '@/lib/data/countries';
import { getHomepageCatalog, isPreviewCatalogEnabled } from '@/lib/data/catalog.server';
import { Hero } from '@/components/home/Hero';
import { BestDealsSection } from '@/components/home/BestDealsSection';
import { SmartComparisonBlock } from '@/components/home/SmartComparisonBlock';
import { BiggestPriceDropsSection } from '@/components/home/BiggestPriceDropsSection';
import { CategoryGrid } from '@/components/home/CategoryGrid';
import { BuyingInsightBlock } from '@/components/home/BuyingInsightBlock';
import { TrendingSection } from '@/components/home/TrendingSection';
import { PriceIntelligenceSection } from '@/components/home/PriceIntelligenceSection';
import { TrustPillarsBlock } from '@/components/home/TrustPillarsBlock';
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
        'en-SA': 'https://catchtheprice.com/sa',
        'en-GB': 'https://catchtheprice.com/uk',
        'en-CA': 'https://catchtheprice.com/ca',
        'en-AU': 'https://catchtheprice.com/au',
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

      {/* 2. Flagship Smart Comparison Block (Breaks repetitive card grid) */}
      <SmartComparisonBlock />

      {/* 3. Biggest Price Drops */}
      <BiggestPriceDropsSection products={biggestDrops} />

      {/* Reserved Ad Slot between primary sections */}
      <div className="max-w-5xl mx-auto px-4">
        <AdSlot slotId="home-after-deals" format="banner" />
      </div>

      {/* 4. Browse Categories */}
      <CategoryGrid />

      {/* 5. Buying Insight: How Deal Score Cuts Fake Discounts */}
      <BuyingInsightBlock />

      {/* 6. Trending Now */}
      <TrendingSection products={trending} />

      {/* 7. Price Intelligence (Compare -> Track -> Catch) */}
      <PriceIntelligenceSection />

      {/* 8. The CatchThePrice Trust Pillars */}
      <TrustPillarsBlock />

      {/* 9. Global Market Coverage */}
      <CountrySection />

      {/* 10. Recently Dropped Prices */}
      <RecentlyDroppedSection />

      {/* 11. Price Alert CTA */}
      <PriceAlertCTASection />
    </div>
  );
}
