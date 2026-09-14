'use client';

import React, { useState } from 'react';
import { Product } from '@/lib/types';
import { useCountry } from '@/context/CountryContext';
import { DealScoreBadge } from '@/components/product/DealScoreBadge';
import { MerchantOffersList } from '@/components/product/MerchantOffersList';
import { PriceHistoryChart } from '@/components/product/PriceHistoryChart';
import { AIBuyingSummary } from '@/components/product/AIBuyingSummary';
import { ProductSpecs } from '@/components/product/ProductSpecs';
import { PriceAlertModal } from '@/components/product/PriceAlertModal';
import { ProductCard } from '@/components/search/ProductCard';
import { AdSlot } from '@/components/common/AdSlot';
import {
  Bell,
  ExternalLink,
  Bookmark,
  Share2,
  TrendingDown,
  ShieldCheck,
  Store,
  CheckCircle,
  ArrowRight,
  ChevronRight,
} from 'lucide-react';

interface ProductClientPageProps {
  product: Product;
  relatedProducts: Product[];
}

export function ProductClientPage({ product, relatedProducts }: ProductClientPageProps) {
  const { formatLocalPrice, toggleSaveProduct, isProductSaved, country, countryInfo } = useCountry();
  const [selectedImage, setSelectedImage] = useState(product.imageUrl);
  const [isAlertModalOpen, setIsAlertModalOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const saved = isProductSaved(product.id);
  const discountAmount = product.originalPrice - product.currentBestPrice;
  const discountPercent = Math.round((discountAmount / product.originalPrice) * 100);

  const bestOffer = product.offers[0];

  const handleShare = () => {
    if (typeof navigator !== 'undefined' && navigator.share) {
      navigator.share({
        title: product.title,
        text: `Catch this drop on ${product.title}: now ${formatLocalPrice(product.currentBestPrice)}!`,
        url: window.location.href,
      }).catch(() => {});
    } else if (typeof navigator !== 'undefined') {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const outboundBestDealHref = bestOffer
    ? `/api/outbound?offerId=${encodeURIComponent(bestOffer.id)}&country=${country}&targetUrl=${encodeURIComponent(
        bestOffer.url
      )}&productTitle=${encodeURIComponent(product.title)}&merchantName=${encodeURIComponent(
        bestOffer.merchantName
      )}&price=${bestOffer.price}`
    : '#offers';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8 space-y-8">
      {/* Breadcrumb Bar */}
      <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs text-slate-400 overflow-x-auto whitespace-nowrap py-1">
        <a href={`/${country}`} className="hover:text-white transition-colors">
          Home
        </a>
        <ChevronRight className="w-3.5 h-3.5 text-slate-500 shrink-0" />
        <a href={`/${country}/deals/${product.categorySlug}`} className="hover:text-white transition-colors">
          {product.categoryName}
        </a>
        <ChevronRight className="w-3.5 h-3.5 text-slate-500 shrink-0" />
        <span className="text-slate-300 font-medium truncate max-w-xs">{product.brand}</span>
      </nav>

      {/* =========================================================================
          ABOVE THE FOLD SECTION (CRITICAL MOBILE-FIRST REQUIREMENT)
          Product Image, Title, Best Price, Previous Price, % Saved, Deal Score,
          Track Price CTA, View Best Deal CTA
          ========================================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10 items-start">
        {/* Gallery / Image Column */}
        <div className="lg:col-span-5 flex flex-col gap-3">
          <div className="relative aspect-square w-full rounded-3xl bg-ctp-surface border border-ctp p-6 flex items-center justify-center overflow-hidden shadow-2xl">
            {/* Percentage drop badge */}
            {discountPercent > 0 && (
              <div className="absolute top-3 left-3 flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-extrabold bg-emerald-500 text-slate-950 shadow-md z-10">
                <TrendingDown className="w-3.5 h-3.5 stroke-[2.5]" />
                <span>Save {discountPercent}%</span>
              </div>
            )}

            {/* Save & Share actions */}
            <div className="absolute top-3 right-3 flex items-center gap-2 z-10">
              <button
                type="button"
                onClick={handleShare}
                className="p-2.5 rounded-xl bg-slate-900/80 backdrop-blur-md border border-ctp text-slate-300 hover:text-white touch-target flex items-center justify-center transition-colors"
                aria-label="Share product"
              >
                <Share2 className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => toggleSaveProduct(product.id)}
                className={`p-2.5 rounded-xl backdrop-blur-md border border-ctp touch-target flex items-center justify-center transition-all ${
                  saved
                    ? 'bg-emerald-500 text-slate-950 shadow-md border-emerald-400'
                    : 'bg-slate-900/80 text-slate-300 hover:text-white'
                }`}
                aria-label={saved ? 'Remove from saved' : 'Save product'}
              >
                <Bookmark className={`w-4 h-4 ${saved ? 'fill-slate-950' : ''}`} />
              </button>
            </div>

            {/* Selected Image */}
            <img
              src={selectedImage}
              alt={product.title}
              className="max-h-full max-w-full object-contain transition-transform duration-300 hover:scale-105"
            />
          </div>

          {/* Thumbnails row */}
          {product.gallery.length > 1 && (
            <div className="flex items-center gap-2.5 overflow-x-auto pb-1">
              {product.gallery.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(img)}
                  className={`w-16 h-16 rounded-xl bg-ctp-surface border p-1.5 shrink-0 transition-all ${
                    selectedImage === img
                      ? 'border-emerald-500 ring-2 ring-emerald-500/30'
                      : 'border-ctp hover:border-ctp-border-bright'
                  }`}
                >
                  <img src={img} alt="" className="w-full h-full object-contain" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Details & Above-the-fold Actions */}
        <div className="lg:col-span-7 flex flex-col justify-between space-y-6">
          <div>
            {/* Brand and category pills */}
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                {product.brand}
              </span>
              <span className="text-xs text-slate-400">•</span>
              <span className="text-xs text-slate-400">{product.categoryName}</span>
              <span className="text-xs text-slate-400">•</span>
              <span className="text-xs text-slate-400 flex items-center gap-1">
                <Store className="w-3 h-3 text-emerald-400" />
                {product.offersCount} verified retailers
              </span>
            </div>

            {/* Product Title */}
            <h1 className="text-xl sm:text-3xl font-extrabold text-slate-100 leading-tight">
              {product.title}
            </h1>

            {/* Description excerpt */}
            <p className="mt-2 text-xs sm:text-sm text-slate-300 leading-relaxed">
              {product.description}
            </p>
          </div>

          {/* Price & Savings Box */}
          <div className="p-4 sm:p-5 rounded-2xl bg-ctp-surface border border-ctp space-y-3">
            <div className="flex flex-wrap items-baseline justify-between gap-3">
              <div>
                <span className="text-xs text-slate-400 block mb-0.5">Best Current Price</span>
                <div className="flex items-baseline gap-2.5">
                  <span className="text-2xl sm:text-4xl font-extrabold text-emerald-400">
                    {formatLocalPrice(product.currentBestPrice)}
                  </span>
                  {product.originalPrice > product.currentBestPrice && (
                    <span className="text-sm sm:text-base text-slate-400 line-through font-medium">
                      {formatLocalPrice(product.originalPrice)}
                    </span>
                  )}
                </div>
              </div>

              {discountAmount > 0 && (
                <div className="text-right">
                  <span className="text-xs text-emerald-400 font-bold block">
                    You save {formatLocalPrice(discountAmount)} ({discountPercent}%)
                  </span>
                  <span className="text-[11px] text-slate-400">
                    Lowest in 90 days
                  </span>
                </div>
              )}
            </div>

            {/* Deal Score Widget */}
            <div className="pt-2 border-t border-ctp">
              <DealScoreBadge
                score={product.dealScore}
                currentPrice={product.currentBestPrice}
                originalPrice={product.originalPrice}
                lowestPrice={product.priceStats.lowestPrice}
                average90Days={product.priceStats.average90Days}
                size="lg"
                showDetails={true}
              />
            </div>

            {/* Primary Action Buttons (View Best Deal + Track Price) */}
            <div className="pt-2 grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* View Best Deal Button */}
              <a
                href={outboundBestDealHref}
                target="_blank"
                rel="noopener noreferrer"
                className="py-3.5 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold text-sm sm:text-base transition-all shadow-xl shadow-emerald-500/25 flex items-center justify-center gap-2 touch-target"
              >
                <span>View Best Deal on {product.bestMerchantName.split(' ')[0]}</span>
                <ExternalLink className="w-4 h-4" />
              </a>

              {/* Track Price Button */}
              <button
                type="button"
                onClick={() => setIsAlertModalOpen(true)}
                className="py-3.5 px-4 rounded-xl bg-ctp-surface-elevated hover:bg-slate-800 text-slate-100 border border-ctp-border-bright hover:border-emerald-500/50 font-bold text-sm sm:text-base transition-all flex items-center justify-center gap-2 touch-target"
              >
                <Bell className="w-4 h-4 text-emerald-400" />
                <span>Track Price Drops</span>
              </button>
            </div>

            {/* Retailer Direct Checkout Disclaimer */}
            <div className="pt-2 flex items-center gap-2 text-[11px] text-slate-400">
              <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>
                You&apos;ll complete your purchase directly on the retailer&apos;s verified website.
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* =========================================================================
          MERCHANT COMPARISON LIST
          ========================================================================= */}
      <div id="offers">
        <MerchantOffersList offers={product.offers} productTitle={product.title} />
      </div>

      {/* =========================================================================
          INTERACTIVE PRICE HISTORY CHART
          ========================================================================= */}
      <PriceHistoryChart
        history={product.priceHistory}
        stats={product.priceStats}
        productTitle={product.title}
      />

      {/* Non-intrusive Ad Placement */}
      <AdSlot slotId="product-page-middle" format="banner" />

      {/* =========================================================================
          AI BUYING SUMMARY & INSIGHTS
          ========================================================================= */}
      <AIBuyingSummary
        summary={product.aiSummary}
        productTitle={product.title}
        dealScore={product.dealScore}
      />

      {/* =========================================================================
          PRODUCT SPECIFICATIONS TABLE
          ========================================================================= */}
      <ProductSpecs specs={product.specs} brand={product.brand} />

      {/* =========================================================================
          RELATED PRODUCTS CAROUSEL
          ========================================================================= */}
      {relatedProducts.length > 0 && (
        <section className="pt-6 border-t border-ctp">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-bold text-lg text-slate-100">Related Products to Compare</h3>
              <p className="text-xs text-slate-400">Alternative models in {product.categoryName}</p>
            </div>

            <a
              href={`/${country}/deals/${product.categorySlug}`}
              className="text-xs font-semibold text-emerald-400 hover:text-emerald-300 flex items-center gap-1"
            >
              <span>Explore Category</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </a>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-6">
            {relatedProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}

      {/* Modal for Price Tracking */}
      <PriceAlertModal
        product={product}
        isOpen={isAlertModalOpen}
        onClose={() => setIsAlertModalOpen(false)}
      />
    </div>
  );
}
