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

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(supabaseUrl, serviceRoleKey);

async function testJoinedSeededData() {
  const JOINED_SELECT = `
    id,
    category_id,
    brand,
    name,
    slug,
    image_url,
    description,
    specs,
    status,
    categories ( id, name, slug ),
    offers (
      id,
      product_id,
      merchant_id,
      country_code,
      currency,
      price,
      original_price,
      availability,
      product_url,
      affiliate_url,
      last_checked_at,
      is_active,
      metadata,
      merchants (
        id,
        name,
        slug,
        logo_url,
        is_active,
        affiliate_network,
        affiliate_status
      ),
      price_history (
        id,
        price,
        original_price,
        availability,
        captured_at
      )
    )
  `;

  const { data, error } = await supabase
    .from('products')
    .select(JOINED_SELECT)
    .eq('slug', 'apple-iphone-16-pro-max-256gb')
    .single();

  if (error) {
    console.error('Error querying joined product:', error);
    process.exit(1);
  }

  console.log('✓ Product fetched:', data.name);
  console.log('✓ Offers count:', data.offers?.length);
  for (const o of data.offers || []) {
    console.log(`  - ${o.merchants?.name}: AED ${o.price} (original: AED ${o.original_price}), history points: ${o.price_history?.length}`);
  }
}

testJoinedSeededData();
