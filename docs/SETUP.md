# CatchThePrice — Operator Setup & Configuration Guide

This guide walks through configuring and operating **CatchThePrice** (`catchtheprice.com`).

---

## 1. Environment Variables Configuration

Copy `.env.example` to `.env.local` for local development, or add the variables to your Vercel Project Settings for production.

```bash
cp .env.example .env.local
```

### Required Variable Reference

| Variable | Description | Where to Obtain |
| :--- | :--- | :--- |
| `NEXT_PUBLIC_SITE_URL` | Canonical URL of the site (`https://catchtheprice.com` in prod, `http://localhost:3000` in dev) | Project domain |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase Project API URL | Supabase Dashboard → Settings → API |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase Anonymous Client Key (Safe for browser) | Supabase Dashboard → Settings → API |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase Service Role Key (**NEVER EXPOSE TO CLIENT**) | Supabase Dashboard → Settings → API |
| `ADMIN_EMAILS` | Comma-separated list of admin email addresses allowed to access `/admin` | Your team emails |
| `CRON_SECRET` | Secret token to authenticate scheduled cron jobs | Generate a random 32+ char token |
| `ENABLE_DEMO_CATALOG` | Set to `true` to allow fallback to static demo catalog when DB is empty; set to `false` in live prod | Environment flag |
| `NEXT_PUBLIC_DEFAULT_COUNTRY` | Default localized market (`ae` or `us`) | Default: `ae` |
| `RESEND_API_KEY` | API Key for sending transactional emails (Price drop alerts, welcome emails) | Resend.com Dashboard → API Keys |
| `EMAIL_FROM` | Sender address for system emails (e.g., `CatchThePrice <alerts@catchtheprice.com>`) | Verified domain in Resend |

> [!CAUTION]
> **Never** prefix `SUPABASE_SERVICE_ROLE_KEY` with `NEXT_PUBLIC_`. It possesses administrative privileges that bypass Row Level Security.

---

## 2. Supabase Database & Migrations

CatchThePrice utilizes PostgreSQL with Row Level Security (RLS) managed via Supabase.

### Migration Order

Run the following SQL files in your Supabase SQL Editor or via the Supabase CLI in this exact order:

1. **User Account & Retention Foundation**  
   `supabase/migrations/20260917_user_account_retention.sql`  
   - Creates `profiles`, `user_settings`, `saved_products`, `price_alerts`, `notifications`, `recently_viewed`, and `watchlists`.
   - Attaches `handle_new_user()` trigger to automatically create profile and settings rows on Supabase Auth sign-up.
   - Enforces strict user-level RLS policies (`auth.uid() = user_id`).

2. **Automation, Matching & Back-Office Foundation**  
   `supabase/migrations/20260917_automation_matching_foundation.sql`  
   - Creates `brands`, `product_variants`, `product_identifiers`, `deals`, `automation_jobs`, `automation_runs`, `human_review_queue`, and `audit_logs`.
   - Enforces RLS with `revoke all from anon, authenticated` on back-office tables, restricting access to server-side service-role queries.

### Supabase Auth URL Configuration

In Supabase Dashboard → Authentication → URL Configuration:

- **Site URL**: `https://catchtheprice.com`
- **Redirect URLs**:
  - `https://catchtheprice.com/auth/callback`
  - `https://catchtheprice.com/**`
  - `http://localhost:3000/auth/callback` (for local dev)

---

## 3. Account Bootstrapping & Verification

To verify that your Supabase credentials are valid or to bootstrap initial test accounts:

```bash
node scripts/bootstrap-dev-user.mjs
```

This script:
1. Validates connection to your Supabase instance.
2. Checks for `testuser@catchtheprice.com` and `admin@catchtheprice.com`.
3. If not found, creates them with secure temporary credentials printed only to your local terminal.
4. Confirms that corresponding `profiles` and `user_settings` records are created via the database trigger.

---

## 4. Admin Access & Team Setup

1. Add your email address to `ADMIN_EMAILS` in your environment (e.g. `ADMIN_EMAILS=dawood@catchtheprice.com,admin@catchtheprice.com`).
2. Log into CatchThePrice via `/[country]/login`.
3. Navigate to `/admin` or `/admin-access`.
4. The system validates your session against `ADMIN_EMAILS` and grants access to:
   - `/admin/automation`: Manual triggers & execution history for all 12 automation jobs.
   - `/admin/review`: Human review exception queue for low-confidence matches, failed jobs, and merchant anomalies.
   - `/admin/deals`: Real-time deal scoring and discount analysis.
   - `/admin/system`: Connectivity health check and audit log viewer.
   - `/admin/analytics`: User search queries, click-through rates, and device metrics.
   - `/admin/matching`: Ingestion staging and identity resolution reviews.

---

## 5. Email Notifications Configuration

CatchThePrice includes a multi-provider email architecture located in `lib/email/`:

- **Production**: Configure `RESEND_API_KEY` and `EMAIL_FROM`. All price-drop alerts and welcome emails are dispatched via Resend.
- **Development / Unset**: If `RESEND_API_KEY` is not provided, the mailer safely logs notifications to the server console without throwing errors or dropping state.
- **Alert Dispatch Engine**: Background job `SEND_ALERTS` checks active price alerts against current retailer prices, identifies drops, logs alert events, and sends HTML emails formatted with mobile-responsive product cards.

---

## 6. Scheduled Automation & Cron Setup

The platform includes a secured background endpoint: `/api/cron/alerts`.

### Vercel Cron
Add a cron job configuration in `vercel.json` or configure external cron services (such as Cron-Job.org or GitHub Actions) to call:

```http
GET https://catchtheprice.com/api/cron/alerts
Authorization: Bearer <YOUR_CRON_SECRET>
```

Or trigger manual runs via the Admin UI at `/admin/automation` or the API:

```http
POST https://catchtheprice.com/api/admin/automation/run
Content-Type: application/json

{"jobType": "CHECK_PRICES"}
```

---

## 7. Production Release Verification Pipeline

Always run the 5-stage release verification suite before deploying:

```bash
# 1. Type verification (0 errors)
npm run typecheck

# 2. Code style & lint verification (0 errors, 0 warnings)
npm run lint

# 3. Next.js production build (Turbopack SSG + SSR)
npm run build

# 4. Release invariant audit (15/15 rules passed)
npm run audit:release

# 5. Local runtime smoke test (18/18 HTTP assertions passed)
npm run smoke
```
