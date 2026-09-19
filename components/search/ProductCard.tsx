'use client';

import React from 'react';
import { Product } from '@/lib/types';
import { useCountry } from '@/context/CountryContext';
import { Bookmark, Store, TrendingDown, TrendingUp, Minus } from 'lucide-react';

interface ProductCardProps {
  product: Product;
  priority?: boolean;
  priceContext?: 'reference' | 'previous_observation';
}

function previousObservedPrice(product: Product): number | null {
  const history = [...(product.priceHistory || [])]
    .filter((point) => Number.isFinite(point.price) && point.price > 0)
    .sort((a, b) => a.date.localeCompare(b.date));
  return history.length > 1 ? history[history.length - 2].price : null;
}

export function ProductCard({ product, priority = false }: ProductCardProps) {
  const { country, formatLocalPrice, toggleSaveProduct, isProductSaved } = useCountry();
  const saved = isProductSaved(product.id);
  const previous = previousObservedPrice(product);
  const isPending = product.currentBestPrice <= 0;

  const discountPercent =
    product.originalPrice > product.currentBestPrice && product.currentBestPrice > 0
      ? Math.round(((product.originalPrice - product.currentBestPrice) / product.originalPrice) * 100)
      : 0;

  const status = isPending
    ? 'pending'
    : previous === null
      ? 'stable'
      : product.currentBestPrice < previous
        ? 'dropped'
        : product.currentBestPrice > previous
          ? 'increased'
          : 'stable';

  const statusMeta =
    status === 'pending'
      ? { label: 'Tracking', Icon: Store, classes: 'bg-[#14533e] text-white' }
      : status === 'dropped'
        ? { label: 'Price drop', Icon: TrendingDown, classes: 'bg-[#0B8F58] text-white' }
        : status === 'increased'
          ? { label: 'Price up', Icon: TrendingUp, classes: 'bg-[#D93838] text-white' }
          : { label: 'Verified', Icon: Minus, classes: 'bg-[#2177A5] text-white' };

  return (
    <div className="group relative flex flex-col overflow-hidden rounded-2xl border border-[#DDE7E3] bg-white transition-all duration-200 hover:border-[#08784B]/40 hover:shadow-[0_12px_32px_rgba(16,32,39,0.08)]">
      {/* Dominant Centered Product Image Canvas */}
      <div className="relative w-full aspect-square bg-[#F8FAFB] flex items-center justify-center p-4 sm:p-5 overflow-hidden rounded-t-2xl">
        <a
          href={`/${country}/product/${product.slug}`}
          className="flex items-center justify-center w-full h-full"
          aria-label={product.title}
        >
          <img
            src={product.imageUrl}
            alt={product.title}
            loading={priority ? 'eager' : 'lazy'}
            className="max-h-full max-w-full object-contain transition-transform duration-300 group-hover:scale-105"
          />
        </a>

        {/* Floating Discount or Status Pill (Clean & Non-Obtrusive) */}
        {discountPercent > 0 ? (
          <div className="absolute left-2.5 top-2.5 inline-flex items-center gap-1 rounded-lg px-2 py-0.5 text-[10px] font-extrabold bg-[#E5F8EF] text-[#08784B] border border-[#C7EEDC] shadow-xs">
            <TrendingDown className="h-3 w-3 stroke-[2.5]" />
            <span>{discountPercent}% OFF</span>
          </div>
        ) : (
          <div
            className={`absolute left-2.5 top-2.5 inline-flex items-center gap-1 rounded-lg px-2 py-0.5 text-[9px] font-black uppercase tracking-wider ${statusMeta.classes} shadow-xs`}
          >
            <statusMeta.Icon className="h-2.5 w-2.5" />
            <span>{statusMeta.label}</span>
          </div>
        )}

        {/* Bookmark Save Action */}
        <button
          type="button"
          onClick={(event) => {
            event.preventDefault();
            event.stopPropagation();
            toggleSaveProduct(product.id);
          }}
          className={`absolute right-2.5 top-2.5 flex h-8 w-8 items-center justify-center rounded-full border shadow-xs transition-all ${
            saved
              ? 'border-[#08784B] bg-[#08784B] text-white'
              : 'border-[#DDE7E3] bg-white/95 text-[#60727A] hover:text-[#08784B] hover:bg-white'
          }`}
          aria-label={saved ? 'Remove from saved' : 'Save product'}
        >
          <Bookmark className={`h-3.5 w-3.5 ${saved ? 'fill-current' : ''}`} />
        </button>
      </div>

      {/* Balanced Typography & Clean Pricing Area */}
      <div className="flex flex-1 flex-col p-3.5 sm:p-4">
        <div className="text-[10px] font-extrabold uppercase tracking-wider text-[#08784B]">
          {product.brand}
        </div>

        <a
          href={`/${country}/product/${product.slug}`}
          className="mt-1 line-clamp-2 min-h-[38px] text-[13px] sm:text-[14px] font-bold leading-snug text-[#102027] group-hover:text-[#08784B] transition-colors"
          title={product.title}
        >
          {product.title}
        </a>

        {/* Clean, Non-Overlapping Price Section */}
        <div className="mt-auto pt-3">
          <div className="flex items-baseline gap-2 flex-wrap">
            {product.currentBestPrice > 0 ? (
              <>
                <span className="text-base sm:text-lg font-black text-[#102027]">
                  {formatLocalPrice(product.currentBestPrice)}
                </span>
                {product.originalPrice > product.currentBestPrice && (
                  <span className="text-[11px] text-[#829198] line-through font-medium">
                    {formatLocalPrice(product.originalPrice)}
                  </span>
                )}
              </>
            ) : (
              <span className="text-xs font-bold text-[#08784B]">Checking stores...</span>
            )}
          </div>

          {/* Clean Retailer Presence Strip (No Giant Tables) */}
          <div className="mt-2.5 pt-2.5 border-t border-[#EDF2F0] flex items-center justify-between gap-2">
            <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-[#60727A]">
              <Store className="h-3.5 w-3.5 text-[#08784B]" />
              <span>Amazon • Noon</span>
            </span>
            <a
              href={`/${country}/product/${product.slug}`}
              className="inline-flex items-center gap-1 text-[11px] font-extrabold text-[#08784B] group-hover:translate-x-0.5 transition-transform"
            >
              <span>Compare</span>
              <span aria-hidden="true">›</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
