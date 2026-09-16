import React from 'react';
import { Metadata } from 'next';
import { CountryCode, Product } from '@/lib/types';
import { COUNTRIES, DEFAULT_COUNTRY } from '@/lib/data/countries';
import { getHomepageCatalog } from '@/lib/data/catalog.server';
import { getAllProducts } from '@/lib/data/products';
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

function dropPercent(product: Product) {
  if (!product.originalPrice || product.originalPrice <= product.currentBestPrice) return 0;
  return (product.originalPrice - product.currentBestPrice) / product.originalPrice;
}

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
  const live = await getHomepageCatalog(country);
  const usingPreviewFallback = live.products.length === 0;
  const products = usingPreviewFallback ? getAllProducts(country) : live.products;
  const topDeals = usingPreviewFallback ? [...products].sort((a,b) => dropPercent(b)-dropPercent(a)).slice(0,6) : live.topDeals;
  const biggestDrops = usingPreviewFallback ? [...products].sort((a,b) => dropPercent(b)-dropPercent(a)).slice(6,12) : live.biggestDrops;
  const trending = usingPreviewFallback ? products.filter(item => item.isTrending).slice(0,8) : live.trending;
  const isPreview = live.isPreview || usingPreviewFallback;
  const earlyProductIds = new Set([...topDeals, ...biggestDrops].map(item => item.id));
  const uniqueTrending = trending.filter(item => !earlyProductIds.has(item.id)).slice(0, 8);

  return <div className="min-h-screen bg-[#f7f8f8]">
    {isPreview && <div className="max-w-[1600px] mx-auto px-3 sm:px-6 lg:px-8 pt-2"><div className="rounded-md border border-amber-300 bg-amber-50 px-3 py-2 text-[10px] text-amber-900">Preview listings are shown for interface testing until approved retailer feeds/API data are connected.</div></div>}
    <Hero />
    <CategoryGrid />
    <PromoBannerRow />
    <BestDealsSection products={topDeals} />
    <PopularBrandsSection products={products} />
    <BiggestPriceDropsSection products={biggestDrops} />
    <TrendingSection products={uniqueTrending.length ? uniqueTrending : products.slice(0,8)} />
    <RecentlyDroppedSection products={products} />
    <RecentlyViewedSection />
    <div className="max-w-5xl mx-auto px-4 py-3"><AdSlot slotId="home-after-products" format="banner" /></div>
    <PriceAlertCTASection />
  </div>;
}
