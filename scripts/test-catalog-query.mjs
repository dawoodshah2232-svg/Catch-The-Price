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
const supabase = createClient(supabaseUrl, serviceRoleKey);

async function testLive() {
  const { data: productData, error: productError } = await supabase
    .from('products')
    .select(`
      id, category_id, brand, name, slug, image_url, description, specs, status,
      categories ( id, name, slug ),
      offers (
        id, product_id, merchant_id, country_code, currency, price, original_price, availability, product_url, affiliate_url, last_checked_at, is_active,
        merchants ( id, name, slug, logo_url, is_active ),
        price_history ( id, price, original_price, captured_at )
      )
    `)
    .eq('status', 'active')
    .limit(1);

  if (productError) {
    console.error('Join error:', productError);
  } else {
    console.log('Join with price_history inside offers success!', productData[0]);
  }
}

testLive();
