import React from 'react';
import { Metadata } from 'next';
import { CountryCode } from '@/lib/types';
import { COUNTRIES, DEFAULT_COUNTRY } from '@/lib/data/countries';
import { getTopDeals, getBiggestDrops, getTrendingProducts } from '@/lib/data/products';
import { Hero } from '@/components/home/Hero';
import { PriceDropFeed } from '@/components/home/PriceDropFeed';
import { CategoryGrid } from '@/components/home/CategoryGrid';
import { ProductCard } from '@/components/search/ProductCard';
import { AdSlot } from '@/components/common/AdSlot';
import { Flame, TrendingDown, Sparkles, ArrowRight, ShieldCheck } from 'lucide-react';

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
    title: `CatchThePrice ${info.name} — Track It. Catch the Drop. Pay Less.`,
    description: `Compare prices across verified electronics retailers in ${info.name}. Track real-time price drops on phones, laptops, PS5, TVs, and smartwatches.`,
    alternates: {
      canonical: `https://catchtheprice.com/${country}`,
      languages: {
        'en-AE': 'https://catchtheprice.com/ae',
        'en-US': 'https://catchtheprice.com/us',
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
  const countryInfo = COUNTRIES[country];

  const topDeals = getTopDeals(country, 4);
  const biggestDrops = getBiggestDrops(country, 4);
  const trending = getTrendingProducts(country, 4);

  return (
    <div className="min-h-screen">
      {/* 1. Hero with search and quick jump pills */}
      <Hero />

      {/* 2. Live Price Drop Ticker */}
      <PriceDropFeed />

      {/* 3. Section: Today's Top Deals */}
      <section id="top-deals" className="py-8 sm:py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-6">
          <div>
            <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-emerald-400">
              <Flame className="w-4 h-4" />
              <span>Highest Deal Scores</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-100 mt-1">
              Today&apos;s Top Deals in {countryInfo.name}
            </h2>
          </div>

          <a
            href={`/${country}/deals/all`}
            className="text-xs font-semibold text-emerald-400 hover:text-emerald-300 flex items-center gap-1"
          >
            <span>Explore All</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </a>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
          {topDeals.map((product) => (
            <ProductCard key={product.id} product={product} priority={true} />
          ))}
        </div>
      </section>

      {/* Ad Placement 1 */}
      <div className="max-w-4xl mx-auto px-4">
        <AdSlot slotId="home-after-top-deals" format="banner" />
      </div>

      {/* 4. Section: Biggest Price Drops */}
      <section id="price-drops" className="py-8 sm:py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-t border-ctp">
        <div className="flex items-end justify-between mb-6">
          <div>
            <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-cyan-400">
              <TrendingDown className="w-4 h-4" />
              <span>Deepest Discounts</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-100 mt-1">
              Biggest Price Drops
            </h2>
          </div>

          <a
            href={`/${country}/price-drops/all`}
            className="text-xs font-semibold text-cyan-400 hover:text-cyan-300 flex items-center gap-1"
          >
            <span>View All Drops</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </a>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
          {biggestDrops.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* 5. Browse Categories */}
      <div className="border-t border-ctp">
        <CategoryGrid />
      </div>

      {/* 6. Section: Trending Products */}
      <section className="py-8 sm:py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-t border-ctp">
        <div className="flex items-end justify-between mb-6">
          <div>
            <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-amber-400">
              <Sparkles className="w-4 h-4" />
              <span>Most Tracked Right Now</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-100 mt-1">Trending Electronics</h2>
          </div>

          <a
            href={`/${country}/search?sort=trending`}
            className="text-xs font-semibold text-emerald-400 hover:text-emerald-300 flex items-center gap-1"
          >
            <span>See All Trending</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </a>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
          {trending.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* 7. Value & Safety Banner */}
      <section className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-t border-ctp">
        <div className="rounded-3xl bg-gradient-to-r from-emerald-950/30 via-ctp-surface to-cyan-950/30 border border-ctp p-6 sm:p-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="max-w-xl">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
              Never Miss A Drop Again
            </span>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-100 mt-1">
              Track It. Catch the Drop. Pay Less.
            </h3>
            <p className="mt-2 text-xs sm:text-sm text-slate-300 leading-relaxed">
              Add any phone, laptop, console, or TV to your watchlist. Our crawler scans verified stores continuously and pings you the moment price plummets.
            </p>
          </div>

          <a
            href={`/${country}/account?tab=alerts`}
            className="px-6 py-3.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-sm shadow-xl shadow-emerald-500/20 transition-all touch-target shrink-0 flex items-center gap-2"
          >
            <span>Open Price Watchlist</span>
            <ArrowRight className="w-4 h-4" />
          </a>
        </div>
      </section>
    </div>
  );
}
