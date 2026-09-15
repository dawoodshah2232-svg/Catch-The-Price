-- Production ingestion staging tables/columns. Applied on 2026-09-15.
create table if not exists public.ingestion_items (
  id uuid primary key default gen_random_uuid(),
  source_id uuid not null references public.ingestion_sources(id) on delete cascade,
  run_id uuid not null references public.ingestion_runs(id) on delete cascade,
  source_product_id text not null,
  raw_title text not null,
  normalized_title text not null,
  brand text,
  category_slug text,
  price numeric not null,
  currency text not null,
  product_url text not null,
  in_stock boolean not null default true,
  shipping_info text,
  raw_payload jsonb not null default '{}'::jsonb,
  match_status text not null default 'pending' check (match_status in ('pending','auto_matched','review','approved','rejected')),
  product_id uuid references public.products(id) on delete set null,
  confidence numeric,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(run_id, source_product_id)
);

alter table public.ingestion_items enable row level security;
create index if not exists ingestion_items_source_status_idx on public.ingestion_items(source_id, match_status);
create index if not exists ingestion_items_run_idx on public.ingestion_items(run_id);
create index if not exists ingestion_items_product_idx on public.ingestion_items(product_id);

alter table public.ingestion_runs add column if not exists items_staged integer not null default 0;
alter table public.ingestion_runs add column if not exists items_rejected integer not null default 0;
