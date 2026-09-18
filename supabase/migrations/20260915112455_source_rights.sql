-- Production source-rights registry. Applied to project jghpyvawgdfhfqmtiexb on 2026-09-15.
create table if not exists public.source_rights (
  id text primary key,
  retailer text not null,
  market text not null check (market in ('ae','us')),
  status text not null default 'PENDING' check (status in ('DISABLED','PENDING','ACTIVE','REVOKED')),
  approval_reference text,
  approved_at timestamptz,
  pricing_right boolean not null default false,
  image_right boolean not null default false,
  history_right boolean not null default false,
  affiliate_link_right boolean not null default false,
  ai_processing_right boolean not null default false,
  retention_notes text,
  notes text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.source_rights enable row level security;
create index if not exists source_rights_market_status_idx on public.source_rights(market,status);
