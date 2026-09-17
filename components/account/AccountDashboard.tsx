'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { useCountry } from '@/context/CountryContext';
import { ProductCard } from '@/components/search/ProductCard';
import { Product } from '@/lib/types';
import { clearRecentlyViewed, getRecentlyViewedSlugs } from '@/lib/recentlyViewed/client';
import { createSupabaseBrowserClient } from '@/lib/supabase/browser';
import { Bell, Bookmark, CheckCircle2, Clock, Info, Settings, ShieldCheck, Trash2 } from 'lucide-react';

type TabId = 'saved' | 'tracked' | 'alerts' | 'recent' | 'settings';

type AlertHistoryEvent = {
  id: string;
  alert_type: string;
  message: string;
  sent_at: string | null;
  created_at: string;
  products: { name?: string; image_url?: string | null } | Array<{ name?: string; image_url?: string | null }> | null;
};

function eventProduct(event: AlertHistoryEvent) {
  if (!event.products) return null;
  return Array.isArray(event.products) ? event.products[0] || null : event.products;
}

function formatEventTime(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat('en', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' }).format(date);
}

export function AccountDashboard() {
  const searchParams = useSearchParams();
  const requestedTab = searchParams.get('tab') as TabId | null;
  const [activeTab, setActiveTab] = useState<TabId>(
    requestedTab && ['saved', 'tracked', 'alerts', 'recent', 'settings'].includes(requestedTab)
      ? requestedTab
      : 'saved'
  );
  const [catalog, setCatalog] = useState<Product[]>([]);
  const [catalogLoading, setCatalogLoading] = useState(true);
  const [historyEvents, setHistoryEvents] = useState<AlertHistoryEvent[]>([]);
  const [historyLoading, setHistoryLoading] = useState(true);
  const [recentSlugs, setRecentSlugs] = useState<string[]>([]);

  const {
    country,
    countryInfo,
    savedProductIds,
    alerts,
    removeAlert,
    formatLocalPrice,
  } = useCountry();

  useEffect(() => {
    let active = true;
    setCatalogLoading(true);
    fetch(`/api/catalog?country=${encodeURIComponent(country)}`, { cache: 'no-store' })
      .then(async (response) => (response.ok ? response.json() : { products: [] }))
      .then((payload) => {
        if (!active) return;
        setCatalog(Array.isArray(payload.products) ? payload.products : []);
      })
      .catch(() => {
        if (active) setCatalog([]);
      })
      .finally(() => {
        if (active) setCatalogLoading(false);
      });

    return () => {
      active = false;
    };
  }, [country]);

  useEffect(() => {
    let active = true;
    setHistoryLoading(true);

    const loadHistory = async () => {
      const supabase = createSupabaseBrowserClient();
      if (!supabase) {
        if (active) setHistoryLoading(false);
        return;
      }

      const { data: { user } } = await supabase.auth.getUser();
      if (!active) return;
      if (!user) {
        setHistoryEvents([]);
        setHistoryLoading(false);
        return;
      }

      try {
        const response = await fetch(`/api/account/alert-events?country=${encodeURIComponent(country)}`, { cache: 'no-store' });
        if (!active) return;
        const payload = response.ok ? await response.json() : { events: [] };
        setHistoryEvents(Array.isArray(payload.events) ? payload.events : []);
      } catch {
        if (active) setHistoryEvents([]);
      } finally {
        if (active) setHistoryLoading(false);
      }
    };

    loadHistory().catch(() => {
      if (active) setHistoryLoading(false);
    });

    return () => {
      active = false;
    };
  }, [country]);

  useEffect(() => {
    const refresh = () => setRecentSlugs(getRecentlyViewedSlugs(country));
    refresh();
    window.addEventListener('ctp:recently-viewed-updated', refresh);
    return () => window.removeEventListener('ctp:recently-viewed-updated', refresh);
  }, [country]);

  const savedProducts = catalog.filter((product) => savedProductIds.includes(product.id));
  const recentProducts = useMemo(() => {
    const bySlug = new Map(catalog.map((product) => [product.slug.toLowerCase(), product]));
    return recentSlugs
      .map((slug) => bySlug.get(slug.toLowerCase()))
      .filter((product): product is Product => Boolean(product));
  }, [catalog, recentSlugs]);

  const tabs: { id: TabId; label: string; icon: React.ElementType; count?: number }[] = [
    { id: 'saved', label: 'Saved', icon: Bookmark, count: savedProductIds.length },
    { id: 'tracked', label: 'Tracked', icon: Bell, count: alerts.length },
    { id: 'alerts', label: 'Alert history', icon: CheckCircle2, count: historyEvents.length },
    { id: 'recent', label: 'Recently viewed', icon: Clock, count: recentProducts.length },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  const clearRecent = () => {
    clearRecentlyViewed(country);
    setRecentSlugs([]);
  };

  return (
    <div className="min-h-screen bg-[#F4F7F6]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 sm:py-9 space-y-6">
        <section className="rounded-[26px] bg-white border border-[#DDE7E3] p-5 sm:p-6 shadow-[0_10px_28px_rgba(25,55,45,0.05)]">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="text-[10px] uppercase tracking-[0.16em] font-extrabold text-[#08784B]">Your shopping space</div>
              <h1 className="text-xl sm:text-2xl font-extrabold text-[#102027] mt-1">Saved products & price tracking</h1>
              <p className="text-xs sm:text-sm text-[#60727A] mt-1.5 max-w-2xl">
                Market: {countryInfo.flag} {countryInfo.name} ({countryInfo.currency}). Device saves work immediately; signed-in shoppers also sync eligible live products and price-alert preferences with their account.
              </p>
            </div>
            <div className="flex gap-2">
              <Stat value={savedProductIds.length} label="Saved" />
              <Stat value={alerts.length} label="Tracked" />
            </div>
          </div>
        </section>

        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const selected = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`shrink-0 min-h-[42px] inline-flex items-center gap-2 rounded-xl border px-3 sm:px-4 text-xs font-bold transition-colors ${
                  selected
                    ? 'bg-[#0B8F58] border-[#0B8F58] text-white'
                    : 'bg-white border-[#DDE7E3] text-[#60727A] hover:border-[#BFD2CA] hover:text-[#08784B]'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
                {tab.count !== undefined && <span className={`text-[10px] ${selected ? 'text-white/80' : 'text-[#829198]'}`}>{tab.count}</span>}
              </button>
            );
          })}
        </div>

        {activeTab === 'saved' && (
          <section className="space-y-4">
            <SectionHeader title="Saved products" subtitle="Products saved on this device and synced live-product saves when you are signed in." />
            {catalogLoading ? (
              <EmptyCard title="Loading your saved products…" text="Checking the current catalog for your selected market." />
            ) : savedProducts.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-5">
                {savedProducts.map((product) => <ProductCard key={product.id} product={product} />)}
              </div>
            ) : (
              <EmptyCard
                title="No saved products yet"
                text="Save a product from any product card or product page and it will appear here. We do not insert sample products into your wishlist."
                action={<a href={`/${country}/search`} className="inline-flex mt-3 rounded-xl bg-[#0B8F58] text-white px-3 py-2 text-xs font-extrabold">Browse products</a>}
              />
            )}
          </section>
        )}

        {activeTab === 'tracked' && (
          <section className="space-y-4">
            <SectionHeader title="Tracked prices" subtitle="Signed-in price-alert preferences sync from the account-backed watchlist; preview/device entries stay local." />
            {alerts.length === 0 ? (
              <EmptyCard
                title="No active price tracking"
                text="Open a live product and save a price alert. Trigger evaluation is real; notification delivery will only be marked delivered after a verified provider is connected."
              />
            ) : (
              <div className="space-y-3">
                {alerts.map((alert) => (
                  <div key={alert.id} className="rounded-2xl bg-white border border-[#DDE7E3] p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-3 min-w-0">
                      {alert.productImage ? (
                        <img src={alert.productImage} alt={alert.productTitle} className="w-14 h-14 rounded-xl object-contain bg-[#F8FAF9] p-1 border border-[#E1E9E6] shrink-0" />
                      ) : (
                        <div className="w-14 h-14 rounded-xl bg-[#F8FAF9] border border-[#E1E9E6] shrink-0 flex items-center justify-center"><Bell className="w-5 h-5 text-[#0B8F58]" /></div>
                      )}
                      <div className="min-w-0">
                        <h3 className="font-extrabold text-sm text-[#102027] truncate">{alert.productTitle}</h3>
                        <p className="text-xs text-[#60727A] mt-1">
                          {alert.currentPrice > 0 && <>Current: <strong className="text-[#08784B]">{formatLocalPrice(alert.currentPrice)}</strong></>}
                          {alert.targetPrice ? `${alert.currentPrice > 0 ? ' · ' : ''}Target: ${formatLocalPrice(alert.targetPrice)}` : `${alert.currentPrice > 0 ? ' · ' : ''}Any drop preference`}
                        </p>
                        <p className="text-[10px] text-[#829198] mt-1">Account-backed when signed in. Delivery status is tracked separately from the saved trigger.</p>
                      </div>
                    </div>
                    <button type="button" onClick={() => removeAlert(alert.id)} className="self-end sm:self-auto w-10 h-10 rounded-xl border border-[#E3EAE7] bg-[#F8FAF9] text-[#73858D] hover:text-rose-600 flex items-center justify-center" aria-label="Remove tracking preference">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </section>
        )}

        {activeTab === 'alerts' && (
          <section className="space-y-4">
            <SectionHeader title="Alert history" subtitle="Real trigger events from your signed-in account. Queued and delivered states are kept separate." />
            {historyLoading ? (
              <EmptyCard title="Loading alert history…" text="Checking your account for persisted trigger events." />
            ) : historyEvents.length === 0 ? (
              <EmptyCard title="No alert events yet" text="This remains empty until one of your real price-alert conditions actually triggers." />
            ) : (
              <div className="space-y-3">
                {historyEvents.map((event) => {
                  const product = eventProduct(event);
                  return (
                    <div key={event.id} className="rounded-2xl bg-white border border-[#DDE7E3] p-4 flex items-start gap-3">
                      {product?.image_url ? <img src={product.image_url} alt="" className="w-12 h-12 rounded-xl object-contain bg-[#F8FAF9] border border-[#E1E9E6] p-1 shrink-0" /> : <div className="w-12 h-12 rounded-xl bg-[#F8FAF9] border border-[#E1E9E6] flex items-center justify-center shrink-0"><CheckCircle2 className="w-5 h-5 text-[#0B8F58]" /></div>}
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="text-xs font-extrabold text-[#102027]">{product?.name || 'Tracked product'}</h3>
                          <span className={`px-2 py-0.5 rounded-md text-[9px] font-extrabold border ${event.sent_at ? 'bg-[#EAF8F1] text-[#08784B] border-[#CFE9DD]' : 'bg-amber-50 text-amber-800 border-amber-200'}`}>{event.sent_at ? 'DELIVERED' : 'QUEUED'}</span>
                        </div>
                        <p className="text-xs text-[#60727A] mt-1.5 leading-relaxed">{event.message}</p>
                        <div className="text-[10px] text-[#829198] mt-1.5">{formatEventTime(event.created_at)} · {event.alert_type.replaceAll('_', ' ')}</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </section>
        )}

        {activeTab === 'recent' && (
          <section className="space-y-4">
            <div className="flex items-end justify-between gap-3">
              <SectionHeader title="Recently viewed" subtitle="A private device-only history used to help you continue shopping. It is not uploaded as a personal profile history." />
              {recentProducts.length > 0 && (
                <button type="button" onClick={clearRecent} className="min-h-[38px] px-3 rounded-xl bg-white border border-[#DDE7E3] text-[11px] font-bold text-[#60727A] hover:text-rose-600 shrink-0">Clear history</button>
              )}
            </div>
            {catalogLoading ? (
              <EmptyCard title="Loading recently viewed products…" text="Checking your device history against the current market catalog." />
            ) : recentProducts.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-5">
                {recentProducts.map((product) => <ProductCard key={product.id} product={product} />)}
              </div>
            ) : (
              <EmptyCard title="No recently viewed products" text="Products you open will appear here on this device so you can quickly return to them." />
            )}
          </section>
        )}

        {activeTab === 'settings' && (
          <section className="space-y-4 max-w-3xl">
            <SectionHeader title="Notification settings" subtitle="Delivery controls will unlock with the verified notification provider." />
            <div className="rounded-2xl bg-white border border-[#DDE7E3] p-5 sm:p-6">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#EAF5F0] border border-[#CFE3DB] text-[#08784B] flex items-center justify-center shrink-0"><ShieldCheck className="w-4.5 h-4.5" /></div>
                <div>
                  <h3 className="text-sm font-extrabold text-[#102027]">Delivery settings are intentionally locked for now</h3>
                  <p className="text-xs sm:text-sm text-[#60727A] leading-6 mt-1">The price-alert trigger is account-backed, but we will not show email/digest switches that do not yet control a verified delivery backend.</p>
                </div>
              </div>
            </div>
          </section>
        )}

        <div className="rounded-2xl border border-[#DDE7E3] bg-[#F8FBF9] p-4 flex items-start gap-2 text-[11px] text-[#73858D] leading-5">
          <Info className="w-4 h-4 text-[#0B8F58] shrink-0 mt-0.5" />
          Signed-in shoppers can sync eligible live-product saves and price-alert preferences. Recently viewed history stays on the current device, and preview/demo records are never treated as production account data.
        </div>
      </div>
    </div>
  );
}

function Stat({ value, label }: { value: number; label: string }) {
  return <div className="min-w-[78px] rounded-xl border border-[#DDE7E3] bg-[#F8FBF9] px-3 py-2 text-center"><div className="text-lg font-extrabold text-[#102027]">{value}</div><div className="text-[10px] text-[#73858D]">{label}</div></div>;
}

function SectionHeader({ title, subtitle }: { title: string; subtitle: string }) {
  return <div><h2 className="text-lg font-extrabold text-[#102027]">{title}</h2><p className="text-xs text-[#73858D] mt-0.5">{subtitle}</p></div>;
}

function EmptyCard({ title, text, action }: { title: string; text: string; action?: React.ReactNode }) {
  return (
    <div className="rounded-2xl bg-white border border-[#DDE7E3] p-7 sm:p-9 text-center">
      <Bookmark className="w-7 h-7 text-[#A6B5AF] mx-auto" />
      <h3 className="text-sm font-extrabold text-[#102027] mt-3">{title}</h3>
      <p className="text-xs sm:text-sm text-[#73858D] max-w-xl mx-auto mt-1.5 leading-6">{text}</p>
      {action}
    </div>
  );
}
