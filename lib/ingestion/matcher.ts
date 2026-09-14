import { NormalizedItem, MatchResult } from './types';
import { Product } from '@/lib/types';

// Deterministic token set similarity calculation (Jaccard similarity on tokens)
export function matchItemToCatalog(
  item: NormalizedItem,
  catalog: Product[]
): MatchResult {
  const itemTokens = new Set(
    item.title
      .toLowerCase()
      .replace(/[^\w\s]/g, '')
      .split(/\s+/)
      .filter((w) => w.length > 1)
  );

  let bestMatch: Product | null = null;
  let highestScore = 0;

  for (const product of catalog) {
    // Category check
    if (product.categorySlug !== item.categorySlug) continue;

    const productTokens = new Set(
      product.title
        .toLowerCase()
        .replace(/[^\w\s]/g, '')
        .split(/\s+/)
        .filter((w) => w.length > 1)
    );

    // Calculate token intersection over union
    const intersection = new Set([...itemTokens].filter((x) => productTokens.has(x)));
    const union = new Set([...itemTokens, ...productTokens]);

    const similarity = (intersection.size / union.size) * 100;

    // Boost if brand matches exactly
    const brandBoost = item.brand.toLowerCase() === product.brand.toLowerCase() ? 10 : 0;
    const finalScore = Math.min(100, similarity + brandBoost);

    if (finalScore > highestScore) {
      highestScore = finalScore;
      bestMatch = product;
    }
  }

  if (highestScore >= 60 && bestMatch) {
    return {
      rawSku: item.sku,
      matchedProductId: bestMatch.id,
      confidence: Math.round(highestScore * 10) / 10,
      method: 'fuzzy_token',
    };
  }

  return {
    rawSku: item.sku,
    matchedProductId: null,
    confidence: 0,
    method: 'fuzzy_token',
  };
}
