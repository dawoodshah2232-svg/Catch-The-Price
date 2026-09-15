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

  const discountPercent = product.originalPrice > product.currentBestPrice
    ? Math.round(((product.originalPrice - product.currentBestPrice) / product.originalPrice) * 100)
    : 0;

  return (
    <div className="group relative rounded-2xl bg-white border border-[#DDE7E3] hover:border-[#A9CBBE] hover:shadow-[0_14px_34px_rgba(29,71,57,.10)] transition-all duration-200 flex flex-col overflow-hidden">
      <div className="relative w-full pt-[75%] bg-[#F7FAF8] overflow-hidden">
        <a href={`/${country}/product/${product.slug}`} className="absolute inset-0 p-4 flex items-center justify-center">
          <img
            src={product.imageUrl}
            alt={product.title}
            loading={priority ? 'eager' : 'lazy'}
            className="max-h-full max-w-full object-contain transition-transform duration-300 group-hover:scale-105"
          />
        </a>

        {discountPercent > 0 && (
          <div className="absolute top-2.5 left-2.5 flex items-center px-2 py-1 rounded-lg text-[10px] sm:text-[11px] font-extrabold bg-[#DDF8EB] text-[#08784B] border border-[#B9E7D2]">
            {discountPercent}% vs ref.
          </div>
        )}

        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            toggleSaveProduct(product.id);
          }}
          className={`absolute top-2.5 right-2.5 p-2 rounded-xl transition-all touch-target flex items-center justify-center ${
            saved
              ? 'bg-[#00D27A] text-[#071015] shadow-md'
              : 'bg-white/95 text-[#52636B] hover:text-[#08784B] border border-[#DDE7E3] shadow-sm'
          }`}
          aria-label={saved ? 'Remove from saved' : 'Save product'}
        >
          <Bookmark className={`w-4 h-4 ${saved ? 'fill-[#071015]' : ''}`} />
        </button>

        <div className="absolute bottom-2 left-2 flex items-center gap-1 px-2 py-1 rounded-md bg-white/95 border border-[#DDE7E3] text-[10px] text-[#52636B] shadow-sm">
          <Store className="w-3 h-3 text-[#08784B]" />
          <span>{product.offersCount} store{product.offersCount === 1 ? '' : 's'}</span>
        </div>
      </div>

      <div className="p-3.5 sm:p-4 flex-1 flex flex-col justify-between">
        <div>
          <div className="text-[10px] font-bold uppercase tracking-wider text-[#08784B] mb-1">{product.brand}</div>
          <a
            href={`/${country}/product/${product.slug}`}
            className="block font-bold text-xs sm:text-sm text-[#102027] group-hover:text-[#08784B] transition-colors line-clamp-2 leading-snug min-h-[2.5rem]"
          >
            {product.title}
          </a>
        </div>

        <div className="mt-3 pt-3 border-t border-[#E4ECE8]">
          <div className="flex items-baseline justify-between gap-1 mb-2">
            <div>
              <span className="text-[10px] text-[#73858D] block uppercase tracking-wider font-semibold">Lowest listed</span>
              <div className="text-base sm:text-lg font-extrabold text-[#08784B] leading-none mt-0.5">
                {formatLocalPrice(product.currentBestPrice)}
              </div>
              {product.originalPrice > product.currentBestPrice && (
                <div className="text-[10px] sm:text-[11px] text-[#8A999F] mt-1 font-medium">
                  Ref. <span className="line-through">{formatLocalPrice(product.originalPrice)}</span>
                </div>
              )}
            </div>

            {product.dealScore > 0 && (
              <div className="text-right shrink-0">
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg text-[10px] font-extrabold bg-[#EEF8F3] text-[#08784B] border border-[#CFE6DC] whitespace-nowrap">
                  <span className="hidden sm:inline">Deal </span>Score: {product.dealScore}
                </span>
              </div>
            )}
          </div>

          <a
            href={`/${country}/product/${product.slug}`}
            className="w-full mt-2 py-2.5 px-3 rounded-xl bg-[#F0FAF5] hover:bg-[#DDF8EB] text-[#08784B] border border-[#CFE6DC] hover:border-[#9FD2BC] text-xs text-center touch-target flex items-center justify-center gap-1.5 font-bold tracking-wide transition-all duration-200 group/btn"
          >
            <span>Compare prices</span>
            <ArrowRight className="w-3.5 h-3.5 transition-transform duration-200 group-hover/btn:translate-x-0.5" />
          </a>
        </div>
      </div>
    </div>
  );
}
