-- CatchThePrice Migration: Product, Automation, Matching & Admin Foundation
-- Applied on: 2026-09-17

-- 1. BRANDS TABLE
create table if not exists public.brands (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  slug text not null unique,
  logo_url text,
  description text,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.brands enable row level security;
create policy "Public read brands" on public.brands for select using (is_active = true);
create index if not exists brands_slug_idx on public.brands(slug);

-- 2. PRODUCT VARIANTS TABLE
create table if not exists public.product_variants (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products(id) on delete cascade,
  sku text,
  variant_name text not null,
  color text,
  storage text,
  size text,
  specs jsonb not null default '{}'::jsonb,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.product_variants enable row level security;
create policy "Public read variants" on public.product_variants for select using (is_active = true);
create index if not exists product_variants_product_idx on public.product_variants(product_id);

-- 3. PRODUCT IDENTIFIERS TABLE (GTIN, EAN, UPC, MPN, SKU, ASIN)
create table if not exists public.product_identifiers (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products(id) on delete cascade,
  variant_id uuid references public.product_variants(id) on delete cascade,
  identifier_type text not null check (identifier_type in ('GTIN', 'EAN', 'UPC', 'MPN', 'SKU', 'ASIN')),
  value text not null,
  source text not null default 'manual',
  is_verified boolean not null default false,
  created_at timestamptz not null default now(),
  unique (identifier_type, value)
);

alter table public.product_identifiers enable row level security;
create policy "Public read identifiers" on public.product_identifiers for select using (true);
create index if not exists product_identifiers_lookup_idx on public.product_identifiers(identifier_type, value);
create index if not exists product_identifiers_product_idx on public.product_identifiers(product_id);

-- 4. DEALS TABLE (Scored & Verified Deals)
create table if not exists public.deals (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products(id) on delete cascade,
  offer_id uuid not null references public.offers(id) on delete cascade,
  country_code text not null check (country_code in ('ae', 'us')),
  deal_score integer not null check (deal_score >= 0 and deal_score <= 100),
  deal_type text not null default 'PRICE_DROP' check (deal_type in ('PRICE_DROP', 'HISTORICAL_LOW', 'CLEARANCE', 'SEASONAL')),
  original_price numeric not null,
  current_price numeric not null,
  discount_percent numeric not null,
  absolute_saving numeric not null,
  currency text not null,
  starts_at timestamptz not null default now(),
  expires_at timestamptz,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (offer_id)
);

alter table public.deals enable row level security;
create policy "Public read active deals" on public.deals for select using (is_active = true);
create index if not exists deals_score_country_idx on public.deals(country_code, deal_score desc, is_active);
create index if not exists deals_product_idx on public.deals(product_id);

-- 5. AUTOMATION JOBS TABLE
create table if not exists public.automation_jobs (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  job_type text not null check (job_type in (
    'DISCOVER_PRODUCTS',
    'INGEST_FEEDS',
    'UPDATE_OFFERS',
    'CHECK_PRICES',
    'MATCH_PRODUCTS',
    'DETECT_DEALS',
    'GENERATE_CONTENT',
    'REFRESH_SEO',
    'SEND_ALERTS',
    'SEND_DIGESTS',
    'CHECK_AFFILIATE_LINKS',
    'CHECK_FEED_HEALTH'
  )),
  schedule_cron text,
  is_active boolean not null default true,
  config jsonb not null default '{}'::jsonb,
  last_run_at timestamptz,
  next_run_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.automation_jobs enable row level security;
revoke all on public.automation_jobs from anon, authenticated;

-- 6. AUTOMATION RUNS TABLE
create table if not exists public.automation_runs (
  id uuid primary key default gen_random_uuid(),
  job_id uuid references public.automation_jobs(id) on delete set null,
  job_type text not null,
  status text not null default 'queued' check (status in ('queued', 'running', 'completed', 'failed', 'retrying')),
  items_processed integer not null default 0,
  items_failed integer not null default 0,
  retry_count integer not null default 0,
  started_at timestamptz,
  finished_at timestamptz,
  error_details text,
  run_log jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now()
);

alter table public.automation_runs enable row level security;
revoke all on public.automation_runs from anon, authenticated;
create index if not exists automation_runs_status_idx on public.automation_runs(status, created_at desc);
create index if not exists automation_runs_job_idx on public.automation_runs(job_id, created_at desc);

-- 7. HUMAN REVIEW / EXCEPTION QUEUE TABLE
create table if not exists public.human_review_queue (
  id uuid primary key default gen_random_uuid(),
  queue_type text not null check (queue_type in ('PRODUCT_MATCH_REVIEW', 'DATA_QUALITY', 'CONTENT_REVIEW', 'AUTOMATION_FAILURES')),
  reference_id text,
  reference_type text,
  title text not null,
  payload jsonb not null default '{}'::jsonb,
  confidence numeric check (confidence is null or (confidence >= 0 and confidence <= 100)),
  priority text not null default 'medium' check (priority in ('low', 'medium', 'high', 'critical')),
  status text not null default 'PENDING' check (status in ('PENDING', 'ASSIGNED', 'RESOLVED', 'DISMISSED')),
  assigned_to uuid references auth.users(id) on delete set null,
  resolution_notes text,
  resolved_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.human_review_queue enable row level security;
revoke all on public.human_review_queue from anon, authenticated;
create index if not exists human_review_status_priority_idx on public.human_review_queue(queue_type, status, priority);

-- 8. AUDIT LOGS TABLE
create table if not exists public.audit_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete set null,
  user_email text,
  action text not null,
  resource_type text not null,
  resource_id text,
  details jsonb not null default '{}'::jsonb,
  ip_address text,
  created_at timestamptz not null default now()
);

alter table public.audit_logs enable row level security;
revoke all on public.audit_logs from anon, authenticated;
create index if not exists audit_logs_created_idx on public.audit_logs(created_at desc);
create index if not exists audit_logs_resource_idx on public.audit_logs(resource_type, resource_id);
