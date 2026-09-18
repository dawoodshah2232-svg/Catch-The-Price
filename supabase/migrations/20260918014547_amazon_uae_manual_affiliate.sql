-- Amazon UAE manual affiliate configuration. Product/API ingestion remains disabled.
-- SiteStripe URLs are stored per offer in affiliate_url and resolved server-side.

insert into public.merchants
  (name, slug, logo_url, website_url, country_code, is_active, affiliate_network, affiliate_status)
values
  ('Amazon UAE', 'amazon-uae', '/images/merchants/amazon.svg', 'https://www.amazon.ae', 'ae', true, 'AMAZON_ASSOCIATES', 'ACTIVE')
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
    'amazon_associates',
    'amazon-uae',
    'ae',
    'AMAZON_ASSOCIATES',
    'PENDING_FEED',
    array['AMAZON_ASSOCIATES_PARTNER_TAG'],
    '{"manualAffiliate":"SiteStripe","trackingTagEnv":"AMAZON_ASSOCIATES_PARTNER_TAG","productIngestion":"DISABLED_PENDING_CREATORS_API"}'::jsonb,
    true
  )
on conflict (provider) do update
set
  retailer_slug = excluded.retailer_slug,
  country_code = excluded.country_code,
  affiliate_network = excluded.affiliate_network,
  status = excluded.status,
  credential_env_keys = excluded.credential_env_keys,
  config = retailer_integrations.config || excluded.config,
  enabled = excluded.enabled,
  updated_at = now();
