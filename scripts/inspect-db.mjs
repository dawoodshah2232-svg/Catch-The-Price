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

async function inspect() {
  const sr = await supabase.from('source_rights').select('*');
  console.log('--- SOURCE RIGHTS ---');
  console.log(JSON.stringify(sr.data, null, 2));

  const merch = await supabase.from('merchants').select('*');
  console.log('--- MERCHANTS ---');
  console.log(JSON.stringify(merch.data, null, 2));

  const intg = await supabase.from('retailer_integrations').select('*');
  console.log('--- RETAILER INTEGRATIONS ---');
  console.log(JSON.stringify(intg.data, null, 2));

  const tables = ['source_rights', 'merchants', 'offers', 'price_history'];
  for (const t of tables) {
    const { data } = await supabase.from(t).select('*').limit(1);
    console.log(`COLUMNS FOR ${t}:`, Object.keys(data?.[0] || {}));
  }
}

inspect();
