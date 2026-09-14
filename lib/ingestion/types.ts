export interface RawMerchantItem {
  rawSku: string;
  rawTitle: string;
  rawBrand?: string;
  rawCategory?: string;
  rawPrice: number;
  rawCurrency: string;
  rawUrl: string;
  inStock: boolean;
  shippingText?: string;
  merchantSlug: string;
  merchantName: string;
}

export interface NormalizedItem {
  sku: string;
  title: string;
  brand: string;
  categorySlug: string;
  price: number;
  currency: string;
  url: string;
  inStock: boolean;
  shippingInfo: string;
  merchantSlug: string;
  merchantName: string;
}

export interface MatchResult {
  rawSku: string;
  matchedProductId: string | null;
  confidence: number;
  method: 'exact_sku' | 'fuzzy_token' | 'ai_disambiguation';
}

export interface IngestionPipelineResult {
  runId: string;
  itemsFetched: number;
  itemsProcessed: number;
  itemsMatched: number;
  priceDropsDetected: number;
  alertsTriggered: number;
  durationMs: number;
  errors: string[];
}
