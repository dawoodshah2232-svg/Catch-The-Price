'use client';

import React, { useState } from 'react';
import { getAllProducts } from '@/lib/data/products';
import { MERCHANTS } from '@/lib/data/merchants';
import { CATEGORIES } from '@/lib/data/categories';
import {
  Package,
  Store,
  RefreshCw,
  TrendingDown,
  ExternalLink,
  CheckCircle2,
  AlertTriangle,
  ArrowUpRight,
  ShieldCheck,
  Zap,
} from 'lucide-react';

export default function AdminOverviewPage() {
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncStatus, setSyncStatus] = useState<string | null>(null);

  const products = getAllProducts('ae');
  const totalOffers = products.reduce((acc, p) => acc + p.offers.length, 0);

  const handleTriggerSync = async () => {
    setIsSyncing(true);
    setSyncStatus('Connecting to merchant feed adapters...');

    setTimeout(() => {
      setSyncStatus('Normalizing titles and extracting specs...');
    }, 1000);

    setTimeout(() => {
      setSyncStatus('Running product matching & price drop detector...');
    }, 2000);

    setTimeout(() => {
      setIsSyncing(false);
      setSyncStatus('Ingestion completed successfully: 24 offers refreshed, 3 drops recorded.');
    }, 3200);
  };

  return (
    <div className="space-y-8">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-ctp">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
            CatchThePrice Operations
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-100 mt-1">
            Platform Overview &amp; Control
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Real-time status of product catalogs, merchant adapters, and price drop notifications
          </p>
        </div>

        {/* Manual Sync Trigger Button */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleTriggerSync}
            disabled={isSyncing}
            className="px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 text-slate-950 font-bold text-xs transition-all shadow-lg flex items-center gap-2 touch-target"
          >
            <RefreshCw className={`w-4 h-4 ${isSyncing ? 'animate-spin' : ''}`} />
            <span>{isSyncing ? 'Syncing...' : 'Trigger Pipeline Sync'}</span>
          </button>
        </div>
      </div>

      {/* Sync Status Banner */}
      {syncStatus && (
        <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{syncStatus}</span>
        </div>
      )}

      {/* Metric Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-ctp-surface border border-ctp">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-2">
            <span>Tracked Products</span>
            <Package className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-extrabold text-slate-100">{products.length}</div>
          <span className="text-[10px] text-emerald-400 mt-1 block">Across 6 tech categories</span>
        </div>

        <div className="p-4 rounded-2xl bg-ctp-surface border border-ctp">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-2">
            <span>Verified Merchants</span>
            <Store className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-2xl font-extrabold text-slate-100">{MERCHANTS.length}</div>
          <span className="text-[10px] text-slate-400 mt-1 block">UAE, USA, UK, CA, AU</span>
        </div>

        <div className="p-4 rounded-2xl bg-ctp-surface border border-ctp">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-2">
            <span>Live Offers Tracked</span>
            <Zap className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-extrabold text-slate-100">{totalOffers}</div>
          <span className="text-[10px] text-emerald-400 mt-1 block">100% In-Stock Verified</span>
        </div>

        <div className="p-4 rounded-2xl bg-ctp-surface border border-ctp">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-2">
            <span>Drops in 24h</span>
            <TrendingDown className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-extrabold text-emerald-400">4 Drops</div>
          <span className="text-[10px] text-slate-400 mt-1 block">Highest: -19% discount</span>
        </div>
      </div>

      {/* Operations Quick Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Ingestion Adapters Health */}
        <div className="rounded-2xl bg-ctp-surface border border-ctp p-5 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-ctp">
            <h3 className="font-bold text-sm text-slate-100 flex items-center gap-2">
              <RefreshCw className="w-4 h-4 text-emerald-400" />
              <span>Merchant Ingestion Sources</span>
            </h3>
            <a href="/admin/ingestion" className="text-xs text-emerald-400 hover:underline">
              View All Runs →
            </a>
          </div>

          <div className="space-y-2.5 text-xs">
            <div className="p-3 rounded-xl bg-ctp-surface-elevated border border-ctp flex items-center justify-between">
              <div>
                <span className="font-semibold text-slate-200 block">Amazon PA-API Adapter</span>
                <span className="text-[11px] text-slate-400">Frequency: Hourly • UAE, USA, UK</span>
              </div>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                Healthy
              </span>
            </div>

            <div className="p-3 rounded-xl bg-ctp-surface-elevated border border-ctp flex items-center justify-between">
              <div>
                <span className="font-semibold text-slate-200 block">Noon Product Catalog Feed</span>
                <span className="text-[11px] text-slate-400">Frequency: Every 2 Hours • UAE</span>
              </div>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                Healthy
              </span>
            </div>

            <div className="p-3 rounded-xl bg-ctp-surface-elevated border border-ctp flex items-center justify-between">
              <div>
                <span className="font-semibold text-slate-200 block">Best Buy Developer API</span>
                <span className="text-[11px] text-slate-400">Frequency: 3 Hours • USA, CA</span>
              </div>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                Healthy
              </span>
            </div>
          </div>
        </div>

        {/* Product Matching Queue Snapshot */}
        <div className="rounded-2xl bg-ctp-surface border border-ctp p-5 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-ctp">
            <h3 className="font-bold text-sm text-slate-100 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-cyan-400" />
              <span>Product Matching Status</span>
            </h3>
            <a href="/admin/matching" className="text-xs text-emerald-400 hover:underline">
              Review Queue →
            </a>
          </div>

          <div className="space-y-2.5 text-xs">
            <div className="p-3 rounded-xl bg-ctp-surface-elevated border border-ctp">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-slate-200">Apple iPhone 16 Pro Max 256GB</span>
                <span className="text-emerald-400 font-bold">99.8% Match</span>
              </div>
              <p className="text-[11px] text-slate-400 mt-1">
                Auto-matched 4 retailer raw listings with zero ambiguity.
              </p>
            </div>

            <div className="p-3 rounded-xl bg-ctp-surface-elevated border border-ctp">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-slate-200">Sony PlayStation 5 Pro 2TB Console</span>
                <span className="text-emerald-400 font-bold">98.4% Match</span>
              </div>
              <p className="text-[11px] text-slate-400 mt-1">
                Disambiguated from Standard PS5 Slim with high confidence.
              </p>
            </div>

            <div className="p-3 rounded-xl bg-ctp-surface-elevated border border-ctp">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-slate-200">LG OLED65G4SUB 4K Smart TV</span>
                <span className="text-emerald-400 font-bold">99.1% Match</span>
              </div>
              <p className="text-[11px] text-slate-400 mt-1">
                Confirmed 65-inch G4 model specs across all active offers.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
