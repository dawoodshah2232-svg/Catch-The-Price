import type { Product } from '../types';

const RECENT_SEARCHES_KEY = 'ctp_recent_searches_v1';
const MAX_RECENT_SEARCHES = 8;

/**
 * Computes Levenshtein edit distance between two strings
 */
export function levenshteinDistance(a: string, b: string): number {
  if (a === b) return 0;
  if (!a.length) return b.length;
  if (!b.length) return a.length;

  const dp: number[][] = [];
  for (let i = 0; i <= a.length; i++) {
    dp[i] = [i];
  }
  for (let j = 0; j <= b.length; j++) {
    dp[0][j] = j;
  }

  for (let i = 1; i <= a.length; i++) {
    for (let j = 1; j <= b.length; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      dp[i][j] = Math.min(
        dp[i - 1][j] + 1, // deletion
        dp[i][j - 1] + 1, // insertion
        dp[i - 1][j - 1] + cost // substitution
      );
    }
  }

  return dp[a.length][b.length];
}

/**
 * Determines if a query token fuzzy-matches a target word with typo tolerance.
 * Allows 1 edit for words >= 4 chars, 2 edits for words >= 7 chars.
 */
export function isFuzzyTokenMatch(queryToken: string, targetWord: string): boolean {
  const q = queryToken.toLowerCase();
  const t = targetWord.toLowerCase();

  if (t.includes(q) || q.includes(t)) return true;
  if (q.length < 4) return false;

  const maxEdits = q.length >= 7 ? 2 : 1;
  const dist = levenshteinDistance(q, t);
  return dist <= maxEdits;
}

/**
 * Scores a product's relevance against a search query across:
 * - Product Title
 * - Brand Name
 * - Category Name
 * - Model / GTIN / UPC / EAN / MPN
 * - Specifications Text
 * - Typo-tolerant token matching
 */
export function scoreProductRelevance(product: Product, query: string): number {
  const q = query.trim().toLowerCase();
  if (!q) return 0;

  const title = (product.title || '').toLowerCase();
  const brand = (product.brand || '').toLowerCase();
  const category = (product.categoryName || '').toLowerCase();
  const specValues = Object.values(product.specs || {}).map((v) => String(v).toLowerCase());
  const specText = specValues.join(' ');
  const gtin = ((product as any).gtin || '').toLowerCase();
  const mpn = ((product as any).mpn || '').toLowerCase();

  let score = 0;

  // Exact full-string matches
  if (title === q) score += 120;
  else if (title.startsWith(q)) score += 60;
  else if (title.includes(q)) score += 40;

  // Exact identifier match (GTIN, UPC, EAN, MPN)
  if (gtin && gtin === q) score += 150;
  if (mpn && (mpn === q || mpn.includes(q))) score += 90;

  // Brand matching
  if (brand === q) score += 35;
  else if (brand.includes(q)) score += 20;

  // Category matching
  if (category === q) score += 25;
  else if (category.includes(q)) score += 12;

  // Specs matching
  if (specText.includes(q)) score += 10;

  // Token-level analysis with typo tolerance
  const queryTokens = q.split(/\s+/).filter((t) => t.length > 0);
  const targetWords = `${title} ${brand} ${category} ${mpn} ${specText}`
    .split(/[\s,\-_/]+/)
    .filter((w) => w.length > 0);

  for (const token of queryTokens) {
    if (title.includes(token)) {
      score += 8;
    } else if (brand.includes(token)) {
      score += 6;
    } else if (specText.includes(token)) {
      score += 3;
    } else {
      // Check typo-tolerant fuzzy match across target words
      const hasFuzzy = targetWords.some((w) => isFuzzyTokenMatch(token, w));
      if (hasFuzzy) {
        score += 4; // partial match with typo penalty
      }
    }
  }

  return score;
}

/**
 * Computes a smart popularity and flagship tier score for catalog ranking.
 * Flagships, top sellers, and current-generation premium products score highest.
 */
export function getProductPopularityRank(product: {
  title?: string;
  name?: string;
  slug?: string;
  brand?: string;
  categorySlug?: string;
  currentBestPrice?: number;
}): number {
  const slug = (product.slug || '').toLowerCase();
  const category = (product.categorySlug || '').toLowerCase();

  let rank = 100;

  // Supreme Flagship Flag (iPhone 16 Pro Max, S24 Ultra, MacBook Pro M3 Max, PS5 Pro, iPad Pro M4)
  if (slug.includes('iphone-16-pro-max')) rank += 1200;
  else if (slug.includes('iphone-16-pro')) rank += 1150;
  else if (slug.includes('galaxy-s24-ultra')) rank += 1140;
  else if (slug.includes('macbook-pro-16') || slug.includes('m3-max')) rank += 1130;
  else if (slug.includes('playstation-5-pro') || slug.includes('ps5-pro')) rank += 1120;
  else if (slug.includes('ipad-pro-13') || (slug.includes('ipad-pro') && slug.includes('m4'))) rank += 1110;
  else if (slug.includes('galaxy-z-fold6')) rank += 1100;
  else if (slug.includes('apple-watch-ultra-2')) rank += 1090;
  else if (slug.includes('macbook-pro-14') || slug.includes('m3-pro')) rank += 1080;
  else if (slug.includes('sony-wh-1000xm5')) rank += 1070;
  else if (slug.includes('airpods-max')) rank += 1060;
  else if (slug.includes('playstation-5')) rank += 1050;
  else if (slug.includes('xbox-series-x')) rank += 1040;

  // Tier 2: Current-Gen Core Flagships & High-End
  else if (slug.includes('iphone-16-plus')) rank += 980;
  else if (slug.includes('iphone-16')) rank += 970;
  else if (slug.includes('galaxy-s24-plus') || slug.includes('galaxy-s24+')) rank += 960;
  else if (slug.includes('galaxy-s24')) rank += 950;
  else if (slug.includes('galaxy-z-flip6')) rank += 940;
  else if (slug.includes('macbook-air-15')) rank += 930;
  else if (slug.includes('macbook-air-13')) rank += 920;
  else if (slug.includes('ipad-air')) rank += 910;
  else if (slug.includes('ipad-mini') && slug.includes('a17')) rank += 900;
  else if (slug.includes('nintendo-switch-oled')) rank += 890;
  else if (slug.includes('airpods-pro-2') || slug.includes('airpods-pro')) rank += 880;
  else if (slug.includes('galaxy-watch-ultra')) rank += 870;
  else if (slug.includes('apple-watch-series-10') || slug.includes('watch-s10')) rank += 860;
  else if (slug.includes('oneplus-12')) rank += 850;
  else if (slug.includes('xiaomi-14-ultra')) rank += 840;
  else if (slug.includes('lg-oled') || slug.includes('bravia-8')) rank += 830;
  else if (slug.includes('asus-rog-zephyrus') || slug.includes('dell-xps')) rank += 820;

  // Tier 3: Previous-Gen Flagships & High-Value Consumer Electronics
  else if (slug.includes('iphone-15-pro')) rank += 780;
  else if (slug.includes('iphone-15')) rank += 750;
  else if (slug.includes('galaxy-s23')) rank += 740;
  else if (slug.includes('airpods-4')) rank += 730;
  else if (slug.includes('galaxy-tab-s9')) rank += 720;
  else if (slug.includes('bose-quietcomfort')) rank += 710;
  else if (slug.includes('sennheiser-momentum-4')) rank += 700;
  else if (slug.includes('steam-deck-oled')) rank += 690;
  else if (slug.includes('rog-ally')) rank += 685;
  else if (slug.includes('surface-laptop-7')) rank += 680;
  else if (slug.includes('dji-mini-4') || slug.includes('dji-osmo')) rank += 670;
  else if (slug.includes('xbox-series-s')) rank += 660;
  else if (slug.includes('playstation-portal')) rank += 650;

  // Tier 4: Mainstream & Budget Models
  else if (slug.includes('galaxy-a55')) rank += 550;
  else if (slug.includes('ipad-10th-gen')) rank += 540;
  else if (slug.includes('iphone-13')) rank += 530;
  else if (slug.includes('galaxy-watch7')) rank += 520;
  else if (slug.includes('apple-watch-se')) rank += 510;
  else if (slug.includes('dualsense')) rank += 505;
  else if (slug.includes('990-pro') || slug.includes('t7-shield') || slug.includes('sandisk-extreme')) rank += 500;
  else if (slug.includes('mx-master') || slug.includes('mx-keys') || slug.includes('superlight')) rank += 490;
  else if (slug.includes('anker-prime')) rank += 480;

  // Tier 5: Accessories & Adapters (Lowest priority)
  else if (category === 'chargers-power-banks') rank += 150;
  else if (category === 'computer-accessories') rank += 140;
  else if (category === 'storage') rank += 160;
  else if (category === 'networking') rank += 200;
  else {
    rank += Math.min(Math.round((product.currentBestPrice || 0) / 20), 400);
  }

  return rank;
}

/**
 * Filter and sort products using relevance and multi-criteria matching
 */
export function searchProducts(
  products: Product[],
  query: string,
  options: {
    category?: string;
    brand?: string;
    merchant?: string;
    sortBy?: 'relevance' | 'price_asc' | 'price_desc' | 'biggest_drop';
  } = {}
): Product[] {
  const q = query.trim().toLowerCase();
  const { category, brand, merchant, sortBy = 'relevance' } = options;

  const filtered = products.filter((product) => {
    if (category && product.categorySlug.toLowerCase() !== category.toLowerCase()) return false;
    if (brand && product.brand.toLowerCase() !== brand.toLowerCase()) return false;
    if (merchant && !product.offers.some((offer) => offer.merchantName.toLowerCase() === merchant.toLowerCase())) return false;

    if (q) {
      const score = scoreProductRelevance(product, q);
      return score > 0;
    }
    return true;
  });

  return [...filtered].sort((a, b) => {
    if (sortBy === 'price_asc') return a.currentBestPrice - b.currentBestPrice;
    if (sortBy === 'price_desc') return b.currentBestPrice - a.currentBestPrice;
    if (sortBy === 'biggest_drop') {
      const aDrop = a.originalPrice > 0 ? (a.originalPrice - a.currentBestPrice) / a.originalPrice : 0;
      const bDrop = b.originalPrice > 0 ? (b.originalPrice - b.currentBestPrice) / b.originalPrice : 0;
      return bDrop - aDrop;
    }

    if (q) {
      const diff = scoreProductRelevance(b, q) - scoreProductRelevance(a, q);
      // If one product has significantly higher textual relevance, respect text match
      if (Math.abs(diff) >= 10) return diff;
    }

    // Flagship popularity rank prioritization
    const rankDiff = getProductPopularityRank(b) - getProductPopularityRank(a);
    if (rankDiff !== 0) return rankDiff;

    if (a.offersCount !== b.offersCount) return b.offersCount - a.offersCount;
    return b.currentBestPrice - a.currentBestPrice;
  });
}

// ==========================================
// CLIENT-SIDE RECENT SEARCHES MANAGEMENT
// ==========================================

export function getRecentSearches(): string[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = window.localStorage.getItem(RECENT_SEARCHES_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.filter((item) => typeof item === 'string' && item.trim().length > 0) : [];
  } catch {
    return [];
  }
}

export function saveRecentSearch(query: string): string[] {
  if (typeof window === 'undefined') return [];
  const trimmed = query.trim();
  if (!trimmed || trimmed.length < 2) return getRecentSearches();

  try {
    const current = getRecentSearches();
    const filtered = current.filter((q) => q.toLowerCase() !== trimmed.toLowerCase());
    const updated = [trimmed, ...filtered].slice(0, MAX_RECENT_SEARCHES);
    window.localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(updated));
    return updated;
  } catch {
    return [];
  }
}

export function removeRecentSearch(query: string): string[] {
  if (typeof window === 'undefined') return [];
  try {
    const current = getRecentSearches();
    const updated = current.filter((q) => q.toLowerCase() !== query.trim().toLowerCase());
    window.localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(updated));
    return updated;
  } catch {
    return [];
  }
}

export function clearRecentSearches(): void {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.removeItem(RECENT_SEARCHES_KEY);
  } catch {}
}
