'use client';

import React from 'react';
import { Product } from '@/lib/types';
import { useCountry } from '@/context/CountryContext';
import { Bookmark, Store } from 'lucide-react';

interface ProductCardProps {
  product: Product;
  priority?: boolean;
}

export function ProductCard({ product, priority = false }: ProductCardProps) {
  const { country, formatLocalPrice, toggleSaveProduct, isProductSaved } = useCountry();
  const saved = isProductSaved(product.id);

  const discountPercent = Math.round(
    ((product.originalPrice - product.currentBestPrice) / product.originalPrice) * 100
  );

  return (
    <div className="group relative rounded-2xl bg-[#091217] border border-[#162633] hover:border-[#203648] hover:shadow-xl transition-all duration-200 flex flex-col overflow-hidden">
      {/* Top Media Container */}
      <div className="relative w-full pt-[75%] bg-[#071015] overflow-hidden">
        {/* Product Image */}
        <a
          href={`/${country}/product/${product.slug}`}
          className="absolute inset-0 p-4 flex items-center justify-center"
        >
          <img
            src={product.imageUrl}
            alt={product.title}
            loading={priority ? 'eager' : 'lazy'}
            className="max-h-full max-w-full object-contain transition-transform duration-300 group-hover:scale-105"
          />
        </a>

        {/* Percentage Drop Indicator (↓ 12%) */}
        {discountPercent > 0 && (
          <div className="absolute top-2.5 left-2.5 flex items-center gap-0.5 px-2 py-0.5 rounded-lg text-[11px] font-extrabold bg-[#00D27A] text-[#071015] shadow-sm">
            <span>↓ {discountPercent}%</span>
          </div>
        )}

        {/* Save / Heart Button */}
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            toggleSaveProduct(product.id);
          }}
          className={`absolute top-2.5 right-2.5 p-2 rounded-xl backdrop-blur-md transition-all touch-target flex items-center justify-center ${
            saved
              ? 'bg-[#00D27A] text-[#071015] shadow-md'
              : 'bg-[#091217]/80 text-[#CBD5E1] hover:text-white hover:bg-[#0f1c24] border border-[#162633]'
          }`}
          aria-label={saved ? 'Remove from saved' : 'Save product'}
        >
          <Bookmark className={`w-4 h-4 ${saved ? 'fill-[#071015]' : ''}`} />
        </button>

        {/* Store Count Badge */}
        <div className="absolute bottom-2 left-2 flex items-center gap-1 px-2 py-0.5 rounded-md bg-[#091217]/90 backdrop-blur-sm border border-[#162633] text-[10px] text-[#CBD5E1]">
          <Store className="w-3 h-3 text-[#00D27A]" />
          <span>{product.offersCount} stores</span>
        </div>
      </div>

      {/* Card Body */}
      <div className="p-3.5 sm:p-4 flex-1 flex flex-col justify-between">
        <div>
          {/* Brand */}
          <div className="text-[10px] font-bold uppercase tracking-wider text-[#00D27A] mb-1">
            {product.brand}
          </div>

          {/* Product Name */}
          <a
            href={`/${country}/product/${product.slug}`}
            className="block font-bold text-xs sm:text-sm text-[#F8FAFC] group-hover:text-[#00E6A2] transition-colors line-clamp-2 leading-snug"
          >
            {product.title}
          </a>
        </div>

        {/* Pricing & Deal Score */}
        <div className="mt-3 pt-3 border-t border-[#162633]">
          <div className="flex items-baseline justify-between gap-1 mb-2">
            <div>
              <span className="text-[10px] text-[#94A3B8] block uppercase tracking-wider font-semibold">
                Best Price
              </span>
              <div className="text-base sm:text-lg font-extrabold text-[#00D27A] leading-none mt-0.5">
                {formatLocalPrice(product.currentBestPrice)}
              </div>
              {product.originalPrice > product.currentBestPrice && (
                <div className="text-[11px] text-[#94A3B8] line-through mt-0.5 font-medium">
                  {formatLocalPrice(product.originalPrice)}
                </div>
              )}
            </div>

            {/* Deal Score Badge */}
            <div className="text-right shrink-0">
              <span className="inline-flex items-center gap-1 px-1.5 sm:px-2 py-0.5 rounded-lg text-[10px] font-extrabold bg-[#00D27A]/15 text-[#00D27A] border border-[#00D27A]/30 whitespace-nowrap">
                <span className="hidden sm:inline">Deal </span>Score: {product.dealScore}
              </span>
            </div>
          </div>

          {/* View Prices CTA Button - High-Conversion */}
          <a
            href={`/${country}/product/${product.slug}`}
            className="w-full mt-2.5 py-2.5 px-3 rounded-xl btn-conversion-primary text-xs text-center touch-target flex items-center justify-center font-extrabold tracking-wide"
          >
            View Prices
          </a>
        </div>
      </div>
    </div>
  );
}
