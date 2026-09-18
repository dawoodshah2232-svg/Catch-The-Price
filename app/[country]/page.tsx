import React from 'react';
import { Metadata } from 'next';
import { CountryCode, Product } from '@/lib/types';
import { COUNTRIES, DEFAULT_COUNTRY } from '@/lib/data/countries';
import { getHomepageCatalog } from '@/lib/data/catalog.server';
import { Hero } from '@/components/home/Hero';
import { PromoBannerRow } from '@/components/home/PromoBannerRow';
import { BestDealsSection } from '@/components/home/BestDealsSection';
import { PopularBrandsSection } from '@/components/home/PopularBrandsSection';
import { CategoryGrid } from '@/components/home/CategoryGrid';
import { StorefrontExtensions } from '@/components/home/StorefrontExtensions';
import { NewsletterSignup } from '@/components/home/NewsletterSignup';

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
  const products = live.products;
  const isPreview = live.isPreview;

  return <div className="min-h-screen bg-[#f7f8f8]">
    {isPreview && <div className="max-w-[1600px] mx-auto px-3 sm:px-6 lg:px-8 pt-2"><div className="rounded-md border border-amber-300 bg-amber-50 px-3 py-2 text-[10px] text-amber-900">Preview listings are shown for interface testing until approved retailer feeds/API data are connected.</div></div>}
    <Hero />
    <CategoryGrid />
    <PromoBannerRow />
    <BestDealsSection products={live.topDeals} hasRealDeals={live.hasRealDeals} />
    <PopularBrandsSection products={products} />
    <StorefrontExtensions
      products={live.moreDeals}
      trending={live.trending}
      dropped={live.biggestDrops}
      hasRealDrops={live.hasRealDrops}
    />
    <NewsletterSignup />
  </div>;
}
