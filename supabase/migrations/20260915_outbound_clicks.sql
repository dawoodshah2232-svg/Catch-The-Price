-- Privacy-safe retailer hand-off analytics. Table already exists in production; this file records the intended shape.
create table if not exists public.outbound_clicks (
  id uuid primary key default gen_random_uuid(),
  offer_id uuid not null references public.offers(id) on delete cascade,
  product_id uuid not null references public.products(id) on delete cascade,
  merchant_id uuid not null references public.merchants(id) on delete cascade,
  country_code text not null check (country_code in ('ae','us')),
  price numeric not null,
  currency text not null,
  referrer_host text,
  device_type text not null default 'unknown',
  created_at timestamptz not null default now()
);

alter table public.outbound_clicks enable row level security;
create index if not exists outbound_clicks_created_idx on public.outbound_clicks(created_at desc);
create index if not exists outbound_clicks_product_idx on public.outbound_clicks(product_id, created_at desc);
create index if not exists outbound_clicks_merchant_idx on public.outbound_clicks(merchant_id, created_at desc);
