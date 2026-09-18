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

const requiredCategories = [
  { slug: 'phones', name: 'Phones', description: 'Smartphones & Mobile Devices' },
  { slug: 'laptops', name: 'Laptops', description: 'Notebooks, MacBooks & Ultrabooks' },
  { slug: 'tablets', name: 'Tablets', description: 'iPads & Android Tablets' },
  { slug: 'smartwatches', name: 'Smartwatches', description: 'Wearables & Fitness Trackers' },
  { slug: 'headphones', name: 'Headphones', description: 'Wireless Earbuds & Over-Ear Headphones' },
  { slug: 'gaming', name: 'Gaming', description: 'Gaming Consoles & Handhelds' },
  { slug: 'tvs', name: 'TVs', description: 'OLED, QLED & 4K Smart TVs' },
  { slug: 'monitors', name: 'Monitors', description: 'Computer Monitors & Displays' },
  { slug: 'computer-accessories', name: 'Computer Accessories', description: 'Mice, Keyboards & Peripherals' },
  { slug: 'chargers-power-banks', name: 'Chargers & Power Banks', description: 'Fast Chargers, Adapters & Power Banks' },
  { slug: 'storage', name: 'Storage', description: 'External SSDs, Flash Drives & Memory' },
  { slug: 'networking', name: 'Networking', description: 'Routers, Mesh Wi-Fi & Smart Networking' },
  { slug: 'cameras', name: 'Cameras', description: 'Digital Cameras, Action Cams & Drones' },
  { slug: 'home-electronics', name: 'Home Electronics', description: 'Smart Home Devices & Appliances' },
  { slug: 'pc-components', name: 'PC Components', description: 'Processors, Graphics Cards & Hardware' },
];

async function sync() {
  const { data: firstRow } = await supabase.from('categories').select('*').limit(1);
  console.log('Sample category row in DB:', firstRow);

  for (const cat of requiredCategories) {
    const { error } = await supabase.from('categories').upsert(cat, { onConflict: 'slug' });
    if (error) {
      console.error(`Failed to upsert category ${cat.slug}:`, error.message);
    }
  }
  const { data: allCats } = await supabase.from('categories').select('id,name,slug');
  console.log(`Synced ${allCats?.length} categories successfully:`, allCats?.map(c => c.slug).join(', '));
}

sync();
