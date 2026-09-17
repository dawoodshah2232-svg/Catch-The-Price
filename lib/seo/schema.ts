import { Product } from '@/lib/types';

const SITE_URL = 'https://catchtheprice.com';

/**
 * Generates BreadcrumbList structured data for search engines.
 */
export function generateBreadcrumbsJsonLd(
  items: Array<{ name: string; url: string }>
) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url.startsWith('http') ? item.url : `${SITE_URL}${item.url}`,
    })),
  };
}

/**
 * Generates ItemList structured data for category, brand, and deal collections.
 */
export function generateItemListJsonLd({
  name,
  description,
  url,
  products,
  country,
}: {
  name: string;
  description?: string;
  url: string;
  products: Product[];
  country: string;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name,
    description,
    url: url.startsWith('http') ? url : `${SITE_URL}${url}`,
    numberOfItems: products.length,
    itemListElement: products.map((product, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: product.title,
      url: `${SITE_URL}/${country}/product/${product.slug}`,
      image: product.imageUrl || undefined,
    })),
  };
}

/**
 * Generates factual Product structured data with AggregateOffer.
 * CRITICAL RULE: NEVER inject fake reviews, aggregate ratings, or simulated reviewer counts.
 */
export function generateProductJsonLd({
  product,
  country,
}: {
  product: Product;
  country: string;
}) {
  const livePrices = product.offers
    .map((o) => o.price)
    .filter((p) => Number.isFinite(p) && p > 0);

  const lowPrice = livePrices.length > 0 ? Math.min(...livePrices) : product.currentBestPrice;
  const highPrice = livePrices.length > 0 ? Math.max(...livePrices) : product.currentBestPrice;

  const aggregateOffer =
    product.offers.length > 0
      ? {
          '@type': 'AggregateOffer',
          priceCurrency: product.currency,
          lowPrice,
          highPrice,
          offerCount: product.offers.length,
          offers: product.offers.map((offer) => ({
            '@type': 'Offer',
            price: offer.price,
            priceCurrency: offer.currency,
            availability: offer.inStock ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
            url: `${SITE_URL}/api/outbound?offerId=${encodeURIComponent(offer.id)}&country=${country}`,
            seller: {
              '@type': 'Organization',
              name: offer.merchantName,
            },
          })),
        }
      : undefined;

  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.title,
    description: product.description || undefined,
    image: product.imageUrl ? [product.imageUrl] : undefined,
    brand: product.brand
      ? {
          '@type': 'Brand',
          name: product.brand,
        }
      : undefined,
    category: product.categoryName,
    sku: product.id,
    offers: aggregateOffer,
  };
}

/**
 * Generates Brand structured data
 */
export function generateBrandJsonLd({
  name,
  url,
  description,
  logo,
}: {
  name: string;
  url: string;
  description?: string;
  logo?: string;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Brand',
    name,
    url: url.startsWith('http') ? url : `${SITE_URL}${url}`,
    description,
    logo,
  };
}

/**
 * Generates Organization / Merchant structured data
 */
export function generateMerchantJsonLd({
  name,
  url,
  websiteUrl,
}: {
  name: string;
  url: string;
  websiteUrl?: string;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name,
    url: url.startsWith('http') ? url : `${SITE_URL}${url}`,
    sameAs: websiteUrl ? [websiteUrl] : undefined,
  };
}

/**
 * Generates factual FAQ structured data.
 * Strictly used only for legitimate factual shopping/price-comparison FAQs.
 */
export function generateFaqJsonLd(
  questions: Array<{ question: string; answer: string }>
) {
  if (!questions.length) return null;

  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: questions.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer,
      },
    })),
  };
}
