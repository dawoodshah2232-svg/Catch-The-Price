import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { createClient } from '@supabase/supabase-js';

// Load .env.local if present
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

describe('Authentication Journey & Session Protection Tests', () => {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

  function isAllowedAdminEmail(email, allowlistString) {
    if (!email) return false;
    const allowed = (allowlistString || '')
      .split(',')
      .map((e) => e.trim().toLowerCase())
      .filter(Boolean);
    return allowed.includes(email.trim().toLowerCase());
  }

  test('Admin allowlist correctly validates authorized operators and denies customers', () => {
    const allowlist = 'admin@catchtheprice.com,dawoodshah2232@gmail.com';

    // Authorized operators
    assert.equal(isAllowedAdminEmail('admin@catchtheprice.com', allowlist), true);
    assert.equal(isAllowedAdminEmail('ADMIN@CATCHTHEPRICE.COM', allowlist), true);
    assert.equal(isAllowedAdminEmail('dawoodshah2232@gmail.com', allowlist), true);

    // Regular customers or unauthorized users
    assert.equal(isAllowedAdminEmail('testuser@catchtheprice.com', allowlist), false);
    assert.equal(isAllowedAdminEmail('shopper@example.com', allowlist), false);
    assert.equal(isAllowedAdminEmail('', allowlist), false);
    assert.equal(isAllowedAdminEmail(null, allowlist), false);
  });

  test('Live Supabase Auth verifies customer credentials and sessions', async () => {
    if (!supabaseUrl || !anonKey) {
      console.log('Skipping live auth test: Supabase env vars not set.');
      return;
    }

    const supabase = createClient(supabaseUrl, anonKey, {
      auth: { persistSession: false },
    });

    const testEmail = 'testuser@catchtheprice.com';
    const testPassword = process.env.DEV_TEST_USER_PASSWORD || 'CatchThePriceTest2026!';

    const { data, error } = await supabase.auth.signInWithPassword({
      email: testEmail,
      password: testPassword,
    });

    assert.equal(error, null, `Sign-in error: ${error?.message}`);
    assert.ok(data.session, 'Session token should be present');
    assert.ok(data.user, 'User object should be present');
    assert.equal(data.user.email?.toLowerCase(), testEmail.toLowerCase());
    assert.ok(data.session.access_token.length > 20, 'Access token is valid JWT');
  });

  test('Live Supabase Auth verifies admin credentials and permissions', async () => {
    if (!supabaseUrl || !anonKey) {
      console.log('Skipping live admin auth test: Supabase env vars not set.');
      return;
    }

    const supabase = createClient(supabaseUrl, anonKey, {
      auth: { persistSession: false },
    });

    const adminEmail = 'admin@catchtheprice.com';
    const adminPassword = process.env.DEV_ADMIN_PASSWORD || 'CatchThePriceAdmin2026!';

    const { data, error } = await supabase.auth.signInWithPassword({
      email: adminEmail,
      password: adminPassword,
    });

    assert.equal(error, null, `Admin sign-in error: ${error?.message}`);
    assert.ok(data.session, 'Admin session token should be present');
    assert.equal(data.user.email?.toLowerCase(), adminEmail.toLowerCase());

    const allowlist = process.env.ADMIN_EMAILS || 'admin@catchtheprice.com';
    assert.equal(isAllowedAdminEmail(data.user.email, allowlist), true);
  });
});
