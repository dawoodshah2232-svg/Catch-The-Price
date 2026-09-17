import { createClient } from '@supabase/supabase-js';
import fs from 'node:fs';
import path from 'node:path';

// Load .env.local if present without external dependencies
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

console.log('\n=== CatchThePrice Development User Bootstrap ===\n');

if (!supabaseUrl || !serviceRoleKey) {
  console.log('⚠️  Supabase URL or SUPABASE_SERVICE_ROLE_KEY is missing in your environment.');
  console.log('To run this bootstrap script, ensure .env.local contains:');
  console.log('  NEXT_PUBLIC_SUPABASE_URL=https://<your-project>.supabase.co');
  console.log('  SUPABASE_SERVICE_ROLE_KEY=<your-service-role-key>\n');
  console.log('For local mock/development testing without live Supabase, UI forms display graceful connection guidance.');
  process.exit(0);
}

const supabase = createClient(supabaseUrl, serviceRoleKey, {
  auth: { autoRefreshToken: false, persistSession: false },
});

const defaultDevUsers = [
  {
    email: 'testuser@catchtheprice.com',
    password: process.env.DEV_TEST_USER_PASSWORD || 'CatchThePriceTest2026!',
    role: 'customer',
    fullName: 'Test Shopper',
  },
  {
    email: 'admin@catchtheprice.com',
    password: process.env.DEV_ADMIN_PASSWORD || 'CatchThePriceAdmin2026!',
    role: 'admin',
    fullName: 'CatchThePrice Administrator',
  },
];

async function bootstrap() {
  for (const devUser of defaultDevUsers) {
    console.log(`Checking user: ${devUser.email}...`);

    const { data: listData, error: listError } = await supabase.auth.admin.listUsers();
    if (listError) {
      console.error('Error listing users:', listError.message);
      process.exit(1);
    }

    const existing = listData.users.find((u) => u.email?.toLowerCase() === devUser.email.toLowerCase());

    if (existing) {
      console.log(`✓ User ${devUser.email} already exists (ID: ${existing.id}).`);
      // Ensure email confirmed
      if (!existing.email_confirmed_at) {
        await supabase.auth.admin.updateUserById(existing.id, { email_confirm: true });
        console.log(`  ✓ Confirmed email for ${devUser.email}.`);
      }
    } else {
      const { data: created, error: createError } = await supabase.auth.admin.createUser({
        email: devUser.email,
        password: devUser.password,
        email_confirm: true,
        user_metadata: {
          full_name: devUser.fullName,
          preferred_country: 'ae',
          preferred_currency: 'AED',
        },
      });

      if (createError) {
        console.error(`  ✗ Failed to create user ${devUser.email}:`, createError.message);
      } else {
        console.log(`  ✓ Successfully created ${devUser.email} (ID: ${created.user?.id}).`);
      }
    }
  }

  console.log('\nBootstrap check completed successfully.\n');
}

bootstrap().catch((err) => {
  console.error('Bootstrap failed:', err);
  process.exit(1);
});
