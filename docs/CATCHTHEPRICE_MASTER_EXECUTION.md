# CatchThePrice Master Execution Tracker

Source of truth: `CatchThePrice_Master_Implementation_Report-1.pdf` (15 Sep 2026).

Status values: `DONE`, `PARTIAL`, `MISSING`, `BLOCKED`, `DEFERRED`.

## P0 — launch-critical

| # | Task | Status | Current note |
|---|---|---|---|
| 01 | Remove fabricated public states | DONE | Production catalog/search/deals/product routes use live Supabase data and honest unavailable states. Demo fixtures are preview-only, labelled and excluded from the production sitemap. |
| 02 | Protect all admin operations | DONE | Admin layout and write APIs require a real Supabase session plus `ADMIN_EMAILS` allowlist. Public admin navigation is removed. |
| 03 | Create source rights register | DONE | Persisted `source_rights` is the production authority. Sources fail closed and cannot become publish-ready without dated approval evidence plus required rights. |
| 04 | Replace arbitrary URL redirects | DONE | `/api/outbound` accepts only offer ID + market, resolves destinations server-side, validates HTTPS/merchant host/active state and records privacy-safe outbound analytics. |
| 05 | Apply and verify access model | DONE | RLS/server-only access assumptions are enforced on operational paths, database evolution is tracked through `supabase/migrations/`, and the obsolete monolithic `supabase/schema.sql` is now a non-executable retirement notice. |
| 06 | Prepare canonical production environment | PARTIAL | Vercel hosting works and the app is production-shaped. `catchtheprice.com` DNS/canonical cutover and rollback procedure remain. Vercel deploys are temporarily blocked by the account build-rate quota, while GitHub quality checks continue independently. |
| 07 | Canonical product/variant/offer identity | PARTIAL | Ingestion captures GTIN/EAN/UPC, MPN, model, source SKU and image evidence. Human-approved canonical product creation/assignment plus safe offer publishing is implemented; full variant validation still needs genuine source data. |
| 08 | Prove one permitted source end-to-end | BLOCKED | Rights-gated JSON feed runner plus Best Buy API connector work through FETCH → RIGHTS → NORMALIZE → STAGE → REVIEW → PUBLISH. Final proof needs one actually approved feed/API and private credential. |
| 09 | Conflict-first matching + review | PARTIAL | Admin has an auditable human review desk and exact-identifier suggestions. Genuine GTIN/MPN/model source data is still required to validate automatic matching thresholds. |
| 10 | Two overlapping sources + curated inventory | BLOCKED | Requires real source approvals. Target remains 80–120 curated variants with meaningful UAE/US coverage. |
| 11 | Freshness + genuine history | PARTIAL | History is shown only from stored observations. Approved publishing can record an initial observation when history rights permit it; recurring source refresh begins after a permitted live source is connected. |
| 12 | Shared shopping UI foundation | DONE | Amazon-inspired-but-original commerce rhythm implemented with light shopping surfaces and permanently dark branded header/footer in light and dark appearance modes. |
| 13 | Compact persistent mobile search | DONE | Mobile brand row scrolls away while the dark search strip remains sticky. Mobile bottom navigation is dark, compact and app-like. |
| 14 | Replace oversized/aggressive cards | DONE | Compact product cards, calmer CTAs, mobile category rails and comparison entry points are implemented; unvalidated Deal Score remains hidden. |
| 15 | Accurate local discovery | PARTIAL | Search reads the live catalog, uses deterministic relevance ranking and mobile-friendly pagination, and records consented searches plus zero-result demand. Genuine-data launch QA remains. |
| 16 | Complete product decision page | PARTIAL | Live offers, source confidence, genuine history, structured specs, alternatives, FAQ and compare are present. Mobile jump navigation and dark sticky buying actions are implemented; genuine-data launch QA remains. |
| 17 | Minimum serious two-product compare | DONE | `/[country]/compare` supports direct product-card entry, same-category selection, structured facts, prices and responsive shopping UI. Missing facts stay unknown. |
| 18 | Genuine saved persistence | PARTIAL | Device saves plus authenticated owner-scoped watchlist persistence are implemented. Signed-in live-product saves and price-alert preferences sync back into the shopper UI; final multi-device QA remains. |
| 19 | Verified alert delivery | PARTIAL | Signed-in users persist real alerts; deterministic target/drop evaluation and real alert history are implemented. A CRON_SECRET-protected scheduled evaluator endpoint is ready. Verified email provider/verification and actual delivery remain external work. |
| 20 | Useful authored content | PARTIAL | Blog index/article pages use the clean shopping UI with transparency and related guides. Launch editorial set still needs final factual/editorial QA. |
| 21 | Controlled AI draft preparation | PARTIAL | Persisted opportunity/draft/job queues and admin Content & AI dashboard are live. A real first-party demand worker converts repeated zero-result searches into reviewable opportunities. External-source research/draft generation remains human-gated and not yet connected. |
| 22 | Replace simulated back-office activity | DONE | Admin overview, products, merchants, ingestion, matching, alerts, analytics, SEO and Content & AI screens read persisted state instead of simulated numbers. |
| 23 | Metric dictionary + real analytics | DONE | Privacy-safe first-party analytics, validated retailer hand-offs, admin operational counts, a formal metrics dictionary and explicit shopper analytics consent are implemented. Analytics events fail closed until consent is granted. |
| 24 | Final homepage content rhythm | PARTIAL | Homepage uses Hero → category rail → shopping hub → deals → dynamic brands → compare → drops → editorial/intelligence modules with early-product deduplication. Final genuine-data visual QA remains. |
| 25 | Trust/policy pages | DONE | About, Contact, How Pricing Works, Data Sources, Editorial Policy, Affiliate Disclosure, Privacy and Terms are real routes and linked in the footer. Privacy choices can be changed from the Privacy Policy page. |
| 26 | Eligible regional SEO + Search Console | PARTIAL | Public routes are restricted to UAE/US, sitemap contains launch markets/live product URLs only and admin SEO shows honest local diagnostics. Search Console and final live-schema validation remain. |
| 27 | Full production-shaped QA | PARTIAL | GitHub quality gate now runs lint, release-safety assertions, production build and runtime smoke checks across core UAE/US/public routes. Real-browser mobile/accessibility/performance tests at 360/390/412/430/768/1024/1440 still require deployable/genuine-data QA. |
| 28 | Controlled production pilot/domain cutover | BLOCKED | Do after one real source path and remaining P0 QA are ready. |
| 29 | Activate approved affiliate links | BLOCKED | Affiliate identifiers remain disabled until actual program approval/evidence exists. |
| 30 | Apply for AdSense + measured slots | BLOCKED | Production no longer renders fake ad placeholders. Apply/connect real AdSense only after catalog/editorial/trust/mobile quality gates pass and appropriate ad consent/configuration is ready. |

## P1 — immediately after stable launch

| # | Task | Status |
|---|---|---|
| 31 | Four-product comparison + validated scoring | DEFERRED |
| 32 | Expand sources/content from observed demand | DEFERRED |
| 33 | Controlled experiments on UX/CTA/ad density | DEFERRED |

## P2/P3 — later

| # | Task | Status |
|---|---|---|
| 34 | Optional additional theme refinements + transparent recommendations | DEFERRED |
| 35 | New categories/languages with complete schemas | DEFERRED |
| 36 | Canada/UK/Australia, sponsorships, native apps, compatibility | DEFERRED |

## Current execution order

1. Obtain one real retailer/API/feed approval and credential, then prove staging → review → publish with genuine products.
2. Configure a verified notification provider and email verification, then connect the ready scheduled alert evaluator.
3. Validate exact-identifier matching against real GTIN/MPN/model data while keeping ambiguity human-gated.
4. Run genuine-data mobile/accessibility/performance/security QA at 360/390/412/430/768/1024/1440.
5. Connect `catchtheprice.com`, business email and Search Console; first-party analytics consent is already implemented.
6. Pilot with real data, then activate approved affiliate programs and apply for AdSense only after launch gates pass.

## Verified production database / operational state

Production Supabase includes the core catalog tables plus:

- `source_rights` — deny-by-default retailer permission/evidence registry.
- `ingestion_items` — pre-publication feed staging queue with identity evidence, review state and publish state.
- `outbound_clicks` — privacy-safe retailer hand-off events.
- `analytics_events` — privacy-safe page/search/product interaction events.
- `content_opportunities` — controlled research opportunity queue.
- `content_drafts` — private factual/editorial review queue.
- `ai_jobs` — model/job/cost/error audit log.
- `alert_events` — persisted real alert triggers with queued vs delivered state.
- `ingestion_runs.items_staged` / `items_rejected` — real staging metrics.

The repo also contains:

- a CRON_SECRET-protected scheduled alert-evaluation route;
- a first-party zero-result-search demand worker;
- a release audit that blocks known unsupported public claims/security regressions;
- a formal first-party metrics dictionary;
- shopper-controlled analytics consent with analytics disabled by default;
- a GitHub Actions quality gate for lint, release audit, production build and runtime smoke testing.

RLS is enabled on operational tables. CatchThePrice does not store full IP addresses for the analytics implemented here.

## External blockers

1. No retailer/feed may be activated until commercial/data permission is actually obtained and recorded in `source_rights`.
2. The first live connector needs its real private credential/API key.
3. Vercel currently reports a build-rate quota block; GitHub work and independent quality checks continue meanwhile.
4. Email/notification delivery requires a verified provider and environment configuration before any event may be marked delivered.
5. Domain DNS, business email, Search Console, affiliate approval and AdSense approval require external account actions.

## Launch rule

No public fabricated price, merchant destination, historical point, rating, saved activity, alert success, ingestion success, analytics number or revenue value may remain at launch. Missing/unknown data must render as unavailable rather than being generated.
