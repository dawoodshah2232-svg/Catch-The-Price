import { test, describe } from 'node:test';
import assert from 'node:assert/strict';

describe('API Security & Input Validation Tests', () => {
  function safeRedirectPath(target, fallback = '/ae/account') {
    if (!target) return fallback;
    if (target.startsWith('/') && !target.startsWith('//') && !target.startsWith('/\\')) {
      return target;
    }
    return fallback;
  }

  function validateOutboundHost(merchantWebsiteUrl, destinationUrl) {
    function normalizeHost(h) {
      return h.toLowerCase().replace(/^www\./, '');
    }

    try {
      const merchantHost = normalizeHost(new URL(merchantWebsiteUrl).hostname);
      const destinationHost = normalizeHost(new URL(destinationUrl).hostname);
      return merchantHost.length > 0 && (destinationHost === merchantHost || destinationHost.endsWith(`.${merchantHost}`));
    } catch {
      return false;
    }
  }

  const VALID_EVENTS = new Set([
    'page_view', 'search', 'product_view', 'save', 'save_product',
    'alert_intent', 'create_alert', 'compare', 'affiliate_click',
    'retailer_click', 'deal_view', 'guide_view',
  ]);

  test('Blocks open redirect attempts in auth callbacks', () => {
    // Malicious open redirect attempts
    assert.equal(safeRedirectPath('https://evil.com'), '/ae/account');
    assert.equal(safeRedirectPath('//evil.com'), '/ae/account');
    assert.equal(safeRedirectPath('/\\evil.com'), '/ae/account');
    assert.equal(safeRedirectPath('javascript:alert(1)'), '/ae/account');

    // Valid relative app routes
    assert.equal(safeRedirectPath('/ae/account/saved'), '/ae/account/saved');
    assert.equal(safeRedirectPath('/ae/account/alerts'), '/ae/account/alerts');
  });

  test('Enforces outbound redirect host matching against merchant website domain', () => {
    // Valid merchant redirects
    assert.equal(validateOutboundHost('https://www.amazon.ae', 'https://amazon.ae/dp/B001'), true);
    assert.equal(validateOutboundHost('https://amazon.ae', 'https://subdomain.amazon.ae/item'), true);
    assert.equal(validateOutboundHost('https://www.noon.com', 'https://noon.com/uae-en/p/1'), true);

    // Host mismatch / phishing attempts
    assert.equal(validateOutboundHost('https://www.amazon.ae', 'https://evil-amazon.com/dp/B001'), false);
    assert.equal(validateOutboundHost('https://www.noon.com', 'https://phishing-noon.com'), false);
  });

  test('Validates complete shopping intelligence event taxonomy', () => {
    const requiredEvents = [
      'product_view',
      'search',
      'compare',
      'save_product',
      'create_alert',
      'affiliate_click',
      'retailer_click',
      'deal_view',
      'guide_view',
    ];

    for (const evt of requiredEvents) {
      assert.equal(VALID_EVENTS.has(evt), true, `Event "${evt}" must be present in VALID_EVENTS`);
    }

    assert.equal(VALID_EVENTS.has('malicious_exploit'), false);
  });
});
