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

  const discountPercent = product.originalPrice > product.currentBestPrice && product.originalPrice > 0
    ? Math.round(((product.originalPrice - product.currentBestPrice) / product.originalPrice) * 100)
    : 0;

  return (
    <article className="group relative rounded-2xl bg-[#091217] border border-[#162633] hover:border-[#203648] transition-all duration-200 flex flex-col overflow-hidden min-w-0 h-full">
      <div className="relative w-full aspect-[4/3] bg-[#071015] overflow-hidden">
        <a
          href={`/${country}/product/${product.slug}`}
          className="absolute inset-0 p-2.5 sm:p-4 flex items-center justify-center"
          aria-label={`View ${product.title}`}
        >
          <img
            src={product.imageUrl}
            alt={product.title}
            loading={priority ? 'eager' : 'lazy'}
            className="w-full h-full object-contain transition-transform duration-300 group-hover:scale-[1.03]"
          />
        </a>

        {discountPercent > 0 && (
          <div className="absolute top-2 left-2 flex items-center px-2 py-0.5 rounded-lg text-[10px] sm:text-[11px] font-extrabold bg-[#00D27A]/95 text-[#071015]">
            ↓ {discountPercent}%
          </div>
        )}

        <button
          type="button"
          onClick={(event) => {
            event.preventDefault();
            event.stopPropagation();
            toggleSaveProduct(product.id);
          }}
          className={`absolute top-2 right-2 min-w-[40px] min-h-[40px] p-2 rounded-xl backdrop-blur-md transition-all flex items-center justify-center ${
            saved
              ? 'bg-[#00D27A] text-[#071015]'
              : 'bg-[#091217]/88 text-[#CBD5E1] border border-[#20313d]'
          }`}
          aria-label={saved ? 'Remove from saved' : 'Save product'}
        >
          <Bookmark className={`w-4 h-4 ${saved ? 'fill-[#071015]' : ''}`} />
        </button>

        <div className="absolute bottom-2 left-2 flex items-center gap-1 px-2 py-0.5 rounded-md bg-[#091217]/92 backdrop-blur-sm border border-[#162633] text-[9px] sm:text-[10px] text-[#CBD5E1]">
          <Store className="w-3 h-3 text-[#00D27A]" />
          <span>{product.offersCount} offer{product.offersCount === 1 ? '' : 's'}</span>
        </div>
      </div>

      <div className="p-3 sm:p-4 flex-1 flex flex-col justify-between min-w-0">
        <div className="min-w-0">
          <div className="text-[9px] sm:text-[10px] font-bold uppercase tracking-wider text-[#00D27A] mb-1">
            {product.brand}
          </div>
          <a
            href={`/${country}/product/${product.slug}`}
            className="block font-bold text-[13px] sm:text-sm text-[#F8FAFC] group-hover:text-[#00E6A2] transition-colors line-clamp-2 leading-snug break-words"
          >
            {product.title}
          </a>
        </div>

        <div className="mt-3 pt-3 border-t border-[#162633]">
          <div className="flex items-end justify-between gap-2 min-w-0">
            <div className="min-w-0">
              <span className="text-[9px] sm:text-[10px] text-[#94A3B8] block uppercase tracking-wider font-semibold">
                Lowest listed price
              </span>
              <div className="text-[17px] sm:text-lg font-extrabold text-[#00D27A] leading-tight mt-0.5 break-words">
                {formatLocalPrice(product.currentBestPrice)}
              </div>
              {product.originalPrice > product.currentBestPrice && (
                <div className="text-[10px] sm:text-[11px] text-[#94A3B8] line-through mt-0.5 font-medium">
                  {formatLocalPrice(product.originalPrice)}
                </div>
              )}
            </div>

            {product.dealScore > 0 && (
              <span className="shrink-0 inline-flex items-center px-1.5 sm:px-2 py-0.5 rounded-lg text-[9px] sm:text-[10px] font-extrabold bg-[#00D27A]/10 text-[#55e7aa] border border-[#00D27A]/25 whitespace-nowrap">
                <span className="hidden sm:inline">Deal&nbsp;</span>Score: {product.dealScore}
              </span>
            )}
          </div>

          <a
            href={`/${country}/product/${product.slug}`}
            className="w-full mt-3 min-h-[44px] px-3 rounded-xl text-[11px] sm:text-xs text-center flex items-center justify-center font-bold tracking-wide bg-[#0d211d] text-[#9de7c5] border border-[#245044] hover:bg-[#103029] hover:border-[#00D27A]/50 transition-colors"
          >
            Compare prices
          </a>
        </div>
      </div>
    </article>
  );
}
