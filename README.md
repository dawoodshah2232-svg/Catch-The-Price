# CatchThePrice — Price Comparison & Price Tracking Platform

> **TRACK IT. CATCH THE DROP. PAY LESS.**
>
> *Smarter Shopping for a Brighter Tomorrow.*

## Current V1 Status

CatchThePrice is a mobile-first price comparison, deal discovery, and price-tracking platform being prepared for an AdSense-first launch.

### Live launch markets
- 🇦🇪 United Arab Emirates — AED (`/ae`)
- 🇺🇸 United States — USD (`/us`)

### Planned later markets
- United Kingdom
- Canada
- Australia
- Saudi Arabia

These planned markets are not part of the public indexed V1 launch yet.

## Important Data Status

The current repository includes seed/demo product data so the UI, routing, price-history components, deal-score logic, merchant comparison, and alert flows can be tested before live merchant feeds are connected.

Do **not** describe seed/demo prices as live, real-time, verified, or current production prices.

Production data should come only from approved merchant APIs, affiliate feeds, retailer feeds, permitted crawling, or other authorized sources.

## V1 Categories

- Phones
- Laptops
- Gaming
- TVs
- Headphones
- Smartwatches

## Core Product Experience

- Mobile-first responsive UI
- Product search and discovery
- Multi-merchant offer comparison
- Price-history charts
- Deal Score engine
- Saved products and price alerts
- Outbound merchant links
- Affiliate-ready outbound tracking
- AdSense-reserved layout slots
- UAE/USA localized routes and currencies
- SEO metadata, sitemap, robots, and structured-data support

## Technology

- Next.js 16
- React 19
- TypeScript
- Tailwind CSS 4
- Supabase / PostgreSQL
- Vercel

## Environment Variables

```env
NEXT_PUBLIC_SITE_URL=https://catchtheprice.com
NEXT_PUBLIC_SUPABASE_URL=https://jghpyvawgdfhfqmtiexb.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your_supabase_publishable_key_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key_here
NEXT_PUBLIC_DEFAULT_COUNTRY=ae
NEXT_PUBLIC_ADSENSE_CLIENT_ID=ca-pub-XXXXXXXXXXXXXXXX
NEXT_PUBLIC_ADSENSE_TEST_MODE=true
```

Never commit real secrets. `SUPABASE_SERVICE_ROLE_KEY` is server-only and must never be exposed through a `NEXT_PUBLIC_*` variable.

## Development

```bash
npm install
npm run dev
```

Production verification:

```bash
npm run build
npm run lint
```

## Deployment

Production deployment is hosted on Vercel. GitHub `main` is the production source branch.

Before public launch:

1. Verify UAE and USA routes only.
2. Replace or clearly label demo data until live feeds are connected.
3. Verify Privacy Policy, Terms, About, Contact, Affiliate Disclosure, and retailer-checkout disclosures.
4. Verify AdSense placements do not interfere with search, navigation, Track Price, or merchant Buy buttons.
5. Verify sitemap and robots rules.
6. Connect `catchtheprice.com` and verify SSL/canonical URLs.
7. Add Google Search Console and Analytics.
8. Apply for AdSense only after useful production content is live and indexable.

## Monetization

V1 is **AdSense-first**. Affiliate monetization can be added to merchant outbound links later.

Ads must never be positioned in a way that encourages accidental clicks or confuses advertising with product/merchant actions.

## Security

- Supabase RLS should remain enabled on public tables.
- Service-role credentials stay server-side only.
- Environment files containing secrets remain excluded from Git.
- Outbound merchant redirects should validate destinations and log only necessary analytics data.

---

© 2026 CatchThePrice. All rights reserved.
