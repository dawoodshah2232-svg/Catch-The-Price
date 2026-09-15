# CatchThePrice Master Execution Tracker

Source of truth: `CatchThePrice_Master_Implementation_Report-1.pdf` (15 Sep 2026).

Status values: `DONE`, `PARTIAL`, `MISSING`, `BLOCKED`, `DEFERRED`.

## P0 — launch-critical

| # | Task | Status | Current note |
|---|---|---|---|
| 01 | Remove fabricated public states | PARTIAL | Seeded demo alert removed; alert API now fails honestly. Seeded catalog/offers/history still remain and must be isolated from production. |
| 02 | Protect all admin operations | PARTIAL | Production admin is closed by default with `ADMIN_UI_ENABLED`; real Supabase-authenticated admin role checks still required. |
| 03 | Create source rights register | PARTIAL | Deny-by-default registry added at `lib/config/sourceRights.ts`; approvals/evidence still need to be recorded and persisted. |
| 04 | Replace arbitrary URL redirects | PARTIAL | `targetUrl` is no longer trusted. `/api/outbound` now resolves a UUID offer from Supabase, validates market, active state, HTTPS and merchant host. Affiliate policy and persisted click analytics still need the final tables/approval model. |
| 05 | Apply and verify access model | PARTIAL | Live Supabase inspected: all current public tables have RLS enabled. Public read policies are scoped; owner tables use auth ownership. `ingestion_sources`, `ingestion_runs`, `product_matches` have RLS with no client policies, so they are closed to anon/auth clients. Repo `supabase/schema.sql` is stale and must be reconciled with production before any migration. |
| 06 | Prepare canonical production environment | PARTIAL | Vercel works; catchtheprice.com cutover/rollback plan still required. |
| 07 | Canonical product/variant/offer identity | MISSING | Current frontend fixture model still mixes product and generated offers; live Supabase schema is closer to the target but contains no products/offers yet. |
| 08 | Prove one permitted source end-to-end | BLOCKED | Requires verified source permission/feed/API access. |
| 09 | Conflict-first matching + review | PARTIAL | Prototype exists; must be rebuilt around identifiers/variant constraints and real source data. |
| 10 | Two overlapping sources + curated inventory | BLOCKED | Requires source approvals. Target remains 80–120 curated variants with meaningful UAE/US coverage. |
| 11 | Freshness + genuine history | MISSING | Current frontend history is generated; live Supabase has a real `price_history` table but no observations yet. |
| 12 | Shared shopping UI foundation | PARTIAL | Brand exists; final light-surface/dark-nav design system still needs implementation. |
| 13 | Compact persistent mobile search | PARTIAL | Existing mobile header improved; final report spec still needs exact 48px brand row + 64px sticky search validation. |
| 14 | Replace oversized/aggressive cards | PARTIAL | Cards improved but still need report contract, real images and final 360/390/412/430 QA. |
| 15 | Accurate local discovery | PARTIAL | Search exists; ranking, exact variant handling, stable filters/pagination and query QA set required. |
| 16 | Complete product decision page | PARTIAL | PDP scaffold exists; genuine evidence, conditions, FAQ/methodology/related guides and truthful history required. |
| 17 | Minimum serious two-product compare | PARTIAL | Quick compare scaffold exists; aligned canonical specs/evidence and pair-page rules required. |
| 18 | Genuine saved persistence | PARTIAL | Device saves exist; live Supabase watchlists are authenticated-owner records. Account persistence/RLS/merge and honest scope messaging required. |
| 19 | Verified alert delivery | PARTIAL | False success removed. Public alert endpoint is intentionally unavailable until account-backed persistence, verification and delivery exist. |
| 20 | Useful authored content | MISSING | Guide/comparison templates and reviewed initial editorial set required. |
| 21 | Controlled AI draft preparation | MISSING | Opportunity queue, evidence/quality gates, cost/model tracking and human review required. |
| 22 | Replace simulated back-office activity | PARTIAL | Overview fake metrics removed; production admin closed. Other admin pages still need persisted records and real jobs. |
| 23 | Metric dictionary + real analytics | MISSING | Must connect consent-compatible analytics and server-resolved shopping events. Live DB does not yet have the final outbound analytics table. |
| 24 | Final homepage content rhythm | PARTIAL | Discovery modules added; final ordered light-surface composition and deduplication required. |
| 25 | Trust/policy pages | PARTIAL | Route audit and complete About/Contact/Privacy/Terms/Affiliate/Editorial/Data Sources/Methodology/cookie content required. |
| 26 | Eligible regional SEO + Search Console | PARTIAL | UAE/US indexing direction started; schema/canonicals/hreflang/sitemap/Search Console must be verified against real data. |
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

1. Finish task 01: isolate all fixture catalog/offers/history from production and show honest unavailable states.
2. Finish task 02: implement real Supabase admin authentication + server-side role enforcement.
3. Finish task 03: persist source-rights evidence and make all source activation deny-by-default.
4. Finish task 04: add policy-aware affiliate activation and a real outbound event table after approvals.
5. Finish task 05: reconcile checked-in schema/migrations with the live Supabase schema and add policy tests.
6. In parallel, implement task 12–14 design system/mobile foundation from the report; never reintroduce fake data to make screens look populated.

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
