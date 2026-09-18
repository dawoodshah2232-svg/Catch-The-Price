-- Noon UAE affiliate configuration. This does not create product data or enable ingestion.
-- Campaign URLs remain server-side environment variables only.

insert into public.merchants
  (name, slug, logo_url, website_url, country_code, is_active, affiliate_network, affiliate_status)
values
  ('Noon UAE', 'noon-ae', '/images/merchants/noon.svg', 'https://www.noon.com', 'ae', true, 'NOON_AFFILIATE', 'ACTIVE')
on conflict (slug) do update
set
  name = excluded.name,
  website_url = excluded.website_url,
  country_code = excluded.country_code,
  affiliate_network = excluded.affiliate_network,
  affiliate_status = excluded.affiliate_status,
  updated_at = now();

insert into public.retailer_integrations
  (provider, retailer_slug, country_code, affiliate_network, status, credential_env_keys, config, enabled)
values
  (
    'noon_affiliate',
    'noon-ae',
    'ae',
    'NOON_AFFILIATE',
    'AFFILIATE_ACTIVE_PENDING_PRODUCT_DATA',
    array['NOON_AFFILIATE_TRACKING_URL', 'NOON_AFFILIATE_SECONDARY_TRACKING_URL'],
    '{
      "campaign":"Everyday",
      "productIngestion":"DISABLED_PENDING_OFFICIAL_API_OR_FEED",
      "primaryTrackingEnv":"NOON_AFFILIATE_TRACKING_URL",
      "secondaryTrackingEnv":"NOON_AFFILIATE_SECONDARY_TRACKING_URL",
      "commissionRates":{"apparel":10,"bags_luggage":10,"footwear":10,"jewelry":10,"stationery_office":9,"eyewear":9,"watches":9,"books_media":9,"sports_outdoor":8,"hair_personal_care":8,"automotive":8,"cosmetics":8,"fragrance":8,"health_nutrition":8,"toys":8,"baby":8,"electronic_personal_care":8,"small_appliances":8,"furniture":6,"kitchen_dining":6,"home_improvement":6,"home_decor":6,"bath_bedding":6,"grocery":5,"large_appliances":5,"laptop_accessories":4,"mobile_accessories":4,"gaming_accessories":4,"audio_video":3,"headphones":3,"wearables":3,"cameras":3,"laptops":3,"gaming_consoles":3,"mobiles":2}
    }'::jsonb,
    true
  )
on conflict (provider) do update
set
  retailer_slug = excluded.retailer_slug,
  country_code = excluded.country_code,
  affiliate_network = excluded.affiliate_network,
  status = excluded.status,
  credential_env_keys = excluded.credential_env_keys,
  config = excluded.config,
  enabled = excluded.enabled,
  updated_at = now();

insert into public.source_rights (id, retailer, market, status, notes)
values
  ('noon-affiliate-ae', 'Noon UAE Affiliate', 'ae', 'PENDING', 'Everyday affiliate campaign is active. Product ingestion remains disabled until an official Noon API or product feed and publication rights are recorded.')
on conflict (id) do update
set retailer = excluded.retailer,
    market = excluded.market,
    notes = excluded.notes;
