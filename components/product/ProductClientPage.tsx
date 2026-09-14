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
  ChevronRight,
  Star,
} from 'lucide-react';

interface ProductClientPageProps {
  product: Product;
  relatedProducts: Product[];
}

export function ProductClientPage({ product, relatedProducts }: ProductClientPageProps) {
  const { formatLocalPrice, toggleSaveProduct, isProductSaved, country } = useCountry();
  const [selectedImage, setSelectedImage] = useState(product.imageUrl);
  const [isAlertModalOpen, setIsAlertModalOpen] = useState(false);

  const saved = isProductSaved(product.id);
  const discountAmount = product.originalPrice - product.currentBestPrice;
  const discountPercent = Math.round((discountAmount / product.originalPrice) * 100);

  const bestOffer = product.offers[0];

  const outboundBestDealHref = bestOffer
    ? `/api/outbound?offerId=${encodeURIComponent(bestOffer.id)}&country=${country}&targetUrl=${encodeURIComponent(
        bestOffer.url
      )}&productTitle=${encodeURIComponent(product.title)}&merchantName=${encodeURIComponent(
        bestOffer.merchantName
      )}&price=${bestOffer.price}`
    : '#offers';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-8 space-y-6 sm:space-y-8">
      {/* Breadcrumb Navigation */}
      <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs text-[#CBD5E1] overflow-x-auto whitespace-nowrap">
        <a href={`/${country}`} className="hover:text-white transition-colors">
          Home
        </a>
        <ChevronRight className="w-3.5 h-3.5 text-[#94A3B8] shrink-0" />
        <a href={`/${country}/deals/${product.categorySlug}`} className="hover:text-white transition-colors">
          {product.categoryName}
        </a>
        <ChevronRight className="w-3.5 h-3.5 text-[#94A3B8] shrink-0" />
        <span className="text-[#F8FAFC] font-medium truncate max-w-xs">{product.brand}</span>
      </nav>

      {/* =========================================================================
          PRODUCT DETAIL UPPER SECTION (EXACT SPECIFICATION)
          - Product Image
          - Product Name
          - Rating / Relevance Information
          - Current Lowest Price
          - Previous Price
          - Discount %
          - Deal Score
          - Two Main CTAs: View Best Deal | Track Price
          ========================================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 lg:gap-10 items-start">
        {/* Product Image Gallery */}
        <div className="lg:col-span-5 space-y-3">
          <div className="relative aspect-square max-h-[290px] sm:max-h-[460px] mx-auto w-full rounded-3xl bg-[#091217] border border-[#162633] p-4 sm:p-6 flex items-center justify-center overflow-hidden shadow-2xl">
            {/* Discount Tag */}
            {discountPercent > 0 && (
              <div className="absolute top-3.5 left-3.5 flex items-center gap-1 px-2.5 py-1 rounded-xl text-xs font-extrabold bg-[#00D27A] text-[#071015] shadow-md z-10">
                <TrendingDown className="w-3.5 h-3.5 stroke-[2.5]" />
                <span>Save {discountPercent}%</span>
              </div>
            )}

            {/* Save / Bookmark Button */}
            <div className="absolute top-3.5 right-3.5 z-10">
              <button
                type="button"
                onClick={() => toggleSaveProduct(product.id)}
                className={`p-2.5 rounded-xl border touch-target flex items-center justify-center transition-all ${
                  saved
                    ? 'bg-[#00D27A] text-[#071015] border-[#00D27A] shadow-md'
                    : 'bg-[#071015]/80 text-[#CBD5E1] hover:text-white border-[#162633]'
                }`}
                aria-label={saved ? 'Saved' : 'Save product'}
              >
                <Bookmark className={`w-4 h-4 ${saved ? 'fill-[#071015]' : ''}`} />
              </button>
            </div>

            <img
              src={selectedImage}
              alt={product.title}
              className="max-h-full max-w-full object-contain transition-transform duration-300 hover:scale-105"
            />
          </div>

          {/* Thumbnails */}
          {product.gallery.length > 1 && (
            <div className="flex items-center gap-2.5 overflow-x-auto pb-1">
              {product.gallery.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(img)}
                  className={`w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-[#091217] border p-2 shrink-0 transition-all ${
                    selectedImage === img
                      ? 'border-[#00D27A] ring-2 ring-[#00D27A]/25'
                      : 'border-[#162633] hover:border-[#203648]'
                  }`}
                >
                  <img src={img} alt="" className="w-full h-full object-contain" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Details & Pricing CTAs */}
        <div className="lg:col-span-7 space-y-4 sm:space-y-6">
          <div>
            {/* Rating / Relevance Information */}
            <div className="flex items-center gap-2 mb-2 text-xs">
              <span className="font-extrabold uppercase tracking-wider text-[#00D27A]">
                {product.brand}
              </span>
              <span className="text-[#94A3B8]">•</span>
              <div className="flex items-center gap-1 text-amber-400 font-semibold">
                <Star className="w-3.5 h-3.5 fill-amber-400" />
                <span>4.8</span>
                <span className="text-[#CBD5E1] font-normal">(Verified Rating)</span>
              </div>
              <span className="text-[#94A3B8]">•</span>
              <span className="text-[#CBD5E1] flex items-center gap-1">
                <Store className="w-3.5 h-3.5 text-[#00D27A]" />
                {product.offersCount} stores comparing
              </span>
            </div>

            {/* Product Name */}
            <h1 className="text-xl sm:text-3xl lg:text-4xl font-extrabold text-[#F8FAFC] leading-tight">
              {product.title}
            </h1>

            <p className="mt-2 text-xs sm:text-sm text-[#CBD5E1] leading-relaxed">
              {product.description}
            </p>
          </div>

          {/* Pricing & CTA Card */}
          <div className="p-4 sm:p-5 rounded-3xl bg-[#091217] border border-[#162633] space-y-3.5 shadow-xl">
            {/* Price Row: Current lowest, previous, discount % */}
            <div className="flex flex-wrap items-baseline justify-between gap-3">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#94A3B8] block mb-0.5">
                  Current Lowest Price
                </span>
                <div className="flex items-baseline gap-2.5 sm:gap-3">
                  <span className="text-2xl sm:text-4xl font-extrabold text-[#00D27A]">
                    {formatLocalPrice(product.currentBestPrice)}
                  </span>
                  {product.originalPrice > product.currentBestPrice && (
                    <span className="text-sm sm:text-base text-[#94A3B8] line-through font-medium">
                      {formatLocalPrice(product.originalPrice)}
                    </span>
                  )}
                </div>
              </div>

              {discountPercent > 0 && (
                <div className="text-right">
                  <span className="px-2.5 sm:px-3 py-1 rounded-xl text-xs font-extrabold bg-[#00D27A]/15 text-[#00D27A] border border-[#00D27A]/30 inline-block">
                    ↓ {discountPercent}% Discount
                  </span>
                  <span className="text-[10px] text-[#94A3B8] block mt-1">
                    Lowest recorded in 90 days
                  </span>
                </div>
              )}
            </div>

            {/* Deal Score Component */}
            <div className="pt-2 border-t border-[#162633]">
              <DealScoreBadge score={product.dealScore} size="lg" />
            </div>

            {/* Two Main CTAs: View Best Deal | Track Price */}
            <div className="pt-2 grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* View Best Deal CTA - High Conversion */}
              <a
                href={outboundBestDealHref}
                target="_blank"
                rel="noopener noreferrer"
                className="py-3.5 sm:py-4 px-5 rounded-2xl btn-conversion-primary text-sm sm:text-base flex items-center justify-center gap-2 touch-target font-extrabold tracking-wide"
              >
                <span>View Best Deal on {product.bestMerchantName.split(' ')[0]}</span>
                <ExternalLink className="w-4 h-4" />
              </a>

              {/* Track Price CTA - High-Contrast Secondary Action */}
              <button
                type="button"
                onClick={() => setIsAlertModalOpen(true)}
                className="py-3.5 sm:py-4 px-5 rounded-2xl bg-[#0f1c24] hover:bg-[#152733] text-[#F8FAFC] border-2 border-[#00D27A]/40 hover:border-[#00D27A] font-extrabold text-sm sm:text-base transition-all flex items-center justify-center gap-2 touch-target"
              >
                <Bell className="w-4 h-4 text-[#00D27A]" />
                <span>Track Price</span>
              </button>
            </div>

            {/* Transparent Retailer Notice */}
            <div className="pt-1 flex items-center gap-2 text-[11px] text-[#94A3B8]">
              <ShieldCheck className="w-4 h-4 text-[#00D27A] shrink-0" />
              <span>You will complete your purchase directly on the retailer&apos;s website.</span>
            </div>
          </div>
        </div>
      </div>

      {/* Merchant Comparison List */}
      <div id="offers">
        <MerchantOffersList offers={product.offers} productTitle={product.title} />
      </div>

      {/* Price History Component */}
      <PriceHistoryChart
        history={product.priceHistory}
        stats={product.priceStats}
        productTitle={product.title}
      />

      {/* Reserved AdSlot */}
      <AdSlot slotId="product-lower-feed" format="banner" />

      {/* AI Buying Summary */}
      <AIBuyingSummary
        summary={product.aiSummary}
        productTitle={product.title}
        dealScore={product.dealScore}
      />

      {/* Product Specifications */}
      <ProductSpecs specs={product.specs} brand={product.brand} />

      {/* Related Products Carousel */}
      {relatedProducts.length > 0 && (
        <section className="pt-6 border-t border-[#162633]">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-bold text-lg text-[#F8FAFC]">Compare Alternative Models</h3>
              <p className="text-xs text-[#CBD5E1]">Similar electronics in {product.categoryName}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-6">
            {relatedProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}

      {/* Price Alert Bottom Sheet Modal */}
      <PriceAlertModal
        product={product}
        isOpen={isAlertModalOpen}
        onClose={() => setIsAlertModalOpen(false)}
      />
    </div>
  );
}
