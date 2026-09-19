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

async function checkUrl(url) {
  try {
    const res = await fetch(url, {
      method: 'GET',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
        'Range': 'bytes=0-100'
      }
    });
    return (res.ok || res.status === 206);
  } catch {
    return false;
  }
}

async function fetchNoonImage(query) {
  try {
    const url = 'https://www.noon.com/_svc/catalog/api/v3/u/search/?q=' + encodeURIComponent(query);
    const res = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
        'Accept': 'application/json',
        'X-Locale': 'en-ae',
        'X-Platform': 'web'
      }
    });
    if (!res.ok) return null;
    const data = await res.json();
    const hit = data.hits?.[0];
    if (hit?.image_key) {
      const imgUrl = `https://f.nooncdn.com/p/${hit.image_key}.jpg`;
      const ok = await checkUrl(imgUrl);
      if (ok) return imgUrl;
    }
  } catch (err) {
    console.error(`Error resolving Noon image for "${query}":`, err.message);
  }
  return null;
}

async function resolveAllImages() {
  const { data: products } = await supabase.from('products').select('id, name, slug, brand, image_url').order('name');
  console.log(`Starting image audit and resolution for ${products.length} products...`);

  let validCount = 0;
  let updatedCount = 0;
  const failed = [];

  for (const p of products) {
    let currentOk = false;
    if (p.image_url) {
      currentOk = await checkUrl(p.image_url);
    }

    if (currentOk) {
      validCount++;
      continue;
    }

    console.log(`Resolving replacement for [${p.name}] (previous failed: ${p.image_url})`);
    let newUrl = null;

    // Try Noon search for official UAE retailer image
    newUrl = await fetchNoonImage(p.name);
    
    // If not found, try searching with brand + model
    if (!newUrl && p.name.includes('(')) {
      const simplified = p.name.split('(')[0].trim();
      newUrl = await fetchNoonImage(simplified);
    }

    if (newUrl) {
      await supabase.from('products').update({ image_url: newUrl }).eq('id', p.id);
      console.log(`  -> SUCCESS: ${newUrl}`);
      updatedCount++;
      validCount++;
    } else {
      console.log(`  -> FAILED to resolve image for ${p.name}`);
      failed.push(p.name);
    }

    // Small delay to prevent rate limiting
    await new Promise(r => setTimeout(r, 200));
  }

  console.log(`\nAudit complete!`);
  console.log(`Valid 200 OK images: ${validCount} / ${products.length}`);
  console.log(`Updated images: ${updatedCount}`);
  if (failed.length > 0) {
    console.log(`Failed products (${failed.length}):`, failed);
  }
}

resolveAllImages();
