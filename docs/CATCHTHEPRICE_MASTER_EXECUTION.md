# CatchThePrice Master Execution Tracker

Source of truth: `CatchThePrice_Master_Implementation_Report-1.pdf` (15 Sep 2026).

Status values: `DONE`, `PARTIAL`, `MISSING`, `BLOCKED`, `DEFERRED`.

## P0 — launch-critical

| # | Task | Status | Current note |
|---|---|---|---|
| 01 | Remove fabricated public states | DONE | Production catalog/search/deals/product routes now use live Supabase data and honest unavailable states. Demo fixture data is preview-only, labelled and excluded from the production sitemap. |
| 02 | Protect all admin operations | DONE | Admin layout and write APIs require a real Supabase session plus `ADMIN_EMAILS` allowlist. Public admin navigation is removed. |
| 03 | Create source rights register | DONE | Persisted `source_rights` table is now the production authority. Sources fail closed and cannot become publish-ready without dated approval evidence plus required rights. |
| 04 | Replace arbitrary URL redirects | DONE | `/api/outbound` accepts only offer ID + market, resolves the destination server-side, validates HTTPS/merchant host/active state, and records privacy-safe outbound analytics. |
| 05 | Apply and verify access model | PARTIAL | RLS is enabled on production tables and operational tables have no browser write path. New migrations are tracked under `supabase/migrations/`; the original monolithic `supabase/schema.sql` still needs formal reconciliation/deprecation. |
| 06 | Prepare canonical production environment | PARTIAL | Vercel hosting works and the app is production-shaped. `catchtheprice.com` DNS/canonical cutover and rollback procedure remain. Current Vercel deploys are temporarily blocked by the account build-rate quota, but GitHub work continues. |
| 07 | Canonical product/variant/offer identity | PARTIAL | Ingestion captures GTIN/EAN/UPC, MPN, model, source SKU and image evidence. Human-approved canonical product creation/assignment plus safe offer publishing is implemented; full variant schema and genuine-source validation remain. |
| 08 | Prove one permitted source end-to-end | BLOCKED | Rights-gated JSON feed runner plus a Best Buy API connector now work through FETCH → RIGHTS → NORMALIZE → STAGE → REVIEW → PUBLISH. Completing the proof requires one actually approved feed/API and source credentials. |
| 09 | Conflict-first matching + review | PARTIAL | Admin has an auditable human review desk: assign an existing exact product, create a new draft canonical product, reject, then publish only after rights/image/destination checks. Automatic identifier-first suggestions still need genuine source data for validation. |
| 10 | Two overlapping sources + curated inventory | BLOCKED | Requires real source approvals. Target remains 80–120 curated variants with meaningful UAE/US coverage. |
| 11 | Freshness + genuine history | PARTIAL | History is shown only from recorded observations; approved publishing records an initial price observation only when history rights permit it. Recurring observations begin after a permitted live source is connected. |
| 12 | Shared shopping UI foundation | DONE | Hybrid light shopping surfaces + dark branded header/footer implemented across primary shopping UI. |
| 13 | Compact persistent mobile search | DONE | Mobile brand row now scrolls away while the search strip alone remains sticky. Header/search spacing and branding were reworked for mobile and desktop. |
| 14 | Replace oversized/aggressive cards | DONE | Compact 4:3 product cards, calmer CTAs, explicit View Prices + Compare action, and no unvalidated Deal Score. |
| 15 | Accurate local discovery | PARTIAL | Search reads the live catalog and now records real searches plus zero-result demand. Exact-variant ranking, pagination and genuine-data launch QA remain. |
| 16 | Complete product decision page | PARTIAL | Live offers, source confidence, honest price history, structured specs, alternatives, FAQ and compare are present. Final genuine-data buying-guide composition and launch QA remain. |
| 17 | Minimum serious two-product compare | DONE | `/[country]/compare` supports direct product-card entry, same-category selection, structured facts, prices and light shopping UI. Missing facts remain unknown. |
| 18 | Genuine saved persistence | PARTIAL | Device saves plus authenticated owner-scoped watchlist persistence/sync are implemented. Final cross-device/session QA remains. |
| 19 | Verified alert delivery | PARTIAL | Signed-in users can persist a real account-backed alert. The UI no longer claims email success; email verification/delivery and recurring evaluation remain. |
| 20 | Useful authored content | PARTIAL | Blog index and article pages use the clean light-shopping UI with featured content, mobile reading, source/transparency blocks, related guides and editorial-policy links. Launch editorial set still needs final factual/editorial QA. |
| 21 | Controlled AI draft preparation | PARTIAL | Persisted `content_opportunities`, `content_drafts` and `ai_jobs` queues plus an honest admin Content & AI dashboard are implemented. Automated research/draft workers and review actions remain; AI has no direct publication authority. |
| 22 | Replace simulated back-office activity | DONE | Admin overview, products, merchants, ingestion, matching, analytics, SEO and Content & AI screens now read persisted state instead of simulated numbers. |
| 23 | Metric dictionary + real analytics | PARTIAL | Privacy-safe `analytics_events` + `outbound_clicks` record page views, searches, zero-result searches, product views and retailer hand-offs. Admin also reports real saved-product and active-alert counts. Consent integration and the formal metric dictionary remain. |
| 24 | Final homepage content rhythm | PARTIAL | Discovery modules and hybrid UI direction are in place. Final deduplication/engagement pass and genuine-data QA remain. |
| 25 | Trust/policy pages | DONE | About, Contact, How Pricing Works, Data Sources, Editorial Policy, Affiliate Disclosure, Privacy and Terms are real routes and linked in the footer. |
| 26 | Eligible regional SEO + Search Console | PARTIAL | Public routes are now restricted to UAE/US, sitemap contains launch markets/live product URLs only, and admin SEO shows honest local diagnostics instead of fake indexing claims. Search Console and final schema validation remain. |
| 27 | Full production-shaped QA | MISSING | Must run genuine-data mobile/accessibility/security/performance tests at target widths before public cutover. |
| 28 | Controlled production pilot/domain cutover | BLOCKED | Do after one real source path and core P0 QA are ready. |
| 29 | Activate approved affiliate links | BLOCKED | Affiliate identifiers remain disabled until actual program approval/evidence exists. |
| 30 | Apply for AdSense + measured slots | BLOCKED | Apply only after real catalog/editorial/trust/mobile quality gates pass. |

## P1 — immediately after stable launch

| # | Task | Status |
|---|---|---|
| 31 | Four-product comparison + validated scoring | DEFERRED |
| 32 | Expand sources/content from observed demand | DEFERRED |
| 33 | Controlled experiments on UX/CTA/ad density | DEFERRED |

## P2/P3 — later

| # | Task | Status |
|---|---|
| 34 | Optional dark mode + transparent recommendations | DEFERRED |
| 35 | New categories/languages with complete schemas | DEFERRED |
| 36 | Canada/UK/Australia, sponsorships, native apps, compatibility | DEFERRED |

## Current execution order

1. Obtain one real retailer/API/feed approval and credentials, then prove the completed rights-gated staging → review → publish path with genuine products.
2. While that external approval is pending, finish account/alert delivery evaluation, controlled content-worker plumbing and launch editorial QA.
3. Validate automatic exact-identifier suggestions against real GTIN/MPN/model data, while keeping ambiguous variants human-gated.
4. Run mobile/accessibility/performance/security QA at 360/390/412/430/768/1024/1440.
5. Connect `catchtheprice.com`, business email, Search Console and production consent/analytics configuration.
6. Pilot with real data, then affiliate/AdSense applications only after launch gates pass.

## Verified production database state

Production Supabase includes the core catalog tables plus:

- `source_rights` — persisted deny-by-default retailer permission/evidence registry.
- `ingestion_items` — pre-publication feed staging queue with identity evidence, review state and publish state.
- `outbound_clicks` — privacy-safe retailer hand-off events.
- `analytics_events` — privacy-safe page/search/product interaction events.
- `content_opportunities` — controlled research opportunity queue.
- `content_drafts` — private factual/editorial review queue.
- `ai_jobs` — model/job/cost/error audit log.
- `ingestion_runs.items_staged` / `items_rejected` — real staging metrics.

`ingestion_items` stores source SKU, GTIN/EAN/UPC when available, MPN, model, image URL, review decision, reviewer, published offer and timestamps. Re-running the same source item refreshes its staging row rather than creating duplicate queue items.

RLS is enabled on operational tables. CatchThePrice does not need to store full IP addresses for the analytics implemented here.

## External blockers

1. No retailer/feed may be activated until the corresponding commercial/data permission is actually obtained and recorded in `source_rights`.
2. The first live connector also needs its real private credential/API key.
3. Vercel currently reports a build-rate quota block. Code continues to land in GitHub and can deploy once the quota clears.

## Launch rule

No public fabricated price, merchant destination, historical point, rating, saved activity, alert success, ingestion success, analytics number or revenue value may remain at launch. Missing/unknown data must render as unavailable rather than being generated.
