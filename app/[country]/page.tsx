import React from 'react';
import { Metadata } from 'next';
import { CountryCode } from '@/lib/types';
import { COUNTRIES, DEFAULT_COUNTRY } from '@/lib/data/countries';
import { getHomepageCatalog } from '@/lib/data/catalog.server';
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
import { AdSlot } from '@/components/common/AdSlot';

interface HomePageProps {
  params: Promise<{
    country: string;
  }>;
}

export async function generateMetadata({ params }: HomePageProps): Promise<Metadata> {
  const { country: rawCountry } = await params;
  const country = (rawCountry?.toLowerCase() in COUNTRIES ? rawCountry.toLowerCase() : DEFAULT_COUNTRY) as CountryCode;
  const info = COUNTRIES[country];

  return {
    title: `CatchThePrice ${info.name} — TRACK IT. CATCH THE DROP. PAY LESS.`,
    description: `Smarter Shopping for a Brighter Tomorrow. Compare prices across trusted stores in ${info.name}, track price drops and buy when the price is right.`,
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
  const { topDeals, biggestDrops, trending, isPreview } = await getHomepageCatalog(country);

  return (
    <div className="min-h-screen ui-page">
      {isPreview && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-3">
          <div className="rounded-xl border border-amber-300 bg-amber-50 px-4 py-2.5 text-xs text-amber-900">
            Development preview: sample catalog content is shown for interface testing only.
          </div>
        </div>
      )}

      <Hero />
      <BestDealsSection products={topDeals} />
      <SmartComparisonBlock />
      <BiggestPriceDropsSection products={biggestDrops} />

      <div className="max-w-5xl mx-auto px-4">
        <AdSlot slotId="home-after-deals" format="banner" />
      </div>

      <CategoryGrid />
      <BuyingInsightBlock />
      <TrendingSection products={trending} />
      <PriceIntelligenceSection />
      <TrustPillarsBlock />
      <CountrySection />
      <RecentlyDroppedSection />
      <PriceAlertCTASection />
    </div>
  );
}
