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

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceRoleKey) {
  console.error('Missing Supabase credentials');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, serviceRoleKey);

function slugify(text) {
  return text
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 90);
}

export async function ingestBatch(batchNumber) {
  const batchIndex = batchNumber - 1;
  const startIdx = batchIndex * 20;
  const endIdx = startIdx + 20;

  const allResearch = JSON.parse(fs.readFileSync('data/catalog/uae-100-research.json', 'utf8'));
  const batch = allResearch.slice(startIdx, endIdx);

  if (!batch.length) {
    console.error(`No items found for Batch ${batchNumber}`);
    return;
  }

  // Fetch category map
  const { data: categories } = await supabase.from('categories').select('id,slug');
  const catMap = new Map((categories || []).map(c => [c.slug, c.id]));

  console.log(`Ingesting Batch ${batchNumber} (items ${startIdx + 1} to ${endIdx})...`);

  const inserted = [];
  for (const item of batch) {
    const slug = slugify(item.name);
    const categoryId = catMap.get(item.category) || null;

    const row = {
      name: item.name,
      slug,
      brand: item.brand,
      category_id: categoryId,
      image_url: item.imageUrl,
      description: item.sourceDescription || item.sourceTitle || item.name,
      specs: {
        Brand: item.brand,
        Category: item.category,
        OfficialSource: item.source,
        MarketPriority: 'Amazon UAE & Noon UAE',
      },
      status: 'active',
      updated_at: new Date().toISOString(),
    };

    const { data, error } = await supabase
      .from('products')
      .upsert(row, { onConflict: 'slug' })
      .select('id,name,slug,category_id,status');

    if (error) {
      console.error(`Error inserting ${item.name}:`, error.message);
    } else {
      inserted.push(data[0]);
    }
  }

  console.log(`Batch ${batchNumber} completed. Ingested ${inserted.length} canonical products.`);
  return inserted;
}

const batchArg = parseInt(process.argv[2] || '1', 10);
ingestBatch(batchArg);
