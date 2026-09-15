'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { CountryCode, CountryInfo, WatchlistAlert } from '@/lib/types';
import { COUNTRIES, DEFAULT_COUNTRY, formatPrice } from '@/lib/data/countries';
import { useRouter, usePathname } from 'next/navigation';

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
  const router = useRouter();
  const pathname = usePathname();

  // Load only state that the visitor actually created on this device.
  // Production must never seed fake saved items or alerts.
  useEffect(() => {
    try {
      const saved = localStorage.getItem('ctp_saved_products');
      if (saved) {
        setSavedProductIds(JSON.parse(saved));
      }

      const savedAlerts = localStorage.getItem('ctp_alerts');
      if (savedAlerts) {
        setAlerts(JSON.parse(savedAlerts));
      }
    } catch {
      // Storage may be unavailable in restricted browser contexts.
    }
  }, []);

  const toggleSaveProduct = (productId: string) => {
    setSavedProductIds((prev) => {
      const exists = prev.includes(productId);
      const next = exists ? prev.filter((id) => id !== productId) : [...prev, productId];
      try {
        localStorage.setItem('ctp_saved_products', JSON.stringify(next));
      } catch {}
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
      const next = [newAlert, ...prev];
      try {
        localStorage.setItem('ctp_alerts', JSON.stringify(next));
      } catch {}
      return next;
    });
  };

  const removeAlert = (alertId: string) => {
    setAlerts((prev) => {
      const next = prev.filter((a) => a.id !== alertId);
      try {
        localStorage.setItem('ctp_alerts', JSON.stringify(next));
      } catch {}
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
      const countryList = ['ae', 'us', 'uk', 'ca', 'au'];
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
  if (!context) {
    throw new Error('useCountry must be used within a CountryProvider');
  }
  return context;
}
