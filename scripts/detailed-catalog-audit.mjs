import { createClient } from '@supabase/supabase-js';
import fs from 'node:fs';
import path from 'node:path';

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

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function audit() {
  const { data: products } = await supabase
    .from('products')
    .select(`
      id, name, slug, brand, category_id, image_url, description, specs,
      categories ( id, name, slug ),
      offers (
        id, merchant_id, price, original_price, availability, product_url, affiliate_url,
        merchants ( name, slug )
      )
    `)
    .order('name');

  const { data: categories } = await supabase.from('categories').select('*');
  console.log('--- CATEGORIES IN DB ---');
  console.log(categories.map(c => `${c.slug}: ${c.name} (${c.id})`).join('\n'));

  console.log('\n--- AUDIT SUMMARY (100 PRODUCTS) ---');
  console.log('Total products:', products.length);

  let imageIssues = [];
  let specsIssues = [];
  let categoryIssues = [];
  let offerIssues = [];

  for (const p of products) {
    if (!p.image_url || !p.image_url.startsWith('https://')) {
      imageIssues.push({ name: p.name, img: p.image_url });
    }
    const specCount = Object.keys(p.specs || {}).length;
    if (specCount < 3) {
      specsIssues.push({ name: p.name, specCount, specs: p.specs });
    }
    if (!p.categories || !p.category_id) {
      categoryIssues.push({ name: p.name, cat: p.categories });
    }
    const offers = p.offers || [];
    if (offers.length < 2) {
      offerIssues.push({ name: p.name, offerCount: offers.length });
    }
  }

  console.log('Image issues count (<https:// or missing):', imageIssues.length);
  if (imageIssues.length > 0) console.log(imageIssues.slice(0, 5));

  console.log('Specs issues count (< 3 keys):', specsIssues.length);
  if (specsIssues.length > 0) console.log(specsIssues.slice(0, 5));

  console.log('Category issues count:', categoryIssues.length);
  if (categoryIssues.length > 0) console.log(categoryIssues.slice(0, 5));

  console.log('Offer issues count (< 2 offers):', offerIssues.length);
  if (offerIssues.length > 0) console.log(offerIssues.slice(0, 5));

  // Check sample offer URLs
  console.log('\n--- SAMPLE OFFERS FOR FIRST 3 PRODUCTS ---');
  for (const p of products.slice(0, 3)) {
    console.log(`\nProduct: ${p.name} (${p.slug})`);
    console.log(`Image: ${p.image_url?.slice(0, 80)}...`);
    console.log(`Category: ${p.categories?.name} (${p.categories?.slug})`);
    console.log(`Specs keys (${Object.keys(p.specs || {}).length}):`, Object.keys(p.specs || {}));
    for (const o of p.offers || []) {
      console.log(`  Merchant: ${o.merchants?.name}`);
      console.log(`  Price: ${o.price} AED (Original: ${o.original_price} AED)`);
      console.log(`  Product URL: ${o.product_url}`);
      console.log(`  Affiliate URL: ${o.affiliate_url}`);
    }
  }

  // Count products per category
  const catDistribution = {};
  for (const p of products) {
    const cName = p.categories?.name || 'Unassigned';
    catDistribution[cName] = (catDistribution[cName] || 0) + 1;
  }
  console.log('\n--- CATEGORY DISTRIBUTION ---');
  console.log(catDistribution);
}

audit();
