import { afterEach, describe, test } from 'node:test';
import assert from 'node:assert/strict';
import { streamAdmitadXmlFeed } from '../../lib/ingestion/admitadXmlFeedAdapter.ts';
import { normalizeMerchantItem } from '../../lib/ingestion/normalizer.ts';

const originalFetch = global.fetch;

afterEach(() => {
  global.fetch = originalFetch;
});

function respond(xml) {
  global.fetch = async () => new Response(xml, { status: 200, headers: { 'content-type': 'application/xml' } });
}

describe('Admitad XML feed importer', () => {
  test('streams and normalizes qualified offers without retaining the XML document', async () => {
    respond(`<?xml version="1.0"?><yml_catalog><shop><offers>
      <offer id="abc-1" available="true"><url>https://ad.admitad.com/goto/abc</url><name>Canon Camera</name><vendor>Canon</vendor><price>2899.00</price><oldprice>3199.00</oldprice><currencyId>AED</currencyId><picture>https://images.example/canon.jpg</picture><description>Camera body</description></offer>
      <offer id="missing-image"><url>https://ad.admitad.com/goto/skip</url><name>Skip me</name><price>99</price><currencyId>AED</currencyId></offer>
    </offers></shop></yml_catalog>`);
    const items = [];
    for await (const item of streamAdmitadXmlFeed({ feedUrl: 'https://export.admitad.com/feed.xml', merchantSlug: 'canon-uae', merchantName: 'Canon UAE', currency: 'AED', requireImage: true })) items.push(item);

    assert.equal(items.length, 1);
    assert.equal(items[0].rawSku, 'abc-1');
    assert.equal(items[0].rawPrice, 2899);
    assert.equal(items[0].rawOriginalPrice, 3199);
    assert.equal(items[0].rawAffiliateUrl, 'https://ad.admitad.com/goto/abc');
    assert.equal(normalizeMerchantItem(items[0]).brand, 'Canon');
  });

  test('fails closed for malformed XML', async () => {
    respond('<offers><offer id="broken"><name>Bad');
    await assert.rejects(async () => {
      for await (const item of streamAdmitadXmlFeed({ feedUrl: 'https://export.admitad.com/feed.xml', merchantSlug: 'canon-uae', merchantName: 'Canon UAE', currency: 'AED' })) {
        assert.ok(item);
      }
    });
  });

  test('keeps the retailer external ID stable across a price update', async () => {
    const before = normalizeMerchantItem({ rawSku: 'canon-r5-001', rawTitle: 'Canon EOS R5', rawPrice: 9999, rawCurrency: 'AED', rawUrl: 'https://canon.ae/r5', inStock: true, merchantSlug: 'canon-uae', merchantName: 'Canon UAE' });
    const after = normalizeMerchantItem({ rawSku: 'canon-r5-001', rawTitle: 'Canon EOS R5', rawPrice: 8999, rawOriginalPrice: 9999, rawCurrency: 'AED', rawUrl: 'https://canon.ae/r5', inStock: true, merchantSlug: 'canon-uae', merchantName: 'Canon UAE' });

    assert.equal(before.sku, after.sku);
    assert.equal(after.price, 8999);
    assert.equal(after.originalPrice, 9999);
  });

  test('retries a transient feed failure before parsing', async () => {
    let calls = 0;
    global.fetch = async () => {
      calls += 1;
      return calls === 1
        ? new Response('', { status: 503 })
        : new Response('<offers><offer id="retry"><url>https://example.com/p</url><name>Retry item</name><price>1</price><currencyId>AED</currencyId><picture>https://example.com/i.jpg</picture></offer></offers>', { status: 200 });
    };
    const items = [];
    for await (const item of streamAdmitadXmlFeed({ feedUrl: 'https://export.admitad.com/feed.xml', merchantSlug: 'test', merchantName: 'Test', currency: 'AED' })) items.push(item);

    assert.equal(calls, 2);
    assert.equal(items.length, 1);
  });
});
