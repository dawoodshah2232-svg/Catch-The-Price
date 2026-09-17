import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import {
  levenshteinDistance,
  isFuzzyTokenMatch,
  scoreProductRelevance,
} from '../../lib/search/searchEngine.ts';

describe('Search Engine & Typo Tolerance Tests', () => {
  test('Levenshtein distance detects single-character typos', () => {
    assert.equal(levenshteinDistance('iphone', 'iphne'), 1);
    assert.equal(levenshteinDistance('samsung', 'sumsung'), 1);
    assert.equal(levenshteinDistance('macbook', 'macbok'), 1);
    assert.equal(levenshteinDistance('playstation', 'playstaion'), 1);
  });

  test('Fuzzy token matching accommodates typos for words >= 4 chars', () => {
    assert.equal(isFuzzyTokenMatch('sumsung', 'samsung'), true);
    assert.equal(isFuzzyTokenMatch('iphne', 'iphone'), true);
    assert.equal(isFuzzyTokenMatch('playstaion', 'playstation'), true);
  });

  test('Relevance score prioritizes exact matches over partials and typos', () => {
    const product1 = {
      id: 'p1',
      title: 'iPhone 15 Pro',
      brand: 'Apple',
      categoryName: 'Phones',
      specs: {},
    };
    const product2 = {
      id: 'p2',
      title: 'iPhone 15 Pro Max 256GB',
      brand: 'Apple',
      categoryName: 'Phones',
      specs: {},
    };
    const product3 = {
      id: 'p3',
      title: 'Protective Case for iPhone 15 Pro',
      brand: 'Spigen',
      categoryName: 'Accessories',
      specs: {},
    };

    const exactScore = scoreProductRelevance(product1, 'iPhone 15 Pro');
    const prefixScore = scoreProductRelevance(product2, 'iPhone 15 Pro');
    const partialScore = scoreProductRelevance(product3, 'iPhone 15 Pro');
    const typoScore = scoreProductRelevance(product1, 'iphne 15 Pro');

    assert.ok(exactScore > prefixScore, `Expected exact (${exactScore}) > prefix (${prefixScore})`);
    assert.ok(prefixScore > partialScore, `Expected prefix (${prefixScore}) > partial (${partialScore})`);
    assert.ok(typoScore > 0, `Typo score should be > 0, got ${typoScore}`);
  });
});
