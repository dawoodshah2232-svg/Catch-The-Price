insert into public.ingestion_sources (name, source_type, country_code, base_url, config, is_active)
values (
  'Best Buy Products API',
  'api',
  'us',
  'https://www.bestbuy.com',
  jsonb_build_object(
    'adapter','bestbuy',
    'rightsId','bestbuy-us',
    'merchantSlug','best-buy',
    'merchantName','Best Buy',
    'apiEnvKey','BESTBUY_API_KEY',
    'search','onlineAvailability=true',
    'pageSize',50,
    'maxPages',2
  ),
  true
)
on conflict (name) do update set
  source_type = excluded.source_type,
  country_code = excluded.country_code,
  base_url = excluded.base_url,
  config = excluded.config,
  is_active = excluded.is_active,
  updated_at = now();

-- This is configuration only. It does not grant rights or make the connector runnable.
-- public.source_rights('bestbuy-us') must independently become ACTIVE with real approval
-- evidence and the private BESTBUY_API_KEY must exist before ingestion can execute.
