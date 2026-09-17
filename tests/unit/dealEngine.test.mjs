import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import { evaluateDeal } from '../../lib/deals/dealEngine.ts';

describe('Rules-First Deal Scoring Algorithm Tests', () => {
  test('Calculates high score (>=80) for genuine all-time low with competing retailers', () => {
    const result = evaluateDeal({
      productId: 'prod-1',
      offerId: 'off-1',
      currentPrice: 2800,
      originalPrice: 3500,
      recentAverage: 3300,
      historicalLow: 2800,
      competingOffersCount: 4,
      inStock: true,
      currency: 'AED',
    });

    assert.ok(result.dealScore >= 80, `Expected score >= 80, got ${result.dealScore}`);
    assert.equal(result.isTopDeal, true);
    assert.equal(result.dealType, 'HISTORICAL_LOW');
    assert.equal(result.discountPercent, 20);
    assert.equal(result.absoluteSaving, 700);
  });

  test('Scores 0 for out of stock or non-positive price', () => {
    const oos = evaluateDeal({
      productId: 'prod-1',
      offerId: 'off-1',
      currentPrice: 100,
      originalPrice: 200,
      competingOffersCount: 1,
      inStock: false,
      currency: 'AED',
    });
    assert.equal(oos.dealScore, 0);

    const zeroPrice = evaluateDeal({
      productId: 'prod-1',
      offerId: 'off-1',
      currentPrice: 0,
      originalPrice: 200,
      competingOffersCount: 1,
      inStock: true,
      currency: 'AED',
    });
    assert.equal(zeroPrice.dealScore, 0);
  });

  test('Handles price increases without negative score glitch', () => {
    const result = evaluateDeal({
      productId: 'prod-1',
      offerId: 'off-1',
      currentPrice: 500,
      originalPrice: 400, // current price is higher than reference
      recentAverage: 450,
      competingOffersCount: 1,
      inStock: true,
      currency: 'AED',
    });

    assert.ok(result.dealScore >= 0);
    assert.equal(result.discountPercent, 0);
    assert.equal(result.absoluteSaving, 0);
  });

  test('Boundaries strictly capped at 100 points maximum', () => {
    const result = evaluateDeal({
      productId: 'prod-1',
      offerId: 'off-1',
      currentPrice: 100,
      originalPrice: 1000, // 90% discount
      recentAverage: 900,
      historicalLow: 500,
      competingOffersCount: 10,
      inStock: true,
      currency: 'AED',
    });

    assert.ok(result.dealScore <= 100);
    assert.equal(result.dealScore, 100);
  });
});
