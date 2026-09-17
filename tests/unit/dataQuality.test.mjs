import { test, describe } from 'node:test';
import assert from 'node:assert/strict';

describe('Data Quality Validation Tests', () => {
  function checkPriceAnomaly(price, originalPrice) {
    const isNonPositive = price <= 0;
    const isExorbitant = price > 1000000;
    const isGlitchedDiscount = originalPrice > 0 && price < originalPrice * 0.05;

    return isNonPositive || isExorbitant || isGlitchedDiscount;
  }

  function checkStaleOffer(lastCheckedIso, cutoffDays = 7) {
    const last = new Date(lastCheckedIso).getTime();
    const cutoff = Date.now() - cutoffDays * 86400000;
    return last < cutoff;
  }

  function findDuplicateOffers(offers) {
    const pairs = new Map();
    const duplicates = [];
    for (const off of offers) {
      const key = `${off.merchant_id}_${off.product_id}`;
      if (pairs.has(key)) duplicates.push(off.id);
      else pairs.set(key, off.id);
    }
    return duplicates;
  }

  test('Flags impossible non-positive price or exorbitant prices', () => {
    assert.equal(checkPriceAnomaly(0, 500), true);
    assert.equal(checkPriceAnomaly(-10, 500), true);
    assert.equal(checkPriceAnomaly(1500000, 2000000), true);
  });

  test('Flags glitched discount where price dropped by more than 95%', () => {
    // E.g. iPhone priced at 10 AED when reference was 4500 AED
    assert.equal(checkPriceAnomaly(10, 4500), true);
    // Reasonable 30% discount is valid
    assert.equal(checkPriceAnomaly(3150, 4500), false);
  });

  test('Identifies offers older than 7 days as stale', () => {
    const eightDaysAgo = new Date(Date.now() - 8 * 86400000).toISOString();
    const oneDayAgo = new Date(Date.now() - 1 * 86400000).toISOString();

    assert.equal(checkStaleOffer(eightDaysAgo, 7), true);
    assert.equal(checkStaleOffer(oneDayAgo, 7), false);
  });

  test('Detects duplicate offers for the same merchant and product', () => {
    const sampleOffers = [
      { id: 'off-1', merchant_id: 'm1', product_id: 'p1' },
      { id: 'off-2', merchant_id: 'm2', product_id: 'p1' },
      { id: 'off-3', merchant_id: 'm1', product_id: 'p1' }, // duplicate of off-1
    ];
    const dups = findDuplicateOffers(sampleOffers);
    assert.deepEqual(dups, ['off-3']);
  });
});
