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
    <section className="py-7 sm:py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-t border-[#E1E9E6]">
      <div className="flex items-start justify-between gap-3 mb-4 sm:mb-5">
        <div className="min-w-0">
          <div className="flex items-center gap-1.5 text-[10px] sm:text-xs font-extrabold uppercase tracking-[0.12em] text-[#08784B]">
            <TrendingDown className="w-4 h-4 shrink-0" />
            <span>Recent drops</span>
          </div>
          <h2 className="text-[20px] sm:text-2xl font-extrabold text-[#102027] mt-1 leading-tight">
            Biggest price drops
          </h2>
          <p className="text-[11px] sm:text-xs text-[#64767E] mt-1">
            Price changes from available store data.
          </p>
        </div>

        <a
          href={`/${country}/price-drops/all`}
          className="shrink-0 mt-5 text-[11px] sm:text-xs font-extrabold text-[#08784B] hover:text-[#045E3A] flex items-center gap-1 transition-colors"
        >
          <span className="hidden min-[390px]:inline">See all drops</span>
          <span className="min-[390px]:hidden">All</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </a>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {products.map((product) => {
          const discountPercent = product.originalPrice > product.currentBestPrice && product.originalPrice > 0
            ? Math.round(((product.originalPrice - product.currentBestPrice) / product.originalPrice) * 100)
            : 0;
          const saved = isProductSaved(product.id);

          return (
            <article
              key={product.id}
              className="p-3.5 sm:p-4 rounded-2xl bg-white border border-[#DDE7E3] hover:border-[#BFD2CA] hover:shadow-[0_10px_28px_rgba(25,55,45,0.07)] transition-all flex flex-col justify-between group min-w-0"
            >
              <div>
                <div className="flex items-center justify-between text-[10px] sm:text-[11px] mb-2">
                  <span className="font-extrabold text-[#08784B] uppercase tracking-wider truncate pr-2">
                    {product.brand}
                  </span>
                  <button
                    type="button"
                    onClick={() => toggleSaveProduct(product.id)}
                    className="text-[#60727A] hover:text-[#08784B] p-1.5 min-w-[36px] min-h-[36px] flex items-center justify-center shrink-0"
                    aria-label="Save"
                  >
                    <Bookmark className={`w-4 h-4 ${saved ? 'fill-[#0B8F58] text-[#0B8F58]' : ''}`} />
                  </button>
                </div>

                <a href={`/${country}/product/${product.slug}`} className="flex items-center gap-3 min-w-0">
                  <img
                    src={product.imageUrl}
                    alt={product.title}
                    className="w-14 h-14 sm:w-16 sm:h-16 object-contain rounded-xl bg-[#F8FAF9] p-1.5 border border-[#E3ECE8] shrink-0 group-hover:scale-[1.03] transition-transform"
                  />
                  <div className="min-w-0 flex-1">
                    <h3 className="font-bold text-[12px] sm:text-sm text-[#102027] group-hover:text-[#08784B] transition-colors line-clamp-2 leading-snug">
                      {product.title}
                    </h3>
                    <div className="text-[10px] text-[#65777F] mt-1 flex items-center gap-1 min-w-0">
                      <Store className="w-3 h-3 text-[#0B8F58] shrink-0" />
                      <span className="truncate">{product.bestMerchantName}</span>
                    </div>
                  </div>
                </a>
              </div>

              <div className="mt-3 pt-3 border-t border-[#EDF2F0]">
                <div className="flex items-end justify-between gap-2 min-w-0">
                  <div className="min-w-0">
                    <span className="text-[9px] sm:text-[10px] text-[#829198] block font-semibold uppercase tracking-wider truncate">
                      Was: <span className="line-through">{formatLocalPrice(product.originalPrice)}</span>
                    </span>
                    <div className="flex items-baseline gap-1 mt-0.5 min-w-0">
                      <span className="text-[10px] text-[#65777F] font-medium shrink-0">Now:</span>
                      <span className="text-sm sm:text-lg font-extrabold text-[#08784B] truncate">
                        {formatLocalPrice(product.currentBestPrice)}
                      </span>
                    </div>
                  </div>

                  {discountPercent > 0 && (
                    <span className="shrink-0 px-2 py-1 rounded-lg text-[10px] sm:text-xs font-extrabold bg-[#E5F8EF] text-[#08784B] border border-[#C7EEDC]">
                      -{discountPercent}%
                    </span>
                  )}
                </div>

                <div className="mt-2.5 pt-2 border-t border-[#EDF2F0] flex items-center justify-between gap-2 text-[9px] sm:text-[10px] text-[#65777F]">
                  <span className="flex items-center gap-1 text-[#08784B] font-semibold min-w-0">
                    <History className="w-3 h-3 shrink-0" />
                    <span className="truncate">Price history</span>
                  </span>
                  <a
                    href={`/${country}/product/${product.slug}`}
                    className="font-extrabold text-[#20343C] hover:text-[#08784B] transition-colors shrink-0"
                  >
                    View →
                  </a>
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
