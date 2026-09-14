'use client';

import React, { useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { useCountry } from '@/context/CountryContext';
import { getAllProducts } from '@/lib/data/products';
import { ProductCard } from '@/components/search/ProductCard';
import {
  Bookmark,
  Bell,
  Clock,
  Settings,
  User,
  Trash2,
  ExternalLink,
  ShieldCheck,
  CheckCircle2,
  Mail,
  Smartphone,
} from 'lucide-react';

export function AccountDashboard() {
  const searchParams = useSearchParams();
  const initialTab = (searchParams.get('tab') as any) || 'saved';

  const [activeTab, setActiveTab] = useState<'saved' | 'tracked' | 'alerts' | 'recent' | 'settings'>(
    initialTab
  );
  const [emailNotification, setEmailNotification] = useState(true);
  const [instantDrops, setInstantDrops] = useState(true);
  const [digestWeekly, setDigestWeekly] = useState(false);

  const {
    country,
    countryInfo,
    savedProductIds,
    alerts,
    removeAlert,
    formatLocalPrice,
  } = useCountry();

  const allProducts = getAllProducts(country);
  const savedProducts = allProducts.filter((p) => savedProductIds.includes(p.id));

  // Fallback demo saved products if user hasn't saved yet
  const displaySaved =
    savedProducts.length > 0
      ? savedProducts
      : [allProducts[0], allProducts[1]];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 space-y-8">
      {/* Account Profile Banner */}
      <div className="rounded-3xl bg-ctp-surface border border-ctp p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-xl">
            CTP
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg sm:text-xl font-bold text-slate-100">CatchThePrice Member</h1>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                Verified Shopper
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Market Preference: {countryInfo.flag} {countryInfo.name} ({countryInfo.currency})
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs text-slate-400 self-start sm:self-auto">
          <div className="px-3 py-1.5 rounded-xl bg-slate-900 border border-ctp text-slate-300">
            <strong>{savedProductIds.length}</strong> Saved
          </div>
          <div className="px-3 py-1.5 rounded-xl bg-slate-900 border border-ctp text-slate-300">
            <strong>{alerts.length}</strong> Tracked
          </div>
        </div>
      </div>

      {/* Tabs Bar */}
      <div className="flex items-center gap-1.5 border-b border-ctp pb-1 overflow-x-auto">
        {[
          { id: 'saved', label: 'Saved Products', icon: Bookmark, count: savedProductIds.length },
          { id: 'tracked', label: 'Tracked Prices', icon: Bell, count: alerts.length },
          { id: 'alerts', label: 'Alert History', icon: CheckCircle2, count: 2 },
          { id: 'recent', label: 'Recently Viewed', icon: Clock, count: 4 },
          { id: 'settings', label: 'Notification Settings', icon: Settings },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all touch-target ${
                isActive
                  ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 font-bold'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
              {tab.count !== undefined && (
                <span
                  className={`px-1.5 py-0.2 rounded-full text-[10px] ${
                    isActive ? 'bg-emerald-500 text-slate-950 font-bold' : 'bg-slate-800 text-slate-400'
                  }`}
                >
                  {tab.count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Tab 1: Saved Products */}
      {activeTab === 'saved' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-slate-100">Saved Wishlist</h2>
            <span className="text-xs text-slate-400">
              {savedProductIds.length > 0 ? `${savedProductIds.length} items saved` : 'Showing popular picks'}
            </span>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6">
            {displaySaved.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      )}

      {/* Tab 2: Tracked Prices */}
      {activeTab === 'tracked' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-slate-100">Active Price Alerts</h2>
              <p className="text-xs text-slate-400">We notify you the instant these prices drop</p>
            </div>
          </div>

          <div className="space-y-3">
            {alerts.map((alert) => (
              <div
                key={alert.id}
                className="p-4 rounded-2xl bg-ctp-surface border border-ctp flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="flex items-center gap-3">
                  <img
                    src={alert.productImage}
                    alt={alert.productTitle}
                    className="w-12 h-12 rounded-xl object-contain bg-slate-950 p-1 border border-ctp shrink-0"
                  />
                  <div>
                    <h3 className="font-semibold text-xs sm:text-sm text-slate-100">{alert.productTitle}</h3>
                    <div className="flex items-center gap-2 text-xs text-slate-400 mt-1">
                      <span>
                        Current: <strong className="text-emerald-400">{formatLocalPrice(alert.currentPrice)}</strong>
                      </span>
                      <span>•</span>
                      <span>
                        Trigger: {alert.targetPrice ? `Below ${formatLocalPrice(alert.targetPrice)}` : 'Any Drop'}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-3 pt-2 sm:pt-0 border-t sm:border-t-0 border-ctp">
                  <span className="inline-flex items-center gap-1 text-[11px] text-emerald-400 font-medium">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    Tracking 24/7
                  </span>

                  <button
                    type="button"
                    onClick={() => removeAlert(alert.id)}
                    className="p-2 rounded-xl text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                    aria-label="Remove alert"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 3: Alerts History */}
      {activeTab === 'alerts' && (
        <div className="space-y-4">
          <h2 className="text-base font-bold text-slate-100">Drop Notification History</h2>
          <div className="space-y-3">
            <div className="p-4 rounded-2xl bg-ctp-surface border border-ctp flex items-start gap-3">
              <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shrink-0">
                <Bell className="w-4 h-4" />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-xs sm:text-sm text-slate-100">
                    iPhone 16 Pro Max dropped by {countryInfo.currency} 367!
                  </h4>
                  <span className="text-[10px] text-slate-400">Yesterday</span>
                </div>
                <p className="text-xs text-slate-400 mt-1">
                  Amazon updated their offer from {formatLocalPrice(4400)} to {formatLocalPrice(4033)}. This matched your target threshold.
                </p>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-ctp-surface border border-ctp flex items-start gap-3">
              <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 shrink-0">
                <Bell className="w-4 h-4" />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-xs sm:text-sm text-slate-100">
                    PS5 Pro reached Deal Score 87 (Rare Dip)
                  </h4>
                  <span className="text-[10px] text-slate-400">3 days ago</span>
                </div>
                <p className="text-xs text-slate-400 mt-1">
                  Price decreased by 9.3% with stock verified across 4 regional suppliers.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 4: Recently Viewed */}
      {activeTab === 'recent' && (
        <div className="space-y-4">
          <h2 className="text-base font-bold text-slate-100">Recently Viewed Tech</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-6">
            {allProducts.slice(0, 4).map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      )}

      {/* Tab 5: Notification Settings */}
      {activeTab === 'settings' && (
        <div className="max-w-2xl space-y-6">
          <h2 className="text-base font-bold text-slate-100">Notification Preferences</h2>

          <div className="space-y-4 bg-ctp-surface border border-ctp p-5 rounded-2xl">
            <label className="flex items-center justify-between cursor-pointer">
              <div>
                <span className="text-xs font-semibold text-slate-200 block">Instant Email Alerts</span>
                <span className="text-[11px] text-slate-400">
                  Send an email the minute a tracked product hits your target price
                </span>
              </div>
              <input
                type="checkbox"
                checked={emailNotification}
                onChange={(e) => setEmailNotification(e.target.checked)}
                className="w-4 h-4 accent-emerald-500 rounded"
              />
            </label>

            <label className="flex items-center justify-between cursor-pointer pt-3 border-t border-ctp">
              <div>
                <span className="text-xs font-semibold text-slate-200 block">Major Deal Alerts (Deal Score 90+)</span>
                <span className="text-[11px] text-slate-400">
                  Get pinged only for verified historical all-time low discounts
                </span>
              </div>
              <input
                type="checkbox"
                checked={instantDrops}
                onChange={(e) => setInstantDrops(e.target.checked)}
                className="w-4 h-4 accent-emerald-500 rounded"
              />
            </label>

            <label className="flex items-center justify-between cursor-pointer pt-3 border-t border-ctp">
              <div>
                <span className="text-xs font-semibold text-slate-200 block">Weekly Top 10 Price Drops Digest</span>
                <span className="text-[11px] text-slate-400">
                  A curated weekend recap of the best electronics deals in {countryInfo.name}
                </span>
              </div>
              <input
                type="checkbox"
                checked={digestWeekly}
                onChange={(e) => setDigestWeekly(e.target.checked)}
                className="w-4 h-4 accent-emerald-500 rounded"
              />
            </label>
          </div>
        </div>
      )}
    </div>
  );
}
