-- Forward-only retailer and affiliate foundation. No credentials are stored here.
-- Existing canonical products, merchants, offers, per-offer price history, and click
-- analytics are extended in place to preserve production data.

alter table public.merchants add column if not exists domain text;
alter table public.merchants add column if not exists affiliate_network text;
alter table public.merchants add column if not exists affiliate_status text not null default 'PENDING';

alter table public.offers add column if not exists previous_price numeric(14,2);
alter table public.offers add column if not exists source_type text not null default 'manual';
alter table public.offers add column if not exists source_updated_at timestamptz;
alter table public.offers add column if not exists metadata jsonb not null default '{}'::jsonb;

do $$
begin
  if not exists (select 1 from pg_constraint where conname = 'offers_previous_price_check') then
    alter table public.offers add constraint offers_previous_price_check
      check (previous_price is null or previous_price >= 0);
  end if;
  if not exists (select 1 from pg_constraint where conname = 'offers_source_type_check') then
    alter table public.offers add constraint offers_source_type_check
      check (source_type in ('official_api', 'approved_feed', 'affiliate_feed', 'manual'));
  end if;
  if not exists (select 1 from pg_constraint where conname = 'merchants_affiliate_status_check') then
    alter table public.merchants add constraint merchants_affiliate_status_check
      check (affiliate_status in ('ACTIVE', 'PENDING', 'DISABLED', 'REVOKED'));
  end if;
end $$;

create index if not exists offers_source_type_active_idx
  on public.offers(source_type, country_code, last_checked_at desc) where is_active = true;

-- This table holds only provider status and environment variable names. Secrets
-- remain in the server environment and this table is unavailable to browser roles.
create table if not exists public.retailer_integrations (
  id uuid primary key default gen_random_uuid(),
  provider text not null unique check (provider in ('amazon_associates', 'admitad', 'noon_affiliate', 'impact')),
  retailer_slug text not null,
  country_code text not null check (country_code in ('ae', 'us')),
  affiliate_network text not null,
  status text not null check (status in ('NOT_CONFIGURED', 'PENDING_FEED', 'AFFILIATE_ACTIVE_PENDING_PRODUCT_DATA', 'DISABLED', 'READY')),
  credential_env_keys text[] not null default '{}',
  config jsonb not null default '{}'::jsonb,
  enabled boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.retailer_integrations enable row level security;
revoke all on public.retailer_integrations from anon, authenticated;
create index if not exists retailer_integrations_status_idx on public.retailer_integrations(status, enabled);

do $$
begin
  if not exists (select 1 from pg_trigger where tgname = 'retailer_integrations_touch_updated_at' and tgrelid = 'public.retailer_integrations'::regclass) then
    create trigger retailer_integrations_touch_updated_at
      before update on public.retailer_integrations
      for each row execute function public.touch_updated_at();
  end if;
end $$;

insert into public.retailer_integrations
  (provider, retailer_slug, country_code, affiliate_network, status, credential_env_keys, config, enabled)
values
  ('amazon_associates', 'amazon-uae', 'ae', 'AMAZON_ASSOCIATES', 'NOT_CONFIGURED',
    array['AMAZON_ASSOCIATES_ACCESS_KEY','AMAZON_ASSOCIATES_SECRET_KEY','AMAZON_ASSOCIATES_PARTNER_TAG'],
    '{"approved_source":"official_api_or_feed_only"}'::jsonb, false),
  ('admitad', 'admitad', 'ae', 'ADMITAD', 'PENDING_FEED',
    array['ADMITAD_CLIENT_ID','ADMITAD_CLIENT_SECRET','ADMITAD_PRODUCT_FEED_URL'],
    '{"approved_source":"publisher_product_feed_only"}'::jsonb, false),
  ('noon_affiliate', 'noon-uae', 'ae', 'NOON_AFFILIATE', 'AFFILIATE_ACTIVE_PENDING_PRODUCT_DATA',
    array['NOON_AFFILIATE_FEED_URL','NOON_AFFILIATE_API_TOKEN'],
    '{"campaign":"Everyday"}'::jsonb, false),
  ('impact', 'impact', 'ae', 'IMPACT', 'DISABLED', array[]::text[], '{}'::jsonb, false)
on conflict (provider) do nothing;

insert into public.source_rights
  (id, retailer, market, status, notes)
values
  ('amazon-associates-ae', 'Amazon Associates UAE', 'ae', 'PENDING', 'Official Amazon API/feed access and publishing rights must be recorded before activation. No scraping.'),
  ('admitad-ae', 'Admitad', 'ae', 'PENDING', 'Publisher product-feed configuration and rights review pending.'),
  ('noon-affiliate-ae', 'Noon Affiliate', 'ae', 'PENDING', 'Everyday affiliate campaign is active; product-data publishing rights and feed configuration remain pending.'),
  ('impact-disabled', 'Impact', 'ae', 'DISABLED', 'Marketplace integration declined. Do not activate.')
on conflict (id) do nothing;

-- Extend privacy-minimized server-side handoff tracking. click_id is an anonymous,
-- short-lived attribution value; neither IP addresses nor full user agents are stored.
alter table public.outbound_clicks add column if not exists click_id text;
alter table public.outbound_clicks add column if not exists destination_type text not null default 'retailer';
alter table public.outbound_clicks add column if not exists affiliate_network text;

do $$
begin
  if not exists (select 1 from pg_constraint where conname = 'outbound_clicks_destination_type_check') then
    alter table public.outbound_clicks add constraint outbound_clicks_destination_type_check
      check (destination_type in ('retailer', 'affiliate'));
  end if;
end $$;

create index if not exists outbound_clicks_offer_created_idx
  on public.outbound_clicks(offer_id, created_at desc);
