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
      if (diff !== 0) return diff;
    }

    if (a.offersCount !== b.offersCount) return b.offersCount - a.offersCount;
    return a.currentBestPrice - b.currentBestPrice;
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
