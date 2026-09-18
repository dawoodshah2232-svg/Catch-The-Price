'use client';

import React from 'react';
import { Product } from '@/lib/types';
import { useCountry } from '@/context/CountryContext';
import { Bookmark, Minus, Store, TrendingDown, TrendingUp } from 'lucide-react';

interface ProductCardProps { product: Product; priority?: boolean; priceContext?: 'reference'|'previous_observation'; }

function previousObservedPrice(product: Product): number | null {
  const history = [...(product.priceHistory || [])].filter(point => Number.isFinite(point.price) && point.price > 0).sort((a, b) => a.date.localeCompare(b.date));
  return history.length > 1 ? history[history.length - 2].price : null;
}

export function ProductCard({ product, priority = false }: ProductCardProps) {
  const { country, formatLocalPrice, toggleSaveProduct, isProductSaved } = useCountry();
  const saved = isProductSaved(product.id);
  const previous = previousObservedPrice(product);
  const status = previous === null ? 'stable' : product.currentBestPrice < previous ? 'dropped' : product.currentBestPrice > previous ? 'increased' : 'stable';
  const statusMeta = status === 'dropped'
    ? { label: 'Price dropped', Icon: TrendingDown, classes: 'bg-[#0b9a58] text-white' }
    : status === 'increased'
      ? { label: 'Price increased', Icon: TrendingUp, classes: 'bg-[#e24747] text-white' }
      : { label: 'Price stable', Icon: Minus, classes: 'bg-[#2688bd] text-white' };
  const liveOffers = [...product.offers].filter(offer => offer.inStock).sort((a, b) => a.price - b.price).slice(0, 3);
  const offers = liveOffers;

  return <div className="group relative flex flex-col overflow-hidden rounded-[7px] border border-[#e0e4e2] bg-white transition-all hover:border-[#a9c9bb] hover:shadow-[0_7px_20px_rgba(25,55,45,.08)]">
    <div className="relative w-full overflow-hidden bg-white pt-[68%]">
      <a href={`/${country}/product/${product.slug}`} className="absolute inset-0 flex items-center justify-center p-3"><img src={product.imageUrl} alt={product.title} loading={priority ? 'eager' : 'lazy'} className="max-h-full max-w-full object-contain transition-transform group-hover:scale-[1.03]" /></a>
      <div className={`absolute left-2 top-2 inline-flex items-center gap-1 rounded-[4px] px-2 py-1 text-[8px] font-black uppercase tracking-wide ${statusMeta.classes}`}><statusMeta.Icon className="h-3 w-3" />{statusMeta.label}</div>
      <button type="button" onClick={event => { event.preventDefault(); event.stopPropagation(); toggleSaveProduct(product.id); }} className={`absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-full border shadow-sm ${saved ? 'border-[#087f4e] bg-[#087f4e] text-white' : 'border-[#e0e4e2] bg-white text-[#66767b]'}`} aria-label={saved ? 'Remove from saved' : 'Save product'}><Bookmark className={`h-3.5 w-3.5 ${saved ? 'fill-current' : ''}`} /></button>
    </div>
    <div className="flex flex-1 flex-col p-3">
      <div className="text-[9px] font-bold uppercase tracking-[.08em] text-[#77857f]">{product.brand}</div>
      <a href={`/${country}/product/${product.slug}`} className="mt-1 min-h-[32px] line-clamp-2 text-[11px] font-bold leading-[1.35] text-[#17262c] group-hover:text-[#08784b] sm:text-[12px]">{product.title}</a>
      <div className="mt-auto pt-3">
        <div className="text-[9px] font-semibold text-[#5b7167]">{product.currentBestPrice > 0 ? 'Lowest price' : 'UAE Retailers'}</div>
        <div className="mt-0.5 flex flex-wrap items-baseline gap-1.5">
          {product.currentBestPrice > 0 ? (
            <>
              <span className="text-[15px] font-black text-[#111f24] sm:text-[17px]">{formatLocalPrice(product.currentBestPrice)}</span>
              {product.originalPrice > product.currentBestPrice && <span className="text-[9px] text-[#9aa4a0] line-through">{formatLocalPrice(product.originalPrice)}</span>}
            </>
          ) : (
            <span className="text-[12px] font-bold text-[#08784b]">Offers pending verification</span>
          )}
        </div>
        <div className="mt-2 space-y-1 border-t border-[#edf1ef] pt-2">
          {offers.length ? (
            offers.map(offer => (
              <div key={offer.id} className="flex items-center justify-between gap-2 text-[9px]">
                <span className="truncate font-semibold text-[#53645e]">{offer.merchantName}</span>
                <span className="shrink-0 font-bold text-[#22342d]">{formatLocalPrice(offer.price)}</span>
              </div>
            ))
          ) : (
            <div className="flex items-center justify-between gap-2 text-[9px]">
              <span className="truncate font-semibold text-[#53645e]">{product.bestMerchantName}</span>
              <span className="shrink-0 text-[#77857f]">Tracking Amazon & Noon</span>
            </div>
          )}
        </div>
        <div className="mt-2 flex items-center justify-between gap-2">
          <span className="inline-flex items-center gap-1 text-[9px] text-[#697873]">
            <Store className="h-3 w-3 text-[#08784b]" />
            {product.offersCount > 0 ? `${product.offersCount} store${product.offersCount === 1 ? '' : 's'}` : 'Stores tracking'}
          </span>
          <a href={`/${country}/product/${product.slug}`} className="text-[9px] font-black text-[#08784b]">VIEW ›</a>
        </div>
      </div>
    </div>
  </div>;
}
