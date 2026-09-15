-- Privacy-safe traffic analytics. Applied on 2026-09-15.
create table if not exists public.analytics_events (
  id uuid primary key default gen_random_uuid(),
  event_type text not null check (event_type in ('page_view','search','product_view','save','alert_intent')),
  country_code text check (country_code in ('ae','us')),
  path text not null,
  referrer_host text,
  device_type text not null default 'unknown',
  session_id uuid,
  search_query text,
  product_slug text,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

alter table public.analytics_events enable row level security;
create index if not exists analytics_events_created_idx on public.analytics_events(created_at desc);
create index if not exists analytics_events_type_created_idx on public.analytics_events(event_type, created_at desc);
create index if not exists analytics_events_path_created_idx on public.analytics_events(path, created_at desc);
create index if not exists analytics_events_session_idx on public.analytics_events(session_id, created_at desc);
