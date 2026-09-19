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

async function testAllImages() {
  const { data: products } = await supabase.from('products').select('id, name, slug, brand, image_url').order('name');
  console.log(`Testing ${products.length} product images for HTTP status...`);

  let okCount = 0;
  const failed = [];

  for (const p of products) {
    if (!p.image_url) {
      failed.push({ name: p.name, error: 'Missing image_url' });
      continue;
    }
    try {
      const res = await fetch(p.image_url, {
        method: 'HEAD',
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
          'Accept': 'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8'
        }
      });
      if (res.ok) {
        okCount++;
      } else if (res.status === 405 || res.status === 403) {
        // Some CDNs block HEAD, try GET with range or abort
        const getRes = await fetch(p.image_url, {
          method: 'GET',
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
            'Range': 'bytes=0-100'
          }
        });
        if (getRes.ok || getRes.status === 206) {
          okCount++;
        } else {
          failed.push({ name: p.name, status: getRes.status, url: p.image_url });
        }
      } else {
        failed.push({ name: p.name, status: res.status, url: p.image_url });
      }
    } catch (err) {
      failed.push({ name: p.name, error: err.message, url: p.image_url });
    }
  }

  console.log(`Image HTTP test complete: ${okCount} / ${products.length} OK.`);
  if (failed.length > 0) {
    console.log('Failed images:', JSON.stringify(failed, null, 2));
  }
}

testAllImages();
