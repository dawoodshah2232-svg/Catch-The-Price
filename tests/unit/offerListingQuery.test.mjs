import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { createClient } from '@supabase/supabase-js';

// Load .env.local if present
const envPath = path.join(process.cwd(), '.env.local');
if (fs.existsSync(envPath)) {
  const content = fs.readFileSync(envPath, 'utf8');
  for (const line of content.split('\n')) {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith('#') && trimmed.includes('=')) {
      const idx = trimmed.indexOf('=');
      const key = trimmed.slice(0, idx).trim();
      const val = trimmed.slice(idx + 1).trim().replace(/^["']|["']$/g, '');
      if (!process.env[key]) {
        process.env[key] = val;
      }
    }
  }
}

// ============================================================================
// Source Rights Governance Logic (mirrored from lib/config/sourceRights.ts)
// ============================================================================
function canPublishSource(source) {
  if (!source || source.status !== 'ACTIVE') return false;

  const pricingRight = source.pricingRight ?? source.pricing_right;
  const affiliateLinkRight = source.affiliateLinkRight ?? source.affiliate_link_right ?? true;
  if (!pricingRight || !affiliateLinkRight) return false;

  const approvalRef = (source.approvalReference || source.approval_reference || '').trim();
  if (!approvalRef) return false;

  const approvedAt = source.approvedAt || source.approved_at;
  if (!approvedAt) return false;

  const approvedTime = Date.parse(approvedAt);
  if (Number.isNaN(approvedTime) || approvedTime > Date.now()) {
    return false;
  }

  const expiry = source.expiresAt || source.expires_at || source.validUntil;
  if (expiry) {
    const expiryTime = Date.parse(expiry);
    if (!Number.isNaN(expiryTime) && expiryTime <= Date.now()) {
      return false; // Expired
    }
  }

  return true;
}

function resolveMerchantSourceRights(merchant, rightsList, sourcesList) {
  if (!merchant || !rightsList.length) return undefined;

  if (sourcesList && sourcesList.length > 0) {
    for (const src of sourcesList) {
      const cfg = src.config;
      if (cfg && typeof cfg === 'object') {
        const rightsId = cfg.source_rights_id || cfg.rightsId;
        const merchantSlug = cfg.merchant_slug || cfg.slug;
        if (
          typeof rightsId === 'string' &&
          typeof merchantSlug === 'string' &&
          merchantSlug.toLowerCase() === merchant.slug.toLowerCase()
        ) {
          const match = rightsList.find((r) => r.id.toLowerCase() === rightsId.toLowerCase());
          if (match) return match;
        }
      }
    }
  }

  const directMatch = rightsList.find((r) => r.id.toLowerCase() === merchant.slug.toLowerCase());
  if (directMatch) return directMatch;

  const mSlug = merchant.slug.toLowerCase();
  const slugMatch = rightsList.find((r) => {
    const rId = r.id.toLowerCase();
    const rRetailer = r.retailer.toLowerCase();
    return (
      mSlug.includes(rRetailer) ||
      rId.includes(mSlug) ||
      (mSlug.includes('amazon') && rId.includes('amazon')) ||
      (mSlug.includes('noon') && rId.includes('noon'))
    );
  });
  if (slugMatch) return slugMatch;

  const mName = merchant.name.toLowerCase();
  return rightsList.find(
    (r) =>
      r.retailer.toLowerCase() === mName ||
      mName.includes(r.retailer.toLowerCase()) ||
      r.retailer.toLowerCase().includes(mName)
  );
}

// ============================================================================
// Mapping Logic (mirrored from lib/data/catalog.server.ts)
// ============================================================================
function numeric(value) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
}

function priceStats(currentPrice, history) {
  const prices = history.length ? history.map((point) => point.price) : [currentPrice];
  return {
    currentPrice,
    lowestPrice: Math.min(...prices, currentPrice),
    highestPrice: Math.max(...prices, currentPrice),
    average30Days: Math.round(
      prices.slice(-3).reduce((sum, value) => sum + value, 0) / Math.max(prices.slice(-3).length, 1)
    ),
    average90Days: Math.round(prices.reduce((sum, value) => sum + value, 0) / Math.max(prices.length, 1)),
  };
}

function mapJoinedProduct(row, country, rightsList, sourcesList) {
  const rawOffers = Array.isArray(row.offers) ? row.offers : [];
  const validOfferRows = rawOffers.filter((offer) => {
    if (offer.country_code.toLowerCase() !== country.toLowerCase()) return false;
    if (!offer.is_active || offer.availability !== 'in_stock') return false;
    if (numeric(offer.price) <= 0) return false;

    const merchant = offer.merchants;
    if (!merchant || !merchant.is_active) return false;

    const metadataRightsId = typeof offer.metadata?.rightsId === 'string' ? offer.metadata.rightsId : undefined;
    const rightsRecord = metadataRightsId
      ? rightsList.find((r) => r.id.toLowerCase() === metadataRightsId.toLowerCase())
      : resolveMerchantSourceRights(merchant, rightsList, sourcesList);

    if (!canPublishSource(rightsRecord)) {
      return false; // Fail closed on unapproved or expired source rights
    }

    return true;
  });

  validOfferRows.sort((a, b) => numeric(a.price) - numeric(b.price));

  const mappedOffers = validOfferRows.map((offer, index) => ({
    id: offer.id,
    productId: row.id,
    merchantId: offer.merchant_id,
    merchantName: offer.merchants.name,
    price: numeric(offer.price),
    originalPrice: numeric(offer.original_price) || numeric(offer.price),
    currency: offer.currency,
    inStock: true,
    url: offer.product_url,
    affiliateUrl: offer.affiliate_url || undefined,
    lastCheckedAt: offer.last_checked_at,
    isBestPrice: index === 0,
  }));

  const history = validOfferRows
    .flatMap((o) =>
      (o.price_history || []).map((h) => ({
        date: h.captured_at,
        price: numeric(h.price),
        merchantName: o.merchants?.name,
      }))
    )
    .filter((point) => point.price > 0)
    .sort((a, b) => a.date.localeCompare(b.date));

  const best = mappedOffers.length > 0 ? mappedOffers[0] : null;
  const currentPrice = best ? best.price : 0;
  const originalPrice = best
    ? Math.max(best.price, ...mappedOffers.map((o) => o.originalPrice || o.price))
    : 0;

  return {
    id: row.id,
    title: row.name,
    slug: row.slug,
    currentBestPrice: currentPrice,
    originalPrice,
    currency: best ? best.currency : country === 'us' ? 'USD' : 'AED',
    offersCount: mappedOffers.length,
    bestMerchantName: best ? best.merchantName : 'Retailers pending',
    priceStats: priceStats(currentPrice, history),
    priceHistory: history,
    offers: mappedOffers,
  };
}

describe('Offer Listing & Source Rights Governance Tests', () => {
  const activeRights = [
    {
      id: 'amazon-associates-ae',
      retailer: 'Amazon UAE',
      market: 'ae',
      status: 'ACTIVE',
      approvalReference: 'AMZ-ASSOC-AE-2026-VERIFIED',
      approvedAt: '2026-01-01T00:00:00Z',
      pricingRight: true,
      imageRight: true,
      historyRight: true,
      affiliateLinkRight: true,
      aiProcessingRight: true,
      notes: 'Active Amazon Associates agreement for UAE market.',
    },
    {
      id: 'noon-affiliate-ae',
      retailer: 'Noon UAE',
      market: 'ae',
      status: 'ACTIVE',
      approvalReference: 'NOON-EVERYDAY-AFF-2026-VERIFIED',
      approvedAt: '2026-01-01T00:00:00Z',
      pricingRight: true,
      imageRight: true,
      historyRight: true,
      affiliateLinkRight: true,
      aiProcessingRight: true,
      notes: 'Active Noon affiliate program agreement for UAE market.',
    },
  ];

  test('canPublishSource filters out unapproved or incomplete source rights', () => {
    // Null or undefined
    assert.equal(canPublishSource(null), false);
    assert.equal(canPublishSource(undefined), false);

    // Status not ACTIVE
    assert.equal(canPublishSource({ status: 'PENDING', pricingRight: true, approvalReference: 'REF-1', approvedAt: '2026-01-01T00:00:00Z' }), false);
    assert.equal(canPublishSource({ status: 'DISABLED', pricingRight: true, approvalReference: 'REF-1', approvedAt: '2026-01-01T00:00:00Z' }), false);
    assert.equal(canPublishSource({ status: 'REVOKED', pricingRight: true, approvalReference: 'REF-1', approvedAt: '2026-01-01T00:00:00Z' }), false);

    // Pricing right false
    assert.equal(canPublishSource({ status: 'ACTIVE', pricingRight: false, approvalReference: 'REF-1', approvedAt: '2026-01-01T00:00:00Z' }), false);

    // Missing approval reference or approval date
    assert.equal(canPublishSource({ status: 'ACTIVE', pricingRight: true, approvalReference: '', approvedAt: '2026-01-01T00:00:00Z' }), false);
    assert.equal(canPublishSource({ status: 'ACTIVE', pricingRight: true, approvalReference: 'REF-1', approvedAt: null }), false);

    // Future approval date
    const futureDate = new Date(Date.now() + 1000 * 60 * 60 * 24 * 30).toISOString();
    assert.equal(canPublishSource({ status: 'ACTIVE', pricingRight: true, approvalReference: 'REF-1', approvedAt: futureDate }), false);

    // Valid active source
    assert.equal(canPublishSource(activeRights[0]), true);
    assert.equal(canPublishSource(activeRights[1]), true);
  });

  test('canPublishSource rejects expired source rights', () => {
    const expiredYesterday = new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString();
    const expiredRecord = {
      status: 'ACTIVE',
      pricingRight: true,
      approvalReference: 'OLD-REF',
      approvedAt: '2025-01-01T00:00:00Z',
      validUntil: expiredYesterday,
    };
    assert.equal(canPublishSource(expiredRecord), false);

    const validRecord = {
      status: 'ACTIVE',
      pricingRight: true,
      approvalReference: 'NEW-REF',
      approvedAt: '2026-01-01T00:00:00Z',
      validUntil: new Date(Date.now() + 1000 * 60 * 60 * 24 * 100).toISOString(),
    };
    assert.equal(canPublishSource(validRecord), true);
  });

  test('resolveMerchantSourceRights correctly maps merchants to rights records', () => {
    const amazonMerchant = { id: 'm-amz', name: 'Amazon UAE', slug: 'amazon-ae', is_active: true };
    const noonMerchant = { id: 'm-noon', name: 'Noon UAE', slug: 'noon-ae', is_active: true };
    const unknownMerchant = { id: 'm-shady', name: 'Shady Store', slug: 'shady-store', is_active: true };

    const resolvedAmz = resolveMerchantSourceRights(amazonMerchant, activeRights);
    assert.ok(resolvedAmz);
    assert.equal(resolvedAmz.id, 'amazon-associates-ae');

    const resolvedNoon = resolveMerchantSourceRights(noonMerchant, activeRights);
    assert.ok(resolvedNoon);
    assert.equal(resolvedNoon.id, 'noon-affiliate-ae');

    const resolvedUnknown = resolveMerchantSourceRights(unknownMerchant, activeRights);
    assert.equal(resolvedUnknown, undefined);
  });

  test('mapJoinedProduct excludes offers with unapproved source rights', () => {
    const row = {
      id: 'prod-1',
      name: 'Sony WH-1000XM5',
      slug: 'sony-wh-1000xm5',
      offers: [
        {
          id: 'off-amz',
          product_id: 'prod-1',
          merchant_id: 'm-amz',
          country_code: 'ae',
          currency: 'AED',
          price: 1199,
          original_price: 1399,
          availability: 'in_stock',
          product_url: 'https://amazon.ae/dp/example',
          affiliate_url: 'https://amazon.ae/dp/example?tag=aff',
          last_checked_at: '2026-09-19T10:00:00Z',
          is_active: true,
          merchants: { id: 'm-amz', name: 'Amazon UAE', slug: 'amazon-ae', is_active: true },
          price_history: [
            { id: 'h1', price: 1299, captured_at: '2026-08-15T00:00:00Z' },
            { id: 'h2', price: 1199, captured_at: '2026-09-19T00:00:00Z' },
          ],
        },
        {
          id: 'off-unapproved',
          product_id: 'prod-1',
          merchant_id: 'm-unapproved',
          country_code: 'ae',
          currency: 'AED',
          price: 999, // cheaper price from unapproved seller
          original_price: 1399,
          availability: 'in_stock',
          product_url: 'https://unapproved.com/deal',
          affiliate_url: null,
          last_checked_at: '2026-09-19T10:00:00Z',
          is_active: true,
          merchants: { id: 'm-unapproved', name: 'Unapproved Merchant', slug: 'unapproved-seller', is_active: true },
          price_history: [{ id: 'h3', price: 999, captured_at: '2026-09-19T00:00:00Z' }],
        },
      ],
    };

    const product = mapJoinedProduct(row, 'ae', activeRights);

    // Unapproved merchant must be excluded despite offering lower price (999)
    assert.equal(product.offersCount, 1);
    assert.equal(product.offers[0].merchantName, 'Amazon UAE');
    assert.equal(product.currentBestPrice, 1199);
    assert.equal(product.bestMerchantName, 'Amazon UAE');
    assert.equal(product.priceHistory.length, 2);
  });

  test('mapJoinedProduct accurately computes best price, discounts, and price stats', () => {
    const row = {
      id: 'prod-iphone',
      name: 'Apple iPhone 16 Pro Max 256GB',
      slug: 'apple-iphone-16-pro-max-256gb',
      offers: [
        {
          id: 'off-amz',
          product_id: 'prod-iphone',
          merchant_id: 'm-amz',
          country_code: 'ae',
          currency: 'AED',
          price: 5099,
          original_price: 5099,
          availability: 'in_stock',
          product_url: 'https://amazon.ae/dp/iphone16',
          affiliate_url: 'https://amazon.ae/dp/iphone16?tag=catchtheprice-21',
          last_checked_at: '2026-09-19T10:00:00Z',
          is_active: true,
          merchants: { id: 'm-amz', name: 'Amazon UAE', slug: 'amazon-ae', is_active: true },
          price_history: [
            { id: 'h1', price: 5099, captured_at: '2026-08-05T00:00:00Z' },
            { id: 'h2', price: 5099, captured_at: '2026-08-20T00:00:00Z' },
            { id: 'h3', price: 5099, captured_at: '2026-09-05T00:00:00Z' },
            { id: 'h4', price: 5099, captured_at: '2026-09-19T00:00:00Z' },
          ],
        },
        {
          id: 'off-noon',
          product_id: 'prod-iphone',
          merchant_id: 'm-noon',
          country_code: 'ae',
          currency: 'AED',
          price: 4949, // Noon is cheaper
          original_price: 5099,
          availability: 'in_stock',
          product_url: 'https://noon.com/uae-en/iphone16',
          affiliate_url: 'https://noon.com/uae-en/iphone16?utm_source=ctp',
          last_checked_at: '2026-09-19T10:00:00Z',
          is_active: true,
          merchants: { id: 'm-noon', name: 'Noon UAE', slug: 'noon-ae', is_active: true },
          price_history: [
            { id: 'h5', price: 5099, captured_at: '2026-08-05T00:00:00Z' },
            { id: 'h6', price: 5049, captured_at: '2026-08-20T00:00:00Z' },
            { id: 'h7', price: 4999, captured_at: '2026-09-05T00:00:00Z' },
            { id: 'h8', price: 4949, captured_at: '2026-09-19T00:00:00Z' },
          ],
        },
      ],
    };

    const product = mapJoinedProduct(row, 'ae', activeRights);

    assert.equal(product.offersCount, 2);
    assert.equal(product.currentBestPrice, 4949);
    assert.equal(product.bestMerchantName, 'Noon UAE');
    assert.equal(product.originalPrice, 5099);
    assert.equal(product.offers[0].isBestPrice, true);
    assert.equal(product.offers[1].isBestPrice, false);

    // Price history has 8 observations chronologically sorted
    assert.equal(product.priceHistory.length, 8);
    for (let i = 1; i < product.priceHistory.length; i++) {
      assert.ok(
        product.priceHistory[i].date >= product.priceHistory[i - 1].date,
        'Price history points must be in chronological order'
      );
    }

    // Price stats
    assert.equal(product.priceStats.lowestPrice, 4949);
    assert.equal(product.priceStats.highestPrice, 5099);
  });
});

describe('Live Supabase Catalog & Price History Verification', () => {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  test('Database contains 100 products with active offers and multi-point price history', async () => {
    if (!supabaseUrl || !serviceKey || serviceKey.length < 20) {
      console.log('Skipping live DB test: Supabase service key not configured.');
      return;
    }

    const supabase = createClient(supabaseUrl, serviceKey, {
      auth: { persistSession: false, autoRefreshToken: false },
    });

    // 1. Verify source rights records are active
    const { data: rights, error: rightsErr } = await supabase
      .from('source_rights')
      .select('*')
      .eq('status', 'ACTIVE');

    assert.equal(rightsErr, null, `Source rights query failed: ${rightsErr?.message}`);
    assert.ok(rights && rights.length >= 2, 'Expected at least 2 active source rights (Amazon & Noon)');
    const amazonRight = rights.find((r) => r.id === 'amazon-associates-ae');
    const noonRight = rights.find((r) => r.id === 'noon-affiliate-ae');
    assert.ok(amazonRight, 'Amazon UAE source right must exist');
    assert.ok(noonRight, 'Noon UAE source right must exist');
    assert.equal(canPublishSource(amazonRight), true);
    assert.equal(canPublishSource(noonRight), true);

    // 2. Fetch full relational product join (same query used by getCatalogProducts)
    const { data: products, error: prodErr } = await supabase
      .from('products')
      .select(`
        id,
        category_id,
        brand,
        name,
        slug,
        image_url,
        description,
        specs,
        status,
        categories ( id, name, slug ),
        offers (
          id,
          product_id,
          merchant_id,
          country_code,
          currency,
          price,
          original_price,
          availability,
          product_url,
          affiliate_url,
          last_checked_at,
          is_active,
          metadata,
          merchants (
            id,
            name,
            slug,
            logo_url,
            is_active,
            affiliate_network,
            affiliate_status
          ),
          price_history (
            id,
            price,
            original_price,
            availability,
            captured_at
          )
        )
      `)
      .eq('status', 'active');

    assert.equal(prodErr, null, `Product relational join query failed: ${prodErr?.message}`);
    assert.ok(products && products.length >= 100, `Expected 100 products, got ${products?.length}`);

    // 3. Map all products through governance filter
    const mapped = products.map((row) => mapJoinedProduct(row, 'ae', rights));

    let productsWithValidOffers = 0;
    let productsWithValidChart = 0;

    for (const p of mapped) {
      assert.ok(p.currentBestPrice > 0, `Product ${p.slug} must have currentBestPrice > 0, got ${p.currentBestPrice}`);
      assert.ok(p.offersCount >= 1, `Product ${p.slug} must have active offers, got ${p.offersCount}`);
      assert.ok(p.priceHistory.length >= 2, `Product ${p.slug} must have >= 2 price points for chart, got ${p.priceHistory.length}`);
      assert.equal(p.currency, 'AED');

      if (p.offersCount >= 2) productsWithValidOffers++;
      if (p.priceHistory.length >= 4) productsWithValidChart++;
    }

    assert.equal(
      productsWithValidOffers,
      100,
      `All 100 products should have competitive multi-merchant offers (Amazon & Noon)`
    );
    assert.equal(
      productsWithValidChart,
      100,
      `All 100 products should have multi-observation price history for charting`
    );

    // 4. Verify iPhone 16 Pro Max detail query
    const iphone = mapped.find((p) => p.slug === 'apple-iphone-16-pro-max-256gb');
    assert.ok(iphone, 'iPhone 16 Pro Max must exist in catalog');
    assert.equal(iphone.offers.length, 2, 'iPhone must have 2 offers (Amazon and Noon)');
    assert.ok(iphone.priceStats.lowestPrice > 0, 'Lowest price must be positive');
    assert.ok(iphone.priceStats.highestPrice >= iphone.priceStats.lowestPrice, 'Highest >= Lowest');
    assert.equal(iphone.priceHistory.length, 8, 'iPhone must have 8 historical observations (4 per merchant)');
  });
});
