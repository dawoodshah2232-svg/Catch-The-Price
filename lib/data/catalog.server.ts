import 'server-only';

import { getServerSupabase } from '@/lib/supabase/server';
import { CountryCode, Offer, PricePoint, Product } from '@/lib/types';
import {
  getAllProducts as getFixtureProducts,
  getProductBySlug as getFixtureProductBySlug,
} from '@/lib/data/products';

const LIVE_MARKETS = new Set<CountryCode>(['ae', 'us']);

export function isPreviewCatalogEnabled(): boolean {
  if (process.env.ENABLE_DEMO_CATALOG === 'true') return true;
  if (process.env.VERCEL_ENV === 'preview') return true;

  const configuredSite = (process.env.NEXT_PUBLIC_SITE_URL || '').toLowerCase();
  return configuredSite.includes('vercel.app') || configuredSite.includes('preview.catchtheprice.com');
}

type ProductRow = {
  id: string;
  category_id: string | null;
  brand: string | null;
  name: string;
  slug: string;
  image_url: string | null;
  description: string | null;
  ai_summary: string | null;
  specs: Record<string, unknown> | null;
  status: string;
};

type OfferRow = {
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
};

type MerchantRow = {
  id: string;
  name: string;
  slug: string;
  country_code: string;
  website_url: string;
  logo_url: string | null;
  is_active: boolean;
};

type CategoryRow = {
  id: string;
  name: string;
  slug: string;
};

type HistoryRow = {
  offer_id: string;
  price: number | string;
  captured_at: string;
};

function numeric(value: number | string | null | undefined): number {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
}

function stringSpecs(value: Record<string, unknown> | null): Record<string, string> {
  if (!value) return {};

  return Object.fromEntries(
    Object.entries(value)
      .filter(([, item]) => typeof item === 'string' || typeof item === 'number' || typeof item === 'boolean')
      .map(([key, item]) => [key, String(item)])
  );
}

function toPriceStats(currentPrice: number, history: PricePoint[]) {
  if (history.length === 0) {
    return {
      currentPrice,
      lowestPrice: currentPrice,
      highestPrice: currentPrice,
      average30Days: currentPrice,
      average90Days: currentPrice,
    };
  }

  const prices = history.map((point) => point.price).filter((price) => Number.isFinite(price) && price > 0);
  if (prices.length === 0) {
    return {
      currentPrice,
      lowestPrice: currentPrice,
      highestPrice: currentPrice,
      average30Days: currentPrice,
      average90Days: currentPrice,
    };
  }

  const now = Date.now();
  const averageForDays = (days: number) => {
    const threshold = now - days * 24 * 60 * 60 * 1000;
    const scoped = history.filter((point) => new Date(point.date).getTime() >= threshold).map((point) => point.price);
    if (scoped.length === 0) return currentPrice;
    return scoped.reduce((sum, price) => sum + price, 0) / scoped.length;
  };

  return {
    currentPrice,
    lowestPrice: Math.min(...prices, currentPrice),
    highestPrice: Math.max(...prices, currentPrice),
    average30Days: averageForDays(30),
    average90Days: averageForDays(90),
  };
}

function normalizeCountry(value: string): CountryCode | null {
  const normalized = value.toLowerCase() as CountryCode;
  return LIVE_MARKETS.has(normalized) ? normalized : null;
}

async function fetchLiveCatalog(country: CountryCode): Promise<Product[]> {
  const supabase = getServerSupabase();

  const [{ data: productRows, error: productError }, { data: offerRows, error: offerError }, { data: merchantRows, error: merchantError }, { data: categoryRows, error: categoryError }] = await Promise.all([
    supabase.from('products').select('id, category_id, brand, name, slug, image_url, description, ai_summary, specs, status').eq('status', 'active'),
    supabase.from('offers').select('id, product_id, merchant_id, country_code, currency, price, original_price, availability, product_url, affiliate_url, last_checked_at, is_active').eq('country_code', country).eq('is_active', true),
    supabase.from('merchants').select('id, name, slug, country_code, website_url, logo_url, is_active').eq('is_active', true),
    supabase.from('categories').select('id, name, slug'),
  ]);

  if (productError || offerError || merchantError || categoryError) {
    throw productError || offerError || merchantError || categoryError;
  }

  const products = (productRows || []) as ProductRow[];
  const offers = (offerRows || []) as OfferRow[];
  const merchants = (merchantRows || []) as MerchantRow[];
  const categories = (categoryRows || []) as CategoryRow[];

  if (products.length === 0 || offers.length === 0) return [];

  const merchantMap = new Map(merchants.map((merchant) => [merchant.id, merchant]));
  const categoryMap = new Map(categories.map((category) => [category.id, category]));
  const offerIds = offers.map((offer) => offer.id);

  let historyRows: HistoryRow[] = [];
  if (offerIds.length > 0) {
    const { data, error } = await supabase.from('price_history').select('offer_id, price, captured_at').in('offer_id', offerIds).order('captured_at', { ascending: true });
    if (!error && data) historyRows = data as HistoryRow[];
  }

  const historyByOffer = new Map<string, PricePoint[]>();
  for (const row of historyRows) {
    const price = numeric(row.price);
    if (price <= 0) continue;
    const current = historyByOffer.get(row.offer_id) || [];
    current.push({ date: row.captured_at, price });
    historyByOffer.set(row.offer_id, current);
  }

  const offersByProduct = new Map<string, Offer[]>();
  for (const row of offers) {
    const merchant = merchantMap.get(row.merchant_id);
    if (!merchant) continue;
    const normalizedCountry = normalizeCountry(row.country_code);
    if (!normalizedCountry || normalizedCountry !== country) continue;

    const price = numeric(row.price);
    if (price <= 0) continue;

    const mapped: Offer = {
      id: row.id,
      merchantId: row.merchant_id,
      merchantName: merchant.name,
      merchantSlug: merchant.slug,
      merchantLogo: merchant.logo_url || undefined,
      country: normalizedCountry,
      currency: row.currency,
      price,
      originalPrice: row.original_price == null ? undefined : numeric(row.original_price),
      availability: row.availability || 'unknown',
      productUrl: row.product_url,
      affiliateUrl: row.affiliate_url || undefined,
      lastChecked: row.last_checked_at,
      history: historyByOffer.get(row.id) || [],
    };

    const current = offersByProduct.get(row.product_id) || [];
    current.push(mapped);
    offersByProduct.set(row.product_id, current);
  }

  const result: Product[] = [];
  for (const row of products) {
    const productOffers = offersByProduct.get(row.id) || [];
    if (productOffers.length === 0) continue;

    productOffers.sort((a, b) => a.price - b.price);
    const best = productOffers[0];
    const allHistory = productOffers.flatMap((offer) => offer.history || []).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    const category = row.category_id ? categoryMap.get(row.category_id) : undefined;

    result.push({
      id: row.id,
      name: row.name,
      slug: row.slug,
      brand: row.brand || 'Unknown',
      category: category?.slug || 'uncategorized',
      categoryName: category?.name || 'Uncategorized',
      image: row.image_url || '',
      description: row.description || '',
      aiSummary: row.ai_summary || undefined,
      specs: stringSpecs(row.specs),
      offers: productOffers,
      priceHistory: allHistory,
      priceStats: toPriceStats(best.price, allHistory),
    });
  }

  return result;
}

export async function getCatalogProducts(country: CountryCode): Promise<Product[]> {
  if (!LIVE_MARKETS.has(country)) return [];

  try {
    const live = await fetchLiveCatalog(country);
    if (live.length > 0) return live;
  } catch (error) {
    console.error('Failed to load live catalog', error);
  }

  return isPreviewCatalogEnabled() ? getFixtureProducts(country) : [];
}

export async function getCatalogProductBySlug(country: CountryCode, slug: string): Promise<Product | null> {
  const products = await getCatalogProducts(country);
  const liveMatch = products.find((product) => product.slug === slug);
  if (liveMatch) return liveMatch;

  return isPreviewCatalogEnabled() ? getFixtureProductBySlug(slug, country) || null : null;
}

export async function getHomepageCatalog(country: CountryCode): Promise<{
  products: Product[];
  topDeals: Product[];
  biggestDrops: Product[];
  trending: Product[];
  isPreview: boolean;
}> {
  const products = await getCatalogProducts(country);
  const topDeals = [...products].sort((a, b) => {
    const aPrice = a.priceStats?.currentPrice || a.offers[0]?.price || Number.POSITIVE_INFINITY;
    const bPrice = b.priceStats?.currentPrice || b.offers[0]?.price || Number.POSITIVE_INFINITY;
    const aReference = a.offers[0]?.originalPrice || aPrice;
    const bReference = b.offers[0]?.originalPrice || bPrice;
    const aDrop = aReference > 0 ? (aReference - aPrice) / aReference : 0;
    const bDrop = bReference > 0 ? (bReference - bPrice) / bReference : 0;
    return bDrop - aDrop;
  }).slice(0, 8);

  const biggestDrops = products
    .filter((product) => (product.priceHistory || []).length > 1)
    .sort((a, b) => {
      const aHistory = a.priceHistory || [];
      const bHistory = b.priceHistory || [];
      const aPrevious = aHistory.length > 1 ? aHistory[aHistory.length - 2].price : 0;
      const bPrevious = bHistory.length > 1 ? bHistory[bHistory.length - 2].price : 0;
      const aCurrent = a.priceStats?.currentPrice || a.offers[0]?.price || 0;
      const bCurrent = b.priceStats?.currentPrice || b.offers[0]?.price || 0;
      const aDrop = aPrevious > 0 ? (aPrevious - aCurrent) / aPrevious : 0;
      const bDrop = bPrevious > 0 ? (bPrevious - bCurrent) / bPrevious : 0;
      return bDrop - aDrop;
    })
    .slice(0, 8);

  const trending = [...products].sort((a, b) => (b.offers?.length || 0) - (a.offers?.length || 0)).slice(0, 8);

  return {
    products,
    topDeals,
    biggestDrops,
    trending,
    isPreview: isPreviewCatalogEnabled(),
  };
}
