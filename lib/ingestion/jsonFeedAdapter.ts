import 'server-only';

import { MerchantSourceAdapter, LaunchMarket } from '@/lib/ingestion/sourceAdapter';
import { RawMerchantItem } from '@/lib/ingestion/types';

export type JsonFeedConfig = {
  feedUrl: string;
  rightsId: string;
  merchantSlug: string;
  merchantName: string;
};

function normalizeHost(value: string): string {
  return value.toLowerCase().replace(/^www\./, '');
}

function validateFeedUrl(feedUrl: string, baseUrl?: string | null): URL {
  const url = new URL(feedUrl);
  if (url.protocol !== 'https:') throw new Error('Feed URL must use HTTPS');

  if (baseUrl) {
    const base = new URL(baseUrl);
    const host = normalizeHost(url.hostname);
    const baseHost = normalizeHost(base.hostname);
    if (host !== baseHost && !host.endsWith(`.${baseHost}`)) {
      throw new Error('Feed URL host must match the configured source host');
    }
  }

  return url;
}

function toNumber(value: unknown): number {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
}

function toBoolean(value: unknown): boolean {
  if (typeof value === 'boolean') return value;
  if (typeof value === 'string') return ['true', '1', 'yes', 'in_stock', 'instock'].includes(value.toLowerCase());
  return Boolean(value);
}

/**
 * Generic partner JSON feed adapter.
 * Expected feed shape: an array or { items: [...] } where each item exposes
 * sku/id, title/name, price, currency, url/product_url and optional brand,
 * category, stock/in_stock and shipping/shipping_text fields.
 */
export function createJsonFeedAdapter({
  sourceRightsId,
  market,
  adapterName,
  baseUrl,
  config,
}: {
  sourceRightsId: string;
  market: LaunchMarket;
  adapterName: string;
  baseUrl?: string | null;
  config: JsonFeedConfig;
}): MerchantSourceAdapter {
  return {
    sourceRightsId,
    market,
    adapterName,
    async fetchItems(): Promise<RawMerchantItem[]> {
      const feedUrl = validateFeedUrl(config.feedUrl, baseUrl);
      const response = await fetch(feedUrl, {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'User-Agent': 'CatchThePriceFeedImporter/1.0',
        },
        cache: 'no-store',
        signal: AbortSignal.timeout(15000),
      });

      if (!response.ok) {
        throw new Error(`Feed request failed with HTTP ${response.status}`);
      }

      const payload = await response.json();
      const items = Array.isArray(payload) ? payload : Array.isArray(payload?.items) ? payload.items : [];
      if (!Array.isArray(items)) return [];

      return items.slice(0, 5000).map((item: Record<string, unknown>) => ({
        rawSku: String(item.sku ?? item.id ?? item.product_id ?? '').trim(),
        rawTitle: String(item.title ?? item.name ?? '').trim(),
        rawBrand: item.brand ? String(item.brand).trim() : undefined,
        rawCategory: item.category ? String(item.category).trim() : undefined,
        rawPrice: toNumber(item.price ?? item.current_price),
        rawCurrency: String(item.currency ?? '').trim().toUpperCase(),
        rawUrl: String(item.url ?? item.product_url ?? '').trim(),
        inStock: toBoolean(item.in_stock ?? item.stock ?? item.available ?? true),
        shippingText: item.shipping_text || item.shipping ? String(item.shipping_text ?? item.shipping) : undefined,
        merchantSlug: config.merchantSlug,
        merchantName: config.merchantName,
      }));
    },
  };
}
