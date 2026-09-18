'use client';

import React, { useState } from 'react';
import { Product } from '@/lib/types';
import { useCountry } from '@/context/CountryContext';
import { DealScoreBadge } from '@/components/product/DealScoreBadge';
import { ProductGallery2 } from '@/components/product/ProductGallery2';
import { KeySpecsSummary } from '@/components/product/KeySpecsSummary';
import { RetailerPriceComparison } from '@/components/product/RetailerPriceComparison';
import { PriceHistorySection } from '@/components/product/PriceHistorySection';
import { StructuredSpecsTable } from '@/components/product/StructuredSpecsTable';
import { AIBuyingSummary } from '@/components/product/AIBuyingSummary';
import { ProductDecisionFAQ } from '@/components/product/ProductDecisionFAQ';
import { PriceAlertModal } from '@/components/product/PriceAlertModal';
import { ProductCard } from '@/components/search/ProductCard';
import { QuickCompareSection } from '@/components/product/QuickCompareSection';
import { AdSlot } from '@/components/common/AdSlot';
import {
  Bell,
  ExternalLink,
  ShieldCheck,
  Store,
  ChevronRight,
  Info,
  History,
  SlidersHorizontal,
  ArrowRightLeft,
  Check,
} from 'lucide-react';

interface ProductClientPageProps {
  product: Product;
  relatedProducts: Product[];
  isPreview?: boolean;
}

export function ProductClientPage({ product, relatedProducts, isPreview = false }: ProductClientPageProps) {
  const { formatLocalPrice, toggleSaveProduct, isProductSaved, country } = useCountry();
  const [isAlertModalOpen, setIsAlertModalOpen] = useState(false);
  const [galleryIndex, setGalleryIndex] = useState(0);

  const isIPhone16ProMax = product.slug.toLowerCase() === 'apple-iphone-16-pro-max-256gb';
  const saved = isProductSaved(product.id);
  const discountAmount = Math.max(0, product.originalPrice - product.currentBestPrice);
  const discountPercent = product.originalPrice > 0
    ? Math.round((discountAmount / product.originalPrice) * 100)
    : 0;

  const validOffers = product.offers.filter((o) => o.price > 0 && Number.isFinite(o.price));
  const hasValidOffers = validOffers.length > 0;
  const bestOffer = validOffers[0];
  const outboundBestDealHref = bestOffer
    ? `/api/outbound?offerId=${encodeURIComponent(bestOffer.id)}&country=${country}`
    : '#offers';

  // Finishes for iPhone 16 Pro Max mapping to gallery indices
  const finishes = [
    { name: 'Desert Titanium', color: '#C29B7F', index: 0 },
    { name: 'Natural Titanium', color: '#9E9B93', index: 3 },
    { name: 'Black Titanium', color: '#3B3A3E', index: 4 },
    { name: 'White Titanium', color: '#E3E4E5', index: 5 },
  ];

  const mobileJumpLinks = [
    ...(hasValidOffers ? [{ label: 'Store Offers', href: '#offers', Icon: Store }] : []),
    { label: 'Price History', href: '#history', Icon: History },
    { label: 'Specifications', href: '#specs', Icon: SlidersHorizontal },
    ...(relatedProducts.length > 0 ? [{ label: 'Compare', href: '#compare', Icon: ArrowRightLeft }] : []),
  ];

  return (
    <div className="bg-[#F4F7F6] min-h-screen pb-20 sm:pb-0">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5 sm:py-6 space-y-4 sm:space-y-6">
        {isPreview && (
          <div className="rounded-xl border border-amber-300 bg-amber-50 px-3.5 py-2 text-xs text-amber-900 flex items-start gap-2">
            <Info className="w-3.5 h-3.5 mt-0.5 shrink-0" />
            <span>
              Development preview only. Sample content used to test the interface.
            </span>
          </div>
        )}

        {/* Breadcrumb Navigation */}
        <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-[11px] text-[#73858D] overflow-x-auto whitespace-nowrap scrollbar-none">
          <a href={`/${country}`} className="hover:text-[#08784B] transition-colors">Home</a>
          <ChevronRight className="w-3 h-3 text-[#9AABA4] shrink-0" />
          <a href={`/${country}/deals/${product.categorySlug}`} className="hover:text-[#08784B] transition-colors">{product.categoryName}</a>
          <ChevronRight className="w-3 h-3 text-[#9AABA4] shrink-0" />
          <span className="text-[#31474F] font-semibold truncate max-w-xs">{product.brand}</span>
        </nav>

        {/* Desktop 2-Column Experience: Left Canvas, Right Information */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-8 items-start">
          {/* Left Column: Multi-Image Canvas & Lightbox */}
          <div className="lg:col-span-5">
            <ProductGallery2
              primaryImageUrl={product.imageUrl}
              images={product.images}
              productTitle={product.title}
              discountPercent={discountPercent}
              isSaved={saved}
              onToggleSave={() => toggleSaveProduct(product.id)}
              selectedIndex={galleryIndex}
              onSelectImage={(idx) => setGalleryIndex(idx)}
            />
          </div>

          {/* Right Column: Title, Interactive Variants, Key Specs, Single Price Module */}
          <div className="lg:col-span-7 space-y-3.5 sm:space-y-4">
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-1.5 text-[11px]">
                <span className="font-extrabold uppercase tracking-wider text-[#08784B]">{product.brand}</span>
                <span className="text-[#A0AEA9]">•</span>
                <span className="text-[#65777F] flex items-center gap-1">
                  <Store className="w-3 h-3 text-[#0B8F58]" />
                  {hasValidOffers
                    ? `${validOffers.length} verified offer${validOffers.length === 1 ? '' : 's'}`
                    : 'Tracking Amazon UAE & Noon UAE'}
                </span>
              </div>

              <h1 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-[#102027] leading-tight">
                {product.title}
              </h1>

              {product.description && (
                <p className="mt-1.5 text-xs text-[#52636B] leading-relaxed max-w-2xl line-clamp-2">
                  {product.description}
                </p>
              )}
            </div>

            {/* Storage & Color Variants (Clickable & Active) */}
            {isIPhone16ProMax && (
              <div className="space-y-2 pt-0.5">
                {/* Finish Selector: Clicking immediately switches gallery image */}
                <div className="flex flex-wrap items-center gap-1.5">
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#73858D] mr-1">
                    Finish:
                  </span>
                  {finishes.map((f) => {
                    const isActive = galleryIndex === f.index;
                    return (
                      <button
                        key={f.name}
                        type="button"
                        onClick={() => setGalleryIndex(f.index)}
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                          isActive
                            ? 'bg-white border-[#08784B] ring-1 ring-[#08784B] text-[#102027] shadow-2xs'
                            : 'bg-white border border-[#DDE7E3] text-[#60727A] hover:text-[#102027]'
                        }`}
                      >
                        <span
                          className="w-2.5 h-2.5 rounded-full border border-black/10 shrink-0"
                          style={{ backgroundColor: f.color }}
                        />
                        <span>{f.name}</span>
                      </button>
                    );
                  })}
                </div>

                {/* Storage Selector */}
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#73858D] mr-1">
                    Storage:
                  </span>
                  <span className="px-2.5 py-1 rounded-lg text-xs font-extrabold bg-[#E5F8EF] text-[#08784B] border border-[#C7EEDC] flex items-center gap-1">
                    <Check className="w-3 h-3 stroke-[3]" /> 256GB
                  </span>
                  <span className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-white text-[#60727A] border border-[#DDE7E3] opacity-60">
                    512GB
                  </span>
                  <span className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-white text-[#60727A] border border-[#DDE7E3] opacity-60">
                    1TB
                  </span>
                </div>
              </div>
            )}

            {/* Compact Glanceable Key Specs Presentation */}
            <KeySpecsSummary
              specs={product.specs}
              brand={product.brand}
              isIPhone16ProMax={isIPhone16ProMax}
            />

            {/* ONE Strong Compact Retailer & Pricing Module */}
            <div className="p-3.5 sm:p-5 rounded-[20px] bg-white border border-[#DDE7E3] space-y-3 shadow-[0_8px_24px_rgba(25,55,45,0.05)]">
              {hasValidOffers ? (
                /* When Real Verified Offers Exist */
                <>
                  <div className="flex flex-wrap items-baseline justify-between gap-2">
                    <div>
                      <span className="text-[9px] font-extrabold uppercase tracking-wider text-[#73858D] block mb-0.5">
                        Lowest Verified Price
                      </span>
                      <div className="flex items-baseline gap-2">
                        <span className="text-2xl sm:text-3xl font-extrabold text-[#08784B]">
                          {formatLocalPrice(product.currentBestPrice)}
                        </span>
                        {product.originalPrice > product.currentBestPrice && (
                          <span className="text-xs sm:text-sm text-[#829198] line-through font-medium">
                            {formatLocalPrice(product.originalPrice)}
                          </span>
                        )}
                      </div>
                    </div>

                    {discountPercent > 0 && (
                      <span className="px-2.5 py-0.5 rounded-lg text-[11px] font-extrabold bg-[#E5F8EF] text-[#08784B] border border-[#C7EEDC]">
                        ↓ {discountPercent}% vs reference
                      </span>
                    )}
                  </div>

                  {product.dealScore > 0 && (
                    <div className="pt-1.5 border-t border-[#EDF2F0]">
                      <DealScoreBadge score={product.dealScore} size="sm" />
                    </div>
                  )}

                  <div className="grid grid-cols-2 gap-2.5 pt-1">
                    <a
                      href={outboundBestDealHref}
                      target="_blank"
                      rel="sponsored noopener"
                      className="py-2.5 px-4 rounded-xl bg-[#0B8F58] hover:bg-[#08784B] text-white text-xs sm:text-sm font-extrabold flex items-center justify-center gap-2 transition-colors shadow-2xs"
                    >
                      <span>Visit {product.bestMerchantName}</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                    <button
                      type="button"
                      onClick={() => setIsAlertModalOpen(true)}
                      className="py-2.5 px-4 rounded-xl bg-[#F4F7F6] hover:bg-[#EAF4F0] text-[#20343C] border border-[#CFE0DA] font-extrabold text-xs sm:text-sm transition-all flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <Bell className="w-3.5 h-3.5 text-[#08784B]" />
                      <span>Track Price</span>
                    </button>
                  </div>
                </>
              ) : (
                /* When No Offers Exist Yet: Single Compact Module */
                <div className="space-y-3">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <div className="h-7 w-16 rounded-lg bg-white border border-[#DDE7E3] p-1 flex items-center justify-center shadow-2xs">
                        <img src="/images/merchants/amazon.svg" alt="Amazon UAE" className="h-4 object-contain" />
                      </div>
                      <span className="text-xs font-bold text-[#829198]">+</span>
                      <div className="h-7 w-16 rounded-lg bg-white border border-[#DDE7E3] p-1 flex items-center justify-center shadow-2xs">
                        <img src="/images/merchants/noon.svg" alt="Noon UAE" className="h-4 object-contain" />
                      </div>
                    </div>

                    <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-[#E5F8EF] text-[#08784B] border border-[#C7EEDC]">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#08784B] animate-pulse" />
                      Price Tracking Active
                    </span>
                  </div>

                  <p className="text-xs text-[#52636B] leading-relaxed">
                    We&apos;re tracking this product across Amazon UAE and Noon UAE. Get notified when a verified price is available.
                  </p>

                  <button
                    type="button"
                    onClick={() => setIsAlertModalOpen(true)}
                    className="w-full py-2.5 px-4 rounded-xl bg-[#0B8F58] hover:bg-[#08784B] text-white text-xs sm:text-sm font-extrabold flex items-center justify-center gap-2 transition-all shadow-2xs cursor-pointer"
                  >
                    <Bell className="w-3.5 h-3.5" />
                    <span>Set Price Alert</span>
                  </button>
                </div>
              )}

              {/* Single Concise Trust Note */}
              <div className="pt-1 flex items-start gap-1.5 text-[10px] sm:text-[11px] text-[#73858D]">
                <ShieldCheck className="w-3.5 h-3.5 text-[#08784B] shrink-0" />
                <span>Purchases completed directly with official stores under manufacturer warranty.</span>
              </div>
            </div>

            {/* Mobile Jump Links */}
            <nav className="sm:hidden flex items-center gap-1.5 overflow-x-auto scrollbar-none pb-0.5" aria-label="Product sections">
              {mobileJumpLinks.map(({ label, href, Icon }) => (
                <a
                  key={label}
                  href={href}
                  className="shrink-0 px-3 py-1.5 rounded-lg bg-white border border-[#DDE7E3] text-[11px] font-extrabold text-[#31474F] inline-flex items-center gap-1"
                >
                  <Icon className="w-3 h-3 text-[#0B8F58]" /> {label}
                </a>
              ))}
            </nav>
          </div>
        </div>

        {/* Section: Retailer Price Comparison (Detailed table when verified offers exist) */}
        {hasValidOffers && (
          <div id="offers" className="scroll-mt-20">
            <RetailerPriceComparison
              offers={product.offers}
              productTitle={product.title}
              onOpenAlertModal={() => setIsAlertModalOpen(true)}
            />
          </div>
        )}

        {/* Section: Price History & Trends (Compact Empty State or Real Chart) */}
        <div id="history" className="scroll-mt-20">
          <PriceHistorySection
            history={product.priceHistory}
            stats={product.priceStats}
            productTitle={product.title}
            onOpenAlertModal={() => setIsAlertModalOpen(true)}
          />
        </div>

        {/* Section: AI Buying Summary */}
        <AIBuyingSummary
          summary={product.aiSummary}
          productTitle={product.title}
          dealScore={product.dealScore}
        />

        <AdSlot slotId="product-lower-feed" format="banner" />

        {/* Section: Technical Specifications (Dense, Information-Rich, Working Tabs) */}
        <div id="specs" className="scroll-mt-20">
          <StructuredSpecsTable
            specGroups={product.specGroups}
            fallbackSpecs={product.specs}
            brand={product.brand}
          />
        </div>

        {/* Section: Product Questions / FAQ */}
        <ProductDecisionFAQ product={product} />

        {/* Section: Quick Compare & Related Products */}
        {relatedProducts.length > 0 && (
          <div id="compare" className="scroll-mt-20">
            <QuickCompareSection current={product} alternatives={relatedProducts} />

            <section className="pt-4 mt-4 border-t border-[#DDE7E3]">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h3 className="font-extrabold text-base sm:text-lg text-[#102027]">Explore Alternative Models</h3>
                  <p className="text-xs text-[#73858D]">Similar products in {product.categoryName}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5 sm:gap-4">
                {relatedProducts.map((item) => (
                  <ProductCard key={item.id} product={item} />
                ))}
              </div>
            </section>
          </div>
        )}

        {/* Price Alert Modal */}
        <PriceAlertModal
          product={product}
          isOpen={isAlertModalOpen}
          onClose={() => setIsAlertModalOpen(false)}
        />
      </div>

      {/* Mobile Sticky Bottom Action Bar */}
      <div className="sm:hidden fixed bottom-0 left-0 right-0 z-[60] bg-[#071015] border-t border-[#1A2B35] px-3 pt-2 pb-[calc(env(safe-area-inset-bottom,8px)+8px)] shadow-[0_-10px_28px_rgba(0,0,0,.22)] grid grid-cols-[auto_1fr_auto] items-center gap-2">
        <div className="min-w-0 pr-1">
          <div className="text-[8px] uppercase tracking-wider font-bold text-[#7F968D]">
            {product.currentBestPrice > 0 ? 'Best Listed' : 'Monitoring'}
          </div>
          <div className="text-[13px] font-extrabold text-white truncate">
            {product.currentBestPrice > 0
              ? formatLocalPrice(product.currentBestPrice)
              : 'Amazon & Noon'}
          </div>
        </div>

        {bestOffer ? (
          <a
            href={outboundBestDealHref}
            target="_blank"
            rel="sponsored noopener"
            className="min-h-[44px] rounded-xl bg-[#00D27A] hover:bg-[#00E6A2] text-[#071015] text-xs font-extrabold flex items-center justify-center gap-1.5 px-3"
          >
            <span>Visit {product.bestMerchantName}</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        ) : (
          <button
            type="button"
            onClick={() => setIsAlertModalOpen(true)}
            className="min-h-[44px] rounded-xl bg-[#00D27A] hover:bg-[#00E6A2] text-[#071015] text-xs font-extrabold flex items-center justify-center gap-1.5 px-3 cursor-pointer"
          >
            <Bell className="w-3.5 h-3.5" />
            <span>Set Price Alert</span>
          </button>
        )}

        <button
          type="button"
          onClick={() => setIsAlertModalOpen(true)}
          className="min-w-[44px] min-h-[44px] rounded-xl bg-[#0F1C24] border border-[#223743] text-[#67EFB8] flex items-center justify-center cursor-pointer"
          aria-label="Track price"
        >
          <Bell className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
