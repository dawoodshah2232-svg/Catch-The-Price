import { NormalizedItem } from '@/lib/ingestion/types';
import { CanonicalCandidate, suggestExactMatch } from '@/lib/ingestion/exactMatcher.server';
import { matchItemToCatalog } from '@/lib/ingestion/matcher';
import { Product } from '@/lib/types';

export type MatchDecision = 'AUTO_ACCEPT' | 'REVIEW' | 'REJECT';

export interface MatchingResult {
  sourceItemId: string;
  matchedProductId: string | null;
  confidence: number;
  method: string;
  decision: MatchDecision;
  reviewReason?: string;
}

const AUTO_ACCEPT_THRESHOLD = 90;
const REVIEW_THRESHOLD = 65;

export function evaluateProductMatch(
  item: NormalizedItem,
  canonicalCandidates: CanonicalCandidate[],
  catalogProducts: Product[]
): MatchingResult {
  // Stage 1: Priority Exact Identifiers (GTIN, MPN, Exact Model, SKU)
  const exactSuggestion = suggestExactMatch(item, canonicalCandidates);
  if (exactSuggestion && exactSuggestion.confidence >= AUTO_ACCEPT_THRESHOLD) {
    return {
      sourceItemId: item.sku,
      matchedProductId: exactSuggestion.productId,
      confidence: exactSuggestion.confidence,
      method: exactSuggestion.method,
      decision: 'AUTO_ACCEPT',
    };
  }

  // Stage 2: Deterministic Token & Brand Similarity Matching
  const tokenMatch = matchItemToCatalog(item, catalogProducts);

  if (tokenMatch.matchedProductId && tokenMatch.confidence >= AUTO_ACCEPT_THRESHOLD) {
    return {
      sourceItemId: item.sku,
      matchedProductId: tokenMatch.matchedProductId,
      confidence: tokenMatch.confidence,
      method: tokenMatch.method,
      decision: 'AUTO_ACCEPT',
    };
  }

  if (tokenMatch.matchedProductId && tokenMatch.confidence >= REVIEW_THRESHOLD) {
    return {
      sourceItemId: item.sku,
      matchedProductId: tokenMatch.matchedProductId,
      confidence: tokenMatch.confidence,
      method: tokenMatch.method,
      decision: 'REVIEW',
      reviewReason: `Confidence score (${tokenMatch.confidence}%) is below auto-accept threshold (${AUTO_ACCEPT_THRESHOLD}%). Manual verification required.`,
    };
  }

  // Low confidence: NEVER silently merge
  return {
    sourceItemId: item.sku,
    matchedProductId: null,
    confidence: tokenMatch.confidence || 0,
    method: 'insufficient_similarity',
    decision: 'REJECT',
    reviewReason: 'No high-confidence match found across catalog.',
  };
}
