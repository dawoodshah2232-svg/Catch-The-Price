'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  Bookmark,
  Bell,
  Inbox,
  ArrowRight,
  Target,
  Sparkles,
  ShoppingBag,
  Scale,
  Clock,
  CheckCircle2,
} from 'lucide-react';
import { useCountry } from '@/context/CountryContext';
import { Product } from '@/lib/types';
import { ProductCard } from '@/components/search/ProductCard';
import { getRecentlyViewedSlugs } from '@/lib/recentlyViewed/client';
import { createSupabaseBrowserClient } from '@/lib/supabase/browser';

interface EnrichedAlert {
  id: string;
  productId: string;
  targetPrice: number;
  currentPrice: number;
  difference: number;
  differencePercent: number;
  isTargetReached: boolean;
  isActive: boolean;
  product?: {
    id: string;
    title: string;
    slug: string;
    imageUrl: string | null;
    currentBestPrice: number;
    currency: string;
    bestMerchantName?: string;
  };
}

export function AccountOverview() {
  const { country, savedProductIds, alerts, formatLocalPrice } = useCountry();

  const [catalog, setCatalog] = useState<Product[]>([]);
  const [enrichedAlerts, setEnrichedAlerts] = useState<EnrichedAlert[]>([]);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [recentProducts, setRecentProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    setLoading(true);

    const loadData = async () => {
      const supabase = createSupabaseBrowserClient();
      let hasUser = false;
      if (supabase) {
        const { data: { user } } = await supabase.auth.getUser();
        hasUser = Boolean(user);
      }
      if (!active) return;

      const [catRes, alertsRes, notifRes] = await Promise.all([
        fetch(`/api/catalog?country=${encodeURIComponent(country)}`, { cache: 'no-store' })
          .then((res) => (res.ok ? res.json() : { products: [] }))
          .catch(() => ({ products: [] })),
        hasUser
          ? fetch(`/api/account/alerts?country=${encodeURIComponent(country)}`, { cache: 'no-store' })
              .then((res) => (res.ok ? res.json() : { alerts: [] }))
              .catch(() => ({ alerts: [] }))
          : Promise.resolve({ alerts: [] }),
        hasUser
          ? fetch('/api/account/notifications', { cache: 'no-store' })
              .then((res) => (res.ok ? res.json() : { notifications: [] }))
              .catch(() => ({ notifications: [] }))
          : Promise.resolve({ notifications: [] }),
      ]);
      if (!active) return;
      const products: Product[] = Array.isArray(catRes.products) ? catRes.products : [];
      setCatalog(products);

      if (Array.isArray(alertsRes.alerts) && alertsRes.alerts.length > 0) {
        setEnrichedAlerts(alertsRes.alerts);
      } else {
        // Build fallback enriched alerts from client context
        const prodMap = new Map(products.map((p) => [p.id, p]));
        const localEnriched: EnrichedAlert[] = alerts
          .filter((a) => a.country === country && a.isActive)
          .map((a) => {
            const prod = prodMap.get(a.productId);
            const curr = prod?.currentBestPrice || a.currentPrice || 0;
            const target = a.targetPrice || 0;
            return {
              id: a.id,
              productId: a.productId,
              targetPrice: target,
              currentPrice: curr,
              difference: curr > target ? curr - target : 0,
              differencePercent: curr > target && curr > 0 ? ((curr - target) / curr) * 100 : 0,
              isTargetReached: target > 0 && curr > 0 && curr <= target,
              isActive: a.isActive,
              product: prod
                ? {
                    id: prod.id,
                    title: prod.title,
                    slug: prod.slug,
                    imageUrl: prod.imageUrl,
                    currentBestPrice: prod.currentBestPrice,
                    currency: prod.currency,
                    bestMerchantName: prod.bestMerchantName,
                  }
                : undefined,
            };
          });
        setEnrichedAlerts(localEnriched);
      }

      if (Array.isArray(notifRes.notifications)) {
        setNotifications(notifRes.notifications.slice(0, 4));
      }

      // Load recently viewed products
      const slugs = getRecentlyViewedSlugs(country);
      if (slugs.length > 0) {
        const matching = slugs
          .map((slug) => products.find((p) => p.slug.toLowerCase() === slug.toLowerCase()))
          .filter((p): p is Product => Boolean(p))
          .slice(0, 6);
        setRecentProducts(matching);
      }

      setLoading(false);
    };

    loadData().catch(() => {
      if (active) setLoading(false);
    });

    return () => {
      active = false;
    };
  }, [country, alerts]);

  const savedProducts = catalog.filter((p) => savedProductIds.includes(p.id));
  const targetReachedCount = enrichedAlerts.filter((a) => a.isTargetReached).length;

  if (loading) {
    return (
      <div className="rounded-3xl border border-[#d6e3dd] bg-white p-12 text-center shadow-[0_4px_16px_rgba(0,0,0,0.02)]">
        <div className="h-8 w-8 mx-auto animate-spin rounded-full border-2 border-[#00A859] border-t-transparent" />
        <p className="mt-3 text-xs text-[#5c7268]">Loading your dashboard overview...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* 1. Metric Overview Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <Link
          href={`/${country}/account/saved`}
          className="group rounded-3xl border border-[#d6e3dd] bg-white p-4 sm:p-5 shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:border-[#00C16A] hover:shadow-[0_8px_30px_rgba(0,193,106,0.12)] transition-all"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#5c7268]">Saved Products</span>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#e6f9f0] text-[#00A859] group-hover:bg-[#00C16A] group-hover:text-white transition-colors">
              <Bookmark className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-black text-[#0c1913]">
              {savedProductIds.length}
            </span>
            <span className="text-[11px] font-semibold text-[#73887e]">in watchlist</span>
          </div>
        </Link>

        <Link
          href={`/${country}/account/alerts`}
          className="group rounded-3xl border border-[#d6e3dd] bg-white p-4 sm:p-5 shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:border-[#00C16A] hover:shadow-[0_8px_30px_rgba(0,193,106,0.12)] transition-all"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#5c7268]">Active Alerts</span>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#eaf4fd] text-[#1c7ed6] group-hover:bg-[#1c7ed6] group-hover:text-white transition-colors">
              <Bell className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-black text-[#0c1913]">
              {enrichedAlerts.length}
            </span>
            <span className="text-[11px] font-semibold text-[#73887e]">tracking prices</span>
          </div>
        </Link>

        <div className="rounded-3xl border border-[#d6e3dd] bg-white p-4 sm:p-5 shadow-[0_4px_20px_rgba(0,0,0,0.03)]">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#5c7268]">Target Reached</span>
            <div
              className={`flex h-9 w-9 items-center justify-center rounded-xl transition-colors ${
                targetReachedCount > 0
                  ? 'bg-[#e6f9f0] text-[#00A859]'
                  : 'bg-[#f0f4f2] text-[#869990]'
              }`}
            >
              <Target className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span
              className={`text-2xl sm:text-3xl font-black ${
                targetReachedCount > 0 ? 'text-[#00A859]' : 'text-[#0c1913]'
              }`}
            >
              {targetReachedCount}
            </span>
            <span className="text-[11px] font-semibold text-[#73887e]">ready to buy</span>
          </div>
        </div>

        <Link
          href={`/${country}/account/notifications`}
          className="group rounded-3xl border border-[#d6e3dd] bg-white p-4 sm:p-5 shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:border-[#00C16A] hover:shadow-[0_8px_30px_rgba(0,193,106,0.12)] transition-all"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#5c7268]">Notifications</span>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#fbf2e9] text-[#e8590c] group-hover:bg-[#e8590c] group-hover:text-white transition-colors">
              <Inbox className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-black text-[#0c1913]">
              {notifications.length}
            </span>
            <span className="text-[11px] font-semibold text-[#73887e]">updates</span>
          </div>
        </Link>
      </div>

      {/* 2. Active Price Alerts Spotlight */}
      {enrichedAlerts.length > 0 && (
        <section className="rounded-3xl border border-[#d6e3dd] bg-white p-5 sm:p-7 shadow-[0_4px_20px_rgba(0,0,0,0.03)]">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="text-lg font-black text-[#0c1913] flex items-center gap-2">
                <Bell className="h-5 w-5 text-[#00A859]" />
                <span>Price Drops You Are Tracking</span>
              </h2>
              <p className="text-xs text-[#5c7268] mt-0.5">
                We monitor prices and alert you when an item drops to or below your target.
              </p>
            </div>
            <Link
              href={`/${country}/account/alerts`}
              className="hidden sm:inline-flex items-center gap-1 text-xs font-bold text-[#00A859] hover:underline"
            >
              <span>Manage all alerts</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
            {enrichedAlerts.slice(0, 3).map((alert) => (
              <div
                key={alert.id}
                className={`relative flex flex-col justify-between rounded-2xl border p-4 transition-all ${
                  alert.isTargetReached
                    ? 'border-[#00C16A] bg-[#f0fbf5] shadow-[0_4px_16px_rgba(0,193,106,0.12)]'
                    : 'border-[#e0ebe5] bg-[#fafcfb] hover:border-[#b8d1c5]'
                }`}
              >
                <div>
                  <div className="flex items-start gap-3">
                    {alert.product?.imageUrl ? (
                      <img
                        src={alert.product.imageUrl}
                        alt={alert.product.title}
                        className="h-14 w-14 rounded-xl object-contain bg-white p-1 border border-[#e2ece7] shrink-0"
                      />
                    ) : (
                      <div className="h-14 w-14 rounded-xl bg-[#e6f0eb] flex items-center justify-center shrink-0">
                        <ShoppingBag className="h-6 w-6 text-[#758a80]" />
                      </div>
                    )}
                    <div className="min-w-0 flex-1">
                      <Link
                        href={alert.product?.slug ? `/${country}/product/${alert.product.slug}` : '#'}
                        className="text-xs font-bold text-[#0c1913] line-clamp-2 hover:text-[#00A859]"
                      >
                        {alert.product?.title || 'Tracked Product'}
                      </Link>
                      {alert.product?.bestMerchantName && (
                        <div className="text-[10px] text-[#71867c] mt-0.5">
                          Best at <span className="font-semibold text-[#0c1913]">{alert.product.bestMerchantName}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-[#e2ece7] flex items-baseline justify-between">
                    <div>
                      <div className="text-[10px] uppercase font-bold text-[#71867c]">Current Best</div>
                      <div className="text-base font-black text-[#0c1913]">
                        {formatLocalPrice(alert.currentPrice)}
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="text-[10px] uppercase font-bold text-[#71867c]">Your Target</div>
                      <div className="text-base font-black text-[#00A859]">
                        {formatLocalPrice(alert.targetPrice)}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-3">
                  {alert.isTargetReached ? (
                    <div className="flex items-center justify-between rounded-xl bg-[#00C16A] px-3 py-2 text-white">
                      <span className="text-xs font-black flex items-center gap-1.5">
                        <CheckCircle2 className="h-3.5 w-3.5" />
                        Target Reached!
                      </span>
                      {alert.product?.slug && (
                        <Link
                          href={`/${country}/product/${alert.product.slug}`}
                          className="text-[11px] font-bold underline"
                        >
                          View Deal
                        </Link>
                      )}
                    </div>
                  ) : (
                    <div className="flex items-center justify-between rounded-xl bg-[#f0f5f2] px-3 py-1.5 text-[11px] text-[#556960]">
                      <span>Diff to target:</span>
                      <strong className="text-[#0c1913]">
                        {formatLocalPrice(alert.difference)} ({Math.round(alert.differencePercent)}% to drop)
                      </strong>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 3. Saved Products Preview */}
      <section className="rounded-3xl border border-[#d6e3dd] bg-white p-5 sm:p-7 shadow-[0_4px_20px_rgba(0,0,0,0.03)]">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="text-lg font-black text-[#0c1913] flex items-center gap-2">
              <Bookmark className="h-5 w-5 text-[#00A859]" />
              <span>Your Saved Products ({savedProductIds.length})</span>
            </h2>
            <p className="text-xs text-[#5c7268] mt-0.5">
              Keep an eye on pricing movements and retailer stock across top stores.
            </p>
          </div>
          {savedProducts.length > 0 && (
            <Link
              href={`/${country}/account/saved`}
              className="text-xs font-bold text-[#00A859] hover:underline flex items-center gap-1"
            >
              <span>View all ({savedProductIds.length})</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          )}
        </div>

        {savedProducts.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
            {savedProducts.slice(0, 4).map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-10 rounded-2xl border border-dashed border-[#d2e0da] bg-[#fbfdfc] px-4">
            <Bookmark className="mx-auto h-10 w-10 text-[#a0b5ab]" />
            <h3 className="mt-3 text-sm font-bold text-[#1f382e]">Your watchlist is currently empty</h3>
            <p className="mt-1 text-xs text-[#6a8077] max-w-sm mx-auto">
              Tap the heart icon on any product to save it here and receive price updates.
            </p>
            <div className="mt-5">
              <Link
                href={`/${country}/deals/all`}
                className="inline-flex items-center gap-2 rounded-xl bg-[#00C16A] px-4 py-2 text-xs font-black text-white hover:bg-[#00a85c] transition-colors"
              >
                <span>Browse Today&apos;s Deals</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>
        )}
      </section>

      {/* 4. Recently Viewed Products Strip */}
      {recentProducts.length > 0 && (
        <section className="rounded-3xl border border-[#d6e3dd] bg-white p-5 sm:p-7 shadow-[0_4px_20px_rgba(0,0,0,0.03)]">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="text-lg font-black text-[#0c1913] flex items-center gap-2">
                <Clock className="h-5 w-5 text-[#00A859]" />
                <span>Recently Viewed</span>
              </h2>
              <p className="text-xs text-[#5c7268] mt-0.5">
                Items you recently browsed on CatchThePrice.
              </p>
            </div>
            <Link
              href={`/${country}/account/history`}
              className="text-xs font-bold text-[#00A859] hover:underline flex items-center gap-1"
            >
              <span>Full History</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
            {recentProducts.map((product) => (
              <Link
                key={product.id}
                href={`/${country}/product/${product.slug}`}
                className="group rounded-2xl border border-[#e2ece7] bg-white p-3 hover:border-[#00C16A] hover:shadow-[0_4px_16px_rgba(0,193,106,0.1)] transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="h-24 w-full flex items-center justify-center p-1">
                    {product.imageUrl ? (
                      <img
                        src={product.imageUrl}
                        alt={product.title}
                        className="max-h-full max-w-full object-contain transition-transform group-hover:scale-105"
                      />
                    ) : (
                      <ShoppingBag className="h-8 w-8 text-[#a0b5ab]" />
                    )}
                  </div>
                  <h4 className="mt-2 text-[11px] font-bold text-[#0c1913] line-clamp-2 leading-snug group-hover:text-[#00A859]">
                    {product.title}
                  </h4>
                </div>
                <div className="mt-2 pt-2 border-t border-[#eef4f1]">
                  <span className="text-xs font-black text-[#0c1913]">
                    {formatLocalPrice(product.currentBestPrice)}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* 5. Quick Tools & Help Strip */}
      <section className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
        <Link
          href={`/${country}/deals/all`}
          className="flex items-center gap-3 rounded-2xl border border-[#d6e3dd] bg-white p-4 shadow-[0_4px_14px_rgba(0,0,0,0.02)] hover:border-[#00C16A] hover:bg-[#f9fcfb] transition-all"
        >
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#e6f9f0] text-[#00A859]">
            <Sparkles className="h-5 w-5" />
          </div>
          <div>
            <h4 className="text-xs font-black text-[#0c1913]">Today&apos;s Top Deals</h4>
            <p className="text-[11px] text-[#6b8076]">Highest scored discounts right now</p>
          </div>
        </Link>

        <Link
          href={`/${country}/compare`}
          className="flex items-center gap-3 rounded-2xl border border-[#d6e3dd] bg-white p-4 shadow-[0_4px_14px_rgba(0,0,0,0.02)] hover:border-[#00C16A] hover:bg-[#f9fcfb] transition-all"
        >
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#eaf4fd] text-[#1c7ed6]">
            <Scale className="h-5 w-5" />
          </div>
          <div>
            <h4 className="text-xs font-black text-[#0c1913]">Compare Products</h4>
            <p className="text-[11px] text-[#6b8076]">Side-by-side specs & prices</p>
          </div>
        </Link>

        <Link
          href={`/${country}/blog`}
          className="flex items-center gap-3 rounded-2xl border border-[#d6e3dd] bg-white p-4 shadow-[0_4px_14px_rgba(0,0,0,0.02)] hover:border-[#00C16A] hover:bg-[#f9fcfb] transition-all"
        >
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#fbf2e9] text-[#e8590c]">
            <ShoppingBag className="h-5 w-5" />
          </div>
          <div>
            <h4 className="text-xs font-black text-[#0c1913]">Buying Guides</h4>
            <p className="text-[11px] text-[#6b8076]">Expert advice before purchasing</p>
          </div>
        </Link>
      </section>
    </div>
  );
}
