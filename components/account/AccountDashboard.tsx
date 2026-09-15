'use client';

import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { useCountry } from '@/context/CountryContext';
import { ProductCard } from '@/components/search/ProductCard';
import { Product } from '@/lib/types';
import { Bell, Bookmark, CheckCircle2, Clock, Info, Settings, ShieldCheck, Trash2 } from 'lucide-react';

type TabId = 'saved' | 'tracked' | 'alerts' | 'recent' | 'settings';

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

  const savedProducts = catalog.filter((product) => savedProductIds.includes(product.id));

  const tabs: { id: TabId; label: string; icon: React.ElementType; count?: number }[] = [
    { id: 'saved', label: 'Saved', icon: Bookmark, count: savedProductIds.length },
    { id: 'tracked', label: 'Tracked', icon: Bell, count: alerts.length },
    { id: 'alerts', label: 'Alert history', icon: CheckCircle2 },
    { id: 'recent', label: 'Recently viewed', icon: Clock },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-[#F4F7F6]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 sm:py-9 space-y-6">
        <section className="rounded-[26px] bg-white border border-[#DDE7E3] p-5 sm:p-6 shadow-[0_10px_28px_rgba(25,55,45,0.05)]">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="text-[10px] uppercase tracking-[0.16em] font-extrabold text-[#08784B]">Your shopping space</div>
              <h1 className="text-xl sm:text-2xl font-extrabold text-[#102027] mt-1">Saved products & price tracking</h1>
              <p className="text-xs sm:text-sm text-[#60727A] mt-1.5 max-w-2xl">
                Market: {countryInfo.flag} {countryInfo.name} ({countryInfo.currency}). Saved items on this screen are currently stored on this device until account sync is enabled.
              </p>
            </div>
            <div className="flex gap-2">
              <Stat value={savedProductIds.length} label="Saved" />
              <Stat value={alerts.length} label="Tracked" />
            </div>
          </div>
        </section>

        <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
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
            <SectionHeader title="Saved products" subtitle="Products you saved while browsing CatchThePrice." />
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
            <SectionHeader title="Tracked prices" subtitle="Only tracking preferences actually present on this device are shown." />
            {alerts.length === 0 ? (
              <EmptyCard
                title="No active price tracking"
                text="Price-alert delivery is not presented as active until the account-backed notification system is fully connected and verified."
              />
            ) : (
              <div className="space-y-3">
                {alerts.map((alert) => (
                  <div key={alert.id} className="rounded-2xl bg-white border border-[#DDE7E3] p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-3 min-w-0">
                      <img src={alert.productImage} alt={alert.productTitle} className="w-14 h-14 rounded-xl object-contain bg-[#F8FAF9] p-1 border border-[#E1E9E6] shrink-0" />
                      <div className="min-w-0">
                        <h3 className="font-extrabold text-sm text-[#102027] truncate">{alert.productTitle}</h3>
                        <p className="text-xs text-[#60727A] mt-1">
                          Current: <strong className="text-[#08784B]">{formatLocalPrice(alert.currentPrice)}</strong>
                          {alert.targetPrice ? ` · Target: ${formatLocalPrice(alert.targetPrice)}` : ' · Any drop preference'}
                        </p>
                        <p className="text-[10px] text-[#829198] mt-1">Saved tracking preference. Notification delivery status is not assumed.</p>
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
            <SectionHeader title="Alert history" subtitle="Notification events will appear only after verified delivery is connected." />
            <EmptyCard
              title="No verified alert events yet"
              text="We removed the old sample notification history. Real alert history will be written only when CatchThePrice actually sends or records a notification event."
            />
          </section>
        )}

        {activeTab === 'recent' && (
          <section className="space-y-4">
            <SectionHeader title="Recently viewed" subtitle="This section will be enabled when real account/device view history is persisted." />
            <EmptyCard
              title="Recently viewed is not stored yet"
              text="CatchThePrice currently records aggregate product-view analytics, but does not pretend that anonymous analytics are a personal browsing history."
            />
          </section>
        )}

        {activeTab === 'settings' && (
          <section className="space-y-4 max-w-3xl">
            <SectionHeader title="Notification settings" subtitle="Account-backed notification controls will unlock with the verified alert-delivery system." />
            <div className="rounded-2xl bg-white border border-[#DDE7E3] p-5 sm:p-6">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#EAF5F0] border border-[#CFE3DB] text-[#08784B] flex items-center justify-center shrink-0"><ShieldCheck className="w-4.5 h-4.5" /></div>
                <div>
                  <h3 className="text-sm font-extrabold text-[#102027]">Settings are intentionally locked for now</h3>
                  <p className="text-xs sm:text-sm text-[#60727A] leading-6 mt-1">We will not show email, instant-drop or digest switches that do not yet control a real notification backend. When delivery is implemented, these controls will be connected to your authenticated account and saved preferences.</p>
                </div>
              </div>
            </div>
          </section>
        )}

        <div className="rounded-2xl border border-[#DDE7E3] bg-[#F8FBF9] p-4 flex items-start gap-2 text-[11px] text-[#73858D] leading-5">
          <Info className="w-4 h-4 text-[#0B8F58] shrink-0 mt-0.5" />
          CatchThePrice is still completing authenticated shopper accounts. Until then, device-local saves are kept separate from claims about synced accounts, verified notifications or personal history.
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
