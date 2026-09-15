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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-8 space-y-6 sm:space-y-8">
      {isPreview && (
        <div className="rounded-2xl border border-amber-400/25 bg-amber-400/10 px-4 py-3 text-xs text-amber-100 flex items-start gap-2">
          <Info className="w-4 h-4 mt-0.5 shrink-0" />
          <span>
            Development preview only. The prices, merchant offers, deal score and historical data on this page are sample content used to test the interface and must not be used for a purchase decision.
          </span>
        </div>
      )}

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

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 lg:gap-10 items-start">
        <div className="lg:col-span-5 space-y-3">
          <div className="relative aspect-square max-h-[290px] sm:max-h-[460px] mx-auto w-full rounded-3xl bg-[#091217] border border-[#162633] p-4 sm:p-6 flex items-center justify-center overflow-hidden shadow-2xl">
            {discountPercent > 0 && (
              <div className="absolute top-3.5 left-3.5 flex items-center gap-1 px-2.5 py-1 rounded-xl text-xs font-extrabold bg-[#00D27A] text-[#071015] shadow-md z-10">
                <TrendingDown className="w-3.5 h-3.5 stroke-[2.5]" />
                <span>{discountPercent}% below reference</span>
              </div>
            )}

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
              className="max-h-full max-w-full object-contain transition-transform duration-300 hover:scale-[1.03]"
            />
          </div>

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
            <div className="flex flex-wrap items-center gap-2 mb-2 text-xs">
              <span className="font-extrabold uppercase tracking-wider text-[#00D27A]">
                {product.brand}
              </span>
              <span className="text-[#94A3B8]">•</span>
              <span className="text-[#CBD5E1] flex items-center gap-1">
                <Store className="w-3.5 h-3.5 text-[#00D27A]" />
                {product.offersCount} retailer offer{product.offersCount === 1 ? '' : 's'} listed
              </span>
            </div>

            <h1 className="text-xl sm:text-3xl lg:text-4xl font-extrabold text-[#F8FAFC] leading-tight">
              {product.title}
            </h1>

            {product.description && (
              <p className="mt-2 text-xs sm:text-sm text-[#CBD5E1] leading-relaxed">
                {product.description}
              </p>
            )}
          </div>

          <div className="p-4 sm:p-5 rounded-3xl bg-[#091217] border border-[#162633] space-y-3.5 shadow-xl">
            <div className="flex flex-wrap items-baseline justify-between gap-3">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#94A3B8] block mb-0.5">
                  Current Lowest Listed Price
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
                    ↓ {discountPercent}% Difference
                  </span>
                  <span className="text-[10px] text-[#94A3B8] block mt-1">
                    Compared with the listed reference price
                  </span>
                </div>
              )}
            </div>

            {product.dealScore > 0 && (
              <div className="pt-2 border-t border-[#162633]">
                <DealScoreBadge score={product.dealScore} size="lg" />
              </div>
            )}

            <div className="pt-2 grid grid-cols-1 sm:grid-cols-2 gap-3">
              <a
                href={outboundBestDealHref}
                target="_blank"
                rel="sponsored noopener"
                className="py-3.5 sm:py-4 px-5 rounded-2xl bg-[#00D27A] hover:bg-[#00E6A2] text-[#071015] text-sm sm:text-base flex items-center justify-center gap-2 touch-target font-extrabold tracking-wide transition-colors"
              >
                <span>{bestOffer ? `Visit ${product.bestMerchantName}` : 'View retailer offers'}</span>
                <ExternalLink className="w-4 h-4" />
              </a>

              <button
                type="button"
                onClick={() => setIsAlertModalOpen(true)}
                className="py-3.5 sm:py-4 px-5 rounded-2xl bg-[#0f1c24] hover:bg-[#152733] text-[#F8FAFC] border border-[#00D27A]/35 hover:border-[#00D27A] font-extrabold text-sm sm:text-base transition-all flex items-center justify-center gap-2 touch-target"
              >
                <Bell className="w-4 h-4 text-[#00D27A]" />
                <span>Track Price</span>
              </button>
            </div>

            <div className="pt-1 flex items-center gap-2 text-[11px] text-[#94A3B8]">
              <ShieldCheck className="w-4 h-4 text-[#00D27A] shrink-0" />
              <span>Purchases are completed on the retailer&apos;s website under the retailer&apos;s terms.</span>
            </div>
          </div>
        </div>
      </div>

      <div id="offers">
        <MerchantOffersList offers={product.offers} productTitle={product.title} />
      </div>

      {product.priceHistory.length > 1 ? (
        <PriceHistoryChart
          history={product.priceHistory}
          stats={product.priceStats}
          productTitle={product.title}
        />
      ) : (
        <section className="rounded-2xl bg-[#091217] border border-[#162633] p-4 sm:p-5">
          <h3 className="font-bold text-sm text-[#F8FAFC]">Price history</h3>
          <p className="mt-1 text-xs text-[#94A3B8] leading-relaxed">
            Historical pricing will appear after CatchThePrice has collected enough genuine observations for this exact product and market.
          </p>
        </section>
      )}

      <AIBuyingSummary
        summary={product.aiSummary}
        productTitle={product.title}
        dealScore={product.dealScore}
      />

      <AdSlot slotId="product-lower-feed" format="banner" />

      <ProductSpecs specs={product.specs} brand={product.brand} />

      {relatedProducts.length > 0 && (
        <>
          <QuickCompareSection current={product} alternatives={relatedProducts} />

          <section className="pt-6 border-t border-[#162633]">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-bold text-lg text-[#F8FAFC]">Explore Alternative Models</h3>
                <p className="text-xs text-[#CBD5E1]">Similar products in {product.categoryName}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-6">
              {relatedProducts.map((item) => (
                <ProductCard key={item.id} product={item} />
              ))}
            </div>
          </section>
        </>
      )}

      <PriceAlertModal
        product={product}
        isOpen={isAlertModalOpen}
        onClose={() => setIsAlertModalOpen(false)}
      />
    </div>
  );
}
