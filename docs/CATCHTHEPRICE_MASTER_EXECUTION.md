# CatchThePrice Master Execution Tracker

Source of truth: `CatchThePrice_Master_Implementation_Report-1.pdf` (15 Sep 2026).

Status values: `DONE`, `PARTIAL`, `MISSING`, `BLOCKED`, `DEFERRED`.

## P0 — launch-critical

| # | Task | Status | Current note |
|---|---|---|---|
| 01 | Remove fabricated public states | PARTIAL | Seeded demo alert removed; alert API fails honestly. Homepage and product routes now use `catalog.server.ts`: Vercel sample catalog is explicitly labelled + noindex, while the real production host reads live Supabase and shows honest unavailable states. Search/deals/price-drop routes still need migration away from direct fixture imports. |
| 02 | Protect all admin operations | PARTIAL | Production admin is closed by default with `ADMIN_UI_ENABLED`; real Supabase-authenticated admin role checks still required. |
| 03 | Create source rights register | PARTIAL | Deny-by-default registry added at `lib/config/sourceRights.ts`; approvals/evidence still need to be recorded and persisted. |
| 04 | Replace arbitrary URL redirects | PARTIAL | `targetUrl` is no longer trusted. `/api/outbound` resolves a UUID offer from Supabase, validates market, active state, HTTPS and merchant host. Product page links now send only offer ID + market. Affiliate policy and persisted click analytics still need the final tables/approval model. |
| 05 | Apply and verify access model | PARTIAL | Live Supabase inspected: all current public tables have RLS enabled. Public read policies are scoped; owner tables use auth ownership. `ingestion_sources`, `ingestion_runs`, `product_matches` have RLS with no client policies, so they are closed to anon/auth clients. Repo `supabase/schema.sql` is stale and must be reconciled with production before any migration. |
| 06 | Prepare canonical production environment | PARTIAL | Vercel works; catchtheprice.com cutover/rollback plan still required. |
| 07 | Canonical product/variant/offer identity | PARTIAL | New server catalog adapter reads real live products/offers/merchants/categories/history without inventing scores or history. Database still needs the full variant/evidence model and real rows. |
| 08 | Prove one permitted source end-to-end | BLOCKED | Requires verified source permission/feed/API access. |
| 09 | Conflict-first matching + review | PARTIAL | Prototype exists; must be rebuilt around identifiers/variant constraints and real source data. |
| 10 | Two overlapping sources + curated inventory | BLOCKED | Requires source approvals. Target remains 80–120 curated variants with meaningful UAE/US coverage. |
| 11 | Freshness + genuine history | PARTIAL | Product pages now show history only when real observations exist; otherwise they show an honest waiting state. Live Supabase has `price_history` but currently no observations. |
| 12 | Shared shopping UI foundation | PARTIAL | Brand exists; hybrid light-surface/dark-nav design system still needs implementation. |
| 13 | Compact persistent mobile search | PARTIAL | Implemented 48px mobile brand row that scrolls away and a separate 64px sticky search strip. Still needs device-width QA at 360/390/412/430 and keyboard testing. |
| 14 | Replace oversized/aggressive cards | PARTIAL | Cards now use 4:3 image wells, calmer CTA, 13–14px titles, ~17–18px prices and hide unvalidated Deal Score. Final multi-width QA and light-surface redesign remain. |
| 15 | Accurate local discovery | PARTIAL | Search exists; ranking, exact variant handling, stable filters/pagination and query QA set required. |
| 16 | Complete product decision page | PARTIAL | PDP now uses live-catalog adapter for production, removes arbitrary outbound parameters, hides unvalidated scores and fake history, and labels sample preview data. FAQ/methodology/related guides/conditions still required. |
| 17 | Minimum serious two-product compare | PARTIAL | Added `/[country]/compare` with a real two-product same-category comparison workspace using only available structured facts. Needs compare-add workflow from cards/PDP, evidence IDs and pair-page rules. |
| 18 | Genuine saved persistence | PARTIAL | Device saves exist; live Supabase watchlists are authenticated-owner records. Account persistence/RLS/merge and honest scope messaging required. |
| 19 | Verified alert delivery | PARTIAL | False success removed. Public alert endpoint is intentionally unavailable until account-backed persistence, verification and delivery exist. |
| 20 | Useful authored content | MISSING | Guide/comparison templates and reviewed initial editorial set required. |
| 21 | Controlled AI draft preparation | MISSING | Opportunity queue, evidence/quality gates, cost/model tracking and human review required. |
| 22 | Replace simulated back-office activity | PARTIAL | Overview fake metrics removed; production admin closed. Other admin pages still need persisted records and real jobs. |
| 23 | Metric dictionary + real analytics | MISSING | Must connect consent-compatible analytics and server-resolved shopping events. Live DB does not yet have the final outbound analytics table. |
| 24 | Final homepage content rhythm | PARTIAL | Discovery modules added; homepage now switches to honest catalog-unavailable state on real production when no eligible data exists. Final hybrid visual composition and deduplication remain. |
| 25 | Trust/policy pages | PARTIAL | Route audit and complete About/Contact/Privacy/Terms/Affiliate/Editorial/Data Sources/Methodology/cookie content required. |
| 26 | Eligible regional SEO + Search Console | PARTIAL | UAE/US indexing direction started; preview sample homepage/product pages are now noindex and product hreflang is limited to live markets. Sitemap/Search Console/schema still need real-data verification. |
| 27 | Full production-shaped QA | MISSING | Must run genuine-data mobile/accessibility/security/performance tests at all target widths. |
| 28 | Controlled production pilot/domain cutover | BLOCKED | Do after P0 gates and real source path are ready. |
| 29 | Activate approved affiliate links | BLOCKED | No affiliate parameters until actual program approval/evidence exists. |
| 30 | Apply for AdSense + measured slots | BLOCKED | Do only after real catalog/editorial/trust/mobile gates pass. |

## P1 — immediately after stable launch

| # | Task | Status |
|---|---|---|
| 31 | Four-product comparison + validated scoring | DEFERRED |
| 32 | Expand sources/content from observed demand | DEFERRED |
| 33 | Controlled experiments on UX/CTA/ad density | DEFERRED |

## P2/P3 — later

| # | Task | Status |
|---|---|---|
| 34 | Optional dark mode + transparent recommendations | DEFERRED |
| 35 | New categories/languages with complete schemas | DEFERRED |
| 36 | Canada/UK/Australia, sponsorships, native apps, compatibility | DEFERRED |

## Immediate execution order

1. Finish task 01: migrate search/deals/price-drop/account surfaces away from direct fixture reads; preview-only sample data must remain labelled + noindex.
2. Finish task 02: implement real Supabase admin authentication + server-side role enforcement.
3. Finish task 03: persist source-rights evidence and make all source activation deny-by-default.
4. Finish task 04: add policy-aware affiliate activation and a real outbound event table after approvals.
5. Finish task 05: reconcile checked-in schema/migrations with the live Supabase schema and add policy tests.
6. Continue task 12–14: hybrid shopping design system, mobile-width QA, image/logo QA and search keyboard behavior.
7. Continue task 17: wire Compare actions from product cards/PDP into the new comparison workspace.

## Verified production database facts (15 Sep 2026)

- `categories`: 6 rows.
- `products`, `offers`, `merchants`, `price_history`, `profiles`, `watchlists`, `alert_events`, `ingestion_sources`, `ingestion_runs`, `product_matches`, `seo_pages`: currently 0 rows.
- RLS is enabled on every listed public table.
- Public read is limited to categories, active merchants/offers/products, price history and indexable SEO pages.
- Profile/watchlist policies are owner-scoped to authenticated `auth.uid()`.
- `ingestion_sources`, `ingestion_runs` and `product_matches` have RLS enabled with no client policies, so browser roles cannot access them.
- The checked-in `supabase/schema.sql` does not match the live schema and must not be treated as an authoritative migration until reconciled.

## Launch rule

No public fabricated price, merchant destination, historical point, rating, saved activity, alert success, ingestion success, analytics number or revenue value may remain at launch. Missing/unknown data must render as unavailable rather than being generated.
