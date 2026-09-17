'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Settings,
  User,
  Mail,
  Globe,
  Bell,
  CheckCircle2,
  ShieldCheck,
  LogOut,
  Save,
  AlertCircle,
} from 'lucide-react';
import { useCountry } from '@/context/CountryContext';
import { CountryCode } from '@/lib/types';
import { createSupabaseBrowserClient } from '@/lib/supabase/browser';

export function SettingsView() {
  const router = useRouter();
  const { country, setCountry } = useCountry();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Form states
  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [market, setMarket] = useState<CountryCode>(country);
  const [notifyPriceDrops, setNotifyPriceDrops] = useState(true);
  const [notifyTargetReached, setNotifyTargetReached] = useState(true);
  const [notifyWeeklyDigest, setNotifyWeeklyDigest] = useState(true);
  const [notifyDeals, setNotifyDeals] = useState(true);

  useEffect(() => {
    let active = true;
    setLoading(true);

    const loadProfile = async () => {
      const supabase = createSupabaseBrowserClient();
      if (!supabase) {
        if (active) setLoading(false);
        return;
      }

      const {
        data: { user: authUser },
      } = await supabase.auth.getUser();

      if (!active) return;
      if (!authUser) {
        setUser(null);
        setLoading(false);
        return;
      }

      try {
        const res = await fetch('/api/account/profile', { cache: 'no-store' });
        if (!active) return;
        if (res.ok) {
          const data = await res.json();
          if (data?.user) {
            setUser(data.user);
            setDisplayName(data.user.profile?.display_name || authUser.user_metadata?.full_name || '');
            setEmail(data.user.email || authUser.email || '');
            setMarket(data.user.profile?.preferred_country || country);

            const s = data.user.settings;
            if (s) {
              setNotifyPriceDrops(Boolean(s.notify_price_drops));
              setNotifyTargetReached(Boolean(s.notify_target_reached));
              setNotifyWeeklyDigest(Boolean(s.notify_weekly_digest));
              setNotifyDeals(Boolean(s.notify_deals));
            }
          }
        }
      } catch {
        // Ignored
      } finally {
        if (active) setLoading(false);
      }
    };

    loadProfile().catch(() => {
      if (active) setLoading(false);
    });

    return () => {
      active = false;
    };
  }, [country]);

  async function handleSaveSettings(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setFeedback(null);

    if (!user) {
      if (market !== country) {
        setCountry(market as any);
        router.push(`/${market}/account/settings`);
      }
      setFeedback({ type: 'success', text: 'Shopping region preferences saved locally.' });
      setSaving(false);
      setTimeout(() => setFeedback(null), 3000);
      return;
    }

    try {
      const res = await fetch('/api/account/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          displayName,
          preferredCountry: market,
          notifyPriceDrops,
          notifyTargetReached,
          notifyWeeklyDigest,
          notifyDeals,
        }),
      });

      if (res.ok) {
        setFeedback({ type: 'success', text: 'Settings updated successfully.' });
        if (market !== country) {
          setCountry(market as any);
          router.push(`/${market}/account/settings`);
        }
      } else {
        setFeedback({ type: 'error', text: 'Could not save settings. Please try again.' });
      }
    } catch {
      setFeedback({ type: 'error', text: 'Network error while saving settings.' });
    } finally {
      setSaving(false);
      setTimeout(() => setFeedback(null), 4000);
    }
  }

  async function handleSignOut() {
    const supabase = createSupabaseBrowserClient();
    if (supabase) {
      await supabase.auth.signOut();
    }
    router.push(`/${country}`);
    router.refresh();
  }

  if (loading) {
    return (
      <div className="rounded-3xl border border-[#d6e3dd] bg-white p-12 text-center shadow-[0_4px_16px_rgba(0,0,0,0.02)]">
        <div className="h-8 w-8 mx-auto animate-spin rounded-full border-2 border-[#00A859] border-t-transparent" />
        <p className="mt-3 text-xs text-[#5c7268]">Loading account settings...</p>
      </div>
    );
  }

  return (
    <div className="max-w-[1100px] space-y-6">
      <div>
        <h1 className="text-2xl font-black text-[#0c1913] flex items-center gap-2.5">
          <Settings className="h-6 w-6 text-[#00A859]" />
          <span>Account Settings</span>
        </h1>
        <p className="mt-1 text-xs text-[#5c7268]">
          Manage your personal profile, preferred shopping market, and alert preferences.
        </p>
      </div>

      {feedback && (
        <div
          className={`flex items-center gap-2 rounded-2xl p-4 text-xs font-semibold ${
            feedback.type === 'success'
              ? 'border border-emerald-200 bg-emerald-50 text-emerald-800'
              : 'border border-red-200 bg-red-50 text-red-800'
          }`}
        >
          {feedback.type === 'success' ? (
            <CheckCircle2 className="h-4 w-4 text-[#00A859] shrink-0" />
          ) : (
            <AlertCircle className="h-4 w-4 text-red-600 shrink-0" />
          )}
          <span>{feedback.text}</span>
        </div>
      )}

      {!user && (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-3xl border border-emerald-300/60 bg-emerald-50/70 p-6">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-5 w-5 text-[#00A859]" />
              <h3 className="text-sm font-black text-[#0c1913]">Browsing as a Guest</h3>
            </div>
            <p className="text-xs text-[#5c7268] max-w-lg leading-relaxed">
              Sign in or create a free account to customize notifications, save alerts permanently, and synchronize across all your devices.
            </p>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <Link
              href={`/${country}/login`}
              className="inline-flex h-10 items-center justify-center rounded-xl bg-[#00C16A] px-4 text-xs font-black text-white hover:bg-[#00a85c] shadow-[0_4px_12px_rgba(0,193,106,0.25)] transition-all"
            >
              Sign In
            </Link>
            <Link
              href={`/${country}/signup`}
              className="inline-flex h-10 items-center justify-center rounded-xl border border-[#d2e0da] bg-white px-4 text-xs font-bold text-[#0c1913] hover:bg-[#f2f7f4] transition-colors"
            >
              Create Account
            </Link>
          </div>
        </div>
      )}

      <form onSubmit={handleSaveSettings} className="grid gap-6 lg:grid-cols-2">
        {/* 1. Profile Information (Only for authenticated users) */}
        {user && (
          <section className="rounded-3xl border border-[#d6e3dd] bg-white p-6 shadow-[0_4px_16px_rgba(0,0,0,0.02)] space-y-4">
            <h2 className="text-sm font-black text-[#0c1913] flex items-center gap-2">
              <User className="h-4 w-4 text-[#00A859]" />
              <span>Profile Information</span>
            </h2>

            <div>
              <label className="block text-xs font-bold text-[#1f382e] mb-1.5" htmlFor="settings-name">
                Full / Display Name
              </label>
              <input
                id="settings-name"
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder="Your name"
                className="h-11 w-full rounded-2xl border border-[#d2e0da] bg-[#f8faf9] px-3.5 text-xs font-bold text-[#0c1913] outline-none focus:border-[#00C16A] focus:bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#1f382e] mb-1.5" htmlFor="settings-email">
                Email Address
              </label>
              <div className="flex h-11 items-center gap-2 rounded-2xl border border-[#d2e0da] bg-slate-50 px-3.5 text-xs text-slate-500">
                <Mail className="h-4 w-4 text-slate-400" />
                <span className="font-medium text-[#0c1913]">{email}</span>
                <span className="ml-auto flex items-center gap-1 rounded-md bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-800">
                  <ShieldCheck className="h-3 w-3" />
                  Verified
                </span>
              </div>
            </div>
          </section>
        )}

        {/* 2. Market & Currency Preferences */}
        <section className="rounded-3xl border border-[#d6e3dd] bg-white p-6 shadow-[0_4px_16px_rgba(0,0,0,0.02)] space-y-4">
          <h2 className="text-sm font-black text-[#0c1913] flex items-center gap-2">
            <Globe className="h-4 w-4 text-[#00A859]" />
            <span>Market & Currency</span>
          </h2>

          <div>
            <label className="block text-xs font-bold text-[#1f382e] mb-1.5" htmlFor="settings-market">
              Primary Shopping Region
            </label>
            <select
              id="settings-market"
              value={market}
              onChange={(e) => setMarket(e.target.value as CountryCode)}
              className="h-11 w-full rounded-2xl border border-[#d2e0da] bg-[#f8faf9] px-3.5 text-xs font-bold text-[#0c1913] outline-none focus:border-[#00C16A] focus:bg-white"
            >
              <option value="ae">🇦🇪 United Arab Emirates (AED)</option>
              <option value="us">🇺🇸 United States (USD)</option>
            </select>
            <p className="mt-1 text-[11px] text-[#71867c]">
              Currency follows the active market automatically to ensure accurate price comparison.
            </p>
          </div>
        </section>

        {/* 3. Notification Preferences */}
        <section className="rounded-3xl border border-[#d6e3dd] bg-white p-6 shadow-[0_4px_16px_rgba(0,0,0,0.02)] space-y-4 lg:col-span-2">
          <h2 className="text-sm font-black text-[#0c1913] flex items-center gap-2">
            <Bell className="h-4 w-4 text-[#00A859]" />
            <span>Alert & Notification Preferences</span>
          </h2>

          <div className="space-y-3">
            <label className="flex items-center justify-between p-2 rounded-xl hover:bg-[#f9fcfb] cursor-pointer">
              <div>
                <span className="text-xs font-bold text-[#0c1913] block">Target Price Drops</span>
                <span className="text-[11px] text-[#71867c] block">
                  Notify me immediately when an item hits or beats my target price
                </span>
              </div>
              <input
                type="checkbox"
                checked={notifyTargetReached}
                onChange={(e) => setNotifyTargetReached(e.target.checked)}
                className="h-4 w-4 rounded border-[#d2e0da] text-[#00C16A] focus:ring-[#00C16A]"
              />
            </label>

            <label className="flex items-center justify-between p-2 rounded-xl hover:bg-[#f9fcfb] cursor-pointer border-t border-[#edf4f0] pt-3">
              <div>
                <span className="text-xs font-bold text-[#0c1913] block">Price Movement Alerts</span>
                <span className="text-[11px] text-[#71867c] block">
                  Notify me when any saved product experiences a significant price drop
                </span>
              </div>
              <input
                type="checkbox"
                checked={notifyPriceDrops}
                onChange={(e) => setNotifyPriceDrops(e.target.checked)}
                className="h-4 w-4 rounded border-[#d2e0da] text-[#00C16A] focus:ring-[#00C16A]"
              />
            </label>

            <label className="flex items-center justify-between p-2 rounded-xl hover:bg-[#f9fcfb] cursor-pointer border-t border-[#edf4f0] pt-3">
              <div>
                <span className="text-xs font-bold text-[#0c1913] block">Weekly Watchlist Digest</span>
                <span className="text-[11px] text-[#71867c] block">
                  Receive a weekly summary email of price trends on your saved products
                </span>
              </div>
              <input
                type="checkbox"
                checked={notifyWeeklyDigest}
                onChange={(e) => setNotifyWeeklyDigest(e.target.checked)}
                className="h-4 w-4 rounded border-[#d2e0da] text-[#00C16A] focus:ring-[#00C16A]"
              />
            </label>

            <label className="flex items-center justify-between p-2 rounded-xl hover:bg-[#f9fcfb] cursor-pointer border-t border-[#edf4f0] pt-3">
              <div>
                <span className="text-xs font-bold text-[#0c1913] block">Major Deal Highlights</span>
                <span className="text-[11px] text-[#71867c] block">
                  Occasional alerts for highest-scoring deals (score 90+) in your category interests
                </span>
              </div>
              <input
                type="checkbox"
                checked={notifyDeals}
                onChange={(e) => setNotifyDeals(e.target.checked)}
                className="h-4 w-4 rounded border-[#d2e0da] text-[#00C16A] focus:ring-[#00C16A]"
              />
            </label>
          </div>
        </section>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2 lg:col-span-2">
          <button
            type="submit"
            disabled={saving}
            className="w-full sm:w-auto inline-flex h-12 items-center justify-center gap-2 rounded-2xl bg-[#00C16A] px-6 text-xs font-black text-white hover:bg-[#00a85c] shadow-[0_4px_14px_rgba(0,193,106,0.25)] transition-all disabled:opacity-50"
          >
            <Save className="h-4 w-4" />
            <span>{saving ? 'Saving…' : 'Save Preferences'}</span>
          </button>

          {user && (
            <button
              type="button"
              onClick={handleSignOut}
              className="w-full sm:w-auto inline-flex h-12 items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-5 text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors"
            >
              <LogOut className="h-4 w-4 text-slate-500" />
              <span>Sign Out of Account</span>
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
