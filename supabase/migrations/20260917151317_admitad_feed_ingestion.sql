-- Admitad XML feed ingestion. Feed URLs and OAuth credentials remain server-side
-- environment variables; this migration stores only variable names and controls.

alter table public.ingestion_sources add column if not exists last_ingested_at timestamptz;
alter table public.ingestion_sources add column if not exists last_error_at timestamptz;
alter table public.ingestion_sources add column if not exists error_count integer not null default 0;

alter table public.ingestion_runs add column if not exists items_skipped integer not null default 0;

create index if not exists ingestion_sources_active_feed_idx
  on public.ingestion_sources(source_type, is_active, last_ingested_at asc nulls first);
create index if not exists ingestion_items_source_updated_idx
  on public.ingestion_items(source_id, updated_at desc);

-- Rights remain PENDING until the administrator records the exact Admitad approval
-- evidence and permitted uses. Feed sources start disabled and fail closed.
insert into public.source_rights (id, retailer, market, status, notes)
values
  ('admitad-aliexpress-ww-us', 'AliExpress WW via Admitad', 'us', 'PENDING', 'Approved product-feed program noted; record dated publication, image, history and affiliate-link permissions before activation.'),
  ('admitad-canon-uae', 'Canon UAE via Admitad', 'ae', 'PENDING', 'Camera AE product feed; record dated publication, image, history and affiliate-link permissions before activation.'),
  ('admitad-geekbuying-ww-us', 'Geekbuying WW via Admitad', 'us', 'PENDING', 'Main 2 product feed; record dated publication, image, history and affiliate-link permissions before activation.'),
  ('admitad-glasseslit-ww-us', 'Glasseslit WW via Admitad', 'us', 'PENDING', 'Main 2 product feed; record dated publication, image, history and affiliate-link permissions before activation.'),
  ('admitad-jumbo-ae', 'Jumbo AE via Admitad', 'ae', 'PENDING', 'Main product feed; record dated publication, image, history and affiliate-link permissions before activation.'),
  ('admitad-luxury-closet-ae', 'The Luxury Closet WW via Admitad', 'ae', 'PENDING', 'Products AED product feed; record dated publication, image, history and affiliate-link permissions before activation.')
on conflict (id) do nothing;

insert into public.ingestion_sources (name, source_type, country_code, base_url, config, is_active)
values
  ('Admitad AliExpress WW Under $10', 'affiliate_feed', 'us', 'https://www.aliexpress.com', '{"adapter":"admitad_xml","feedEnv":"ADMITAD_FEED_ALIEXPRESS_UNDER_10_URL","apiEnvKey":"ADMITAD_FEED_ALIEXPRESS_UNDER_10_URL","rightsId":"admitad-aliexpress-ww-us","merchantSlug":"aliexpress","merchantName":"AliExpress","currency":"USD","requireImage":true,"maxItemsPerRun":1000}'::jsonb, false),
  ('Admitad AliExpress WW $10–25', 'affiliate_feed', 'us', 'https://www.aliexpress.com', '{"adapter":"admitad_xml","feedEnv":"ADMITAD_FEED_ALIEXPRESS_10_25_URL","apiEnvKey":"ADMITAD_FEED_ALIEXPRESS_10_25_URL","rightsId":"admitad-aliexpress-ww-us","merchantSlug":"aliexpress","merchantName":"AliExpress","currency":"USD","requireImage":true,"maxItemsPerRun":1000}'::jsonb, false),
  ('Admitad AliExpress WW $25–40', 'affiliate_feed', 'us', 'https://www.aliexpress.com', '{"adapter":"admitad_xml","feedEnv":"ADMITAD_FEED_ALIEXPRESS_25_40_URL","apiEnvKey":"ADMITAD_FEED_ALIEXPRESS_25_40_URL","rightsId":"admitad-aliexpress-ww-us","merchantSlug":"aliexpress","merchantName":"AliExpress","currency":"USD","requireImage":true,"maxItemsPerRun":1000}'::jsonb, false),
  ('Admitad AliExpress WW $40–55', 'affiliate_feed', 'us', 'https://www.aliexpress.com', '{"adapter":"admitad_xml","feedEnv":"ADMITAD_FEED_ALIEXPRESS_40_55_URL","apiEnvKey":"ADMITAD_FEED_ALIEXPRESS_40_55_URL","rightsId":"admitad-aliexpress-ww-us","merchantSlug":"aliexpress","merchantName":"AliExpress","currency":"USD","requireImage":true,"maxItemsPerRun":1000}'::jsonb, false),
  ('Admitad AliExpress WW $55–70', 'affiliate_feed', 'us', 'https://www.aliexpress.com', '{"adapter":"admitad_xml","feedEnv":"ADMITAD_FEED_ALIEXPRESS_55_70_URL","apiEnvKey":"ADMITAD_FEED_ALIEXPRESS_55_70_URL","rightsId":"admitad-aliexpress-ww-us","merchantSlug":"aliexpress","merchantName":"AliExpress","currency":"USD","requireImage":true,"maxItemsPerRun":1000}'::jsonb, false),
  ('Admitad AliExpress WW $70–85', 'affiliate_feed', 'us', 'https://www.aliexpress.com', '{"adapter":"admitad_xml","feedEnv":"ADMITAD_FEED_ALIEXPRESS_70_85_URL","apiEnvKey":"ADMITAD_FEED_ALIEXPRESS_70_85_URL","rightsId":"admitad-aliexpress-ww-us","merchantSlug":"aliexpress","merchantName":"AliExpress","currency":"USD","requireImage":true,"maxItemsPerRun":1000}'::jsonb, false),
  ('Admitad AliExpress WW $85–100', 'affiliate_feed', 'us', 'https://www.aliexpress.com', '{"adapter":"admitad_xml","feedEnv":"ADMITAD_FEED_ALIEXPRESS_85_100_URL","apiEnvKey":"ADMITAD_FEED_ALIEXPRESS_85_100_URL","rightsId":"admitad-aliexpress-ww-us","merchantSlug":"aliexpress","merchantName":"AliExpress","currency":"USD","requireImage":true,"maxItemsPerRun":1000}'::jsonb, false),
  ('Admitad AliExpress WW Over $100', 'affiliate_feed', 'us', 'https://www.aliexpress.com', '{"adapter":"admitad_xml","feedEnv":"ADMITAD_FEED_ALIEXPRESS_OVER_100_URL","apiEnvKey":"ADMITAD_FEED_ALIEXPRESS_OVER_100_URL","rightsId":"admitad-aliexpress-ww-us","merchantSlug":"aliexpress","merchantName":"AliExpress","currency":"USD","requireImage":true,"maxItemsPerRun":1000}'::jsonb, false),
  ('Admitad AliExpress WW Hot Products', 'affiliate_feed', 'us', 'https://www.aliexpress.com', '{"adapter":"admitad_xml","feedEnv":"ADMITAD_FEED_ALIEXPRESS_HOT_PRODUCTS_URL","apiEnvKey":"ADMITAD_FEED_ALIEXPRESS_HOT_PRODUCTS_URL","rightsId":"admitad-aliexpress-ww-us","merchantSlug":"aliexpress","merchantName":"AliExpress","currency":"USD","requireImage":true,"maxItemsPerRun":1000}'::jsonb, false),
  ('Admitad Canon UAE Camera AE', 'affiliate_feed', 'ae', 'https://www.canon.ae', '{"adapter":"admitad_xml","feedEnv":"ADMITAD_FEED_CANON_UAE_CAMERA_URL","apiEnvKey":"ADMITAD_FEED_CANON_UAE_CAMERA_URL","rightsId":"admitad-canon-uae","merchantSlug":"canon-uae","merchantName":"Canon UAE","currency":"AED","requireImage":true,"maxItemsPerRun":1000}'::jsonb, false),
  ('Admitad Geekbuying WW Main 2', 'affiliate_feed', 'us', 'https://www.geekbuying.com', '{"adapter":"admitad_xml","feedEnv":"ADMITAD_FEED_GEEKBUYING_WW_MAIN_2_URL","apiEnvKey":"ADMITAD_FEED_GEEKBUYING_WW_MAIN_2_URL","rightsId":"admitad-geekbuying-ww-us","merchantSlug":"geekbuying","merchantName":"Geekbuying","currency":"USD","requireImage":true,"maxItemsPerRun":1000}'::jsonb, false),
  ('Admitad Glasseslit WW Main 2', 'affiliate_feed', 'us', 'https://www.glasseslit.com', '{"adapter":"admitad_xml","feedEnv":"ADMITAD_FEED_GLASSESLIT_WW_MAIN_2_URL","apiEnvKey":"ADMITAD_FEED_GLASSESLIT_WW_MAIN_2_URL","rightsId":"admitad-glasseslit-ww-us","merchantSlug":"glasseslit","merchantName":"Glasseslit","currency":"USD","requireImage":true,"maxItemsPerRun":1000}'::jsonb, false),
  ('Admitad Jumbo AE Main', 'affiliate_feed', 'ae', 'https://www.jumbo.ae', '{"adapter":"admitad_xml","feedEnv":"ADMITAD_FEED_JUMBO_AE_MAIN_URL","apiEnvKey":"ADMITAD_FEED_JUMBO_AE_MAIN_URL","rightsId":"admitad-jumbo-ae","merchantSlug":"jumbo-ae","merchantName":"Jumbo UAE","currency":"AED","requireImage":true,"maxItemsPerRun":1000}'::jsonb, false),
  ('Admitad The Luxury Closet Products AED', 'affiliate_feed', 'ae', 'https://theluxurycloset.com', '{"adapter":"admitad_xml","feedEnv":"ADMITAD_FEED_LUXURY_CLOSET_AED_URL","apiEnvKey":"ADMITAD_FEED_LUXURY_CLOSET_AED_URL","rightsId":"admitad-luxury-closet-ae","merchantSlug":"the-luxury-closet","merchantName":"The Luxury Closet","currency":"AED","requireImage":true,"maxItemsPerRun":1000}'::jsonb, false)
on conflict (name) do nothing;
