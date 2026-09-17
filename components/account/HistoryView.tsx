'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  Clock,
  TrendingDown,
  Trash2,
  Bookmark,
  ExternalLink,
  ShoppingBag,
  History,
} from 'lucide-react';
import { useCountry } from '@/context/CountryContext';
import { Product } from '@/lib/types';
import { getRecentlyViewedSlugs, clearRecentlyViewed } from '@/lib/recentlyViewed/client';
import { createSupabaseBrowserClient } from '@/lib/supabase/browser';

interface AlertEvent {
  id: string;
  alert_type: string;
  message: string;
  sent_at: string | null;
  created_at: string;
  products?: { name?: string; image_url?: string | null; slug?: string } | null;
}

export function HistoryView() {
  const { country, savedProductIds, toggleSaveProduct, formatLocalPrice } = useCountry();

  const [activeSubTab, setActiveSubTab] = useState<'browsing' | 'price_changes'>('browsing');
  const [recentProducts, setRecentProducts] = useState<Product[]>([]);
  const [alertEvents, setAlertEvents] = useState<AlertEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAuthed, setIsAuthed] = useState(false);

  useEffect(() => {
    let active = true;
    setLoading(true);

    const loadHistory = async () => {
      const supabase = createSupabaseBrowserClient();
      let authed = false;
      if (supabase) {
        const { data: { user } } = await supabase.auth.getUser();
        authed = Boolean(user);
      }
      if (!active) return;
      setIsAuthed(authed);

      const [catRes, eventsRes, recentRes] = await Promise.all([
        fetch(`/api/catalog?country=${encodeURIComponent(country)}`, { cache: 'no-store' })
          .then((res) => (res.ok ? res.json() : { products: [] }))
          .catch(() => ({ products: [] })),
        authed
          ? fetch(`/api/account/alert-events?country=${encodeURIComponent(country)}`, { cache: 'no-store' })
              .then((res) => (res.ok ? res.json() : { events: [] }))
              .catch(() => ({ events: [] }))
          : Promise.resolve({ events: [] }),
        authed
          ? fetch(`/api/account/recently-viewed?country=${encodeURIComponent(country)}`, { cache: 'no-store' })
              .then((res) => (res.ok ? res.json() : { items: [] }))
              .catch(() => ({ items: [] }))
          : Promise.resolve({ items: [] }),
      ]);

      if (!active) return;
      const prods: Product[] = Array.isArray(catRes.products) ? catRes.products : [];

      setAlertEvents(Array.isArray(eventsRes.events) ? eventsRes.events : []);

      // Recently viewed: merge server items with local storage slugs
      if (authed && Array.isArray(recentRes.items) && recentRes.items.length > 0) {
        setRecentProducts(recentRes.items.map((i: any) => i.product).filter(Boolean));
      } else {
        const slugs = getRecentlyViewedSlugs(country);
        const matched = slugs
          .map((s) => prods.find((p) => p.slug.toLowerCase() === s.toLowerCase()))
          .filter((p): p is Product => Boolean(p));
        setRecentProducts(matched);
      }

      setLoading(false);
    };

    loadHistory().catch(() => {
      if (active) setLoading(false);
    });

    return () => {
      active = false;
    };
  }, [country]);

  function handleClearBrowsingHistory() {
    clearRecentlyViewed(country);
    setRecentProducts([]);
    if (isAuthed) {
      fetch(`/api/account/recently-viewed?country=${encodeURIComponent(country)}`, {
        method: 'DELETE',
      }).catch(() => undefined);
    }
  }

  return (
    <div className="space-y-6">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-[#0c1913] flex items-center gap-2.5">
            <Clock className="h-6 w-6 text-[#00A859]" />
            <span>Activity & Browsing History</span>
          </h1>
          <p className="mt-1 text-xs text-[#5c7268]">
            Review products you recently inspected and price drops recorded over time.
          </p>
        </div>

        {activeSubTab === 'browsing' && recentProducts.length > 0 && (
          <button
            type="button"
            onClick={handleClearBrowsingHistory}
            className="inline-flex items-center gap-1.5 rounded-2xl border border-red-200 bg-red-50/50 px-3.5 py-2 text-xs font-bold text-red-600 hover:bg-red-100/70 transition-colors self-start sm:self-auto"
          >
            <Trash2 className="h-3.5 w-3.5" />
            <span>Clear browsing history</span>
          </button>
        )}
      </div>

      {/* Sub Tabs */}
      <div className="flex items-center gap-1 border-b border-[#dce6e1] pb-3">
        <button
          type="button"
          onClick={() => setActiveSubTab('browsing')}
          className={`rounded-xl px-3.5 py-1.5 text-xs font-bold transition-colors ${
            activeSubTab === 'browsing'
              ? 'bg-[#00C16A] text-white'
              : 'text-[#5c7268] hover:bg-white hover:text-[#0c1913]'
          }`}
        >
          Recently Viewed ({recentProducts.length})
        </button>
        <button
          type="button"
          onClick={() => setActiveSubTab('price_changes')}
          className={`rounded-xl px-3.5 py-1.5 text-xs font-bold transition-colors ${
            activeSubTab === 'price_changes'
              ? 'bg-[#00C16A] text-white'
              : 'text-[#5c7268] hover:bg-white hover:text-[#0c1913]'
          }`}
        >
          Observed Price Movements ({alertEvents.length})
        </button>
      </div>

      {/* Content */}
      {loading ? (
        <div className="min-h-[30vh] flex items-center justify-center text-xs text-[#73858D]">
          Loading activity history…
        </div>
      ) : activeSubTab === 'browsing' ? (
        recentProducts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {recentProducts.map((product) => {
              const isSaved = savedProductIds.includes(product.id);
              return (
                <div
                  key={product.id}
                  className="rounded-3xl border border-[#d6e3dd] bg-white p-5 shadow-[0_2px_12px_rgba(0,0,0,0.02)] hover:border-[#00C16A] transition-all flex flex-col justify-between"
                >
                  <div className="flex items-start gap-3.5">
                    <div className="h-20 w-20 rounded-2xl bg-[#f8faf9] p-1.5 border border-[#edf4f0] flex items-center justify-center shrink-0">
                      {product.imageUrl ? (
                        <img
                          src={product.imageUrl}
                          alt={product.title}
                          className="max-h-full max-w-full object-contain"
                        />
                      ) : (
                        <ShoppingBag className="h-8 w-8 text-[#98ad9f]" />
                      )}
                    </div>

                    <div className="min-w-0 flex-1">
                      <span className="text-[10px] font-black text-[#6b8076] uppercase tracking-wider">
                        {product.brand}
                      </span>
                      <Link
                        href={`/${country}/product/${product.slug}`}
                        className="mt-0.5 block text-xs font-bold text-[#0c1913] hover:text-[#00A859] line-clamp-2 leading-snug"
                      >
                        {product.title}
                      </Link>
                      <div className="mt-2 text-sm font-black text-[#0c1913]">
                        {formatLocalPrice(product.currentBestPrice)}
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-[#edf4f0] flex items-center justify-between">
                    <button
                      type="button"
                      onClick={() => toggleSaveProduct(product.id)}
                      className={`inline-flex items-center gap-1.5 text-xs font-bold transition-colors ${
                        isSaved ? 'text-[#00A859]' : 'text-[#71867c] hover:text-[#0c1913]'
                      }`}
                    >
                      <Bookmark className={`h-3.5 w-3.5 ${isSaved ? 'fill-[#00A859]' : ''}`} />
                      <span>{isSaved ? 'Saved' : 'Save'}</span>
                    </button>

                    <Link
                      href={`/${country}/product/${product.slug}`}
                      className="inline-flex items-center gap-1 text-xs font-bold text-[#00A859] hover:underline"
                    >
                      <span>Compare Prices</span>
                      <ExternalLink className="h-3 w-3" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="rounded-3xl border border-dashed border-[#d2e0da] bg-white p-12 text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[#e6f9f0] text-[#00A859]">
              <History className="h-8 w-8" />
            </div>
            <h2 className="mt-4 text-xl font-black text-[#0c1913]">No browsing history yet</h2>
            <p className="mt-2 text-xs text-[#5c7268] max-w-sm mx-auto leading-relaxed">
              When you search or inspect products across CatchThePrice, your recently viewed items will appear here for fast re-access.
            </p>
          </div>
        )
      ) : !isAuthed ? (
        <div className="rounded-3xl border border-dashed border-[#d2e0da] bg-white p-10 sm:p-12 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[#e6f9f0] text-[#00A859]">
            <TrendingDown className="h-8 w-8" />
          </div>
          <h2 className="mt-4 text-xl font-black text-[#0c1913]">Price Movement History</h2>
          <p className="mt-2 text-xs text-[#5c7268] max-w-md mx-auto leading-relaxed">
            Price change and trigger events are tied to your account alerts. Sign in or register to record historical price drops on your tracked products.
          </p>
          <div className="mt-6 flex items-center justify-center gap-3">
            <Link
              href={`/${country}/login`}
              className="inline-flex items-center gap-1.5 rounded-2xl bg-[#00C16A] px-5 py-2.5 text-xs font-black text-white hover:bg-[#00a85c] shadow-[0_4px_12px_rgba(0,193,106,0.25)] transition-all"
            >
              <span>Sign In</span>
            </Link>
          </div>
        </div>
      ) : alertEvents.length > 0 ? (
        <div className="space-y-3">
          {alertEvents.map((event) => (
            <div
              key={event.id}
              className="rounded-2xl border border-[#d6e3dd] bg-white p-4 flex items-center justify-between gap-3 shadow-[0_2px_8px_rgba(0,0,0,0.02)]"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#e6f9f0] text-[#00A859]">
                  <TrendingDown className="h-5 w-5" />
                </div>
                <div className="min-w-0">
                  <h3 className="text-xs font-bold text-[#0c1913] truncate">
                    {event.message || 'Price Drop Event'}
                  </h3>
                  <span className="text-[11px] text-[#71867c]">
                    Recorded on {new Date(event.created_at).toLocaleDateString()}
                  </span>
                </div>
              </div>

              {event.products?.slug && (
                <Link
                  href={`/${country}/product/${event.products.slug}`}
                  className="flex h-8 items-center gap-1 rounded-lg bg-[#00C16A] px-3 text-[11px] font-bold text-white hover:bg-[#00a85c] shrink-0"
                >
                  <span>View Product</span>
                  <ExternalLink className="h-3 w-3" />
                </Link>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="rounded-3xl border border-dashed border-[#d2e0da] bg-white p-12 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[#e6f9f0] text-[#00A859]">
            <TrendingDown className="h-8 w-8" />
          </div>
          <h2 className="mt-4 text-xl font-black text-[#0c1913]">No price movements recorded yet</h2>
          <p className="mt-2 text-xs text-[#5c7268] max-w-sm mx-auto leading-relaxed">
            As scheduled price checks run across retailers, any triggered price drops on your tracked products will be archived here.
          </p>
        </div>
      )}
    </div>
  );
}
