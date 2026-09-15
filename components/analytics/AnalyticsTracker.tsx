'use client';

import { useEffect, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';
import { useCountry } from '@/context/CountryContext';
import { sendAnalyticsEvent } from '@/lib/analytics/client';
import { recordRecentlyViewed } from '@/lib/recentlyViewed/client';

const STORAGE_KEY = 'ctp-privacy-v1';

function readAnalyticsConsent(): boolean {
  if (typeof window === 'undefined') return false;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return false;
    const parsed = JSON.parse(raw) as { version?: number; analytics?: boolean };
    return parsed.version === 1 && parsed.analytics === true;
  } catch {
    return false;
  }
}

export function AnalyticsTracker() {
  const pathname = usePathname();
  const { country } = useCountry();
  const lastAnalyticsPath = useRef('');
  const lastRecentPath = useRef('');
  const [analyticsAllowed, setAnalyticsAllowed] = useState(false);

  useEffect(() => {
    setAnalyticsAllowed(readAnalyticsConsent());

    const onConsentChanged = (event: Event) => {
      const detail = (event as CustomEvent<{ analytics?: boolean }>).detail;
      setAnalyticsAllowed(detail?.analytics === true);
    };

    window.addEventListener('ctp-privacy-changed', onConsentChanged);
    return () => window.removeEventListener('ctp-privacy-changed', onConsentChanged);
  }, []);

  useEffect(() => {
    if (!pathname || lastRecentPath.current === pathname) return;
    lastRecentPath.current = pathname;

    const productPrefix = `/${country}/product/`;
    if (pathname.startsWith(productPrefix)) {
      const productSlug = pathname.slice(productPrefix.length).split('/')[0];
      if (productSlug) recordRecentlyViewed(country, productSlug);
    }
  }, [pathname, country]);

  useEffect(() => {
    if (!analyticsAllowed || !pathname || lastAnalyticsPath.current === pathname) return;
    lastAnalyticsPath.current = pathname;

    const base = { country, path: pathname };
    void sendAnalyticsEvent({ eventType: 'page_view', ...base });

    const productPrefix = `/${country}/product/`;
    if (pathname.startsWith(productPrefix)) {
      const productSlug = pathname.slice(productPrefix.length).split('/')[0];
      if (productSlug) void sendAnalyticsEvent({ eventType: 'product_view', ...base, productSlug });
    }
  }, [analyticsAllowed, pathname, country]);

  return null;
}
