export interface RawMerchantItem {
  rawSku: string;
  rawTitle: string;
  rawBrand?: string;
  rawCategory?: string;
  rawPrice: number;
  rawOriginalPrice?: number;
  rawCurrency: string;
  rawUrl: string;
  rawAffiliateUrl?: string;
  rawImageUrl?: string;
  rawImageUrls?: string[];
  rawDescription?: string;
  rawGtin?: string;
  rawMpn?: string;
  rawModel?: string;
  inStock: boolean;
  shippingText?: string;
  merchantSlug: string;
  merchantName: string;
  rawMetadata?: Record<string, unknown>;
}

export interface NormalizedItem {
  sku: string;
  title: string;
  brand: string;
  categorySlug: string;
  price: number;
  originalPrice?: number;
  currency: string;
  url: string;
  affiliateUrl?: string;
  imageUrl?: string;
  imageUrls?: string[];
  description?: string;
  gtin?: string;
  mpn?: string;
  model?: string;
  inStock: boolean;
  shippingInfo: string;
  merchantSlug: string;
  merchantName: string;
  metadata?: Record<string, unknown>;
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
