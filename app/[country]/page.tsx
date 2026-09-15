import React from 'react';
import { Metadata } from 'next';
import { CountryCode } from '@/lib/types';
import { COUNTRIES, DEFAULT_COUNTRY } from '@/lib/data/countries';
import { getTopDeals, getBiggestDrops, getTrendingProducts } from '@/lib/data/products';
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
      },
    },
  };
}

export default async function HomePage({ params }: HomePageProps) {
  const { country: rawCountry } = await params;
  const country = (rawCountry?.toLowerCase() in COUNTRIES ? rawCountry.toLowerCase() : DEFAULT_COUNTRY) as CountryCode;

  const topDeals = getTopDeals(country, 4);
  const biggestDrops = getBiggestDrops(country, 4);
  const trending = getTrendingProducts(country, 4);

  return (
    <div className="min-h-screen bg-[#071015]">
      <Hero />

      <BestDealsSection products={topDeals} />

      <DiscoveryHubSection />

      <div className="max-w-5xl mx-auto px-4">
        <AdSlot slotId="home-after-deals" format="banner" />
      </div>

      <BiggestPriceDropsSection products={biggestDrops} />

      <CategoryGrid />

      <TrendingSection products={trending} />

      <PriceIntelligenceSection />

      <CountrySection />

      <RecentlyDroppedSection />

      <PriceAlertCTASection />
    </div>
  );
}
