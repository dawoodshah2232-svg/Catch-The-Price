-- CatchThePrice Migration: Base Catalog, Merchants & Offers Schema
-- Migration: 20260914_base_catalog_schema.sql

-- 1. CATEGORIES TABLE
create table if not exists public.categories (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  description text,
  icon text,
  created_at timestamptz not null default now()
);

alter table public.categories enable row level security;

create policy "Allow public read-only access to categories"
  on public.categories for select
  using (true);

-- 2. MERCHANTS TABLE
create table if not exists public.merchants (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  logo_url text,
  website_url text,
  country_code text not null default 'ae' check (country_code in ('ae', 'us')),
  is_active boolean not null default true,
  affiliate_network text,
  affiliate_tag text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.merchants enable row level security;

create policy "Allow public read-only access to active merchants"
  on public.merchants for select
  using (is_active = true);

-- 3. PRODUCTS TABLE (Canonical Catalog)
create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  category_id uuid references public.categories(id) on delete set null,
  brand text,
  name text not null,
  slug text not null unique,
  image_url text,
  description text,
  specs jsonb not null default '{}'::jsonb,
  gtin text,
  mpn text,
  status text not null default 'active' check (status in ('active', 'draft', 'archived')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.products enable row level security;

create policy "Allow public read-only access to active products"
  on public.products for select
  using (status = 'active');

create index if not exists products_slug_idx on public.products(slug);
create index if not exists products_category_idx on public.products(category_id);
create index if not exists products_brand_idx on public.products(brand);

-- 4. OFFERS TABLE (Retailer Listings)
create table if not exists public.offers (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products(id) on delete cascade,
  merchant_id uuid not null references public.merchants(id) on delete cascade,
  country_code text not null default 'ae' check (country_code in ('ae', 'us')),
  currency text not null default 'AED',
  price numeric not null check (price >= 0),
  original_price numeric check (original_price is null or original_price >= 0),
  availability text not null default 'in_stock' check (availability in ('in_stock', 'out_of_stock', 'preorder')),
  product_url text not null,
  affiliate_url text,
  last_checked_at timestamptz not null default now(),
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.offers enable row level security;

create policy "Allow public read-only access to active offers"
  on public.offers for select
  using (is_active = true);

create index if not exists offers_product_country_idx on public.offers(product_id, country_code);
create index if not exists offers_merchant_idx on public.offers(merchant_id);

-- 5. PRICE HISTORY TABLE
create table if not exists public.price_history (
  id uuid primary key default gen_random_uuid(),
  offer_id uuid not null references public.offers(id) on delete cascade,
  product_id uuid not null references public.products(id) on delete cascade,
  merchant_id uuid references public.merchants(id) on delete set null,
  price numeric not null check (price >= 0),
  currency text not null default 'AED',
  captured_at timestamptz not null default now()
);

alter table public.price_history enable row level security;

create policy "Allow public read-only access to price history"
  on public.price_history for select
  using (true);

create index if not exists price_history_offer_captured_idx on public.price_history(offer_id, captured_at desc);
create index if not exists price_history_product_captured_idx on public.price_history(product_id, captured_at desc);

-- 6. WATCHLISTS TABLE (Legacy & Real-time tracking)
create table if not exists public.watchlists (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  product_id uuid not null references public.products(id) on delete cascade,
  country_code text not null default 'ae' check (country_code in ('ae', 'us')),
  target_price numeric check (target_price is null or target_price > 0),
  alert_type text not null default 'saved' check (alert_type in ('saved', 'any_drop', 'below_amount', 'major_deal')),
  notify_email text,
  email_verified boolean not null default false,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(user_id, product_id, country_code)
);

alter table public.watchlists enable row level security;

create policy "Users can view own watchlists"
  on public.watchlists for select
  using (auth.uid() = user_id);

create policy "Users can insert own watchlists"
  on public.watchlists for insert
  with check (auth.uid() = user_id);

create policy "Users can update own watchlists"
  on public.watchlists for update
  using (auth.uid() = user_id);

create policy "Users can delete own watchlists"
  on public.watchlists for delete
  using (auth.uid() = user_id);

create index if not exists watchlists_user_country_idx on public.watchlists(user_id, country_code);

-- 7. ALERT EVENTS TABLE (Alert Delivery History)
create table if not exists public.alert_events (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  watchlist_id uuid references public.watchlists(id) on delete cascade,
  product_id uuid not null references public.products(id) on delete cascade,
  offer_id uuid references public.offers(id) on delete set null,
  alert_type text not null check (alert_type in ('price_drop', 'target_reached', 'deal_digest')),
  message text not null,
  sent_at timestamptz,
  created_at timestamptz not null default now()
);

alter table public.alert_events enable row level security;

create policy "Users can view own alert events"
  on public.alert_events for select
  using (auth.uid() = user_id);

create index if not exists alert_events_user_idx on public.alert_events(user_id, created_at desc);
create index if not exists alert_events_unsent_idx on public.alert_events(sent_at) where sent_at is null;
