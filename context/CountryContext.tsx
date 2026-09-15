'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { CountryCode, CountryInfo, WatchlistAlert } from '@/lib/types';
import { COUNTRIES, DEFAULT_COUNTRY, formatPrice } from '@/lib/data/countries';
import { useRouter, usePathname } from 'next/navigation';
import { createSupabaseBrowserClient } from '@/lib/supabase/browser';

interface CountryContextType {
  country: CountryCode;
  countryInfo: CountryInfo;
  setCountry: (code: CountryCode) => void;
  formatLocalPrice: (amount: number) => string;
  savedProductIds: string[];
  toggleSaveProduct: (productId: string) => void;
  isProductSaved: (productId: string) => boolean;
  alerts: WatchlistAlert[];
  addAlert: (alert: Omit<WatchlistAlert, 'id' | 'createdAt'>) => void;
  removeAlert: (alertId: string) => void;
}

const CountryContext = createContext<CountryContextType | undefined>(undefined);
const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export function CountryProvider({
  children,
  initialCountry = DEFAULT_COUNTRY,
}: {
  children: React.ReactNode;
  initialCountry?: CountryCode;
}) {
  const [country, setCountryState] = useState<CountryCode>(initialCountry);
  const [savedProductIds, setSavedProductIds] = useState<string[]>([]);
  const [alerts, setAlerts] = useState<WatchlistAlert[]>([]);
  const [accountUserId, setAccountUserId] = useState<string | null>(null);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    try {
      const saved = localStorage.getItem('ctp_saved_products');
      if (saved) setSavedProductIds(JSON.parse(saved));

      const savedAlerts = localStorage.getItem('ctp_alerts');
      if (savedAlerts) setAlerts(JSON.parse(savedAlerts));
    } catch {
      // Storage may be unavailable in restricted browser contexts.
    }
  }, []);

  useEffect(() => {
    let cancelled = false;
    const supabase = createSupabaseBrowserClient();
    if (!supabase) return;

    const syncAccount = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (cancelled) return;
      setAccountUserId(user?.id || null);
      if (!user || (country !== 'ae' && country !== 'us')) return;

      try {
        const response = await fetch(`/api/account/watchlist?country=${encodeURIComponent(country)}`, { cache: 'no-store' });
        if (!response.ok) return;
        const payload = await response.json();
        const rows = Array.isArray(payload?.items) ? payload.items : [];
        const remoteIds = rows.map((row: { product_id?: string }) => row.product_id).filter(Boolean) as string[];

        setSavedProductIds((localIds) => {
          const mergeableLocal = localIds.filter((id) => UUID_RE.test(id));
          const merged = [...new Set([...remoteIds, ...mergeableLocal])];
          try {
            localStorage.setItem('ctp_saved_products', JSON.stringify(merged));
          } catch {}
          return merged;
        });
      } catch {
        // Account sync is best-effort; device state remains usable.
      }
    };

    void syncAccount();
    const { data: subscription } = supabase.auth.onAuthStateChange((_event, session) => {
      if (cancelled) return;
      setAccountUserId(session?.user?.id || null);
      if (session?.user) void syncAccount();
    });

    return () => {
      cancelled = true;
      subscription.subscription.unsubscribe();
    };
  }, [country]);

  const persistSavedProducts = (ids: string[]) => {
    try {
      localStorage.setItem('ctp_saved_products', JSON.stringify(ids));
    } catch {}
  };

  const toggleSaveProduct = (productId: string) => {
    setSavedProductIds((prev) => {
      const exists = prev.includes(productId);
      const next = exists ? prev.filter((id) => id !== productId) : [...prev, productId];
      persistSavedProducts(next);

      if (accountUserId && UUID_RE.test(productId) && (country === 'ae' || country === 'us')) {
        void fetch('/api/account/watchlist', {
          method: exists ? 'DELETE' : 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ productId, country, alertType: 'saved' }),
        }).catch(() => undefined);
      }

      return next;
    });
  };

  const isProductSaved = (productId: string) => savedProductIds.includes(productId);

  const addAlert = (alertData: Omit<WatchlistAlert, 'id' | 'createdAt'>) => {
    const newAlert: WatchlistAlert = {
      ...alertData,
      id: `alert-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };

    setAlerts((prev) => {
      const withoutSameProduct = prev.filter(
        (item) => !(item.productId === newAlert.productId && item.country === newAlert.country)
      );
      const next = [newAlert, ...withoutSameProduct];
      try {
        localStorage.setItem('ctp_alerts', JSON.stringify(next));
      } catch {}
      return next;
    });

    setSavedProductIds((prev) => {
      if (prev.includes(newAlert.productId)) return prev;
      const next = [...prev, newAlert.productId];
      persistSavedProducts(next);
      return next;
    });
  };

  const removeAlert = (alertId: string) => {
    setAlerts((prev) => {
      const target = prev.find((item) => item.id === alertId);
      const next = prev.filter((a) => a.id !== alertId);
      try {
        localStorage.setItem('ctp_alerts', JSON.stringify(next));
      } catch {}

      if (accountUserId && target && UUID_RE.test(target.productId) && (target.country === 'ae' || target.country === 'us')) {
        void fetch('/api/account/watchlist', {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ productId: target.productId, country: target.country }),
        }).catch(() => undefined);
      }

      return next;
    });
  };

  const setCountry = (newCountry: CountryCode) => {
    setCountryState(newCountry);
    try {
      localStorage.setItem('ctp_country', newCountry);
      document.cookie = `ctp_country=${newCountry}; path=/; max-age=31536000`;
    } catch {}

    if (pathname) {
      const segments = pathname.split('/').filter(Boolean);
      const countryList = ['ae', 'us', 'sa', 'uk', 'ca', 'au'];
      if (countryList.includes(segments[0])) {
        segments[0] = newCountry;
        router.push(`/${segments.join('/')}`);
      } else {
        router.push(`/${newCountry}`);
      }
    }
  };

  const countryInfo = COUNTRIES[country] || COUNTRIES.ae;
  const formatLocalPrice = (amount: number) => formatPrice(amount, country);

  return (
    <CountryContext.Provider
      value={{
        country,
        countryInfo,
        setCountry,
        formatLocalPrice,
        savedProductIds,
        toggleSaveProduct,
        isProductSaved,
        alerts,
        addAlert,
        removeAlert,
      }}
    >
      {children}
    </CountryContext.Provider>
  );
}

export function useCountry() {
  const context = useContext(CountryContext);
  if (!context) throw new Error('useCountry must be used within a CountryProvider');
  return context;
}
