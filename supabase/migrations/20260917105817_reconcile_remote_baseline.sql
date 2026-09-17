-- Forward-only reconciliation of the pre-existing production schema.
-- This migration only adds compatible objects and data-preserving metadata.

-- Existing profiles use user_id; retain it and add the id shape used by the app.
alter table public.profiles add column if not exists id uuid;
alter table public.profiles add column if not exists email text;
alter table public.profiles add column if not exists avatar_url text;
alter table public.profiles add column if not exists preferred_country text not null default 'ae';
alter table public.profiles add column if not exists email_verified boolean not null default false;
alter table public.profiles add column if not exists role text not null default 'customer';
update public.profiles set id = user_id where id is null;
create unique index if not exists profiles_id_key on public.profiles(id);
alter table public.profiles enable row level security;

-- The remote taxonomy predates the current event lifecycle. Replacing this
-- check is metadata-only and preserves all existing analytics rows.
alter table public.analytics_events drop constraint if exists analytics_events_event_type_check;
alter table public.analytics_events add constraint analytics_events_event_type_check check (
  event_type in ('page_view','search','product_view','save','save_product','alert_intent','create_alert','compare','affiliate_click','retailer_click','deal_view','guide_view')
);

create table if not exists public.brands (
  id uuid primary key default gen_random_uuid(), name text not null unique, slug text not null unique,
  logo_url text, description text, is_active boolean not null default true,
  created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
create table if not exists public.product_variants (
  id uuid primary key default gen_random_uuid(), product_id uuid not null references public.products(id) on delete cascade,
  sku text, variant_name text not null, color text, storage text, size text, specs jsonb not null default '{}'::jsonb,
  is_active boolean not null default true, created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
create table if not exists public.product_identifiers (
  id uuid primary key default gen_random_uuid(), product_id uuid not null references public.products(id) on delete cascade,
  variant_id uuid references public.product_variants(id) on delete cascade,
  identifier_type text not null check (identifier_type in ('GTIN','EAN','UPC','MPN','SKU','ASIN')),
  value text not null, source text not null default 'manual', is_verified boolean not null default false,
  created_at timestamptz not null default now(), unique(identifier_type, value)
);
create table if not exists public.deals (
  id uuid primary key default gen_random_uuid(), product_id uuid not null references public.products(id) on delete cascade,
  offer_id uuid not null references public.offers(id) on delete cascade, country_code text not null check (country_code in ('ae','us')),
  deal_score integer not null check (deal_score between 0 and 100), deal_type text not null default 'PRICE_DROP' check (deal_type in ('PRICE_DROP','HISTORICAL_LOW','CLEARANCE','SEASONAL')),
  original_price numeric not null, current_price numeric not null, discount_percent numeric not null, absolute_saving numeric not null,
  currency text not null, starts_at timestamptz not null default now(), expires_at timestamptz, is_active boolean not null default true,
  created_at timestamptz not null default now(), updated_at timestamptz not null default now(), unique(offer_id)
);
create table if not exists public.automation_jobs (
  id uuid primary key default gen_random_uuid(), name text not null unique,
  job_type text not null check (job_type in ('DISCOVER_PRODUCTS','INGEST_FEEDS','UPDATE_OFFERS','CHECK_PRICES','MATCH_PRODUCTS','DETECT_DEALS','GENERATE_CONTENT','REFRESH_SEO','SEND_ALERTS','SEND_DIGESTS','CHECK_AFFILIATE_LINKS','CHECK_FEED_HEALTH')),
  schedule_cron text, is_active boolean not null default true, config jsonb not null default '{}'::jsonb,
  last_run_at timestamptz, next_run_at timestamptz, created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
create table if not exists public.automation_runs (
  id uuid primary key default gen_random_uuid(), job_id uuid references public.automation_jobs(id) on delete set null,
  job_type text not null, status text not null default 'queued' check (status in ('queued','running','completed','failed','retrying')),
  items_processed integer not null default 0, items_failed integer not null default 0, retry_count integer not null default 0,
  started_at timestamptz, finished_at timestamptz, error_details text, run_log jsonb not null default '[]'::jsonb, created_at timestamptz not null default now()
);
create table if not exists public.human_review_queue (
  id uuid primary key default gen_random_uuid(), queue_type text not null check (queue_type in ('PRODUCT_MATCH_REVIEW','DATA_QUALITY','CONTENT_REVIEW','AUTOMATION_FAILURES')),
  reference_id text, reference_type text, title text not null, payload jsonb not null default '{}'::jsonb,
  confidence numeric check (confidence is null or confidence between 0 and 100), priority text not null default 'medium' check (priority in ('low','medium','high','critical')),
  status text not null default 'PENDING' check (status in ('PENDING','ASSIGNED','RESOLVED','DISMISSED')),
  assigned_to uuid references auth.users(id) on delete set null, resolution_notes text, resolved_at timestamptz,
  created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
create table if not exists public.audit_logs (
  id uuid primary key default gen_random_uuid(), user_id uuid references auth.users(id) on delete set null,
  user_email text, action text not null, resource_type text not null, resource_id text, details jsonb not null default '{}'::jsonb,
  ip_address text, created_at timestamptz not null default now()
);

create table if not exists public.user_settings (
  user_id uuid primary key references public.profiles(id) on delete cascade,
  notify_price_drops boolean not null default true, notify_target_reached boolean not null default true,
  notify_weekly_digest boolean not null default true, notify_deals boolean not null default true, marketing_emails boolean not null default false,
  preferred_market text not null default 'ae' check (preferred_market in ('ae','us')),
  preferred_currency text not null default 'AED' check (preferred_currency in ('AED','USD')), updated_at timestamptz not null default now()
);
create table if not exists public.saved_products (
  id uuid primary key default gen_random_uuid(), user_id uuid not null references auth.users(id) on delete cascade,
  product_id uuid not null references public.products(id) on delete cascade, country_code text not null default 'ae' check (country_code in ('ae','us')),
  notes text, created_at timestamptz not null default now(), unique(user_id, product_id, country_code)
);
create table if not exists public.price_alerts (
  id uuid primary key default gen_random_uuid(), user_id uuid not null references auth.users(id) on delete cascade,
  product_id uuid not null references public.products(id) on delete cascade, country_code text not null default 'ae' check (country_code in ('ae','us')),
  target_price numeric not null check (target_price > 0), initial_price numeric check (initial_price is null or initial_price > 0),
  alert_type text not null default 'below_amount' check (alert_type in ('below_amount','any_drop','historical_low','percent_drop')),
  percent_threshold numeric check (percent_threshold is null or (percent_threshold > 0 and percent_threshold <= 100)), is_active boolean not null default true,
  notify_email text, triggered_at timestamptz, last_notified_at timestamptz, created_at timestamptz not null default now(), updated_at timestamptz not null default now(),
  unique(user_id, product_id, country_code, alert_type)
);
create table if not exists public.notifications (
  id uuid primary key default gen_random_uuid(), user_id uuid not null references auth.users(id) on delete cascade,
  type text not null check (type in ('PRICE_TARGET_REACHED','PRICE_DROP','HISTORICAL_LOW','BACK_IN_STOCK','DEAL_DETECTED','SYSTEM')),
  title text not null, message text not null, link_url text, product_id uuid references public.products(id) on delete set null,
  data jsonb not null default '{}'::jsonb, is_read boolean not null default false, read_at timestamptz, created_at timestamptz not null default now()
);
create table if not exists public.recently_viewed (
  id uuid primary key default gen_random_uuid(), user_id uuid not null references auth.users(id) on delete cascade,
  product_id uuid not null references public.products(id) on delete cascade, country_code text not null default 'ae' check (country_code in ('ae','us')),
  viewed_at timestamptz not null default now(), unique(user_id, product_id, country_code)
);

create index if not exists brands_slug_idx on public.brands(slug);
create index if not exists product_variants_product_idx on public.product_variants(product_id);
create index if not exists product_identifiers_lookup_idx on public.product_identifiers(identifier_type, value);
create index if not exists product_identifiers_product_idx on public.product_identifiers(product_id);
create index if not exists deals_score_country_idx on public.deals(country_code, deal_score desc, is_active);
create index if not exists deals_product_idx on public.deals(product_id);
create index if not exists automation_runs_status_idx on public.automation_runs(status, created_at desc);
create index if not exists automation_runs_job_idx on public.automation_runs(job_id, created_at desc);
create index if not exists human_review_status_priority_idx on public.human_review_queue(queue_type, status, priority);
create index if not exists audit_logs_created_idx on public.audit_logs(created_at desc);
create index if not exists audit_logs_resource_idx on public.audit_logs(resource_type, resource_id);
create index if not exists saved_products_user_country_idx on public.saved_products(user_id, country_code);
create index if not exists saved_products_product_idx on public.saved_products(product_id);
create index if not exists price_alerts_user_active_idx on public.price_alerts(user_id, is_active);
create index if not exists price_alerts_product_country_idx on public.price_alerts(product_id, country_code, is_active);
create index if not exists notifications_user_unread_idx on public.notifications(user_id, is_read, created_at desc);
create index if not exists recently_viewed_user_idx on public.recently_viewed(user_id, country_code, viewed_at desc);

alter table public.brands enable row level security;
alter table public.product_variants enable row level security;
alter table public.product_identifiers enable row level security;
alter table public.deals enable row level security;
alter table public.automation_jobs enable row level security;
alter table public.automation_runs enable row level security;
alter table public.human_review_queue enable row level security;
alter table public.audit_logs enable row level security;
alter table public.user_settings enable row level security;
alter table public.saved_products enable row level security;
alter table public.price_alerts enable row level security;
alter table public.notifications enable row level security;
alter table public.recently_viewed enable row level security;
revoke all on public.automation_jobs, public.automation_runs, public.human_review_queue, public.audit_logs from anon, authenticated;
grant select, insert, update on public.user_settings to authenticated;
grant select, insert, delete on public.saved_products to authenticated;
grant select, insert, update, delete on public.price_alerts to authenticated;
grant select, update, delete on public.notifications to authenticated;
grant select, insert, update, delete on public.recently_viewed to authenticated;

do $$
declare item record;
begin
  for item in select * from (values
    ('brands','Public read brands','select','is_active = true',null),
    ('product_variants','Public read variants','select','is_active = true',null),
    ('product_identifiers','Public read identifiers','select','true',null),
    ('deals','Public read active deals','select','is_active = true',null),
    ('user_settings','Users can view own settings','select','auth.uid() = user_id',null),
    ('user_settings','Users can update own settings','update','auth.uid() = user_id','auth.uid() = user_id'),
    ('user_settings','Users can insert own settings','insert',null,'auth.uid() = user_id'),
    ('saved_products','Users can view own saved products','select','auth.uid() = user_id',null),
    ('saved_products','Users can save products','insert',null,'auth.uid() = user_id'),
    ('saved_products','Users can delete own saved products','delete','auth.uid() = user_id',null),
    ('price_alerts','Users can view own price alerts','select','auth.uid() = user_id',null),
    ('price_alerts','Users can insert own price alerts','insert',null,'auth.uid() = user_id'),
    ('price_alerts','Users can update own price alerts','update','auth.uid() = user_id','auth.uid() = user_id'),
    ('price_alerts','Users can delete own price alerts','delete','auth.uid() = user_id',null),
    ('notifications','Users can view own notifications','select','auth.uid() = user_id',null),
    ('notifications','Users can update own notifications','update','auth.uid() = user_id','auth.uid() = user_id'),
    ('notifications','Users can delete own notifications','delete','auth.uid() = user_id',null),
    ('recently_viewed','Users can view own recently viewed items','select','auth.uid() = user_id',null),
    ('recently_viewed','Users can insert own recently viewed items','insert',null,'auth.uid() = user_id'),
    ('recently_viewed','Users can update own recently viewed items','update','auth.uid() = user_id','auth.uid() = user_id'),
    ('recently_viewed','Users can delete own recently viewed items','delete','auth.uid() = user_id',null)
  ) as p(table_name, policy_name, command, using_expr, check_expr)
  loop
    if not exists (select 1 from pg_policies where schemaname='public' and tablename=item.table_name and policyname=item.policy_name) then
      execute format('create policy %I on public.%I for %s to %s %s %s', item.policy_name, item.table_name, item.command, case when item.table_name in ('brands','product_variants','product_identifiers','deals') then 'anon, authenticated' else 'authenticated' end, case when item.using_expr is null then '' else 'using (' || item.using_expr || ')' end, case when item.check_expr is null then '' else 'with check (' || item.check_expr || ')' end);
      if item.table_name in ('brands','product_variants','product_identifiers','deals') then
        execute format('grant select on public.%I to anon, authenticated', item.table_name);
      end if;
    end if;
  end loop;
end $$;

create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
declare pref_country text;
begin
  pref_country := case when coalesce(new.raw_user_meta_data->>'preferred_country','ae') in ('ae','us') then coalesce(new.raw_user_meta_data->>'preferred_country','ae') else 'ae' end;
  insert into public.profiles (id, user_id, email, display_name, avatar_url, preferred_country, preferred_currency, email_verified)
  values (new.id, new.id, new.email, coalesce(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'display_name', split_part(new.email,'@',1)), new.raw_user_meta_data->>'avatar_url', pref_country, case when pref_country='us' then 'USD' else 'AED' end, new.email_confirmed_at is not null)
  on conflict (user_id) do update set id=excluded.id, email=excluded.email, updated_at=now();
  insert into public.user_settings (user_id, preferred_market, preferred_currency)
  values (new.id, pref_country, case when pref_country='us' then 'USD' else 'AED' end)
  on conflict (user_id) do nothing;
  return new;
end;
$$;
revoke execute on function public.handle_new_user() from public;
do $$ begin
  if not exists (select 1 from pg_trigger where tgname='on_auth_user_created' and tgrelid='auth.users'::regclass) then
    create trigger on_auth_user_created after insert on auth.users for each row execute function public.handle_new_user();
  end if;
end $$;
