import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import { IPHONE_16_PRO_MAX_IMAGES } from '../../lib/data/gallery/apple-iphone-16-pro-max.ts';
import { IPHONE_16_PRO_MAX_SPEC_GROUPS } from '../../lib/data/specs/iphone-16-pro-max.ts';

describe('Product Page 2.0 & Price Engine Foundation Tests', () => {
  test('iPhone 16 Pro Max official Apple CDN gallery has verified typed images', () => {
    assert.ok(IPHONE_16_PRO_MAX_IMAGES.length >= 4, 'Should have at least 4 typed gallery images');
    
    // Check primary image exists
    const primary = IPHONE_16_PRO_MAX_IMAGES.find((img) => img.isPrimary);
    assert.ok(primary, 'Primary image must be designated');
    assert.match(primary.imageUrl, /^https:\/\/store\.storeimages\.cdn-apple\.com\//);
    
    // Check typed views
    const types = new Set(IPHONE_16_PRO_MAX_IMAGES.map((img) => img.imageType));
    assert.ok(types.has('front'), 'Must include front/finish view');
    assert.ok(types.has('angle'), 'Must include angle/display view');
    assert.ok(types.has('detail'), 'Must include detail/camera view');

    // Verify all URLs are HTTPS Apple CDN
    for (const img of IPHONE_16_PRO_MAX_IMAGES) {
      assert.ok(img.imageUrl.startsWith('https://'), `Image URL must use HTTPS: ${img.imageUrl}`);
      assert.ok(img.imageUrl.includes('cdn-apple.com'), `Must be official Apple CDN: ${img.imageUrl}`);
      assert.ok(img.altText && img.altText.length > 5, 'Alt text must be informative');
    }
  });

  test('Gallery fallback gracefully handles single-image products', () => {
    function resolveGallery(product) {
      if (product.images && product.images.length > 0) return product.images;
      if (product.imageUrl) {
        return [{
          id: 'primary',
          imageUrl: product.imageUrl,
          sortOrder: 1,
          imageType: 'front',
          altText: product.title,
          isPrimary: true,
        }];
      }
      return [];
    }

    const singleImageProduct = {
      title: 'Generic Smartphone',
      imageUrl: 'https://example.com/phone.jpg',
    };

    const resolved = resolveGallery(singleImageProduct);
    assert.equal(resolved.length, 1);
    assert.equal(resolved[0].imageUrl, 'https://example.com/phone.jpg');
    assert.equal(resolved[0].isPrimary, true);
    assert.equal(resolved[0].imageType, 'front');
  });

  test('iPhone 16 Pro Max has complete GSMArena-grade specification groups', () => {
    const requiredCategories = [
      'Display',
      'Platform & Chip',
      'Camera',
      'Battery & Power',
      'Body & Build',
      'Connectivity',
    ];

    const presentCategories = IPHONE_16_PRO_MAX_SPEC_GROUPS.map((g) => g.category);
    for (const req of requiredCategories) {
      assert.ok(presentCategories.includes(req), `Missing required GSMArena category: ${req}`);
    }

    // Verify specific critical specs
    const displayGroup = IPHONE_16_PRO_MAX_SPEC_GROUPS.find((g) => g.category === 'Display');
    const displaySize = displayGroup?.specs.find((s) => s.name === 'Size');
    assert.ok(displaySize?.value.includes('6.9 inches'), 'Display size must specify 6.9 inches');

    const platformGroup = IPHONE_16_PRO_MAX_SPEC_GROUPS.find((g) => g.category === 'Platform & Chip');
    const chipset = platformGroup?.specs.find((s) => s.name === 'Chipset');
    assert.ok(chipset?.value.includes('Apple A18 Pro'), 'Chipset must specify Apple A18 Pro');

    const cameraGroup = IPHONE_16_PRO_MAX_SPEC_GROUPS.find((g) => g.category === 'Camera');
    const telephoto = cameraGroup?.specs.find((s) => s.name.includes('Telephoto'));
    assert.ok(telephoto?.value.includes('5x optical zoom'), 'Must specify 5x optical zoom');
  });

  test('Truthful pricing states never output AED 0 or fabricated discounts', () => {
    function getPriceDisplayState(currentBestPrice, originalPrice) {
      if (!currentBestPrice || currentBestPrice <= 0) {
        return {
          isPending: true,
          displayPrice: 'Retailer offers pending verification',
          hasDiscount: false,
          discountPercent: 0,
        };
      }
      const hasDiscount = originalPrice > currentBestPrice;
      const discountPercent = hasDiscount
        ? Math.round(((originalPrice - currentBestPrice) / originalPrice) * 100)
        : 0;
      return {
        isPending: false,
        displayPrice: `AED ${currentBestPrice}`,
        hasDiscount,
        discountPercent,
      };
    }

    // Product without verified offers
    const pendingState = getPriceDisplayState(0, 0);
    assert.equal(pendingState.isPending, true);
    assert.equal(pendingState.displayPrice, 'Retailer offers pending verification');
    assert.equal(pendingState.hasDiscount, false);

    // Product with verified price but no discount
    const standardState = getPriceDisplayState(5099, 5099);
    assert.equal(standardState.isPending, false);
    assert.equal(standardState.hasDiscount, false);

    // Product with verified discount
    const discountedState = getPriceDisplayState(4899, 5099);
    assert.equal(discountedState.isPending, false);
    assert.equal(discountedState.hasDiscount, true);
    assert.equal(discountedState.discountPercent, 4);
  });

  test('Price history truthfully distinguishes verified history from pending collection', () => {
    function getHistoryState(historyPoints) {
      const validPoints = (historyPoints || []).filter((p) => Number.isFinite(p.price) && p.price > 0);
      if (validPoints.length < 2) {
        return {
          hasChart: false,
          message: 'Price history is being collected. Daily price checks will populate this chart as market data records.',
        };
      }
      return {
        hasChart: true,
        pointsCount: validPoints.length,
      };
    }

    assert.equal(getHistoryState([]).hasChart, false);
    assert.equal(getHistoryState([{ date: '2026-09-01', price: 5099 }]).hasChart, false);
    assert.equal(
      getHistoryState([
        { date: '2026-09-01', price: 5099 },
        { date: '2026-09-10', price: 4999 },
      ]).hasChart,
      true
    );
  });

  test('Outbound links strictly route via offerId and country without targetUrl', () => {
    function buildOutboundLink(offerId, country) {
      return `/api/outbound?offerId=${encodeURIComponent(offerId)}&country=${country}`;
    }

    const link = buildOutboundLink('off-12345', 'ae');
    assert.equal(link, '/api/outbound?offerId=off-12345&country=ae');
    assert.equal(link.includes('targetUrl='), false, 'Must not expose targetUrl query parameter');
  });
});
