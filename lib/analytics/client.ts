'use client';

const SESSION_KEY = 'ctp-session-id';
const PRIVACY_KEY = 'ctp-privacy-v1';

export function isAnalyticsAllowed(): boolean {
  if (typeof window === 'undefined') return false;
  try {
    const raw = window.localStorage.getItem(PRIVACY_KEY);
    if (!raw) return false;
    const parsed = JSON.parse(raw) as { version?: number; analytics?: boolean };
    return parsed.version === 1 && parsed.analytics === true;
  } catch {
    return false;
  }
}

export function getAnalyticsSessionId(): string | null {
  if (typeof window === 'undefined' || !isAnalyticsAllowed()) return null;

  const existing = window.sessionStorage.getItem(SESSION_KEY);
  if (existing) return existing;

  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    const id = crypto.randomUUID();
    window.sessionStorage.setItem(SESSION_KEY, id);
    return id;
  }

  return null;
}

export async function sendAnalyticsEvent(payload: Record<string, unknown>) {
  if (!isAnalyticsAllowed()) return;

  try {
    await fetch('/api/analytics/event', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...payload,
        sessionId: payload.sessionId || getAnalyticsSessionId(),
      }),
      keepalive: true,
      cache: 'no-store',
    });
  } catch {
    // Analytics must never interrupt shopping or navigation.
  }
}

export function trackProductView(productSlug: string, country: string) {
  void sendAnalyticsEvent({
    eventType: 'product_view',
    productSlug,
    country,
    path: `/${country}/product/${productSlug}`,
  });
}

export function trackSearch(query: string, resultCount: number, country: string) {
  void sendAnalyticsEvent({
    eventType: 'search',
    searchQuery: query,
    resultCount,
    country,
    path: `/${country}/search`,
  });
}

export function trackCompare(leftProduct: string, rightProduct: string, country: string) {
  void sendAnalyticsEvent({
    eventType: 'compare',
    leftProduct,
    rightProduct,
    country,
    path: `/${country}/compare`,
  });
}

export function trackSaveProduct(productSlug: string, saved: boolean, country: string) {
  void sendAnalyticsEvent({
    eventType: 'save_product',
    productSlug,
    saved,
    country,
    path: `/${country}/product/${productSlug}`,
  });
}

export function trackCreateAlert(productSlug: string, targetPrice: number, country: string) {
  void sendAnalyticsEvent({
    eventType: 'create_alert',
    productSlug,
    targetPrice,
    country,
    path: `/${country}/product/${productSlug}`,
  });
}

export function trackAffiliateClick(offerId: string, merchantName: string, country: string, productSlug?: string) {
  void sendAnalyticsEvent({
    eventType: 'affiliate_click',
    offerId,
    merchantName,
    productSlug,
    country,
    path: productSlug ? `/${country}/product/${productSlug}` : `/${country}`,
  });
}

export function trackRetailerClick(offerId: string, merchantName: string, country: string, productSlug?: string) {
  void sendAnalyticsEvent({
    eventType: 'retailer_click',
    offerId,
    merchantName,
    productSlug,
    country,
    path: productSlug ? `/${country}/product/${productSlug}` : `/${country}`,
  });
}

export function trackDealView(productSlug: string, dealScore: number, category: string, country: string) {
  void sendAnalyticsEvent({
    eventType: 'deal_view',
    productSlug,
    dealScore,
    category,
    country,
    path: `/${country}/deals/${category}`,
  });
}

export function trackGuideView(guideSlug: string, category: string, country: string) {
  void sendAnalyticsEvent({
    eventType: 'guide_view',
    guideSlug,
    category,
    country,
    path: `/${country}/blog/${guideSlug}`,
  });
}

