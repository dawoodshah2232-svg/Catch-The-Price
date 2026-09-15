import 'server-only';

import { MerchantSourceAdapter } from '@/lib/ingestion/sourceAdapter';
import { RawMerchantItem } from '@/lib/ingestion/types';

export type BestBuyApiConfig = {
  rightsId: string;
  merchantSlug: string;
  merchantName: string;
  apiEnvKey?: string;
  search?: string;
  pageSize?: number;
  maxPages?: number;
};

type BestBuyProduct = {
  sku?: number | string;
  name?: string;
  manufacturer?: string;
  salePrice?: number;
  regularPrice?: number;
  url?: string;
  image?: string;
  largeFrontImage?: string;
  upc?: string;
  modelNumber?: string;
  onlineAvailability?: boolean;
  categoryPath?: Array<{ id?: string; name?: string }>;
};

type BestBuyResponse = {
  products?: BestBuyProduct[];
  currentPage?: number;
  totalPages?: number;
};

function clampInt(value: unknown, min: number, max: number, fallback: number) {
  const parsed = Number(value);
  if (!Number.isFinite(parsed)) return fallback;
  return Math.max(min, Math.min(max, Math.floor(parsed)));
}

function buildProductsUrl(apiKey: string, config: BestBuyApiConfig, page: number): URL {
  const search = (config.search || 'onlineAvailability=true').trim();
  const expression = search ? `(${search})` : '';
  const url = new URL(`https://api.bestbuy.com/v1/products${expression}`);
  url.searchParams.set('apiKey', apiKey);
  url.searchParams.set('format', 'json');
  url.searchParams.set('page', String(page));
  url.searchParams.set('pageSize', String(clampInt(config.pageSize, 1, 100, 50)));
  url.searchParams.set(
    'show',
    'sku,name,manufacturer,salePrice,regularPrice,url,image,largeFrontImage,upc,modelNumber,onlineAvailability,categoryPath'
  );
  return url;
}

function categoryText(product: BestBuyProduct): string | undefined {
  const names = Array.isArray(product.categoryPath)
    ? product.categoryPath.map((entry) => entry?.name).filter(Boolean)
    : [];
  return names.length ? names.join(' > ') : undefined;
}

/**
 * Official Best Buy Products API adapter.
 * This adapter does not activate a source or grant publication rights. It only runs
 * after the persisted source-rights gate is ACTIVE and a private API key exists.
 */
export function createBestBuyApiAdapter(config: BestBuyApiConfig): MerchantSourceAdapter {
  return {
    sourceRightsId: config.rightsId,
    market: 'us',
    adapterName: 'Best Buy Products API',
    async fetchItems(): Promise<RawMerchantItem[]> {
      const envKey = (config.apiEnvKey || 'BESTBUY_API_KEY').trim();
      const apiKey = process.env[envKey]?.trim();
      if (!apiKey) throw new Error(`Missing private environment variable ${envKey}`);

      const maxPages = clampInt(config.maxPages, 1, 10, 2);
      const output: RawMerchantItem[] = [];

      for (let page = 1; page <= maxPages; page += 1) {
        const url = buildProductsUrl(apiKey, config, page);
        const response = await fetch(url, {
          method: 'GET',
          headers: {
            Accept: 'application/json',
            'User-Agent': 'CatchThePrice/1.0',
          },
          cache: 'no-store',
          signal: AbortSignal.timeout(15000),
        });

        if (!response.ok) {
          throw new Error(`Best Buy API request failed with HTTP ${response.status}`);
        }

        const payload = (await response.json()) as BestBuyResponse;
        const products = Array.isArray(payload.products) ? payload.products : [];

        for (const product of products) {
          const sku = String(product.sku ?? '').trim();
          const title = String(product.name ?? '').trim();
          const productUrl = String(product.url ?? '').trim();
          const salePrice = Number(product.salePrice ?? product.regularPrice ?? 0);

          if (!sku || !title || !productUrl || !Number.isFinite(salePrice) || salePrice <= 0) {
            continue;
          }

          output.push({
            rawSku: sku,
            rawTitle: title,
            rawBrand: product.manufacturer?.trim() || undefined,
            rawCategory: categoryText(product),
            rawPrice: salePrice,
            rawCurrency: 'USD',
            rawUrl: productUrl,
            rawImageUrl: product.largeFrontImage || product.image || undefined,
            rawGtin: product.upc?.trim() || undefined,
            rawModel: product.modelNumber?.trim() || undefined,
            inStock: Boolean(product.onlineAvailability),
            shippingText: 'See Best Buy for delivery or pickup details',
            merchantSlug: config.merchantSlug,
            merchantName: config.merchantName,
          });
        }

        const totalPages = Number(payload.totalPages || page);
        if (page >= totalPages || products.length === 0) break;
      }

      return output;
    },
  };
}
