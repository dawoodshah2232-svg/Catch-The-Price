# CatchThePrice Metrics Dictionary

This file defines the first-party product/commerce metrics used by CatchThePrice. Numbers shown in the admin portal must come from persisted production events or database state. Do not substitute demo values, estimates or invented activity.

## Event sources

### `analytics_events`
Privacy-safe first-party events collected only after optional analytics consent is granted.

Supported event types:
- `page_view` — one route view for a consented browser session.
- `search` — a deliberate product search with query and result count.
- `product_view` — a product detail route view.
- `save` — a product save/unsave interaction when instrumented.
- `alert_intent` — a price-alert interaction when instrumented.

Important fields:
- `country_code` — launch market (`ae` or `us`).
- `path` — first-party route only.
- `referrer_host` — normalized host, never full referring URL.
- `device_type` — coarse device classification.
- `session_id` — browser-session UUID, not a user identity.
- `search_query` — normalized search text for `search` events.
- `product_slug` — product route identifier where relevant.
- `metadata.result_count` — deterministic result count for searches.
- `metadata.zero_result` — true only when result count equals zero.

### `outbound_clicks`
Validated retailer hand-offs. The destination is resolved server-side from a live offer; the browser cannot supply an arbitrary redirect URL.

### Catalog/account tables
Operational counts such as active products, active offers, saved products, watchlists and alert events come directly from the relevant Supabase tables.

## Core admin metrics

| Metric | Definition | Source |
|---|---|---|
| Page views | Count of consented `page_view` events | `analytics_events` |
| Sessions | Distinct non-null `session_id` values over the selected period | `analytics_events` |
| Product views | Count of `product_view` events | `analytics_events` |
| Searches | Count of `search` events | `analytics_events` |
| Zero-result searches | Searches where `metadata.zero_result = true` | `analytics_events` |
| Zero-result rate | Zero-result searches ÷ total searches | Derived |
| Retailer clicks | Count of validated outbound hand-offs | `outbound_clicks` |
| Retailer CTR | Retailer clicks ÷ product views for the same reporting window, only when both datasets are available | Derived |
| Active products | Products with production status `active` | `products` |
| Active offers | Offers with `is_active = true` and otherwise valid for public display | `offers` |
| Active price alerts | Active watchlists whose alert type is not plain `saved` | `watchlists` |
| Queued alert events | Alert events without `sent_at` | `alert_events` |
| Delivered alert events | Alert events with non-null `sent_at` | `alert_events` |
| Pending ingestion review | Staged ingestion items whose review status is pending | `ingestion_items` |

## Traffic dimensions

Allowed dimensions:
- market (`ae`, `us`)
- route/path
- coarse device type
- normalized referrer host
- product slug
- search query
- event date/time

Do not build admin views around full IP addresses, precise location, full referrer URLs or inferred personal identity.

## Reporting rules

1. Use exact persisted counts when available.
2. Label time windows explicitly (for example, last 7 days or last 30 days).
3. Never display projected revenue as actual revenue.
4. Never display affiliate commission until it is sourced from an approved affiliate platform or reconciled import.
5. Never infer a retailer click from a button render; count only validated outbound hand-offs.
6. Never infer a delivered alert from a queued event; delivery requires `sent_at` or provider-backed evidence.
7. Demo catalog mode must not contaminate production analytics or production admin totals.
8. Missing data renders as unavailable/zero as appropriate, never as fabricated sample activity.

## Privacy / consent behavior

- Essential local browser storage may be used for functional preferences such as selected market, appearance and saved-item state.
- First-party analytics is disabled until the shopper chooses to allow it through `ctp-privacy-v1`.
- Analytics preference can be changed from the Privacy Policy page.
- Advertising cookies are not enabled by the analytics preference and require their own appropriate integration if advertising is activated later.
