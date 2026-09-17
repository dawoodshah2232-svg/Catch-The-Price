-- CatchThePrice Migration: User Account & Retention Foundation
-- Applied on: 2026-09-17

-- 1. PROFILES TABLE (Linked with Supabase Auth)
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  display_name text,
  avatar_url text,
  preferred_country text not null default 'ae' check (preferred_country in ('ae', 'us')),
  preferred_currency text not null default 'AED' check (preferred_currency in ('AED', 'USD')),
  email_verified boolean not null default false,
  role text not null default 'customer' check (role in ('customer', 'admin', 'moderator')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

-- Profile RLS: users can only read and update their own profile; admins can read all
create policy "Users can view own profile"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Users can update own profile"
  on public.profiles for update
  using (auth.uid() = id);

create policy "Users can insert own profile"
  on public.profiles for insert
  with check (auth.uid() = id);

-- 2. USER SETTINGS TABLE
create table if not exists public.user_settings (
  user_id uuid primary key references public.profiles(id) on delete cascade,
  notify_price_drops boolean not null default true,
  notify_target_reached boolean not null default true,
  notify_weekly_digest boolean not null default true,
  notify_deals boolean not null default true,
  marketing_emails boolean not null default false,
  preferred_market text not null default 'ae' check (preferred_market in ('ae', 'us')),
  preferred_currency text not null default 'AED' check (preferred_currency in ('AED', 'USD')),
  updated_at timestamptz not null default now()
);

alter table public.user_settings enable row level security;

create policy "Users can view own settings"
  on public.user_settings for select
  using (auth.uid() = user_id);

create policy "Users can update own settings"
  on public.user_settings for update
  using (auth.uid() = user_id);

create policy "Users can insert own settings"
  on public.user_settings for insert
  with check (auth.uid() = user_id);

-- 3. SAVED PRODUCTS TABLE (Persistent Watchlist for Authenticated Users)
create table if not exists public.saved_products (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  product_id uuid not null references public.products(id) on delete cascade,
  country_code text not null default 'ae' check (country_code in ('ae', 'us')),
  notes text,
  created_at timestamptz not null default now(),
  unique(user_id, product_id, country_code)
);

alter table public.saved_products enable row level security;

create policy "Users can view own saved products"
  on public.saved_products for select
  using (auth.uid() = user_id);

create policy "Users can save products"
  on public.saved_products for insert
  with check (auth.uid() = user_id);

create policy "Users can delete own saved products"
  on public.saved_products for delete
  using (auth.uid() = user_id);

create index if not exists saved_products_user_country_idx on public.saved_products(user_id, country_code);
create index if not exists saved_products_product_idx on public.saved_products(product_id);

-- 4. PRICE ALERTS TABLE
create table if not exists public.price_alerts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  product_id uuid not null references public.products(id) on delete cascade,
  country_code text not null default 'ae' check (country_code in ('ae', 'us')),
  target_price numeric not null check (target_price > 0),
  initial_price numeric check (initial_price is null or initial_price > 0),
  alert_type text not null default 'below_amount' check (alert_type in ('below_amount', 'any_drop', 'historical_low', 'percent_drop')),
  percent_threshold numeric check (percent_threshold is null or (percent_threshold > 0 and percent_threshold <= 100)),
  is_active boolean not null default true,
  notify_email text,
  triggered_at timestamptz,
  last_notified_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(user_id, product_id, country_code, alert_type)
);

alter table public.price_alerts enable row level security;

create policy "Users can view own price alerts"
  on public.price_alerts for select
  using (auth.uid() = user_id);

create policy "Users can insert own price alerts"
  on public.price_alerts for insert
  with check (auth.uid() = user_id);

create policy "Users can update own price alerts"
  on public.price_alerts for update
  using (auth.uid() = user_id);

create policy "Users can delete own price alerts"
  on public.price_alerts for delete
  using (auth.uid() = user_id);

create index if not exists price_alerts_user_active_idx on public.price_alerts(user_id, is_active);
create index if not exists price_alerts_product_country_idx on public.price_alerts(product_id, country_code, is_active);

-- 5. NOTIFICATIONS TABLE
create table if not exists public.notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  type text not null check (type in ('PRICE_TARGET_REACHED', 'PRICE_DROP', 'HISTORICAL_LOW', 'BACK_IN_STOCK', 'DEAL_DETECTED', 'SYSTEM')),
  title text not null,
  message text not null,
  link_url text,
  product_id uuid references public.products(id) on delete set null,
  data jsonb not null default '{}'::jsonb,
  is_read boolean not null default false,
  read_at timestamptz,
  created_at timestamptz not null default now()
);

alter table public.notifications enable row level security;

create policy "Users can view own notifications"
  on public.notifications for select
  using (auth.uid() = user_id);

create policy "Users can update own notifications"
  on public.notifications for update
  using (auth.uid() = user_id);

create policy "Users can delete own notifications"
  on public.notifications for delete
  using (auth.uid() = user_id);

create index if not exists notifications_user_unread_idx on public.notifications(user_id, is_read, created_at desc);

-- 6. RECENTLY VIEWED TABLE (Server-Authoritative History with Limits)
create table if not exists public.recently_viewed (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  product_id uuid not null references public.products(id) on delete cascade,
  country_code text not null default 'ae' check (country_code in ('ae', 'us')),
  viewed_at timestamptz not null default now(),
  unique(user_id, product_id, country_code)
);

alter table public.recently_viewed enable row level security;

create policy "Users can view own recently viewed items"
  on public.recently_viewed for select
  using (auth.uid() = user_id);

create policy "Users can insert own recently viewed items"
  on public.recently_viewed for insert
  with check (auth.uid() = user_id);

create policy "Users can update own recently viewed items"
  on public.recently_viewed for update
  using (auth.uid() = user_id);

create policy "Users can delete own recently viewed items"
  on public.recently_viewed for delete
  using (auth.uid() = user_id);

create index if not exists recently_viewed_user_idx on public.recently_viewed(user_id, country_code, viewed_at desc);

-- 7. WATCHLISTS TABLE POLICIES REINFORCEMENT (Legacy/Shared compatibility)
-- Ensure watchlists table has strict RLS
do $$
begin
  if exists (select 1 from information_schema.tables where table_schema = 'public' and table_name = 'watchlists') then
    alter table public.watchlists enable row level security;
    
    drop policy if exists "Users can view own watchlists" on public.watchlists;
    create policy "Users can view own watchlists"
      on public.watchlists for select
      using (auth.uid() = user_id);

    drop policy if exists "Users can insert own watchlists" on public.watchlists;
    create policy "Users can insert own watchlists"
      on public.watchlists for insert
      with check (auth.uid() = user_id);

    drop policy if exists "Users can update own watchlists" on public.watchlists;
    create policy "Users can update own watchlists"
      on public.watchlists for update
      using (auth.uid() = user_id);

    drop policy if exists "Users can delete own watchlists" on public.watchlists;
    create policy "Users can delete own watchlists"
      on public.watchlists for delete
      using (auth.uid() = user_id);
  end if;
end $$;

-- 8. ALERT EVENTS RLS REINFORCEMENT
do $$
begin
  if exists (select 1 from information_schema.tables where table_schema = 'public' and table_name = 'alert_events') then
    alter table public.alert_events enable row level security;
    
    drop policy if exists "Users can view own alert events" on public.alert_events;
    create policy "Users can view own alert events"
      on public.alert_events for select
      using (auth.uid() = user_id);
  end if;
end $$;

-- 9. USER SIGNUP TRIGGER (Auto-create Profile and Settings)
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
declare
  raw_meta jsonb;
  pref_country text;
  pref_currency text;
  display_val text;
begin
  raw_meta := coalesce(new.raw_user_meta_data, '{}'::jsonb);
  pref_country := coalesce(raw_meta->>'preferred_country', 'ae');
  if pref_country not in ('ae', 'us') then
    pref_country := 'ae';
  end if;

  pref_currency := case when pref_country = 'us' then 'USD' else 'AED' end;
  display_val := coalesce(raw_meta->>'full_name', raw_meta->>'display_name', split_part(new.email, '@', 1));

  insert into public.profiles (id, email, display_name, avatar_url, preferred_country, preferred_currency, email_verified)
  values (
    new.id,
    new.email,
    display_val,
    raw_meta->>'avatar_url',
    pref_country,
    pref_currency,
    coalesce(new.email_confirmed_at is not null, false)
  )
  on conflict (id) do update set
    email = excluded.email,
    updated_at = now();

  insert into public.user_settings (user_id, preferred_market, preferred_currency)
  values (new.id, pref_country, pref_currency)
  on conflict (user_id) do nothing;

  return new;
end;
$$;

-- Trigger to hook into auth.users
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();
