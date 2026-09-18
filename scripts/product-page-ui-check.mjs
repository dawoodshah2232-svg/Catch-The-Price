// Run against an existing local server. PLAYWRIGHT_MODULE may point to a bundled runtime.
import { createRequire } from 'node:module';
import assert from 'node:assert/strict';
import { mkdir } from 'node:fs/promises';
const require = createRequire(import.meta.url);
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || 'playwright');
const browser = await chromium.launch({ channel: 'chrome', headless: true });
const page = await browser.newPage();
const errors = [];
page.on('pageerror', e => errors.push(e.message));
const origin = process.env.PRODUCT_QA_ORIGIN || 'http://localhost:3100';
await mkdir('screenshots', { recursive: true });
try {
  await page.goto(`${origin}/ae/product/apple-iphone-16-pro-max-256gb`, { waitUntil: 'networkidle' });
  assert.match(await page.locator('h1').innerText(), /iPhone 16 Pro Max/);
  const consent = page.getByRole('button', { name: 'Essential only', exact: true });
  if (await consent.isVisible()) await consent.click();
  for (const width of [1440, 1280, 768, 430, 390, 360]) {
    await page.setViewportSize({ width, height: 1000 });
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.screenshot({ path: `screenshots/product-approved-${width}.png` });
    assert(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1), `Page overflow at ${width}`);
    const cards = page.locator('#specs section > div.grid > div');
    assert.equal(await cards.count(), 6);
    const first = await cards.nth(0).boundingBox();
    const second = await cards.nth(1).boundingBox();
    assert(width >= 1024 ? second.x > first.x : second.y > first.y, `Spec layout at ${width}`);
    const history = await page.locator('#history').boundingBox();
    if (width >= 1024) assert(history.height <= 220, `History too tall: ${history.height}`);
    await page.locator('#specs').evaluate(el => window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 120, behavior: 'instant' }));
    await page.screenshot({ path: `screenshots/product-specs-${width}.png` });
    console.log(`PASS ${width}px: no overflow, responsive specs, history ${Math.round(history.height)}px`);
  }
  await page.setViewportSize({ width: 390, height: 844 });
  const gallery = page.locator('button[aria-label="Enlarge image"]');
  await gallery.click();
  const dialog = page.getByRole('dialog', { name: /image gallery/ });
  await dialog.waitFor();
  await dialog.getByRole('button', { name: 'Next image', exact: true }).click();
  assert.match(await dialog.innerText(), /2 \/ 8/);
  await page.keyboard.press('ArrowLeft');
  assert.match(await dialog.innerText(), /1 \/ 8/);
  await page.keyboard.press('ArrowLeft');
  assert.match(await dialog.innerText(), /8 \/ 8/);
  await dialog.getByRole('button', { name: 'View image 3', exact: true }).click();
  assert.equal(await dialog.getByRole('button', { name: 'View image 3', exact: true }).getAttribute('aria-pressed'), 'true');
  for (const theme of ['light', 'dark']) {
    await page.evaluate(t => document.documentElement.dataset.theme = t, theme);
    const colors = await dialog.getByRole('button', { name: 'Close fullscreen gallery' }).evaluate(el => ({ color: getComputedStyle(el).color, bg: getComputedStyle(el).backgroundColor, width: el.getBoundingClientRect().width }));
    assert.notEqual(colors.color, colors.bg);
    assert(colors.width >= 44);
    await page.screenshot({ path: `screenshots/product-lightbox-${theme}.png` });
  }
  await page.keyboard.press('Escape');
  assert.equal(await dialog.count(), 0);
  await page.evaluate(() => document.documentElement.dataset.theme = 'light');
  await page.getByRole('button', { name: 'Natural Titanium', exact: true }).click();
  assert.equal(await page.getByRole('button', { name: 'Natural Titanium', exact: true }).getAttribute('aria-pressed'), 'true');
  const canvas = gallery.locator('..').locator('..');
  await canvas.evaluate(el => {
    const touch = x => new Touch({ identifier: 1, target: el, clientX: x, clientY: 150 });
    el.dispatchEvent(new TouchEvent('touchstart', { bubbles: true, touches: [touch(240)] }));
    el.dispatchEvent(new TouchEvent('touchend', { bubbles: true, changedTouches: [touch(100)] }));
  });
  await gallery.click();
  assert.match(await dialog.innerText(), /5 \/ 8/);
  await dialog.getByRole('button', { name: 'Close fullscreen gallery' }).click();
  for (const name of ['Display', 'Platform & Chip', 'Camera', 'Battery & Power', 'Body & Build', 'Connectivity', 'All Specifications']) {
    const tab = page.locator('#specs').getByRole('button', { name, exact: true });
    await tab.click();
    assert.equal(await tab.getAttribute('aria-pressed'), 'true');
    assert.equal(await page.locator('#specs section > div.grid > div').count(), name === 'All Specifications' ? 6 : 1);
  }
  const save = page.getByRole('button', { name: 'Save product', exact: true }).first();
  await save.click();
  await page.getByRole('button', { name: 'Saved to watchlist', exact: true }).click();
  await page.getByRole('button', { name: 'Set Price Alert', exact: true }).first().click();
  assert(await page.locator('#price-alert-title').isVisible());
  await page.getByRole('dialog').getByRole('button', { name: 'Close', exact: true }).click();
  const faq = page.locator('details').filter({ hasText: 'Is the price history real?' });
  await faq.locator('summary').click();
  assert(await faq.evaluate(el => el.open));
  assert(await page.locator('#compare table').isVisible());
  const relatedHref = await page.locator('#compare a[href*="/product/"]').nth(1).getAttribute('href');
  assert(relatedHref?.startsWith('/ae/product/'));
  assert.equal((await page.request.get(`${origin}${relatedHref}`)).status(), 200);
  assert.equal(errors.length, 0, errors.join('\n'));
  console.log('PASS gallery navigation/wrap/keyboard/swipe/finish, lightbox contrast, all tabs, save toggle, alert opens; no runtime errors');
} finally { await browser.close(); }
