import React from 'react';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { CountryCode } from '@/lib/types';
import { COUNTRIES, DEFAULT_COUNTRY } from '@/lib/data/countries';
import { CATEGORIES, getCategoryBySlug } from '@/lib/data/categories';
import { getCatalogProducts } from '@/lib/data/catalog.server';
import { ProductCard } from '@/components/search/ProductCard';
import { AdSlot } from '@/components/common/AdSlot';
import { generateBreadcrumbsJsonLd, generateItemListJsonLd } from '@/lib/seo/schema';
import { Layers, ChevronRight, SlidersHorizontal, ArrowLeft } from 'lucide-react';

interface CategoryPageProps {
  params: Promise<{ country: string; slug: string }>;
}

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const { country: rawCountry, slug: catSlug } = await params;
  const country = (rawCountry?.toLowerCase() in COUNTRIES ? rawCountry.toLowerCase() : DEFAULT_COUNTRY) as CountryCode;
  const info = COUNTRIES[country];
  const cat = getCategoryBySlug(catSlug);

  if (!cat && catSlug !== 'all') {
    return {
      title: 'Category Not Found | CatchThePrice',
      robots: { index: false, follow: false },
    };
  }

  const catName = cat?.name || 'All Electronics';
  const { isPreview } = await getCatalogProducts(country);

  return {
    title: `${catName} Price Comparison & Deals in ${info.name} — CatchThePrice`,
    description: `Compare real-time retailer prices for ${catName} in ${info.name}. Track price history, find verified deals, and buy with confidence.`,
    robots: isPreview ? { index: false, follow: false } : undefined,
    alternates: { canonical: `https://catchtheprice.com/${country}/category/${catSlug}` },
    openGraph: {
      title: `${catName} Price Comparison in ${info.name}`,
      description: `Track real-time prices and verified deals across ${catName} in ${info.name}.`,
    },
  };
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { country: rawCountry, slug: catSlug } = await params;
  const country = (rawCountry?.toLowerCase() in COUNTRIES ? rawCountry.toLowerCase() : DEFAULT_COUNTRY) as CountryCode;
  const countryInfo = COUNTRIES[country];
  const isAll = catSlug === 'all';
  const category = getCategoryBySlug(catSlug);

  if (!isAll && !category) {
    notFound();
  }

  const { products: catalogProducts, isPreview } = await getCatalogProducts(country);
  const products = isAll
    ? catalogProducts
    : catalogProducts.filter((p) => p.categorySlug.toLowerCase() === catSlug.toLowerCase());

  const sorted = [...products].sort((a, b) => b.offersCount - a.offersCount || a.currentBestPrice - b.currentBestPrice);

  const breadcrumbsJsonLd = !isPreview
    ? generateBreadcrumbsJsonLd([
        { name: 'Home', url: `/${country}` },
        { name: 'Categories', url: `/${country}/category/all` },
        { name: category?.name || 'All Products', url: `/${country}/category/${catSlug}` },
      ])
    : null;

  const itemListJsonLd = !isPreview
    ? generateItemListJsonLd({
        name: `${category?.name || 'All'} in ${countryInfo.name}`,
        description: category?.description,
        url: `/${country}/category/${catSlug}`,
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
          <span>Categories</span>
          <ChevronRight className="w-3.5 h-3.5 text-[#A0AEA9]" />
          <span className="text-[#08784B] font-bold">{category?.name || 'All Categories'}</span>
        </nav>

        {/* Hero Header */}
        <section className="rounded-[28px] bg-white border border-[#DDE7E3] p-5 sm:p-7 shadow-[0_12px_34px_rgba(24,52,43,0.06)]">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-[10px] sm:text-xs font-extrabold uppercase tracking-[0.16em] text-[#0B8F58]">
                <Layers className="w-4 h-4" /> Category Catalog
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-[#102027] mt-2">
                {category ? category.name : 'All Product Categories'} in {countryInfo.name}
              </h1>
              <p className="text-xs sm:text-sm text-[#65777F] mt-2 max-w-2xl leading-relaxed">
                {category?.description || 'Explore verified price intelligence and compare live retailer offers across all registered consumer electronics categories.'}
              </p>
            </div>
            <div className="self-start sm:self-auto inline-flex items-center gap-2 text-xs px-3 py-2 rounded-xl bg-[#F3F8F6] border border-[#D8E6E0] text-[#365148] font-bold">
              <SlidersHorizontal className="w-3.5 h-3.5 text-[#0B8F58]" /> {sorted.length} tracked product{sorted.length === 1 ? '' : 's'}
            </div>
          </div>
        </section>

        {/* Category Pills Navigation */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          <a
            href={`/${country}/category/all`}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap border transition-all ${
              isAll
                ? 'bg-[#0B8F58] text-white border-[#0B8F58]'
                : 'bg-white border-[#DDE7E3] text-[#52636B] hover:border-[#BFD2CA]'
            }`}
          >
            All Categories
          </a>
          {CATEGORIES.map((item) => {
            const active = item.slug === catSlug;
            return (
              <a
                key={item.id}
                href={`/${country}/category/${item.slug}`}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap border transition-all ${
                  active
                    ? 'bg-[#0B8F58] text-white border-[#0B8F58]'
                    : 'bg-white border-[#DDE7E3] text-[#52636B] hover:border-[#BFD2CA]'
                }`}
              >
                {item.name}
              </a>
            );
          })}
        </div>

        {/* Product Grid or Honest Empty State */}
        {sorted.length > 0 ? (
          <>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2.5 sm:gap-5 pt-1">
              {sorted.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
            <AdSlot slotId="category-catalog-bottom" format="banner" />
          </>
        ) : (
          <div className="rounded-[28px] bg-white border border-[#DDE7E3] p-12 text-center max-w-md mx-auto my-8 shadow-sm">
            <Layers className="w-12 h-12 text-[#9AABA4] mx-auto mb-3 stroke-[1.5]" />
            <h3 className="text-base font-extrabold text-[#102027]">No tracked products in this category yet</h3>
            <p className="text-xs text-[#60727A] mt-1.5 leading-relaxed">
              We only display verified products with live retailer offers. More items will appear as feeds are ingested.
            </p>
            <div className="mt-5">
              <a
                href={`/${country}/deals/all`}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#0B8F58] text-white text-xs font-bold hover:bg-[#08784B] transition-colors"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Explore all active deals</span>
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
