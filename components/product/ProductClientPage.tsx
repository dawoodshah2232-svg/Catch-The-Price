'use client';

import React, { useState } from 'react';
import { Product } from '@/lib/types';
import { useCountry } from '@/context/CountryContext';
import { DealScoreBadge } from '@/components/product/DealScoreBadge';
import { MerchantOffersList } from '@/components/product/MerchantOffersList';
import { PriceHistoryChart } from '@/components/product/PriceHistoryChart';
import { AIBuyingSummary } from '@/components/product/AIBuyingSummary';
import { ProductSpecs } from '@/components/product/ProductSpecs';
import { ProductDataConfidence } from '@/components/product/ProductDataConfidence';
import { PriceAlertModal } from '@/components/product/PriceAlertModal';
import { ProductCard } from '@/components/search/ProductCard';
import { QuickCompareSection } from '@/components/product/QuickCompareSection';
import { AdSlot } from '@/components/common/AdSlot';
import {
  Bell,
  ExternalLink,
  Bookmark,
  TrendingDown,
  ShieldCheck,
  Store,
  ChevronRight,
  Info,
} from 'lucide-react';

interface ProductClientPageProps {
  product: Product;
  relatedProducts: Product[];
  isPreview?: boolean;
}

export function ProductClientPage({ product, relatedProducts, isPreview = false }: ProductClientPageProps) {
  const { formatLocalPrice, toggleSaveProduct, isProductSaved, country } = useCountry();
  const [selectedImage, setSelectedImage] = useState(product.imageUrl);
  const [isAlertModalOpen, setIsAlertModalOpen] = useState(false);

  const saved = isProductSaved(product.id);
  const discountAmount = Math.max(0, product.originalPrice - product.currentBestPrice);
  const discountPercent = product.originalPrice > 0
    ? Math.round((discountAmount / product.originalPrice) * 100)
    : 0;

  const bestOffer = product.offers[0];
  const outboundBestDealHref = bestOffer
    ? `/api/outbound?offerId=${encodeURIComponent(bestOffer.id)}&country=${country}`
    : '#offers';

  return (
    <div className="bg-[#F4F7F6] min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-8 space-y-6 sm:space-y-8">
        {isPreview && (
          <div className="rounded-2xl border border-amber-300 bg-amber-50 px-4 py-3 text-xs text-amber-900 flex items-start gap-2">
            <Info className="w-4 h-4 mt-0.5 shrink-0" />
            <span>
              Development preview only. Prices, merchant offers, deal score and historical data on this page are sample content used to test the interface.
            </span>
          </div>
        )}

        <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-[11px] sm:text-xs text-[#73858D] overflow-x-auto whitespace-nowrap">
          <a href={`/${country}`} className="hover:text-[#08784B] transition-colors">Home</a>
          <ChevronRight className="w-3.5 h-3.5 text-[#9AABA4] shrink-0" />
          <a href={`/${country}/deals/${product.categorySlug}`} className="hover:text-[#08784B] transition-colors">{product.categoryName}</a>
          <ChevronRight className="w-3.5 h-3.5 text-[#9AABA4] shrink-0" />
          <span className="text-[#31474F] font-semibold truncate max-w-xs">{product.brand}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 lg:gap-10 items-start">
          <div className="lg:col-span-5 space-y-3">
            <div className="relative aspect-square max-h-[330px] sm:max-h-[470px] mx-auto w-full rounded-[26px] bg-white border border-[#DDE7E3] p-4 sm:p-7 flex items-center justify-center overflow-hidden shadow-[0_12px_34px_rgba(25,55,45,0.07)]">
              {discountPercent > 0 && (
                <div className="absolute top-3.5 left-3.5 flex items-center gap-1 px-2.5 py-1 rounded-xl text-[11px] font-extrabold bg-[#E5F8EF] text-[#08784B] border border-[#C7EEDC] z-10">
                  <TrendingDown className="w-3.5 h-3.5 stroke-[2.5]" />
                  <span>{discountPercent}% below reference</span>
                </div>
              )}

              <button
                type="button"
                onClick={() => toggleSaveProduct(product.id)}
                className={`absolute top-3.5 right-3.5 z-10 w-10 h-10 rounded-xl border touch-target flex items-center justify-center transition-all shadow-sm ${
                  saved
                    ? 'bg-[#0B8F58] text-white border-[#0B8F58]'
                    : 'bg-white text-[#60727A] hover:text-[#08784B] border-[#DDE7E3]'
                }`}
                aria-label={saved ? 'Saved' : 'Save product'}
              >
                <Bookmark className={`w-4 h-4 ${saved ? 'fill-white' : ''}`} />
              </button>

              <img
                src={selectedImage}
                alt={product.title}
                className="max-h-full max-w-full object-contain transition-transform duration-300 hover:scale-[1.02]"
              />
            </div>

            {product.gallery.length > 1 && (
              <div className="flex items-center gap-2.5 overflow-x-auto pb-1">
                {product.gallery.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImage(img)}
                    className={`w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-white border p-2 shrink-0 transition-all ${
                      selectedImage === img
                        ? 'border-[#0B8F58] ring-2 ring-[#00D27A]/15'
                        : 'border-[#DDE7E3] hover:border-[#BFD2CA]'
                    }`}
                    aria-label={`View product image ${idx + 1}`}
                  >
                    <img src={img} alt="" className="w-full h-full object-contain" />
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="lg:col-span-7 space-y-4 sm:space-y-6">
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-2 text-[11px] sm:text-xs">
                <span className="font-extrabold uppercase tracking-wider text-[#08784B]">{product.brand}</span>
                <span className="text-[#A0AEA9]">•</span>
                <span className="text-[#65777F] flex items-center gap-1">
                  <Store className="w-3.5 h-3.5 text-[#0B8F58]" />
                  {product.offersCount} retailer offer{product.offersCount === 1 ? '' : 's'}
                </span>
              </div>

              <h1 className="text-[22px] sm:text-3xl lg:text-4xl font-extrabold text-[#102027] leading-tight">
                {product.title}
              </h1>

              {product.description && (
                <p className="mt-2 text-xs sm:text-sm text-[#52636B] leading-relaxed max-w-3xl">{product.description}</p>
              )}
            </div>

            <div className="p-4 sm:p-5 rounded-[24px] bg-white border border-[#DDE7E3] space-y-3.5 shadow-[0_10px_30px_rgba(25,55,45,0.06)]">
              <div className="flex flex-wrap items-baseline justify-between gap-3">
                <div>
                  <span className="text-[9px] sm:text-[10px] font-extrabold uppercase tracking-wider text-[#73858D] block mb-0.5">
                    Current lowest listed price
                  </span>
                  <div className="flex items-baseline gap-2.5 sm:gap-3">
                    <span className="text-2xl sm:text-4xl font-extrabold text-[#08784B]">{formatLocalPrice(product.currentBestPrice)}</span>
                    {product.originalPrice > product.currentBestPrice && (
                      <span className="text-sm sm:text-base text-[#829198] line-through font-medium">{formatLocalPrice(product.originalPrice)}</span>
                    )}
                  </div>
                </div>

                {discountPercent > 0 && (
                  <div className="text-right">
                    <span className="px-2.5 sm:px-3 py-1 rounded-xl text-[10px] sm:text-xs font-extrabold bg-[#E5F8EF] text-[#08784B] border border-[#C7EEDC] inline-block">
                      ↓ {discountPercent}% difference
                    </span>
                    <span className="text-[9px] sm:text-[10px] text-[#829198] block mt-1">vs. listed reference price</span>
                  </div>
                )}
              </div>

              {product.dealScore > 0 && (
                <div className="pt-2 border-t border-[#EDF2F0]">
                  <DealScoreBadge score={product.dealScore} size="lg" />
                </div>
              )}

              <div className="pt-2 hidden sm:grid sm:grid-cols-2 gap-3">
                <a
                  href={outboundBestDealHref}
                  target="_blank"
                  rel="sponsored noopener"
                  className="py-3.5 px-5 rounded-2xl bg-[#0B8F58] hover:bg-[#08784B] text-white text-sm flex items-center justify-center gap-2 touch-target font-extrabold transition-colors"
                >
                  <span>{bestOffer ? `Visit ${product.bestMerchantName}` : 'View retailer offers'}</span>
                  <ExternalLink className="w-4 h-4" />
                </a>

                <button
                  type="button"
                  onClick={() => setIsAlertModalOpen(true)}
                  className="py-3.5 px-5 rounded-2xl bg-[#F3F8F6] hover:bg-[#EAF4F0] text-[#20343C] border border-[#CFE0DA] font-extrabold text-sm transition-all flex items-center justify-center gap-2 touch-target"
                >
                  <Bell className="w-4 h-4 text-[#08784B]" />
                  <span>Track price</span>
                </button>
              </div>

              <div className="pt-1 flex items-start gap-2 text-[10px] sm:text-[11px] text-[#73858D]">
                <ShieldCheck className="w-4 h-4 text-[#0B8F58] shrink-0" />
                <span>Purchases are completed on the retailer&apos;s website under the retailer&apos;s terms.</span>
              </div>
            </div>
          </div>
        </div>

        <div id="offers">
          <MerchantOffersList offers={product.offers} productTitle={product.title} />
        </div>

        <ProductDataConfidence product={product} isPreview={isPreview} />

        {product.priceHistory.length > 1 ? (
          <PriceHistoryChart history={product.priceHistory} stats={product.priceStats} productTitle={product.title} />
        ) : (
          <section className="rounded-2xl bg-white border border-[#DDE7E3] p-4 sm:p-5">
            <h3 className="font-bold text-sm text-[#102027]">Price history</h3>
            <p className="mt-1 text-xs text-[#73858D] leading-relaxed">
              Historical pricing will appear after CatchThePrice has collected enough genuine observations for this exact product and market.
            </p>
          </section>
        )}

        <AIBuyingSummary summary={product.aiSummary} productTitle={product.title} dealScore={product.dealScore} />

        <AdSlot slotId="product-lower-feed" format="banner" />

        <ProductSpecs specs={product.specs} brand={product.brand} />

        {relatedProducts.length > 0 && (
          <>
            <QuickCompareSection current={product} alternatives={relatedProducts} />

            <section className="pt-6 border-t border-[#DDE7E3]">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="font-extrabold text-lg text-[#102027]">Explore alternative models</h3>
                  <p className="text-xs text-[#73858D]">Similar products in {product.categoryName}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5 sm:gap-5">
                {relatedProducts.map((item) => <ProductCard key={item.id} product={item} />)}
              </div>
            </section>
          </>
        )}

        <PriceAlertModal product={product} isOpen={isAlertModalOpen} onClose={() => setIsAlertModalOpen(false)} />
      </div>

      <div className="sm:hidden fixed bottom-0 left-0 right-0 z-[60] bg-white/97 backdrop-blur-xl border-t border-[#DDE7E3] px-3 pt-2 pb-[calc(env(safe-area-inset-bottom,8px)+8px)] shadow-[0_-8px_26px_rgba(24,52,43,0.10)] grid grid-cols-[1fr_auto] gap-2">
        <a
          href={outboundBestDealHref}
          target="_blank"
          rel="sponsored noopener"
          className="min-h-[46px] rounded-xl bg-[#0B8F58] text-white text-xs font-extrabold flex items-center justify-center gap-2 px-3"
        >
          {bestOffer ? `Visit ${product.bestMerchantName}` : 'View offers'} <ExternalLink className="w-3.5 h-3.5" />
        </a>
        <button
          type="button"
          onClick={() => setIsAlertModalOpen(true)}
          className="min-w-[48px] min-h-[46px] rounded-xl bg-[#F0F7F4] border border-[#CFE0DA] text-[#08784B] flex items-center justify-center"
          aria-label="Track price"
        >
          <Bell className="w-4.5 h-4.5" />
        </button>
      </div>
    </div>
  );
}
