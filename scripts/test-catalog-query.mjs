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
    .select('id,category_id,brand,name,slug,image_url,description,specs,status')
    .eq('status', 'active')
    .limit(250);

  if (productError) {
    console.error('Product error:', productError.message);
    return;
  }

  const categoryIds = [...new Set(productData.map((row) => row.category_id).filter(Boolean))];
  const { data: categoryData } = await supabase.from('categories').select('id,name,slug').in('id', categoryIds);
  const categoryMap = new Map((categoryData || []).map((c) => [c.id, c]));

  console.log(`Verified ${productData.length} active canonical products in Supabase.`);
  console.log(`Categories mapped: ${categoryMap.size}`);
  console.log('Sample item:', {
    name: productData[0].name,
    slug: productData[0].slug,
    category: categoryMap.get(productData[0].category_id)?.name,
    hasImage: Boolean(productData[0].image_url),
  });
}

testLive();
