import 'server-only';

import { getServerSupabase } from '@/lib/supabase/server';
import { CountryCode, Offer, PricePoint, Product } from '@/lib/types';

const LIVE_MARKETS = new Set<CountryCode>(['ae', 'us']);

type ProductRow = {
  id: string;
  category_id: string | null;
  brand: string | null;
  name: string;
  slug: string;
  image_url: string | null;
  description: string | null;
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
  logo_url: string | null;
  is_active: boolean;
};

type CategoryRow = { id: string; name: string; slug: string };
type HistoryRow = { offer_id: string; price: number | string; captured_at: string };

function numeric(value: number | string | null | undefined) {
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
    average30Days: Math.round(prices.slice(-3).reduce((sum, value) => sum + value, 0) / Math.max(prices.slice(-3).length, 1)),
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

async function loadLiveCatalog(country: CountryCode): Promise<Product[]> {
  if (!LIVE_MARKETS.has(country)) return [];
  const supabase = getServerSupabase();
  if (!supabase) return [];

  const { data: productData, error: productError } = await supabase
    .from('products')
    .select('id,category_id,brand,name,slug,image_url,description,specs,status')
    .eq('status', 'active')
    .limit(250);

  if (productError || !productData?.length) return [];
  const productRows = productData as ProductRow[];
  const productIds = productRows.map((row) => row.id);
  const categoryIds = [...new Set(productRows.map((row) => row.category_id).filter(Boolean))] as string[];

  const [{ data: offerData, error: offerError }, { data: categoryData }] = await Promise.all([
    supabase
      .from('offers')
      .select('id,product_id,merchant_id,country_code,currency,price,original_price,availability,product_url,affiliate_url,last_checked_at,is_active')
      .in('product_id', productIds)
      .eq('country_code', country)
      .eq('is_active', true),
    categoryIds.length
      ? supabase.from('categories').select('id,name,slug').in('id', categoryIds)
      : Promise.resolve({ data: [] }),
  ]);

  const offers = (!offerError && offerData?.length)
    ? (offerData as OfferRow[]).filter((offer) => offer.availability === 'in_stock' && numeric(offer.price) > 0)
    : [];

  const merchantIds = [...new Set(offers.map((offer) => offer.merchant_id))];
  const offerIds = offers.map((offer) => offer.id);
  const [{ data: merchantData }, { data: historyData }] = await Promise.all([
    merchantIds.length
      ? supabase.from('merchants').select('id,name,logo_url,is_active').in('id', merchantIds).eq('is_active', true)
      : Promise.resolve({ data: [] }),
    offerIds.length
      ? supabase.from('price_history').select('offer_id,price,captured_at').in('offer_id', offerIds).order('captured_at', { ascending: true })
      : Promise.resolve({ data: [] }),
  ]);

  const merchants = (merchantData || []) as MerchantRow[];
  const categories = (categoryData || []) as CategoryRow[];
  const historyRows = (historyData || []) as HistoryRow[];
  const merchantMap = new Map(merchants.map((merchant) => [merchant.id, merchant]));
  const categoryMap = new Map(categories.map((category) => [category.id, category]));
  const offerProductMap = new Map(offers.map((offer) => [offer.id, offer.product_id]));

  return productRows.flatMap((row): Product[] => {
    if (!row.image_url) return [];
    const category = row.category_id ? categoryMap.get(row.category_id) : undefined;
    const productOffers = offers
      .filter((offer) => offer.product_id === row.id && merchantMap.has(offer.merchant_id))
      .sort((a, b) => numeric(a.price) - numeric(b.price));

    const mappedOffers: Offer[] = productOffers.map((offer, index) => {
      const merchant = merchantMap.get(offer.merchant_id)!;
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
    const history: PricePoint[] = historyRows
      .filter((item) => offerProductMap.get(item.offer_id) === row.id && numeric(item.price) > 0)
      .map((item) => ({ date: item.captured_at, price: numeric(item.price) }));
    const currentPrice = best ? best.price : 0;
    const originalPrice = best ? Math.max(best.price, ...mappedOffers.map((offer) => offer.originalPrice || offer.price)) : 0;

    return [{
      id: row.id,
      title: row.name,
      slug: row.slug,
      brand: row.brand || 'Unknown brand',
      categoryId: row.category_id || '',
      categorySlug: category?.slug || 'products',
      categoryName: category?.name || 'Products',
      description: row.description || '',
      imageUrl: row.image_url,
      gallery: [row.image_url],
      specs: stringSpecs(row.specs),
      currentBestPrice: currentPrice,
      originalPrice,
      currency: best ? best.currency : 'AED',
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
    }];
  });
}

export function isPreviewCatalogEnabled(): boolean {
  if (process.env.ENABLE_DEMO_CATALOG === 'true') return true;
  if (process.env.ENABLE_DEMO_CATALOG === 'false') return false;
  return Boolean(process.env.VERCEL_URL && process.env.VERCEL_URL.includes('vercel.app'));
}

export async function getCatalogProducts(country: CountryCode): Promise<{ products: Product[]; isPreview: boolean }> {
  const live = await loadLiveCatalog(country);
  return { products: live, isPreview: false };
}

export async function getCatalogProductBySlug(
  slug: string,
  country: CountryCode
): Promise<{ product: Product | undefined; related: Product[]; isPreview: boolean }> {
  const live = await loadLiveCatalog(country);
  const product = live.find((item) => item.slug.toLowerCase() === slug.toLowerCase());
  const related = product
    ? live.filter((item) => item.categorySlug === product.categorySlug && item.id !== product.id).slice(0, 8)
    : [];
  return { product, related, isPreview: false };
}

export async function getHomepageCatalog(country: CountryCode) {
  const { products, isPreview } = await getCatalogProducts(country);
  const byDiscount = [...products].sort((a, b) => {
    const discountA = a.originalPrice > 0 ? (a.originalPrice - a.currentBestPrice) / a.originalPrice : 0;
    const discountB = b.originalPrice > 0 ? (b.originalPrice - b.currentBestPrice) / b.originalPrice : 0;
    return discountB - discountA;
  });
  const topDeals = byDiscount.slice(0, 12);
  const topDealIds = new Set(topDeals.map((item) => item.id));
  const biggestDrops = [...products]
    .filter((item) => latestObservedDropPercent(item) > 0 && !topDealIds.has(item.id))
    .sort((a, b) => latestObservedDropPercent(b) - latestObservedDropPercent(a))
    .slice(0, 8);
  return {
    isPreview,
    products,
    topDeals,
    biggestDrops,
    trending: products.filter((item) => item.isTrending).slice(0, 12),
  };
}
