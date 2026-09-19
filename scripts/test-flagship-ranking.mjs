import { getProductPopularityRank } from '../lib/search/searchEngine.ts';
import fs from 'node:fs';
import path from 'node:path';
import { createClient } from '@supabase/supabase-js';

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

async function testRankings() {
  const { data: products } = await supabase.from('products').select('name, slug, brand, categories(slug)').eq('status', 'active');

  const mapped = products.map(p => ({
    title: p.name,
    slug: p.slug,
    brand: p.brand,
    categorySlug: p.categories?.slug,
    rank: getProductPopularityRank(p)
  })).sort((a, b) => b.rank - a.rank);

  console.log('--- TOP 10 APPLE PRODUCTS ---');
  const apple = mapped.filter(p => p.brand.toLowerCase() === 'apple').slice(0, 10);
  apple.forEach((p, idx) => console.log(`${idx + 1}. ${p.title} [Rank: ${p.rank}]`));

  console.log('\n--- TOP 10 SAMSUNG PRODUCTS ---');
  const samsung = mapped.filter(p => p.brand.toLowerCase() === 'samsung').slice(0, 10);
  samsung.forEach((p, idx) => console.log(`${idx + 1}. ${p.title} [Rank: ${p.rank}]`));

  console.log('\n--- TOP 10 GAMING PRODUCTS ---');
  const gaming = mapped.filter(p => p.categorySlug === 'gaming').slice(0, 10);
  gaming.forEach((p, idx) => console.log(`${idx + 1}. ${p.title} [Rank: ${p.rank}]`));

  console.log('\n--- TOP 10 PHONES ---');
  const phones = mapped.filter(p => p.categorySlug === 'phones').slice(0, 10);
  phones.forEach((p, idx) => console.log(`${idx + 1}. ${p.title} [Rank: ${p.rank}]`));
}

testRankings();
