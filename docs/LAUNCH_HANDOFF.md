# CatchThePrice Launch Handoff

This checklist is the shortest path from the current production-shaped build to a real public pilot.

## 1. Production environment

Set these in the Vercel production environment. Never commit private values.

- `NEXT_PUBLIC_SITE_URL=https://catchtheprice.com`
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`
- `SUPABASE_SERVICE_ROLE_KEY` — server only
- `ADMIN_EMAILS` — approved administrators only
- `CRON_SECRET` — long random server-only value
- `ENABLE_DEMO_CATALOG=false`
- `NEXT_PUBLIC_DEFAULT_COUNTRY=ae`
- Keep `NEXT_PUBLIC_ADSENSE_TEST_MODE=true` until AdSense is actually approved and launch gates pass.

## 2. First real retailer/source

Do not enable a source merely because an API is technically reachable.

Before activation:

1. Record the real permission/terms evidence in `source_rights`.
2. Confirm pricing/link/image/history/AI rights separately.
3. Add the private source credential to Vercel.
4. Enable the source only after the admin Source Rights screen shows the required rights as active.
5. Run ingestion: FETCH → NORMALIZE → STAGE → HUMAN REVIEW → PUBLISH.
6. Verify the published offer opens only through `/api/outbound` and resolves to the expected HTTPS merchant host.

The existing Best Buy connector must remain disabled until the required permission evidence and private credential are present.

## 3. Genuine launch catalog

Pilot target:

- UAE + US only.
- Roughly 80–120 curated exact variants across launch categories.
- Prefer two permitted overlapping sources per market where possible.
- Validate GTIN/UPC/EAN, MPN, model and variant attributes before merging offers.
- Never fill missing price history, ratings, merchant claims or stock states with generated values.

## 4. Alerts

The evaluator and queued alert history are already implemented.

Before calling alerts “delivered”:

1. Choose and verify an email provider/domain.
2. Add provider credentials as server-only environment variables.
3. Add unsubscribe and delivery-failure handling.
4. Trigger a real test alert to an approved test account.
5. Confirm the event changes from queued to delivered only after the provider accepts the message.

## 5. Domain and SEO

After the Vercel build quota clears:

1. Deploy the latest `main` commit.
2. Confirm `catchtheprice.com` and `www.catchtheprice.com` DNS/canonical behavior.
3. Verify `/ae` and `/us` are public and unsupported markets return 404/noindex as intended.
4. Verify `robots.txt` and `sitemap.xml` on the production domain.
5. Add the domain to Google Search Console and submit the sitemap.
6. Run live structured-data validation on real product pages.

## 6. Final QA matrix

Preview UI QA is automated with desktop/mobile screenshots and the GitHub quality gate.

Final launch QA must be repeated with genuine catalog data at:

- 360 px
- 390 px
- 412 px
- 430 px
- 768 px
- 1024 px
- 1440 px

Check: horizontal overflow, sticky mobile search, dark top/bottom chrome, product cards, product CTA, compare, saved/account, consent controls, forms, keyboard focus, accessibility, performance and retailer hand-offs.

## 7. Affiliate and AdSense

- Keep affiliate identifiers disabled until the actual program is approved and evidence is recorded.
- Keep production ad placeholders hidden.
- Apply for AdSense only after the real catalog, editorial, trust, mobile and production QA gates pass.

## Go-live rule

Do not launch with fabricated prices, stores, history, reviews, drops, ratings, alert success, analytics totals or affiliate relationships. Unknown data should remain unavailable until evidence exists.
