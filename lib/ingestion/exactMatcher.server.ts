import 'server-only';

import { NormalizedItem } from '@/lib/ingestion/types';

export type CanonicalCandidate = {
  id: string;
  brand: string | null;
  name: string;
  model: string | null;
  gtin: string | null;
  sku: string | null;
  specs: Record<string, unknown> | null;
};

export type ExactMatchSuggestion = {
  productId: string;
  confidence: number;
  method: 'exact_gtin' | 'exact_mpn' | 'exact_model' | 'exact_sku';
} | null;

function norm(value?: string | null) {
  return (value || '').trim().toLowerCase().replace(/\s+/g, ' ');
}

function uniqueMatch(candidates: CanonicalCandidate[], predicate: (candidate: CanonicalCandidate) => boolean) {
  const matches = candidates.filter(predicate);
  return matches.length === 1 ? matches[0] : null;
}

export function suggestExactMatch(item: NormalizedItem, candidates: CanonicalCandidate[]): ExactMatchSuggestion {
  const gtin = norm(item.gtin);
  if (gtin) {
    const candidate = uniqueMatch(candidates, (row) => norm(row.gtin) === gtin);
    if (candidate) return { productId: candidate.id, confidence: 100, method: 'exact_gtin' };
  }

  const mpn = norm(item.mpn);
  if (mpn) {
    const candidate = uniqueMatch(candidates, (row) => {
      const specs = row.specs || {};
      const storedMpn = typeof specs.MPN === 'string' || typeof specs.MPN === 'number' ? String(specs.MPN) : '';
      return norm(storedMpn) === mpn;
    });
    if (candidate) return { productId: candidate.id, confidence: 99, method: 'exact_mpn' };
  }

  const model = norm(item.model);
  const brand = norm(item.brand);
  if (model && brand && brand !== 'unknown') {
    const candidate = uniqueMatch(candidates, (row) => norm(row.brand) === brand && norm(row.model) === model);
    if (candidate) return { productId: candidate.id, confidence: 98, method: 'exact_model' };
  }

  const sku = norm(item.sku);
  if (sku) {
    const candidate = uniqueMatch(candidates, (row) => norm(row.sku) === sku);
    if (candidate) return { productId: candidate.id, confidence: 97, method: 'exact_sku' };
  }

  return null;
}
