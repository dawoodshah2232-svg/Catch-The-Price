'use client';

import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import { useCountry } from '@/context/CountryContext';

function getSessionId(): string | null {
  if (typeof window === 'undefined') return null;
  const key = 'ctp-session-id';
  const existing = window.sessionStorage.getItem(key);
  if (existing) return existing;

  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    const id = crypto.randomUUID();
    window.sessionStorage.setItem(key, id);
    return id;
  }
  return null;
}

async function sendEvent(payload: Record<string, unknown>) {
  try {
    await fetch('/api/analytics/event', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
      keepalive: true,
      cache: 'no-store',
    });
  } catch {
    // Analytics must never interrupt shopping.
  }
}

export function AnalyticsTracker() {
  const pathname = usePathname();
  const { country } = useCountry();
  const lastPath = useRef('');

  useEffect(() => {
    if (!pathname || lastPath.current === pathname) return;
    lastPath.current = pathname;

    const sessionId = getSessionId();
    const base = { country, path: pathname, sessionId };
    void sendEvent({ eventType: 'page_view', ...base });

    const productPrefix = `/${country}/product/`;
    if (pathname.startsWith(productPrefix)) {
      const productSlug = pathname.slice(productPrefix.length).split('/')[0];
      if (productSlug) void sendEvent({ eventType: 'product_view', ...base, productSlug });
    }
  }, [pathname, country]);

  return null;
}
