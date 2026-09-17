import { SaxesParser } from 'saxes';
import type { RawMerchantItem } from '@/lib/ingestion/types';

export type AdmitadXmlFeedConfig = {
  feedUrl: string;
  merchantSlug: string;
  merchantName: string;
  /** The market currency required for this source. */
  currency: 'AED' | 'USD';
  requireImage?: boolean;
  minPrice?: number;
  maxPrice?: number;
  allowedCategories?: string[];
};

type OfferFields = Record<string, string[]>;

function text(value: string | undefined): string | undefined {
  const clean = value?.replace(/\s+/g, ' ').trim();
  return clean || undefined;
}

function number(value: string | undefined): number | undefined {
  if (!value) return undefined;
  const parsed = Number(value.replace(/\s/g, '').replace(',', '.'));
  return Number.isFinite(parsed) ? parsed : undefined;
}

function bool(value: string | undefined, fallback: boolean): boolean {
  if (!value) return fallback;
  return ['true', '1', 'yes', 'available', 'in_stock'].includes(value.toLowerCase());
}

function first(fields: OfferFields, ...names: string[]): string | undefined {
  for (const name of names) {
    const value = fields[name]?.[0];
    if (value) return value;
  }
  return undefined;
}

function values(fields: OfferFields, ...names: string[]): string[] {
  return names.flatMap((name) => fields[name] || []).map(text).filter((value): value is string => Boolean(value));
}

function validateFeedUrl(feedUrl: string): URL {
  const url = new URL(feedUrl);
  if (url.protocol !== 'https:') throw new Error('Admitad feed URLs must use HTTPS');
  return url;
}

async function fetchFeed(url: URL, signal?: AbortSignal): Promise<Response> {
  let lastError: Error | undefined;
  for (let attempt = 0; attempt < 3; attempt += 1) {
    try {
      const response = await fetch(url, {
        headers: { Accept: 'application/xml,text/xml;q=0.9,*/*;q=0.1', 'User-Agent': 'CatchThePriceAdmitadImporter/1.0' },
        cache: 'no-store',
        signal: signal ?? AbortSignal.timeout(55_000),
      });
      if (response.ok && response.body) return response;
      await response.body?.cancel();
      lastError = new Error(`Admitad feed request failed (${response.status})`);
      if (response.status < 429 || (response.status < 500 && response.status !== 408)) break;
    } catch (error) {
      lastError = error instanceof Error ? error : new Error('Admitad feed request failed');
    }
    await new Promise((resolve) => setTimeout(resolve, 250 * 2 ** attempt));
  }
  throw lastError || new Error('Admitad feed request failed');
}

function mapOffer(fields: OfferFields, attributes: Record<string, string>, config: AdmitadXmlFeedConfig): RawMerchantItem | null {
  const rawSku = text(attributes.id || first(fields, 'id', 'sku', 'vendorcode', 'offerid'));
  const rawTitle = text(first(fields, 'name', 'model', 'title'));
  const rawPrice = number(first(fields, 'price'));
  const rawCurrency = text(first(fields, 'currencyid', 'currency', 'currencycode'))?.toUpperCase();
  const affiliateUrl = text(first(fields, 'url', 'affiliate_url'));
  const productUrl = text(first(fields, 'product_url', 'producturl', 'link', 'url'));
  const rawCategory = text(first(fields, 'category', 'categoryid', 'typeprefix'));
  const images = values(fields, 'picture', 'image', 'image_url', 'thumbnail');

  if (!rawSku || !rawTitle || !rawPrice || !rawCurrency || !productUrl) return null;
  if (rawCurrency !== config.currency) return null;
  if (config.requireImage && images.length === 0) return null;
  if (config.minPrice && rawPrice < config.minPrice) return null;
  if (config.maxPrice && rawPrice > config.maxPrice) return null;
  if (config.allowedCategories?.length && (!rawCategory || !config.allowedCategories.includes(rawCategory))) return null;

  const oldPrice = number(first(fields, 'oldprice', 'old_price', 'priceold'));
  return {
    rawSku,
    rawTitle,
    rawBrand: text(first(fields, 'vendor', 'brand', 'manufacturer')),
    rawCategory,
    rawPrice,
    rawOriginalPrice: oldPrice && oldPrice >= rawPrice ? oldPrice : undefined,
    rawCurrency,
    rawUrl: productUrl,
    rawAffiliateUrl: affiliateUrl,
    rawImageUrl: images[0],
    rawImageUrls: images,
    rawDescription: text(first(fields, 'description', 'annotation'))?.slice(0, 4000),
    rawGtin: text(first(fields, 'barcode', 'gtin', 'ean', 'upc')),
    rawMpn: text(first(fields, 'mpn', 'vendorcode', 'partnumber')),
    rawModel: text(first(fields, 'model')),
    inStock: bool(attributes.available || first(fields, 'available', 'instock'), true),
    shippingText: text(first(fields, 'delivery', 'shipping', 'shipping_text')),
    merchantSlug: config.merchantSlug,
    merchantName: config.merchantName,
    rawMetadata: {
      source: 'admitad_xml',
      categoryId: text(first(fields, 'categoryid')),
      vendorCode: text(first(fields, 'vendorcode')),
    },
  };
}

/**
 * Streams one XML offer at a time. The bounded queue applies backpressure between
 * network reads and database writes, so a multi-million-item feed is never held in memory.
 */
export async function* streamAdmitadXmlFeed(
  config: AdmitadXmlFeedConfig,
  options: { signal?: AbortSignal; queueSize?: number } = {},
): AsyncGenerator<RawMerchantItem> {
  const url = validateFeedUrl(config.feedUrl);
  const response = await fetchFeed(url, options.signal);
  const responseBody = response.body;
  if (!responseBody) throw new Error('Admitad feed response has no body');

  const queue: RawMerchantItem[] = [];
  const queueSize = options.queueSize ?? 100;
  let done = false;
  let failure: Error | null = null;
  let wake: (() => void) | undefined;
  let waitForSpace: (() => void) | undefined;
  const notify = () => {
    wake?.();
    wake = undefined;
  };
  const parser = new SaxesParser({ xmlns: false });
  let inOffer = false;
  let currentTag = '';
  let fields: OfferFields = {};
  let attributes: Record<string, string> = {};

  parser.on('opentag', (tag) => {
    const name = tag.name.toLowerCase();
    if (name === 'offer') {
      inOffer = true;
      fields = {};
      attributes = Object.fromEntries(Object.entries(tag.attributes).map(([key, value]) => [key.toLowerCase(), String(value)]));
    } else if (inOffer) {
      currentTag = name;
    }
  });
  const append = (value: string) => {
    if (inOffer && currentTag) (fields[currentTag] ||= []).push(value);
  };
  parser.on('text', append);
  parser.on('cdata', append);
  parser.on('closetag', (tag) => {
    const name = (typeof tag === 'string' ? tag : tag.name).toLowerCase();
    if (name === 'offer' && inOffer) {
      const item = mapOffer(fields, attributes, config);
      if (item) queue.push(item);
      inOffer = false;
      currentTag = '';
      notify();
    } else if (name === currentTag) {
      currentTag = '';
    }
  });
  parser.on('error', (error) => {
    failure = error;
    notify();
  });

  const reader = responseBody.getReader();
  const decoder = new TextDecoder();
  const pump = (async () => {
    try {
      while (true) {
        const { value, done: readDone } = await reader.read();
        if (readDone) break;
        parser.write(decoder.decode(value, { stream: true }));
        if (queue.length >= queueSize) await new Promise<void>((resolve) => { waitForSpace = resolve; });
      }
      parser.write(decoder.decode()).close();
    } catch (error) {
      failure = error instanceof Error ? error : new Error('Admitad XML stream failed');
    } finally {
      done = true;
      notify();
    }
  })();

  try {
    while (!done || queue.length > 0) {
      const item = queue.shift();
      if (item) {
        if (queue.length < queueSize) {
          waitForSpace?.();
          waitForSpace = undefined;
        }
        yield item;
        continue;
      }
      if (failure) throw failure;
      await new Promise<void>((resolve) => { wake = resolve; });
    }
    if (failure) throw failure;
  } finally {
    await reader.cancel().catch(() => undefined);
    await pump;
  }
}
