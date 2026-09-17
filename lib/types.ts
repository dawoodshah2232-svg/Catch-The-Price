export type CountryCode = 'ae' | 'us' | 'sa' | 'uk' | 'ca' | 'au';

export interface CountryInfo {
  code: CountryCode;
  name: string;
  flag: string;
  currency: string;
  symbol: string;
  locale: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  icon: string;
  description: string;
  productCount?: number;
}

export interface Merchant {
  id: string;
  name: string;
  slug: string;
  domain: string;
  logoUrl: string;
  rating: number;
  reviewCount: number;
  country: CountryCode;
  affiliateTemplate?: string;
  affiliateNetwork?: string;
  affiliateStatus?: 'ACTIVE' | 'PENDING' | 'DISABLED' | 'REVOKED';
  trustedBadge: boolean;
}

export interface Offer {
  id: string;
  productId: string;
  merchantId: string;
  merchantName: string;
  merchantLogo: string;
  merchantRating: number;
  price: number;
  originalPrice: number;
  currency: string;
  inStock: boolean;
  shippingInfo: string;
  deliveryDays?: string;
  condition: string;
  url: string;
  affiliateUrl?: string;
  retailerProductId?: string;
  previousPrice?: number;
  sourceType?: 'official_api' | 'approved_feed' | 'affiliate_feed' | 'manual';
  sourceUpdatedAt?: string;
  lastCheckedAt: string;
  isBestPrice?: boolean;
}

export interface PricePoint {
  date: string;
  price: number;
  merchantName?: string;
}

export interface PriceStats {
  currentPrice: number;
  lowestPrice: number;
  highestPrice: number;
  average30Days: number;
  average90Days: number;
  allTimeLowestDate?: string;
}

export interface Product {
  id: string;
  title: string;
  slug: string;
  brand: string;
  categoryId: string;
  categorySlug: string;
  categoryName: string;
  description: string;
  imageUrl: string;
  gallery: string[];
  specs: Record<string, string>;
  currentBestPrice: number;
  originalPrice: number;
  currency: string;
  country: CountryCode;
  dealScore: number;
  isTrending?: boolean;
  isTopDeal?: boolean;
  offersCount: number;
  bestMerchantName: string;
  priceLastChecked: string;
  priceStats: PriceStats;
  priceHistory: PricePoint[];
  offers: Offer[];
  aiSummary?: {
    verdict: string;
    pros: string[];
    cons: string[];
    bestTimeToBuy: boolean;
  };
}

export interface WatchlistAlert {
  id: string;
  productId: string;
  productTitle: string;
  productImage: string;
  currentPrice: number;
  targetPrice?: number;
  alertType: 'any_drop' | 'below_amount' | 'major_deal';
  currency: string;
  country: CountryCode;
  isActive: boolean;
  createdAt: string;
  lastTriggeredAt?: string;
}

export interface IngestionSource {
  id: string;
  name: string;
  merchantId: string;
  merchantName: string;
  adapterType: 'feed' | 'api' | 'sitemap';
  frequency: string;
  isActive: boolean;
  lastRunAt?: string;
  lastStatus?: 'success' | 'failed' | 'running';
  itemsCount: number;
}

export interface IngestionRun {
  id: string;
  sourceId: string;
  sourceName: string;
  status: 'completed' | 'in_progress' | 'failed';
  itemsFetched: number;
  itemsProcessed: number;
  itemsMatched: number;
  errorsCount: number;
  startedAt: string;
  completedAt?: string;
}

export interface ProductMatchQueueItem {
  id: string;
  rawTitle: string;
  sourceMerchant: string;
  rawPrice: number;
  currency: string;
  matchedProductId?: string;
  matchedProductTitle?: string;
  confidenceScore: number;
  status: 'auto_matched' | 'flagged' | 'manual_verified';
  detectedAt: string;
}

export interface OutboundClickRecord {
  id: string;
  offerId: string;
  productId: string;
  productTitle: string;
  merchantName: string;
  country: CountryCode;
  price: number;
  currency: string;
  timestamp: string;
}
