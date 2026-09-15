'use client';

import React from 'react';
import { Product } from '@/lib/types';
import { useCountry } from '@/context/CountryContext';
import { Bookmark, Store, ArrowRight } from 'lucide-react';

interface ProductCardProps {
  product: Product;
  priority?: boolean;
}

export function ProductCard({ product, priority = false }: ProductCardProps) {
  const { country, formatLocalPrice, toggleSaveProduct, isProductSaved } = useCountry();
  const saved = isProductSaved(product.id);
  const hasReferencePrice = product.originalPrice > product.currentBestPrice && product.originalPrice > 0;
  const discountPercent = hasReferencePrice
    ? Math.round(((product.originalPrice - product.currentBestPrice) / product.originalPrice) * 100)
    : 0;

  return (
    <article className="group relative rounded-[18px] sm:rounded-[22px] bg-white border border-[#DDE7E3] hover:border-[#BFD2CA] hover:shadow-[0_12px_34px_rgba(25,55,45,0.09)] transition-all duration-200 flex flex-col overflow-hidden min-w-0 h-full">
      <div className="relative w-full aspect-[4/3] bg-[#F8FAF9] overflow-hidden border-b border-[#EDF2F0]">
        <a
          href={`/${country}/product/${product.slug}`}
          className="absolute inset-0 p-2.5 sm:p-4 flex items-center justify-center"
          aria-label={`View ${product.title}`}
        >
          <img
            src={product.imageUrl}
            alt={product.title}
            loading={priority ? 'eager' : 'lazy'}
            className="w-full h-full object-contain transition-transform duration-300 group-hover:scale-[1.025]"
          />
        </a>

        {discountPercent > 0 && (
          <div className="absolute top-2 left-2 px-2 py-1 rounded-lg text-[9px] sm:text-[10px] font-extrabold bg-[#E5F8EF] text-[#08784B] border border-[#C7EEDC]">
            {discountPercent}% off
          </div>
        )}

        <button
          type="button"
          onClick={(event) => {
            event.preventDefault();
            event.stopPropagation();
            toggleSaveProduct(product.id);
          }}
          className={`absolute top-2 right-2 w-9 h-9 sm:w-10 sm:h-10 rounded-xl transition-all flex items-center justify-center border shadow-sm ${
            saved
              ? 'bg-[#0B8F58] text-white border-[#0B8F58]'
              : 'bg-white/95 text-[#60727A] border-[#DDE7E3] hover:text-[#08784B]'
          }`}
          aria-label={saved ? 'Remove from saved' : 'Save product'}
        >
          <Bookmark className={`w-4 h-4 ${saved ? 'fill-white' : ''}`} />
        </button>

        <div className="absolute bottom-2 left-2 flex items-center gap-1 px-2 py-1 rounded-lg bg-white/95 border border-[#DDE7E3] text-[9px] sm:text-[10px] text-[#60727A] shadow-sm">
          <Store className="w-3 h-3 text-[#0B8F58]" />
          <span>{product.offersCount} {product.offersCount === 1 ? 'store' : 'stores'}</span>
        </div>
      </div>

      <div className="p-2.5 sm:p-4 flex-1 flex flex-col min-w-0">
        <div className="min-w-0">
          <div className="text-[9px] sm:text-[10px] font-extrabold uppercase tracking-[0.08em] text-[#08784B] mb-1">
            {product.brand}
          </div>
          <a
            href={`/${country}/product/${product.slug}`}
            className="block font-bold text-xs sm:text-sm text-[#F8FAFC] group-hover:text-[#00E6A2] transition-colors line-clamp-2 leading-snug min-h-[2.5rem]"
          >
            {product.title}
          </a>
        </div>

        <div className="mt-auto pt-2.5 sm:pt-3">
          <div className="flex items-end justify-between gap-1.5 min-w-0">
            <div className="min-w-0">
              <span className="text-[8px] sm:text-[9px] text-[#73858D] block uppercase tracking-wider font-bold">
                Best listed price
              </span>
              <div className="text-[15px] sm:text-lg font-extrabold text-[#08784B] leading-tight mt-0.5 break-words">
                {formatLocalPrice(product.currentBestPrice)}
              </div>
              {hasReferencePrice && (
                <div className="text-[9px] sm:text-[10px] text-[#829198] line-through mt-0.5 font-medium">
                  {formatLocalPrice(product.originalPrice)}
                </div>
              )}
            </div>

            {/* Deal Score Badge */}
            <div className="text-right shrink-0">
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg text-[10px] font-extrabold bg-[#00D27A]/15 text-[#00D27A] border border-[#00D27A]/30 whitespace-nowrap">
                <span className="hidden sm:inline">Deal </span>Score: {product.dealScore}
              </span>
            )}
          </div>

          {/* View Prices CTA Button - Balanced Luxury Affordance */}
          <a
            href={`/${country}/product/${product.slug}`}
            className="w-full mt-2 py-2.5 px-3 rounded-xl bg-[#00D27A]/12 hover:bg-[#00D27A] text-[#00D27A] hover:text-[#060D12] border border-[#00D27A]/30 hover:border-[#00D27A] text-xs text-center touch-target flex items-center justify-center gap-1.5 font-bold tracking-wide transition-all duration-200 group/btn shadow-sm"
          >
            <span>View Prices</span>
            <ArrowRight className="w-3.5 h-3.5 transition-transform duration-200 group-hover/btn:translate-x-0.5" />
          </a>
        </div>
      </div>
    </article>
  );
}
