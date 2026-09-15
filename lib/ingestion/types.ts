export interface RawMerchantItem {
  rawSku: string;
  rawTitle: string;
  rawBrand?: string;
  rawCategory?: string;
  rawPrice: number;
  rawCurrency: string;
  rawUrl: string;
  rawImageUrl?: string;
  rawGtin?: string;
  rawMpn?: string;
  rawModel?: string;
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
  imageUrl?: string;
  gtin?: string;
  mpn?: string;
  model?: string;
  inStock: boolean;
  shippingInfo: string;
  merchantSlug: string;
  merchantName: string;
}

export interface MatchResult {
  rawSku: string;
  matchedProductId: string | null;
  confidence: number;
  method: 'exact_gtin' | 'exact_mpn' | 'exact_model' | 'exact_sku' | 'fuzzy_token' | 'ai_disambiguation';
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
