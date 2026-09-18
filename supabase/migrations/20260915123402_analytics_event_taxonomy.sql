-- Expand analytics events taxonomy to support the full shopping intelligence lifecycle:
-- product_view, search, compare, save_product, create_alert, affiliate_click, retailer_click, deal_view, guide_view
alter table public.analytics_events drop constraint if exists analytics_events_event_type_check;

alter table public.analytics_events add constraint analytics_events_event_type_check check (
  event_type in (
    'page_view',
    'search',
    'product_view',
    'save',
    'save_product',
    'alert_intent',
    'create_alert',
    'compare',
    'affiliate_click',
    'retailer_click',
    'deal_view',
    'guide_view'
  )
);
