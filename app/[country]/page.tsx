import React from 'react';
import { Metadata } from 'next';
import { CountryCode } from '@/lib/types';
import { COUNTRIES, DEFAULT_COUNTRY } from '@/lib/data/countries';
import { getHomepageCatalog } from '@/lib/data/catalog.server';
import { Hero } from '@/components/home/Hero';
import { PromoBannerRow } from '@/components/home/PromoBannerRow';
import { BestDealsSection } from '@/components/home/BestDealsSection';
import { PopularBrandsSection } from '@/components/home/PopularBrandsSection';
import { RecentlyViewedSection } from '@/components/home/RecentlyViewedSection';
import { BiggestPriceDropsSection } from '@/components/home/BiggestPriceDropsSection';
import { CategoryGrid } from '@/components/home/CategoryGrid';
import { TrendingSection } from '@/components/home/TrendingSection';
import { RecentlyDroppedSection } from '@/components/home/RecentlyDroppedSection';
import { PriceAlertCTASection } from '@/components/home/PriceAlertCTASection';
import { AdSlot } from '@/components/common/AdSlot';

interface HomePageProps { params: Promise<{ country: string; }>; }

export async function generateMetadata({ params }: HomePageProps): Promise<Metadata> {
  const { country: rawCountry } = await params;
  const country = (rawCountry?.toLowerCase() in COUNTRIES ? rawCountry.toLowerCase() : DEFAULT_COUNTRY) as CountryCode;
  const info = COUNTRIES[country];
  return {
    title: `CatchThePrice ${info.name} — TRACK IT. CATCH THE DROP. PAY LESS.`,
    description: `Compare prices across available stores in ${info.name}, track price drops and buy when the price is right.`,
    alternates: { canonical: `https://catchtheprice.com/${country}`, languages: { 'en-AE': 'https://catchtheprice.com/ae', 'en-US': 'https://catchtheprice.com/us' } },
  };
}

export default async function HomePage({ params }: HomePageProps) {
  const { country: rawCountry } = await params;
  const country = (rawCountry?.toLowerCase() in COUNTRIES ? rawCountry.toLowerCase() : DEFAULT_COUNTRY) as CountryCode;
  const { products, topDeals, biggestDrops, trending, isPreview } = await getHomepageCatalog(country);
  const earlyProductIds = new Set([...topDeals, ...biggestDrops].map(item => item.id));
  const uniqueTrending = trending.filter(item => !earlyProductIds.has(item.id)).slice(0, 8);

  return <div className="min-h-screen bg-[#f7f8f8]">
    {isPreview && <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 pt-2"><div className="rounded-md border border-amber-300 bg-amber-50 px-3 py-2 text-[10px] text-amber-900">Preview catalog — sample content is shown for interface testing.</div></div>}
    <Hero />
    <CategoryGrid />
    <PromoBannerRow />
    <BestDealsSection products={topDeals} />
    <PopularBrandsSection products={products} />
    <BiggestPriceDropsSection products={biggestDrops} />
    <TrendingSection products={uniqueTrending} />
    <RecentlyDroppedSection products={products} />
    <RecentlyViewedSection />
    <div className="max-w-5xl mx-auto px-4 py-3"><AdSlot slotId="home-after-products" format="banner" /></div>
    <PriceAlertCTASection />
  </div>;
}
