'use client';

import React, { useEffect, useState, useMemo } from 'react';
import Link from 'next/link';
import {
  Bookmark,
  Trash2,
  Bell,
  ArrowRight,
  ShoppingBag,
  ExternalLink,
  Store,
  Filter,
} from 'lucide-react';
import { useCountry } from '@/context/CountryContext';
import { Product } from '@/lib/types';
import { DealScoreBadge } from '@/components/product/DealScoreBadge';

export function SavedProductsView() {
  const { country, savedProductIds, toggleSaveProduct, formatLocalPrice } = useCountry();

  const [catalog, setCatalog] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState<'date' | 'price_low' | 'discount'>('date');

  useEffect(() => {
    let active = true;
    setLoading(true);
    fetch(`/api/catalog?country=${encodeURIComponent(country)}`, { cache: 'no-store' })
      .then((res) => (res.ok ? res.json() : { products: [] }))
      .then((data) => {
        if (!active) return;
        setCatalog(Array.isArray(data.products) ? data.products : []);
      })
      .catch(() => {
        if (active) setCatalog([]);
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [country]);

  const savedProducts = useMemo(() => {
    const list = catalog.filter((p) => savedProductIds.includes(p.id));

    if (sortBy === 'price_low') {
      return [...list].sort((a, b) => a.currentBestPrice - b.currentBestPrice);
    }
    if (sortBy === 'discount') {
      return [...list].sort((a, b) => {
        const discA = a.originalPrice > a.currentBestPrice ? (a.originalPrice - a.currentBestPrice) / a.originalPrice : 0;
        const discB = b.originalPrice > b.currentBestPrice ? (b.originalPrice - b.currentBestPrice) / b.originalPrice : 0;
        return discB - discA;
      });
    }
    return list;
  }, [catalog, savedProductIds, sortBy]);

  return (
    <div className="space-y-6">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-[#0c1913] flex items-center gap-2.5">
            <Bookmark className="h-6 w-6 text-[#00A859]" />
            <span>Saved Products</span>
          </h1>
          <p className="mt-1 text-xs text-[#5c7268]">
            {savedProducts.length} {savedProducts.length === 1 ? 'item' : 'items'} in your watchlist
          </p>
        </div>

        {savedProducts.length > 0 && (
          <div className="flex items-center gap-2 self-start sm:self-auto">
            <Filter className="h-4 w-4 text-[#758a80]" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="h-9 rounded-xl border border-[#d2e0da] bg-white px-3 text-xs font-bold text-[#0c1913] outline-none focus:border-[#00C16A] focus:ring-2 focus:ring-[#00C16A]/20"
            >
              <option value="date">Sort: Recently Added</option>
              <option value="price_low">Sort: Lowest Price</option>
              <option value="discount">Sort: Biggest Discount</option>
            </select>
          </div>
        )}
      </div>

      {/* Product List */}
      {loading ? (
        <div className="min-h-[30vh] flex items-center justify-center text-xs text-[#73858D]">
          Loading your saved products…
        </div>
      ) : savedProducts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {savedProducts.map((product) => {
            const hasDiscount = product.originalPrice > product.currentBestPrice;
            const savings = hasDiscount ? product.originalPrice - product.currentBestPrice : 0;

            return (
              <div
                key={product.id}
                className="group relative flex flex-col justify-between rounded-3xl border border-[#d6e3dd] bg-white p-5 shadow-[0_4px_16px_rgba(0,0,0,0.02)] hover:border-[#00C16A] hover:shadow-[0_8px_30px_rgba(0,193,106,0.1)] transition-all"
              >
                <div>
                  {/* Top image & badges */}
                  <div className="relative h-44 w-full flex items-center justify-center rounded-2xl bg-[#fafcfb] p-3 border border-[#eef4f1]">
                    {product.imageUrl ? (
                      <img
                        src={product.imageUrl}
                        alt={product.title}
                        className="max-h-full max-w-full object-contain transition-transform group-hover:scale-105"
                      />
                    ) : (
                      <ShoppingBag className="h-12 w-12 text-[#a0b5ab]" />
                    )}

                    <div className="absolute top-2.5 left-2.5 flex flex-col gap-1">
                      {hasDiscount && (
                        <span className="rounded-lg bg-[#00C16A] px-2 py-0.5 text-[10px] font-black text-white shadow-sm">
                          Save {formatLocalPrice(savings)}
                        </span>
                      )}
                      {product.dealScore >= 80 && (
                        <DealScoreBadge score={product.dealScore} size="sm" showLabel={false} />
                      )}
                    </div>

                    <button
                      type="button"
                      onClick={() => toggleSaveProduct(product.id)}
                      title="Remove from saved"
                      aria-label="Remove from saved"
                      className="absolute top-2.5 right-2.5 flex h-8 w-8 items-center justify-center rounded-xl bg-white/90 text-[#e03131] hover:bg-red-50 shadow-sm border border-slate-200 transition-colors"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>

                  {/* Brand & Category */}
                  <div className="mt-3 flex items-center justify-between text-[11px] font-bold text-[#6b8076]">
                    <span>{product.brand}</span>
                    <span>{product.categoryName}</span>
                  </div>

                  {/* Title */}
                  <Link
                    href={`/${country}/product/${product.slug}`}
                    className="mt-1 block text-sm font-black text-[#0c1913] line-clamp-2 hover:text-[#00A859] leading-snug"
                  >
                    {product.title}
                  </Link>

                  {/* Pricing info */}
                  <div className="mt-4 flex items-baseline justify-between border-t border-[#edf4f0] pt-3">
                    <div>
                      <div className="text-[10px] uppercase font-bold text-[#71867c]">Best Current Price</div>
                      <div className="flex items-baseline gap-2">
                        <span className="text-xl font-black text-[#0c1913]">
                          {formatLocalPrice(product.currentBestPrice)}
                        </span>
                        {hasDiscount && (
                          <span className="text-xs text-[#8e9f96] line-through font-semibold">
                            {formatLocalPrice(product.originalPrice)}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="text-[10px] text-[#71867c] flex items-center gap-1 justify-end">
                        <Store className="h-3 w-3" />
                        <span>{product.offersCount || product.offers?.length || 1} stores</span>
                      </div>
                      <div className="text-xs font-bold text-[#00A859] mt-0.5 truncate max-w-[120px]">
                        {product.bestMerchantName || 'Best Price'}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Bottom Actions */}
                <div className="mt-4 grid grid-cols-2 gap-2">
                  <Link
                    href={`/${country}/product/${product.slug}`}
                    className="flex h-10 items-center justify-center gap-1.5 rounded-xl border border-[#d2e0da] bg-white text-xs font-bold text-[#0c1913] hover:bg-[#f2f7f4] hover:border-[#b8cfc5] transition-colors"
                  >
                    <span>Compare</span>
                    <ExternalLink className="h-3.5 w-3.5" />
                  </Link>

                  <Link
                    href={`/${country}/account/alerts?productId=${product.id}`}
                    className="flex h-10 items-center justify-center gap-1.5 rounded-xl bg-[#00C16A] text-xs font-black text-white hover:bg-[#00a85c] shadow-[0_2px_8px_rgba(0,193,106,0.2)] transition-all"
                  >
                    <Bell className="h-3.5 w-3.5" />
                    <span>Track Price</span>
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="rounded-3xl border border-dashed border-[#d2e0da] bg-white p-12 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[#e6f9f0] text-[#00A859]">
            <Bookmark className="h-8 w-8" />
          </div>
          <h2 className="mt-4 text-xl font-black text-[#0c1913]">No saved products yet</h2>
          <p className="mt-2 text-xs text-[#5c7268] max-w-md mx-auto leading-relaxed">
            Click the heart icon on any product across CatchThePrice to save it to your watchlist. We&apos;ll monitor retailer prices and notify you when a drop happens.
          </p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <Link
              href={`/${country}/deals/all`}
              className="inline-flex items-center gap-2 rounded-2xl bg-[#00C16A] px-5 py-2.5 text-xs font-black text-white hover:bg-[#00a85c] transition-all"
            >
              <span>Explore Deals</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href={`/${country}/search`}
              className="inline-flex items-center gap-2 rounded-2xl border border-[#d2e0da] bg-white px-5 py-2.5 text-xs font-bold text-[#0c1913] hover:bg-[#f5f9f7] transition-colors"
            >
              <span>Search Products</span>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
