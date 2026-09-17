import { test, describe } from 'node:test';
import assert from 'node:assert/strict';

// Test implementation of Stage 1, Stage 2, and Stage 3 matching logic
describe('Product Matching Engine Tests', () => {
  function matchStagedItem(staged, candidates) {
    // Stage 1: Exact GTIN / UPC / EAN
    if (staged.gtin) {
      const gtinMatch = candidates.find(c => c.gtin && c.gtin === staged.gtin);
      if (gtinMatch) {
        return { matched: true, productId: gtinMatch.id, confidence: 1.0, method: 'GTIN_EXACT' };
      }
    }

    // Stage 2: Brand + MPN
    if (staged.brand && staged.mpn) {
      const mpnMatch = candidates.find(
        c => c.brand?.toLowerCase() === staged.brand.toLowerCase() && c.mpn?.toLowerCase() === staged.mpn.toLowerCase()
      );
      if (mpnMatch) {
        return { matched: true, productId: mpnMatch.id, confidence: 0.95, method: 'BRAND_MPN_EXACT' };
      }
    }

    // Stage 3: Token similarity
    let bestMatch = null;
    let highestScore = 0;

    const stagedTokens = staged.rawTitle.toLowerCase().split(/\s+/).filter(t => t.length > 2);
    for (const c of candidates) {
      const candidateTokens = c.name.toLowerCase().split(/\s+/).filter(t => t.length > 2);
      const intersection = stagedTokens.filter(t => candidateTokens.includes(t));
      const score = (2 * intersection.length) / (stagedTokens.length + candidateTokens.length);

      if (score > highestScore) {
        highestScore = score;
        bestMatch = c;
      }
    }

    if (highestScore >= 0.90) {
      return { matched: true, productId: bestMatch.id, confidence: highestScore, method: 'TOKEN_SIMILARITY_AUTO' };
    }
    if (highestScore >= 0.65) {
      return { matched: false, suggestedProductId: bestMatch.id, confidence: highestScore, method: 'HUMAN_REVIEW_QUEUE' };
    }
    return { matched: false, productId: null, confidence: highestScore, method: 'REJECTED' };
  }

  const catalog = [
    { id: 'p1', name: 'Apple iPhone 15 Pro 128GB Natural Titanium', brand: 'Apple', gtin: '0195949038235', mpn: 'MTUT3LL/A' },
    { id: 'p2', name: 'Samsung Galaxy S24 Ultra 256GB Titanium Gray', brand: 'Samsung', gtin: '8806095300123', mpn: 'SM-S928B' },
    { id: 'p3', name: 'Sony WH-1000XM5 Wireless Headphones Black', brand: 'Sony', gtin: '027242923454', mpn: 'WH1000XM5/B' },
  ];

  test('Stage 1: GTIN exact match achieves 100% confidence', () => {
    const staged = { rawTitle: 'iPhone 15 Pro 128GB Titanium (Noon UAE)', gtin: '0195949038235' };
    const result = matchStagedItem(staged, catalog);
    assert.equal(result.matched, true);
    assert.equal(result.productId, 'p1');
    assert.equal(result.confidence, 1.0);
    assert.equal(result.method, 'GTIN_EXACT');
  });

  test('Stage 2: Brand + MPN exact match achieves 95% confidence', () => {
    const staged = { rawTitle: 'Galaxy S24 Ultra Phone', brand: 'Samsung', mpn: 'SM-S928B' };
    const result = matchStagedItem(staged, catalog);
    assert.equal(result.matched, true);
    assert.equal(result.productId, 'p2');
    assert.equal(result.confidence, 0.95);
    assert.equal(result.method, 'BRAND_MPN_EXACT');
  });

  test('Stage 3: Ambiguous match (65-89% confidence) routes to human review queue', () => {
    const staged = { rawTitle: 'Apple iPhone 15 Pro 128GB' }; // subset of words
    const result = matchStagedItem(staged, catalog);
    assert.equal(result.matched, false);
    assert.equal(result.method, 'HUMAN_REVIEW_QUEUE');
    assert.ok(result.confidence >= 0.65 && result.confidence < 0.90);
    assert.equal(result.suggestedProductId, 'p1');
  });

  test('Stage 3: Low confidence (<65%) rejects without false positives', () => {
    const staged = { rawTitle: 'Generic Protective Case for Smartphone' };
    const result = matchStagedItem(staged, catalog);
    assert.equal(result.matched, false);
    assert.equal(result.method, 'REJECTED');
    assert.ok(result.confidence < 0.65);
  });
});
