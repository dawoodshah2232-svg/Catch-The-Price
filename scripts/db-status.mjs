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
  console.log('No Supabase credentials found in .env.local');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, serviceRoleKey);

async function check() {
  const tables = ['categories', 'merchants', 'products', 'offers', 'retailer_integrations'];
  for (const t of tables) {
    const { data, count, error } = await supabase.from(t).select('*', { count: 'exact' });
    if (error) {
      console.log(`${t}: error - ${error.message}`);
    } else {
      console.log(`${t}: ${count} rows`);
      if (t === 'merchants' || t === 'categories') {
        console.log(data.map(d => ({ id: d.id, name: d.name, slug: d.slug })));
      }
    }
  }
}

check();
