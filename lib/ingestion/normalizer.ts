import { RawMerchantItem, NormalizedItem } from './types';

// Deterministic title normalization regex rules
export function normalizeTitle(rawTitle: string): string {
  let cleaned = rawTitle
    .replace(/\s+/g, ' ')
    .replace(/\[.*?\]/g, '') // remove brackets e.g. [UAE Version]
    .replace(/\(.*?(warranty|free delivery|bundle).*?\)/gi, '') // remove promo parenthesis
    .trim();

  // Standardize common brand suffixes
  cleaned = cleaned.replace(/Apple\s+iPhone/i, 'Apple iPhone');
  cleaned = cleaned.replace(/Sony\s+PS5/i, 'Sony PlayStation 5');
  cleaned = cleaned.replace(/Samsung\s+Galaxy/i, 'Samsung Galaxy');

  return cleaned;
}

export function normalizeMerchantItem(item: RawMerchantItem): NormalizedItem {
  const title = normalizeTitle(item.rawTitle);

  // Guess brand if missing
  let brand = item.rawBrand || 'Generic';
  const knownBrands = ['Apple', 'Samsung', 'Sony', 'Google', 'Dell', 'LG', 'Valve', 'Lenovo', 'Bose'];
  for (const b of knownBrands) {
    if (new RegExp(`\\b${b}\\b`, 'i').test(title)) {
      brand = b;
      break;
    }
  }

  // Guess category
  let categorySlug = 'phones';
  const lower = title.toLowerCase();
  if (lower.includes('macbook') || lower.includes('laptop') || lower.includes('xps')) {
    categorySlug = 'laptops';
  } else if (lower.includes('playstation') || lower.includes('ps5') || lower.includes('xbox') || lower.includes('steam deck') || lower.includes('nintendo')) {
    categorySlug = 'gaming';
  } else if (lower.includes('tv') || lower.includes('oled') || lower.includes('qled')) {
    categorySlug = 'tvs';
  } else if (lower.includes('wh-1000') || lower.includes('airpods') || lower.includes('headphones')) {
    categorySlug = 'headphones';
  } else if (lower.includes('watch') || lower.includes('band')) {
    categorySlug = 'smartwatches';
  }

  return {
    sku: item.rawSku,
    title,
    brand,
    categorySlug,
    price: item.rawPrice,
    currency: item.rawCurrency,
    url: item.rawUrl,
    inStock: item.inStock,
    shippingInfo: item.shippingText || 'Standard Delivery',
    merchantSlug: item.merchantSlug,
    merchantName: item.merchantName,
  };
}
