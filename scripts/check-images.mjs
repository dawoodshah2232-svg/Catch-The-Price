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

async function checkImages() {
  const { data: products } = await supabase.from('products').select('id, name, slug, brand, image_url, category_id').order('name');
  
  const images = new Map();
  const domains = new Map();
  const duplicates = [];

  for (const p of products) {
    if (!p.image_url) {
      console.log(`MISSING IMAGE: ${p.name}`);
      continue;
    }
    if (images.has(p.image_url)) {
      duplicates.push({ name: p.name, other: images.get(p.image_url), url: p.image_url });
    } else {
      images.set(p.image_url, p.name);
    }
    try {
      const u = new URL(p.image_url);
      domains.set(u.hostname, (domains.get(u.hostname) || 0) + 1);
    } catch (e) {
      console.log(`INVALID URL for ${p.name}: ${p.image_url}`);
    }
  }

  console.log('Total products:', products.length);
  console.log('Unique images:', images.size);
  console.log('Duplicate image occurrences:', duplicates.length);
  if (duplicates.length > 0) {
    console.log('Sample duplicates:', duplicates.slice(0, 10));
  }
  console.log('Domains breakdown:', Object.fromEntries(domains.entries()));
}

checkImages();
