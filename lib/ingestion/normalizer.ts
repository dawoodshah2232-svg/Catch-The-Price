import { RawMerchantItem, NormalizedItem } from './types';

export function normalizeTitle(rawTitle: string): string {
  let cleaned = rawTitle
    .replace(/\s+/g, ' ')
    .replace(/\[.*?\]/g, '')
    .replace(/\(.*?(warranty|free delivery|bundle).*?\)/gi, '')
    .trim();

  cleaned = cleaned.replace(/Apple\s+iPhone/i, 'Apple iPhone');
  cleaned = cleaned.replace(/Sony\s+PS5/i, 'Sony PlayStation 5');
  cleaned = cleaned.replace(/Samsung\s+Galaxy/i, 'Samsung Galaxy');

  return cleaned;
}

function cleanIdentifier(value?: string): string | undefined {
  const normalized = value?.trim().replace(/\s+/g, ' ');
  return normalized || undefined;
}

export function normalizeMerchantItem(item: RawMerchantItem): NormalizedItem {
  const title = normalizeTitle(item.rawTitle);

  let brand = item.rawBrand || 'Unknown';
  const knownBrands = [
    'Apple', 'Samsung', 'Sony', 'Google', 'Dell', 'LG', 'Valve', 'Lenovo', 'Bose',
    'NVIDIA', 'AMD', 'Intel', 'ASUS', 'MSI', 'Gigabyte', 'Acer', 'HP', 'Razer',
  ];

  for (const candidate of knownBrands) {
    if (new RegExp(`\\b${candidate}\\b`, 'i').test(title)) {
      brand = candidate;
      break;
    }
  }

  const lower = `${item.rawCategory || ''} ${title}`.toLowerCase();
  let categorySlug = 'products';

  if (/iphone|galaxy|pixel|smartphone|mobile phone|rog phone|redmagic/.test(lower)) {
    categorySlug = 'phones';
  } else if (/macbook|laptop|notebook|xps|thinkpad|vivobook|zenbook|legion/.test(lower)) {
    categorySlug = 'laptops';
  } else if (/geforce|radeon|graphics card|\bgpu\b|\brtx\s?\d|\brx\s?\d|ryzen|core ultra|\bcpu\b|processor|motherboard/.test(lower)) {
    categorySlug = 'pc-components';
  } else if (/playstation|\bps5\b|xbox|steam deck|nintendo|gaming console|controller/.test(lower)) {
    categorySlug = 'gaming';
  } else if (/\btv\b|oled|qled|mini-led|television/.test(lower)) {
    categorySlug = 'tvs';
  } else if (/wh-1000|airpods|headphones|headset|earbuds/.test(lower)) {
    categorySlug = 'headphones';
  } else if (/smartwatch|apple watch|galaxy watch|garmin|fitness band/.test(lower)) {
    categorySlug = 'smartwatches';
  }

  return {
    sku: item.rawSku,
    title,
    brand,
    categorySlug,
    price: Number(item.rawPrice),
    currency: item.rawCurrency.toUpperCase(),
    url: item.rawUrl,
    imageUrl: cleanIdentifier(item.rawImageUrl),
    gtin: cleanIdentifier(item.rawGtin),
    mpn: cleanIdentifier(item.rawMpn),
    model: cleanIdentifier(item.rawModel),
    inStock: item.inStock,
    shippingInfo: item.shippingText || 'See retailer for delivery details',
    merchantSlug: item.merchantSlug,
    merchantName: item.merchantName,
  };
}
