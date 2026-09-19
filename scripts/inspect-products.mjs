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

async function checkProducts() {
  const { data: products } = await supabase.from('products').select('id, name, slug, brand, category_id, specs').order('name');
  const { data: categories } = await supabase.from('categories').select('id, slug, name');
  const catMap = new Map((categories || []).map(c => [c.id, c.slug]));
  
  const summary = products.map(p => ({
    id: p.id,
    name: p.name,
    slug: p.slug,
    brand: p.brand,
    category: catMap.get(p.category_id) || 'unknown'
  }));

  fs.mkdirSync('scratch', { recursive: true });
  fs.writeFileSync('scratch/all-products.json', JSON.stringify(summary, null, 2));
  console.log(`Saved ${summary.length} products to scratch/all-products.json`);
}

checkProducts();
