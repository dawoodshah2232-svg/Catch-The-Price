'use client';

import React from 'react';
import { Product } from '@/lib/types';
import { useCountry } from '@/context/CountryContext';
import { DealScoreBadge } from '@/components/product/DealScoreBadge';
import { Bookmark, Store, TrendingDown, Clock, ShieldCheck } from 'lucide-react';

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
    <div className="group relative rounded-2xl bg-ctp-surface border border-ctp hover:border-ctp-border-bright hover:shadow-xl transition-all duration-200 flex flex-col overflow-hidden">
      {/* Top Media Container */}
      <div className="relative w-full pt-[80%] sm:pt-[75%] bg-slate-950/60 overflow-hidden">
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

        {/* Drop Percentage Tag */}
        {discountPercent > 0 && (
          <div className="absolute top-2.5 left-2.5 flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-extrabold bg-emerald-500 text-slate-950 shadow-md">
            <TrendingDown className="w-3 h-3 stroke-[2.5]" />
            <span>-{discountPercent}%</span>
          </div>
        )}

        {/* Save / Bookmark Button */}
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            toggleSaveProduct(product.id);
          }}
          className={`absolute top-2.5 right-2.5 p-2 rounded-xl backdrop-blur-md transition-all touch-target flex items-center justify-center ${
            saved
              ? 'bg-emerald-500 text-slate-950 shadow-md'
              : 'bg-slate-900/80 text-slate-300 hover:text-white hover:bg-slate-800'
          }`}
          aria-label={saved ? 'Remove from saved' : 'Save product'}
        >
          <Bookmark className={`w-4 h-4 ${saved ? 'fill-slate-950' : ''}`} />
        </button>

        {/* Verified Merchant Badge Pill */}
        <div className="absolute bottom-2 left-2 flex items-center gap-1 px-2 py-0.5 rounded bg-slate-900/85 backdrop-blur-sm border border-ctp text-[10px] text-slate-300">
          <Store className="w-3 h-3 text-emerald-400" />
          <span>{product.offersCount} stores</span>
        </div>
      </div>

      {/* Product Content Body */}
      <div className="p-3.5 sm:p-4 flex-1 flex flex-col justify-between">
        <div>
          {/* Brand & Category */}
          <div className="flex items-center justify-between text-[11px] text-slate-400 mb-1">
            <span className="font-semibold uppercase tracking-wider text-emerald-400/90">
              {product.brand}
            </span>
            <span className="text-[10px] text-slate-400">{product.categoryName}</span>
          </div>

          {/* Product Title */}
          <a
            href={`/${country}/product/${product.slug}`}
            className="block font-semibold text-xs sm:text-sm text-slate-100 group-hover:text-emerald-300 transition-colors line-clamp-2 leading-snug"
          >
            {product.title}
          </a>
        </div>

        {/* Pricing & Deal Score Cluster */}
        <div className="mt-3 pt-3 border-t border-ctp/70">
          <div className="flex items-baseline justify-between gap-1 mb-2">
            <div>
              <div className="text-base sm:text-lg font-extrabold text-emerald-400 leading-none">
                {formatLocalPrice(product.currentBestPrice)}
              </div>
              {product.originalPrice > product.currentBestPrice && (
                <div className="text-[11px] text-slate-400 line-through mt-0.5">
                  {formatLocalPrice(product.originalPrice)}
                </div>
              )}
            </div>

            <DealScoreBadge score={product.dealScore} size="sm" />
          </div>

          {/* Store Name & CTA Button */}
          <div className="flex items-center justify-between gap-2 pt-2 border-t border-ctp/50">
            <span className="text-[11px] text-slate-400 truncate">
              at <strong className="text-slate-300">{product.bestMerchantName}</strong>
            </span>

            <a
              href={`/${country}/product/${product.slug}`}
              className="px-3 py-1.5 rounded-lg bg-emerald-500/10 hover:bg-emerald-500 text-emerald-400 hover:text-slate-950 font-semibold text-xs transition-all border border-emerald-500/25 shrink-0"
            >
              Compare →
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
