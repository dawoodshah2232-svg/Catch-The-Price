'use client';

import React, { useEffect, useState, useMemo } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import {
  Bell,
  Trash2,
  Edit2,
  Check,
  X,
  Plus,
  Target,
  CheckCircle2,
  ShoppingBag,
  ExternalLink,
  Power,
} from 'lucide-react';
import { useCountry } from '@/context/CountryContext';
import { Product } from '@/lib/types';
import { createSupabaseBrowserClient } from '@/lib/supabase/browser';

interface AlertItem {
  id: string;
  productId: string;
  country: string;
  targetPrice: number;
  initialPrice: number;
  currentPrice: number;
  difference: number;
  differencePercent: number;
  isTargetReached: boolean;
  alertType: string;
  isActive: boolean;
  product?: {
    id: string;
    title: string;
    slug: string;
    imageUrl: string | null;
    currentBestPrice: number;
    currency: string;
    bestMerchantName?: string;
  } | null;
}

export function PriceAlertsView() {
  const { country, countryInfo, alerts: contextAlerts, addAlert, removeAlert, formatLocalPrice } = useCountry();
  const searchParams = useSearchParams();
  const preselectedProductId = searchParams.get('productId');

  const [alerts, setAlerts] = useState<AlertItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAuthed, setIsAuthed] = useState(false);
  const [editingAlertId, setEditingAlertId] = useState<string | null>(null);
  const [editPriceInput, setEditPriceInput] = useState<string>('');
  const [filter, setFilter] = useState<'all' | 'active' | 'reached'>('all');
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);

  // New alert form state
  const [showNewModal, setShowNewModal] = useState(Boolean(preselectedProductId));
  const [catalog, setCatalog] = useState<Product[]>([]);
  const [newProductId, setNewProductId] = useState(preselectedProductId || '');
  const [newTargetPrice, setNewTargetPrice] = useState('');
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    let active = true;
    setLoading(true);

    const loadAlerts = async () => {
      const supabase = createSupabaseBrowserClient();
      let authed = false;
      if (supabase) {
        const { data: { user } } = await supabase.auth.getUser();
        authed = Boolean(user);
      }
      if (!active) return;
      setIsAuthed(authed);

      const [alertsRes, catRes] = await Promise.all([
        authed
          ? fetch(`/api/account/alerts?country=${encodeURIComponent(country)}`, { cache: 'no-store' })
              .then((res) => (res.ok ? res.json() : { alerts: [] }))
              .catch(() => ({ alerts: [] }))
          : Promise.resolve({ alerts: [] }),
        fetch(`/api/catalog?country=${encodeURIComponent(country)}`, { cache: 'no-store' })
          .then((res) => (res.ok ? res.json() : { products: [] }))
          .catch(() => ({ products: [] })),
      ]);

      if (!active) return;
      const fetchedCatalog: Product[] = Array.isArray(catRes.products) ? catRes.products : [];
      setCatalog(fetchedCatalog);

      if (authed && Array.isArray(alertsRes.alerts) && alertsRes.alerts.length > 0) {
        setAlerts(alertsRes.alerts);
      } else {
        // Fallback: populate from local context
        const catMap = new Map(fetchedCatalog.map((p) => [p.id, p]));
        const mapped: AlertItem[] = contextAlerts
          .filter((a) => a.country === country)
          .map((a) => {
            const p = catMap.get(a.productId);
            const curr = p?.currentBestPrice || a.currentPrice || 0;
            const target = a.targetPrice || 0;
            return {
              id: a.id,
              productId: a.productId,
              country: a.country,
              targetPrice: target,
              initialPrice: curr,
              currentPrice: curr,
              difference: curr > target ? curr - target : 0,
              differencePercent: curr > target && curr > 0 ? ((curr - target) / curr) * 100 : 0,
              isTargetReached: target > 0 && curr > 0 && curr <= target,
              alertType: a.alertType,
              isActive: a.isActive,
              product: p
                ? {
                    id: p.id,
                    title: p.title,
                    slug: p.slug,
                    imageUrl: p.imageUrl,
                    currentBestPrice: p.currentBestPrice,
                    currency: p.currency,
                    bestMerchantName: p.bestMerchantName,
                  }
                : null,
            };
          });
        setAlerts(mapped);
      }
      setLoading(false);
    };

    loadAlerts().catch(() => {
      if (active) setLoading(false);
    });

    return () => {
      active = false;
    };
  }, [country, contextAlerts]);

  async function handleToggleActive(alert: AlertItem) {
    const nextActive = !alert.isActive;

    // Optimistic update
    setAlerts((prev) =>
      prev.map((a) => (a.id === alert.id ? { ...a, isActive: nextActive } : a))
    );

    if (!isAuthed) return;

    try {
      await fetch('/api/account/alerts', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: alert.id, isActive: nextActive }),
      });
    } catch {
      // Revert if error
      setAlerts((prev) =>
        prev.map((a) => (a.id === alert.id ? { ...a, isActive: alert.isActive } : a))
      );
    }
  }

  function startEditing(alert: AlertItem) {
    setEditingAlertId(alert.id);
    setEditPriceInput(String(alert.targetPrice));
  }

  async function saveEditedPrice(alertId: string) {
    const numericVal = parseFloat(editPriceInput);
    if (!Number.isFinite(numericVal) || numericVal <= 0) return;

    setEditingAlertId(null);

    // Optimistic update
    setAlerts((prev) =>
      prev.map((a) => {
        if (a.id !== alertId) return a;
        const diff = a.currentPrice > numericVal ? a.currentPrice - numericVal : 0;
        const diffPct = a.currentPrice > numericVal && a.currentPrice > 0 ? (diff / a.currentPrice) * 100 : 0;
        return {
          ...a,
          targetPrice: numericVal,
          difference: diff,
          differencePercent: diffPct,
          isTargetReached: a.currentPrice > 0 && a.currentPrice <= numericVal,
        };
      })
    );

    if (!isAuthed) {
      setFeedbackMessage('Target price updated locally.');
      setTimeout(() => setFeedbackMessage(null), 3000);
      return;
    }

    try {
      await fetch('/api/account/alerts', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: alertId, targetPrice: numericVal }),
      });
      setFeedbackMessage('Target price updated successfully.');
      setTimeout(() => setFeedbackMessage(null), 3000);
    } catch {
      // Ignored
    }
  }

  async function handleDeleteAlert(alert: AlertItem) {
    // Optimistic delete
    setAlerts((prev) => prev.filter((a) => a.id !== alert.id));
    removeAlert(alert.id);

    if (!isAuthed) return;

    try {
      await fetch(`/api/account/alerts?id=${encodeURIComponent(alert.id)}`, {
        method: 'DELETE',
      });
    } catch {
      // Ignored
    }
  }

  async function handleCreateNewAlert(e: React.FormEvent) {
    e.preventDefault();
    const target = parseFloat(newTargetPrice);
    if (!newProductId || !Number.isFinite(target) || target <= 0) return;

    setCreating(true);
    const prod = catalog.find((p) => p.id === newProductId);
    const curr = prod?.currentBestPrice || 0;
    const diff = curr > target ? curr - target : 0;

    const createdItem: AlertItem = {
      id: `alert-${Date.now()}`,
      productId: newProductId,
      country,
      targetPrice: target,
      initialPrice: curr,
      currentPrice: curr,
      difference: diff,
      differencePercent: curr > target && curr > 0 ? (diff / curr) * 100 : 0,
      isTargetReached: curr > 0 && curr <= target,
      alertType: 'below_amount',
      isActive: true,
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
        : null,
    };

    if (!isAuthed) {
      addAlert({
        productId: newProductId,
        productTitle: prod?.title || 'Product',
        productImage: prod?.imageUrl || '',
        currentPrice: curr,
        targetPrice: target,
        alertType: 'below_amount',
        currency: prod?.currency || countryInfo.currency,
        country,
        isActive: true,
      });
      setAlerts((prev) => [createdItem, ...prev]);
      setShowNewModal(false);
      setNewTargetPrice('');
      setFeedbackMessage('Price alert created! (Saved on this device)');
      setTimeout(() => setFeedbackMessage(null), 3500);
      setCreating(false);
      return;
    }

    try {
      const res = await fetch('/api/account/alerts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId: newProductId,
          country,
          targetPrice: target,
          initialPrice: prod?.currentBestPrice || null,
          alertType: 'below_amount',
        }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.alert?.id) createdItem.id = data.alert.id;
        setAlerts((prev) => [createdItem, ...prev]);
        setShowNewModal(false);
        setNewTargetPrice('');
        setFeedbackMessage('Price alert created successfully!');
        setTimeout(() => setFeedbackMessage(null), 3500);
      }
    } catch {
      addAlert({
        productId: newProductId,
        productTitle: prod?.title || 'Product',
        productImage: prod?.imageUrl || '',
        currentPrice: curr,
        targetPrice: target,
        alertType: 'below_amount',
        currency: prod?.currency || countryInfo.currency,
        country,
        isActive: true,
      });
      setAlerts((prev) => [createdItem, ...prev]);
      setShowNewModal(false);
      setNewTargetPrice('');
      setFeedbackMessage('Price alert saved locally.');
      setTimeout(() => setFeedbackMessage(null), 3500);
    } finally {
      setCreating(false);
    }
  }

  const filteredAlerts = useMemo(() => {
    if (filter === 'active') return alerts.filter((a) => a.isActive);
    if (filter === 'reached') return alerts.filter((a) => a.isTargetReached);
    return alerts;
  }, [alerts, filter]);

  return (
    <div className="space-y-6">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-[#0c1913] flex items-center gap-2.5">
            <Bell className="h-6 w-6 text-[#00A859]" />
            <span>Price Drop Alerts</span>
          </h1>
          <p className="mt-1 text-xs text-[#5c7268]">
            Set target prices and get notified instantly when items drop to your budget.
          </p>
        </div>

        <div className="flex items-center gap-2.5 self-start sm:self-auto">
          <button
            type="button"
            onClick={() => setShowNewModal(true)}
            className="inline-flex items-center gap-1.5 rounded-2xl bg-[#00C16A] px-4 py-2.5 text-xs font-black text-white hover:bg-[#00a85c] shadow-[0_4px_12px_rgba(0,193,106,0.25)] transition-all"
          >
            <Plus className="h-4 w-4" />
            <span>Track New Product</span>
          </button>
        </div>
      </div>

      {feedbackMessage && (
        <div className="flex items-center gap-2 rounded-2xl border border-emerald-200 bg-emerald-50 p-3.5 text-xs font-semibold text-emerald-800">
          <CheckCircle2 className="h-4 w-4 text-[#00A859] shrink-0" />
          <span>{feedbackMessage}</span>
        </div>
      )}

      {!isAuthed && (
        <div className="flex items-center justify-between gap-3 rounded-2xl border border-emerald-300/60 bg-emerald-50/70 p-3.5 text-xs text-emerald-900">
          <div className="flex items-center gap-2">
            <Bell className="h-4 w-4 text-[#00A859] shrink-0" />
            <span>
              <strong>Guest mode:</strong> Alerts are active locally. <Link href={`/${country}/login`} className="font-black text-[#008f4c] underline hover:text-[#006e3a]">Sign in</Link> to receive email drop notifications and sync across devices.
            </span>
          </div>
          <Link
            href={`/${country}/login`}
            className="shrink-0 rounded-xl bg-[#00C16A] px-3 py-1.5 text-[11px] font-black text-white hover:bg-[#00a85c] transition-colors"
          >
            Sign In
          </Link>
        </div>
      )}

      {/* Filter Tabs */}
      {alerts.length > 0 && (
        <div className="flex items-center gap-1 border-b border-[#dce6e1] pb-3">
          <button
            type="button"
            onClick={() => setFilter('all')}
            className={`rounded-xl px-3.5 py-1.5 text-xs font-bold transition-colors ${
              filter === 'all'
                ? 'bg-[#00C16A] text-white'
                : 'text-[#5c7268] hover:bg-white hover:text-[#0c1913]'
            }`}
          >
            All ({alerts.length})
          </button>
          <button
            type="button"
            onClick={() => setFilter('active')}
            className={`rounded-xl px-3.5 py-1.5 text-xs font-bold transition-colors ${
              filter === 'active'
                ? 'bg-[#00C16A] text-white'
                : 'text-[#5c7268] hover:bg-white hover:text-[#0c1913]'
            }`}
          >
            Active ({alerts.filter((a) => a.isActive).length})
          </button>
          <button
            type="button"
            onClick={() => setFilter('reached')}
            className={`rounded-xl px-3.5 py-1.5 text-xs font-bold transition-colors ${
              filter === 'reached'
                ? 'bg-[#00C16A] text-white'
                : 'text-[#5c7268] hover:bg-white hover:text-[#0c1913]'
            }`}
          >
            Target Reached ({alerts.filter((a) => a.isTargetReached).length})
          </button>
        </div>
      )}

      {/* Alerts List */}
      {loading ? (
        <div className="min-h-[30vh] flex items-center justify-center text-xs text-[#73858D]">
          Loading your price alerts…
        </div>
      ) : filteredAlerts.length > 0 ? (
        <div className="space-y-3.5">
          {filteredAlerts.map((alert) => (
            <div
              key={alert.id}
              className={`rounded-3xl border bg-white p-5 shadow-[0_2px_12px_rgba(0,0,0,0.02)] transition-all ${
                alert.isTargetReached
                  ? 'border-[#00C16A] bg-[#f2fbf6]'
                  : !alert.isActive
                  ? 'border-[#e4ede8] opacity-75'
                  : 'border-[#d6e3dd] hover:border-[#00C16A]/50'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                {/* Product info */}
                <div className="flex items-start gap-4 min-w-0">
                  <div className="h-16 w-16 rounded-2xl bg-white p-1 border border-[#e2ece7] flex items-center justify-center shrink-0">
                    {alert.product?.imageUrl ? (
                      <img
                        src={alert.product.imageUrl}
                        alt={alert.product.title}
                        className="max-h-full max-w-full object-contain"
                      />
                    ) : (
                      <ShoppingBag className="h-8 w-8 text-[#98ad9f]" />
                    )}
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span
                        className={`inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-[10px] font-black ${
                          alert.isTargetReached
                            ? 'bg-[#00C16A] text-white'
                            : alert.isActive
                            ? 'bg-[#e6f9f0] text-[#00A859]'
                            : 'bg-slate-100 text-slate-500'
                        }`}
                      >
                        {alert.isTargetReached ? '🎯 Target Reached' : alert.isActive ? 'Active' : 'Paused'}
                      </span>
                      {alert.product?.bestMerchantName && (
                        <span className="text-[11px] text-[#71867c]">
                          at <strong className="text-[#0c1913]">{alert.product.bestMerchantName}</strong>
                        </span>
                      )}
                    </div>

                    <Link
                      href={alert.product?.slug ? `/${country}/product/${alert.product.slug}` : '#'}
                      className="mt-1 block text-sm font-black text-[#0c1913] hover:text-[#00A859] truncate"
                    >
                      {alert.product?.title || 'Tracked Product'}
                    </Link>

                    <div className="mt-2 flex flex-wrap items-baseline gap-x-4 gap-y-1 text-xs">
                      <div>
                        <span className="text-[#71867c]">Current Best: </span>
                        <strong className="text-sm font-black text-[#0c1913]">
                          {formatLocalPrice(alert.currentPrice)}
                        </strong>
                      </div>

                      <div className="flex items-center gap-1">
                        <span className="text-[#71867c]">Your Target: </span>
                        {editingAlertId === alert.id ? (
                          <div className="inline-flex items-center gap-1">
                            <input
                              type="number"
                              value={editPriceInput}
                              onChange={(e) => setEditPriceInput(e.target.value)}
                              className="h-7 w-24 rounded-lg border border-[#00C16A] px-2 text-xs font-bold outline-none"
                              autoFocus
                            />
                            <button
                              type="button"
                              onClick={() => saveEditedPrice(alert.id)}
                              className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#00C16A] text-white"
                            >
                              <Check className="h-3.5 w-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={() => setEditingAlertId(null)}
                              className="flex h-7 w-7 items-center justify-center rounded-lg bg-slate-200 text-slate-600"
                            >
                              <X className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        ) : (
                          <div className="inline-flex items-center gap-1.5">
                            <strong className="text-sm font-black text-[#00A859]">
                              {formatLocalPrice(alert.targetPrice)}
                            </strong>
                            <button
                              type="button"
                              onClick={() => startEditing(alert)}
                              title="Edit target price"
                              className="p-1 text-[#71867c] hover:text-[#00A859]"
                            >
                              <Edit2 className="h-3 w-3" />
                            </button>
                          </div>
                        )}
                      </div>

                      {!alert.isTargetReached && alert.difference > 0 && (
                        <div className="text-[11px] text-[#e8590c] font-semibold">
                          Needs {formatLocalPrice(alert.difference)} drop ({Math.round(alert.differencePercent)}%)
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                  <button
                    type="button"
                    onClick={() => handleToggleActive(alert)}
                    title={alert.isActive ? 'Pause alert' : 'Resume alert'}
                    className={`inline-flex h-9 items-center gap-1.5 rounded-xl border px-3 text-xs font-bold transition-colors ${
                      alert.isActive
                        ? 'border-[#d2e0da] bg-white text-[#5c7268] hover:bg-[#f2f7f4]'
                        : 'border-[#00C16A] bg-[#e6f9f0] text-[#00A859]'
                    }`}
                  >
                    <Power className="h-3.5 w-3.5" />
                    <span>{alert.isActive ? 'Pause' : 'Resume'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleDeleteAlert(alert)}
                    title="Delete alert"
                    className="flex h-9 w-9 items-center justify-center rounded-xl border border-red-200 bg-red-50 text-red-600 hover:bg-red-100 transition-colors"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>

                  {alert.product?.slug && (
                    <Link
                      href={`/${country}/product/${alert.product.slug}`}
                      className="flex h-9 items-center justify-center gap-1 rounded-xl bg-[#00C16A] px-3 text-xs font-black text-white hover:bg-[#00a85c] transition-colors"
                    >
                      <span>View</span>
                      <ExternalLink className="h-3 w-3" />
                    </Link>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="rounded-3xl border border-dashed border-[#d2e0da] bg-white p-12 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[#e6f9f0] text-[#00A859]">
            <Target className="h-8 w-8" />
          </div>
          <h2 className="mt-4 text-xl font-black text-[#0c1913]">No price alerts set</h2>
          <p className="mt-2 text-xs text-[#5c7268] max-w-md mx-auto leading-relaxed">
            Never overpay. Track your favorite gadgets, appliances, or essentials and we&apos;ll notify you the moment the price hits your target.
          </p>
          <div className="mt-6">
            <button
              type="button"
              onClick={() => setShowNewModal(true)}
              className="inline-flex items-center gap-2 rounded-2xl bg-[#00C16A] px-5 py-2.5 text-xs font-black text-white hover:bg-[#00a85c] transition-all"
            >
              <Plus className="h-4 w-4" />
              <span>Create Your First Alert</span>
            </button>
          </div>
        </div>
      )}

      {/* New Alert Modal */}
      {showNewModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl border border-[#d6e3dd]">
            <div className="flex items-center justify-between pb-3 border-b border-[#edf4f0]">
              <h3 className="text-base font-black text-[#0c1913] flex items-center gap-2">
                <Bell className="h-4 w-4 text-[#00A859]" />
                <span>Create Price Drop Alert</span>
              </h3>
              <button
                type="button"
                onClick={() => setShowNewModal(false)}
                className="p-1 text-[#71867c] hover:text-[#0c1913]"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleCreateNewAlert} className="mt-4 space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#1f382e] mb-1.5" htmlFor="alert-product">
                  Select Product to Track
                </label>
                <select
                  id="alert-product"
                  value={newProductId}
                  onChange={(e) => {
                    const id = e.target.value;
                    setNewProductId(id);
                    const prod = catalog.find((p) => p.id === id);
                    if (prod && prod.currentBestPrice > 0) {
                      // Suggest 10% lower target
                      setNewTargetPrice(String(Math.floor(prod.currentBestPrice * 0.9)));
                    }
                  }}
                  className="h-11 w-full rounded-2xl border border-[#d2e0da] bg-[#f8faf9] px-3.5 text-xs font-medium text-[#0c1913] outline-none focus:border-[#00C16A] focus:bg-white"
                  required
                >
                  <option value="">Choose a product from catalog…</option>
                  {catalog.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.title} — {formatLocalPrice(p.currentBestPrice)}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#1f382e] mb-1.5" htmlFor="target-price">
                  Your Target Price ({countryInfo.currency})
                </label>
                <div className="flex h-11 items-center gap-2 rounded-2xl border border-[#d2e0da] bg-[#f8faf9] px-3.5 focus-within:border-[#00C16A] focus-within:bg-white">
                  <span className="text-xs font-bold text-[#71867c]">{countryInfo.currency}</span>
                  <input
                    id="target-price"
                    type="number"
                    step="any"
                    value={newTargetPrice}
                    onChange={(e) => setNewTargetPrice(e.target.value)}
                    placeholder="e.g. 2999"
                    required
                    min="1"
                    className="w-full bg-transparent text-sm font-bold text-[#0c1913] outline-none"
                  />
                </div>
                <p className="mt-1 text-[11px] text-[#71867c]">
                  We&apos;ll notify you when any merchant drops their price to this number or lower.
                </p>
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowNewModal(false)}
                  className="rounded-xl px-4 py-2 text-xs font-bold text-[#5c7268] hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={creating || !newProductId || !newTargetPrice}
                  className="rounded-xl bg-[#00C16A] px-5 py-2 text-xs font-black text-white hover:bg-[#00a85c] disabled:opacity-50"
                >
                  {creating ? 'Saving…' : 'Start Tracking'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
