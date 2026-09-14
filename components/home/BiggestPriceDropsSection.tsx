'use client';

import React from 'react';
import { Product } from '@/lib/types';
import { useCountry } from '@/context/CountryContext';
import { TrendingDown, ArrowRight, History, Store, Bookmark } from 'lucide-react';

interface BiggestPriceDropsSectionProps {
  products: Product[];
}

export function BiggestPriceDropsSection({ products }: BiggestPriceDropsSectionProps) {
  const { country, formatLocalPrice, toggleSaveProduct, isProductSaved } = useCountry();

  return (
    <section className="py-8 sm:py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-t border-[#162633]">
      <div className="flex items-end justify-between mb-5">
        <div>
          <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#00C996]">
            <TrendingDown className="w-4 h-4" />
            <span>Deep Cuts</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-[#F8FAFC] mt-1">
            Biggest Price Drops
          </h2>
          <p className="text-xs text-[#CBD5E1] mt-0.5">
            Verified price declines against 90-day moving averages
          </p>
        </div>

        <a
          href={`/${country}/price-drops/all`}
          className="text-xs font-bold text-[#00C996] hover:text-[#00E6A2] flex items-center gap-1 transition-colors"
        >
          <span>See All Drops</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </a>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {products.map((product) => {
          const discountPercent = Math.round(
            ((product.originalPrice - product.currentBestPrice) / product.originalPrice) * 100
          );
          const saved = isProductSaved(product.id);

          return (
            <div
              key={product.id}
              className="p-4 rounded-2xl bg-[#091217] border border-[#162633] hover:border-[#203648] transition-all flex flex-col justify-between group"
            >
              <div>
                {/* Header row: Brand + Save */}
                <div className="flex items-center justify-between text-[11px] mb-2">
                  <span className="font-extrabold text-[#00D27A] uppercase tracking-wider">
                    {product.brand}
                  </span>
                  <button
                    type="button"
                    onClick={() => toggleSaveProduct(product.id)}
                    className="text-[#CBD5E1] hover:text-white p-1"
                    aria-label="Save"
                  >
                    <Bookmark className={`w-4 h-4 ${saved ? 'fill-[#00D27A] text-[#00D27A]' : ''}`} />
                  </button>
                </div>

                {/* Product Media & Title */}
                <a
                  href={`/${country}/product/${product.slug}`}
                  className="flex items-center gap-3.5"
                >
                  <img
                    src={product.imageUrl}
                    alt={product.title}
                    className="w-16 h-16 object-contain rounded-xl bg-[#071015] p-1.5 border border-[#162633] shrink-0 group-hover:scale-105 transition-transform"
                  />
                  <div className="min-w-0 flex-1">
                    <h3 className="font-bold text-xs sm:text-sm text-[#F8FAFC] group-hover:text-[#00E6A2] transition-colors line-clamp-2 leading-snug">
                      {product.title}
                    </h3>
                    <div className="text-[10px] text-[#CBD5E1] mt-1 flex items-center gap-1">
                      <Store className="w-3 h-3 text-[#00D27A]" />
                      <span>{product.bestMerchantName}</span>
                    </div>
                  </div>
                </a>
              </div>

              {/* Price Details Block (Was / Now / % Drop) */}
              <div className="mt-4 pt-3 border-t border-[#162633]">
                <div className="flex items-baseline justify-between">
                  <div>
                    <span className="text-[10px] text-[#94A3B8] block font-semibold uppercase tracking-wider">
                      Was: <span className="line-through">{formatLocalPrice(product.originalPrice)}</span>
                    </span>
                    <div className="flex items-baseline gap-1.5 mt-0.5">
                      <span className="text-[11px] text-[#CBD5E1] font-medium">Now:</span>
                      <span className="text-base sm:text-lg font-extrabold text-[#00D27A]">
                        {formatLocalPrice(product.currentBestPrice)}
                      </span>
                    </div>
                  </div>

                  <span className="px-2.5 py-1 rounded-lg text-xs font-extrabold bg-[#00D27A]/15 text-[#00D27A] border border-[#00D27A]/30">
                    -{discountPercent}%
                  </span>
                </div>

                {/* Small Historical Indicator */}
                <div className="mt-2.5 pt-2 border-t border-[#162633]/60 flex items-center justify-between text-[10px] text-[#CBD5E1]">
                  <span className="flex items-center gap-1 text-[#00C996] font-semibold">
                    <History className="w-3 h-3" />
                    <span>Lowest in 90 days</span>
                  </span>
                  <a
                    href={`/${country}/product/${product.slug}`}
                    className="font-bold text-[#F8FAFC] hover:text-[#00D27A] transition-colors"
                  >
                    View Drop →
                  </a>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
