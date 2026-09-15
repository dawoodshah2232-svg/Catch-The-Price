'use client';

import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import { useCountry } from '@/context/CountryContext';
import { sendAnalyticsEvent } from '@/lib/analytics/client';

export function AnalyticsTracker() {
  const pathname = usePathname();
  const { country } = useCountry();
  const lastPath = useRef('');

  useEffect(() => {
    if (!pathname || lastPath.current === pathname) return;
    lastPath.current = pathname;

    const base = { country, path: pathname };
    void sendAnalyticsEvent({ eventType: 'page_view', ...base });

    const productPrefix = `/${country}/product/`;
    if (pathname.startsWith(productPrefix)) {
      const productSlug = pathname.slice(productPrefix.length).split('/')[0];
      if (productSlug) void sendAnalyticsEvent({ eventType: 'product_view', ...base, productSlug });
    }
  }, [pathname, country]);

  return null;
}
