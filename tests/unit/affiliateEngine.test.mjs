import { test, describe } from 'node:test';
import assert from 'node:assert/strict';

describe('Affiliate Engine & Conversion Architecture Tests', () => {
  function generateClickId() {
    const timestamp = Date.now().toString(36);
    const random = Math.random().toString(36).substring(2, 10);
    return `c_${timestamp}_${random}`;
  }

  function buildAffiliateUrl({ productUrl, affiliateUrl, clickId, campaignId, config }) {
    const baseTarget = affiliateUrl?.trim() || productUrl.trim();

    let targetUrl;
    try {
      targetUrl = new URL(baseTarget);
    } catch {
      return { destinationUrl: baseTarget, isDecorated: false };
    }

    if (targetUrl.protocol !== 'https:') {
      return { destinationUrl: baseTarget, isDecorated: false };
    }

    const network = config?.network || 'DIRECT';

    switch (network) {
      case 'AMAZON_ASSOCIATES': {
        if (config?.partnerId) targetUrl.searchParams.set('tag', config.partnerId);
        targetUrl.searchParams.set('ascsubtag', clickId);
        return { destinationUrl: targetUrl.toString(), isDecorated: true };
      }
      case 'IMPACT_RADIUS': {
        targetUrl.searchParams.set('subId1', clickId);
        if (campaignId) targetUrl.searchParams.set('subId2', campaignId);
        return { destinationUrl: targetUrl.toString(), isDecorated: true };
      }
      case 'CJ_AFFILIATE': {
        targetUrl.searchParams.set('sid', clickId);
        return { destinationUrl: targetUrl.toString(), isDecorated: true };
      }
      case 'RAKUTEN': {
        targetUrl.searchParams.set('u1', clickId);
        return { destinationUrl: targetUrl.toString(), isDecorated: true };
      }
      case 'AWIN': {
        targetUrl.searchParams.set('clickref', clickId);
        return { destinationUrl: targetUrl.toString(), isDecorated: true };
      }
      case 'DIRECT':
      default: {
        targetUrl.searchParams.set('ctp_click', clickId);
        return { destinationUrl: targetUrl.toString(), isDecorated: true };
      }
    }
  }

  function calculateEpc(totalCommissions, totalClicks) {
    if (!totalClicks || totalClicks <= 0) return 0;
    return Math.round((totalCommissions / totalClicks) * 100) / 100;
  }

  function calculateConversionRate(totalConversions, totalClicks) {
    if (!totalClicks || totalClicks <= 0) return 0;
    return Math.round((totalConversions / totalClicks) * 10000) / 100;
  }

  test('Generates valid click IDs with timestamp prefix', () => {
    const id1 = generateClickId();
    const id2 = generateClickId();
    assert.match(id1, /^c_[0-9a-z]+_[0-9a-z]+$/);
    assert.notEqual(id1, id2);
  });

  test('Correctly decorates Amazon URL with ascsubtag and partner tag', () => {
    const clickId = 'c_test123_456';
    const result = buildAffiliateUrl({
      productUrl: 'https://www.amazon.ae/dp/B0CHX1W1XY',
      clickId,
      config: { network: 'AMAZON_ASSOCIATES', partnerId: 'catchtheprice-21' },
    });

    assert.equal(result.isDecorated, true);
    const parsed = new URL(result.destinationUrl);
    assert.equal(parsed.searchParams.get('tag'), 'catchtheprice-21');
    assert.equal(parsed.searchParams.get('ascsubtag'), clickId);
  });

  test('Correctly decorates Impact Radius URL with subId1 and subId2', () => {
    const clickId = 'c_imp_789';
    const result = buildAffiliateUrl({
      productUrl: 'https://bestbuy.7t2j.net/c/123/456/789',
      clickId,
      campaignId: 'spring_deals_2026',
      config: { network: 'IMPACT_RADIUS' },
    });

    const parsed = new URL(result.destinationUrl);
    assert.equal(parsed.searchParams.get('subId1'), clickId);
    assert.equal(parsed.searchParams.get('subId2'), 'spring_deals_2026');
  });

  test('Rejects insecure non-HTTPS destinations from decoration', () => {
    const result = buildAffiliateUrl({
      productUrl: 'http://insecure-retailer.com/product/1',
      clickId: 'c_fail',
    });
    assert.equal(result.isDecorated, false);
  });

  test('Calculates EPC and Conversion Rate accurately', () => {
    const epc = calculateEpc(450.75, 1000);
    assert.equal(epc, 0.45); // 0.45 AED per click

    const cr = calculateConversionRate(32, 1000);
    assert.equal(cr, 3.2); // 3.2% conversion rate
  });
});
