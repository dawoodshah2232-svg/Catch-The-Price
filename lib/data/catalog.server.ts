import 'server-only';

import { getServerSupabase } from '../supabase/server';
import { CountryCode, Offer, PricePoint, Product, ProductImage } from '../types';
import { IPHONE_16_PRO_MAX_IMAGES } from './gallery/apple-iphone-16-pro-max';
import { IPHONE_16_PRO_MAX_SPEC_GROUPS } from './specs/iphone-16-pro-max';
import {
  canPublishSource,
  listSourceRights,
  resolveMerchantSourceRights,
  SourceRightsRecord,
} from '../config/sourceRights';
import { getProductPopularityRank, searchProducts } from '../search/searchEngine';

const LIVE_MARKETS = new Set<CountryCode>(['ae', 'us']);

const JOINED_CATALOG_SELECT = `
  id,
  category_id,
  brand,
  name,
  slug,
  image_url,
  description,
  specs,
  status,
  categories ( id, name, slug ),
  offers (
    id,
    product_id,
    merchant_id,
    country_code,
    currency,
    price,
    original_price,
    availability,
    product_url,
    affiliate_url,
    last_checked_at,
    is_active,
    metadata,
    merchants (
      id,
      name,
      slug,
      logo_url,
      is_active,
      affiliate_network,
      affiliate_status
    ),
    price_history (
      id,
      price,
      original_price,
      availability,
      captured_at
    )
  )
`;

export type JoinedMerchantRow = {
  id: string;
  name: string;
  slug: string;
  logo_url: string | null;
  is_active: boolean;
  affiliate_network?: string | null;
  affiliate_status?: string | null;
};

export type JoinedHistoryRow = {
  id: string | number;
  price: number | string;
  original_price?: number | string | null;
  availability?: string | null;
  captured_at: string;
};

export type JoinedOfferRow = {
  id: string;
  product_id: string;
  merchant_id: string;
  country_code: string;
  currency: string;
  price: number | string;
  original_price: number | string | null;
  availability: string;
  product_url: string;
  affiliate_url: string | null;
  last_checked_at: string;
  is_active: boolean;
  metadata?: Record<string, unknown> | null;
  merchants: JoinedMerchantRow | null;
  price_history?: JoinedHistoryRow[] | null;
};

export type JoinedCategoryRow = {
  id: string;
  name: string;
  slug: string;
};

export type JoinedProductRow = {
  id: string;
  category_id: string | null;
  brand: string | null;
  name: string;
  slug: string;
  image_url: string | null;
  description: string | null;
  specs: Record<string, unknown> | null;
  status: string;
  categories: JoinedCategoryRow | null;
  offers?: JoinedOfferRow[] | null;
};

function numeric(value: number | string | null | undefined): number {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
}

function stringSpecs(value: Record<string, unknown> | null): Record<string, string> {
  if (!value) return {};
  return Object.fromEntries(
    Object.entries(value)
      .filter(([, item]) => ['string', 'number', 'boolean'].includes(typeof item))
      .map(([key, item]) => [key, String(item)])
  );
}

function priceStats(currentPrice: number, history: PricePoint[]) {
  const prices = history.length ? history.map((point) => point.price) : [currentPrice];
  return {
    currentPrice,
    lowestPrice: Math.min(...prices, currentPrice),
    highestPrice: Math.max(...prices, currentPrice),
    average30Days: Math.round(
      prices.slice(-3).reduce((sum, value) => sum + value, 0) / Math.max(prices.slice(-3).length, 1)
    ),
    average90Days: Math.round(prices.reduce((sum, value) => sum + value, 0) / Math.max(prices.length, 1)),
  };
}

function latestObservedDropPercent(product: Product): number {
  const history = [...(product.priceHistory || [])]
    .filter((point) => Number.isFinite(point.price) && point.price > 0)
    .sort((a, b) => a.date.localeCompare(b.date));
  if (history.length < 2) return 0;
  const previous = history[history.length - 2].price;
  const latest = history[history.length - 1].price;
  return previous > latest ? (previous - latest) / previous : 0;
}

/**
 * Maps a joined database product row into a typed Product, filtering out
 * offers with unapproved or expired source rights.
 */
export function mapJoinedProduct(
  row: JoinedProductRow,
  country: CountryCode,
  rightsList: SourceRightsRecord[],
  sourcesList?: Array<{ config?: Record<string, unknown> }>
): Product {
  const category = row.categories || undefined;

  // Filter offers: must match country, active, in_stock, price > 0, merchant active, AND have approved source rights
  const rawOffers = Array.isArray(row.offers) ? row.offers : [];
  const validOfferRows = rawOffers.filter((offer) => {
    if (offer.country_code.toLowerCase() !== country.toLowerCase()) return false;
    if (!offer.is_active || offer.availability !== 'in_stock') return false;
    if (numeric(offer.price) <= 0) return false;

    const merchant = offer.merchants;
    if (!merchant || !merchant.is_active) return false;

    // Check source rights: must be ACTIVE, unexpired, with dated approval evidence
    const metadataRightsId = typeof offer.metadata?.rightsId === 'string' ? offer.metadata.rightsId : undefined;
    const rightsRecord = metadataRightsId
      ? rightsList.find((r) => r.id.toLowerCase() === metadataRightsId.toLowerCase())
      : resolveMerchantSourceRights(merchant, rightsList, sourcesList);

    if (!canPublishSource(rightsRecord)) {
      return false; // Filter out unapproved or expired source rights
    }

    return true;
  });

  // Sort valid offers by price ascending (cheapest first)
  validOfferRows.sort((a, b) => numeric(a.price) - numeric(b.price));

  const mappedOffers: Offer[] = validOfferRows.map((offer, index) => {
    const merchant = offer.merchants!;
    return {
      id: offer.id,
      productId: row.id,
      merchantId: offer.merchant_id,
      merchantName: merchant.name,
      merchantLogo: merchant.logo_url || '',
      merchantRating: 0,
      price: numeric(offer.price),
      originalPrice: numeric(offer.original_price) || numeric(offer.price),
      currency: offer.currency,
      inStock: true,
      shippingInfo: 'See retailer for delivery details',
      condition: 'See retailer listing',
      url: offer.product_url,
      affiliateUrl: offer.affiliate_url || undefined,
      lastCheckedAt: offer.last_checked_at,
      isBestPrice: index === 0,
    };
  });

  const hasOffers = mappedOffers.length > 0;
  const best = hasOffers ? mappedOffers[0] : null;

  // Gather historical price observation points from approved offers
  const history: PricePoint[] = validOfferRows
    .flatMap((o) =>
      (o.price_history || []).map((h) => ({
        date: h.captured_at,
        price: numeric(h.price),
        merchantName: o.merchants?.name,
      }))
    )
    .filter((point) => point.price > 0)
    .sort((a, b) => a.date.localeCompare(b.date));

  const currentPrice = best ? best.price : 0;
  const originalPrice = best
    ? Math.max(best.price, ...mappedOffers.map((o) => o.originalPrice || o.price))
    : 0;

  const isIPhone16ProMax = row.slug.toLowerCase() === 'apple-iphone-16-pro-max-256gb';
  const images: ProductImage[] = isIPhone16ProMax
    ? IPHONE_16_PRO_MAX_IMAGES
    : row.image_url
    ? [{ id: `img-${row.id}`, imageUrl: row.image_url, sortOrder: 1, imageType: 'front', altText: row.name, isPrimary: true }]
    : [];
  const specGroups = isIPhone16ProMax ? IPHONE_16_PRO_MAX_SPEC_GROUPS : undefined;
  const gallery = images.map((img) => img.imageUrl);

  return {
    id: row.id,
    title: row.name,
    slug: row.slug,
    brand: row.brand || 'Unknown brand',
    categoryId: row.category_id || '',
    categorySlug: category?.slug || 'products',
    categoryName: category?.name || 'Products',
    description: row.description || '',
    imageUrl: row.image_url || '',
    gallery,
    images,
    specs: stringSpecs(row.specs),
    specGroups,
    currentBestPrice: currentPrice,
    originalPrice,
    currency: best ? best.currency : country === 'us' ? 'USD' : 'AED',
    country,
    dealScore: originalPrice > currentPrice && currentPrice > 0 ? 88 : 75,
    isTrending: true,
    isTopDeal: originalPrice > currentPrice && currentPrice > 0,
    offersCount: mappedOffers.length,
    bestMerchantName: best ? best.merchantName : 'Retailers pending',
    priceLastChecked: best ? best.lastCheckedAt : new Date().toISOString(),
    priceStats: priceStats(currentPrice, history),
    priceHistory: history,
    offers: mappedOffers,
  };
}

/**
 * Loads the live catalog from Supabase with relational join to offers, merchants,
 * categories and price history, strictly filtering out unapproved or expired source rights.
 */
async function loadLiveCatalog(country: CountryCode): Promise<Product[]> {
  if (!LIVE_MARKETS.has(country)) return [];
  const supabase = getServerSupabase();
  if (!supabase) return [];

  const [
    { data: productData, error: productError },
    rightsList,
    { data: ingestionSources },
  ] = await Promise.all([
    supabase
      .from('products')
      .select(JOINED_CATALOG_SELECT)
      .eq('status', 'active')
      .limit(250),
    listSourceRights(),
    supabase.from('ingestion_sources').select('config'),
  ]);

  if (productError || !productData?.length) return [];

  const sourcesList = (ingestionSources || []) as Array<{ config?: Record<string, unknown> }>;

  return (productData as unknown as JoinedProductRow[])
    .filter((row) => Boolean(row.image_url))
    .map((row) => mapJoinedProduct(row, country, rightsList, sourcesList))
    .sort((a, b) => getProductPopularityRank(b) - getProductPopularityRank(a));
}

export function isPreviewCatalogEnabled(): boolean {
  if (process.env.ENABLE_DEMO_CATALOG === 'true') return true;
  if (process.env.ENABLE_DEMO_CATALOG === 'false') return false;
  return Boolean(process.env.VERCEL_URL && process.env.VERCEL_URL.includes('vercel.app'));
}

export async function getCatalogProducts(
  country: CountryCode
): Promise<{ products: Product[]; isPreview: boolean }> {
  const live = await loadLiveCatalog(country);
  return { products: live, isPreview: false };
}

/**
 * Dedicated Product Detail query: queries the product by slug directly from Supabase,
 * joins the offers table, verifies approved source rights, and loads related products.
 */
export async function getCatalogProductBySlug(
  slug: string,
  country: CountryCode
): Promise<{ product: Product | undefined; related: Product[]; isPreview: boolean }> {
  if (!LIVE_MARKETS.has(country)) {
    return { product: undefined, related: [], isPreview: false };
  }

  const supabase = getServerSupabase();
  if (!supabase) {
    return { product: undefined, related: [], isPreview: false };
  }

  const cleanSlug = slug.toLowerCase().trim();

  const [
    { data: productRow, error: productError },
    rightsList,
    { data: ingestionSources },
  ] = await Promise.all([
    supabase
      .from('products')
      .select(JOINED_CATALOG_SELECT)
      .eq('slug', cleanSlug)
      .eq('status', 'active')
      .maybeSingle(),
    listSourceRights(),
    supabase.from('ingestion_sources').select('config'),
  ]);

  if (productError || !productRow) {
    return { product: undefined, related: [], isPreview: false };
  }

  const sourcesList = (ingestionSources || []) as Array<{ config?: Record<string, unknown> }>;
  const product = mapJoinedProduct(
    productRow as unknown as JoinedProductRow,
    country,
    rightsList,
    sourcesList
  );

  // Fetch related products in the same category with joined offers
  let related: Product[] = [];
  if (product.categoryId) {
    const { data: relatedRows } = await supabase
      .from('products')
      .select(JOINED_CATALOG_SELECT)
      .eq('category_id', product.categoryId)
      .neq('id', product.id)
      .eq('status', 'active')
      .limit(8);

    if (relatedRows && relatedRows.length > 0) {
      related = (relatedRows as unknown as JoinedProductRow[])
        .filter((r) => Boolean(r.image_url))
        .map((r) => mapJoinedProduct(r, country, rightsList, sourcesList));
    }
  }

  return { product, related, isPreview: false };
}

/**
 * Search query helper: search products by query string and filters,
 * with joined offers and active source rights verification.
 */
export async function searchCatalogProducts(
  country: CountryCode,
  query?: string,
  filters?: {
    category?: string;
    brand?: string;
    merchant?: string;
    sortBy?: 'relevance' | 'price_asc' | 'price_desc' | 'biggest_drop';
  }
): Promise<{ products: Product[]; total: number; isPreview: boolean }> {
  const { products, isPreview } = await getCatalogProducts(country);
  const q = (query || '').trim();

  if (!q && !filters?.category && !filters?.brand && !filters?.merchant) {
    return { products, total: products.length, isPreview };
  }

  const results = searchProducts(products, q, filters);
  return { products: results, total: results.length, isPreview };
}

export async function getHomepageCatalog(country: CountryCode) {
  const { products, isPreview } = await getCatalogProducts(country);
  const byDiscount = [...products]
    .filter((p) => p.originalPrice > p.currentBestPrice && p.currentBestPrice > 0)
    .sort((a, b) => {
      const discountA = (a.originalPrice - a.currentBestPrice) / a.originalPrice;
      const discountB = (b.originalPrice - b.currentBestPrice) / b.originalPrice;
      const rankA = getProductPopularityRank(a);
      const rankB = getProductPopularityRank(b);
      // Prioritize flagship models with verified discounts
      return (rankB + discountB * 600) - (rankA + discountA * 600);
    });

  const hasRealDeals = byDiscount.length > 0;
  // If real deals exist, feature top flagship deals. Otherwise, feature the first distinct batch of flagships.
  const topDeals = hasRealDeals ? byDiscount.slice(0, 8) : products.slice(0, 8);
  const usedIds = new Set(topDeals.map((item) => item.id));

  // Trending section: premier flagships distinct from top deals
  const trending = products.filter((item) => !usedIds.has(item.id)).slice(0, 8);
  trending.forEach((item) => usedIds.add(item.id));

  // Drops section: verified drops if they exist, or distinct price watch candidates
  const realDrops = [...products]
    .filter((item) => latestObservedDropPercent(item) > 0 && !usedIds.has(item.id))
    .sort((a, b) => {
      const dropA = latestObservedDropPercent(a);
      const dropB = latestObservedDropPercent(b);
      const rankA = getProductPopularityRank(a);
      const rankB = getProductPopularityRank(b);
      return (rankB + dropB * 600) - (rankA + dropA * 600);
    });
  const hasRealDrops = realDrops.length > 0;
  const biggestDrops = hasRealDrops
    ? realDrops.slice(0, 8)
    : products.filter((item) => !usedIds.has(item.id)).slice(0, 8);
  biggestDrops.forEach((item) => usedIds.add(item.id));

  // More deals / popular collections: remaining distinct products
  const moreDeals = products.filter((item) => !usedIds.has(item.id)).slice(0, 12);

  return {
    isPreview,
    products,
    topDeals,
    hasRealDeals,
    trending,
    biggestDrops,
    hasRealDrops,
    moreDeals,
  };
}
