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

  const prices = history.map((point) => point.price);
  const newest = [...history].sort((a, b) => a.date.localeCompare(b.date));
  const last30 = newest.slice(-30).map((point) => point.price);
  const last90 = newest.slice(-90).map((point) => point.price);
  const average = (values: number[]) =>
    Math.round(values.reduce((sum, value) => sum + value, 0) / Math.max(values.length, 1));

  return {
    currentPrice,
    lowestPrice: Math.min(...prices, currentPrice),
    highestPrice: Math.max(...prices, currentPrice),
    average30Days: average(last30.length ? last30 : prices),
    average90Days: average(last90.length ? last90 : prices),
  };
}

function latestObservedDropPercent(product: Product): number {
  const history = [...(product.priceHistory || [])]
    .filter((point) => Number.isFinite(point.price) && point.price > 0)
    .sort((a, b) => a.date.localeCompare(b.date));

  if (history.length < 2) return 0;
  const previous = history[history.length - 2].price;
  const latest = history[history.length - 1].price;
  if (previous <= 0 || latest >= previous) return 0;
  return (previous - latest) / previous;
}

async function loadLiveCatalog(country: CountryCode): Promise<Product[]> {
  if (!LIVE_MARKETS.has(country)) return [];

  const supabase = getServerSupabase();
  if (!supabase) return [];

  const { data: productsData, error: productsError } = await supabase
    .from('products')
    .select('id,category_id,brand,name,slug,image_url,description,ai_summary,specs,status')
    .eq('status', 'active')
    .limit(200);

  if (productsError) {
    console.error('Catalog product read failed:', productsError);
    return [];
  }

  const productRows = (productsData || []) as ProductRow[];
  if (productRows.length === 0) return [];

  const productIds = productRows.map((row) => row.id);
  const categoryIds = [...new Set(productRows.map((row) => row.category_id).filter(Boolean))] as string[];

  const [{ data: offersData, error: offersError }, { data: categoriesData, error: categoriesError }] =
    await Promise.all([
      supabase
        .from('offers')
        .select(
          'id,product_id,merchant_id,country_code,currency,price,original_price,availability,product_url,affiliate_url,last_checked_at,is_active'
        )
        .in('product_id', productIds)
        .eq('country_code', country)
        .eq('is_active', true),
      categoryIds.length
        ? supabase.from('categories').select('id,name,slug').in('id', categoryIds)
        : Promise.resolve({ data: [], error: null }),
    ]);

  if (offersError) {
    console.error('Catalog offer read failed:', offersError);
    return [];
  }
  if (categoriesError) console.error('Catalog category read failed:', categoriesError);

  const offers = ((offersData || []) as OfferRow[]).filter(
    (offer) => offer.availability === 'in_stock' && numeric(offer.price) > 0
  );
  if (offers.length === 0) return [];

  const merchantIds = [...new Set(offers.map((offer) => offer.merchant_id))];
  const offerIds = offers.map((offer) => offer.id);

  const [{ data: merchantsData, error: merchantsError }, { data: historyData, error: historyError }] =
    await Promise.all([
      supabase
        .from('merchants')
        .select('id,name,slug,country_code,website_url,logo_url,is_active')
        .in('id', merchantIds)
        .eq('is_active', true),
      offerIds.length
        ? supabase
            .from('price_history')
            .select('offer_id,price,captured_at')
            .in('offer_id', offerIds)
            .order('captured_at', { ascending: true })
        : Promise.resolve({ data: [], error: null }),
    ]);

  if (merchantsError) {
    console.error('Catalog merchant read failed:', merchantsError);
    return [];
  }
  if (historyError) console.error('Catalog history read failed:', historyError);

  const merchants = (merchantsData || []) as MerchantRow[];
  const categories = (categoriesData || []) as CategoryRow[];
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

    if (productOffers.length === 0) return [];

    const mappedOffers: Offer[] = productOffers.map((offer, index) => {
      const merchant = merchantMap.get(offer.merchant_id)!;
      const current = numeric(offer.price);
      const reference = numeric(offer.original_price) || current;

      return {
        id: offer.id,
        productId: row.id,
        merchantId: merchant.id,
        merchantName: merchant.name,
        merchantLogo: merchant.logo_url || '',
        merchantRating: 0,
        price: current,
        originalPrice: reference,
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

    const bestOffer = mappedOffers[0];
    const history: PricePoint[] = historyRows
      .filter((item) => offerProductMap.get(item.offer_id) === row.id && numeric(item.price) > 0)
      .map((item) => ({ date: item.captured_at, price: numeric(item.price) }));

    const originalPrice = Math.max(
      bestOffer.price,
      ...mappedOffers.map((offer) => offer.originalPrice || offer.price)
    );

    return [
      {
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
        currentBestPrice: bestOffer.price,
        originalPrice,
        currency: bestOffer.currency,
        country,
        dealScore: 0,
        isTrending: false,
        isTopDeal: originalPrice > bestOffer.price,
        offersCount: mappedOffers.length,
        bestMerchantName: bestOffer.merchantName,
        priceLastChecked: bestOffer.lastCheckedAt,
        priceStats: toPriceStats(bestOffer.price, history),
        priceHistory: history,
        offers: mappedOffers,
      },
    ];
  });
}

export async function getCatalogProducts(country: CountryCode): Promise<{ products: Product[]; isPreview: boolean }> {
  if (isPreviewCatalogEnabled()) {
    return { products: getFixtureProducts(country), isPreview: true };
  }

  return { products: await loadLiveCatalog(country), isPreview: false };
}

export async function getCatalogProductBySlug(
  slug: string,
  country: CountryCode
): Promise<{ product: Product | undefined; related: Product[]; isPreview: boolean }> {
  if (isPreviewCatalogEnabled()) {
    const product = getFixtureProductBySlug(slug, country);
    const related = product
      ? getFixtureProducts(country)
          .filter((item) => item.categorySlug === product.categorySlug && item.id !== product.id)
          .slice(0, 4)
      : [];
    return { product, related, isPreview: true };
  }

  const products = await loadLiveCatalog(country);
  const product = products.find((item) => item.slug.toLowerCase() === slug.toLowerCase());
  const related = product
    ? products
        .filter((item) => item.categorySlug === product.categorySlug && item.id !== product.id)
        .slice(0, 4)
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

  const topDeals = byDiscount.slice(0, 4);
  const topDealIds = new Set(topDeals.map((item) => item.id));
  const biggestDrops = [...products]
    .filter((item) => latestObservedDropPercent(item) > 0 && !topDealIds.has(item.id))
    .sort((a, b) => latestObservedDropPercent(b) - latestObservedDropPercent(a))
    .slice(0, 4);

  return {
    isPreview,
    products,
    topDeals,
    biggestDrops,
    trending: isPreview ? products.filter((item) => item.isTrending).slice(0, 4) : [],
  };
}
