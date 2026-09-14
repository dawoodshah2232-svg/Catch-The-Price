# CatchThePrice — Global Price Comparison & Price Tracking Platform

> **TRACK IT. CATCH THE DROP. PAY LESS.**  
> *Smarter Shopping for a Brighter Tomorrow.*

[![Next.js](https://img.shields.io/badge/Next.js-16.1.6-black?style=flat&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-blue?style=flat&logo=react)](https://react.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-v4-38bdf8?style=flat&logo=tailwindcss)](https://tailwindcss.com/)
[![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-3ecf8e?style=flat&logo=supabase)](https://supabase.com/)
[![License](https://img.shields.io/badge/License-Proprietary-emerald)]()

---

## 🌐 Overview

**CatchThePrice** (`catchtheprice.com`) is a high-performance, dark-theme first global product price comparison, price tracking, deals discovery, and shopping intelligence platform. Built with a mobile-first architecture, CatchThePrice provides consumers across 5 primary launch markets with real-time price comparisons, historical price analytics, Deal Score™ calculations, and instant price drop alerts.

### Primary Launch Markets
- 🇦🇪 **United Arab Emirates (UAE)** — AED (`/ae`)
- 🇺🇸 **United States (USA)** — USD (`/us`)
- 🇬🇧 **United Kingdom (UK)** — GBP (`/uk`)
- 🇨🇦 **Canada** — CAD (`/ca`)
- 🇦🇺 **Australia** — AUD (`/au`)

### Core Electronics Categories
1. 📱 **Smartphones** (iPhone 16 Pro, Galaxy S25 Ultra, Pixel 9 Pro)
2. 💻 **Laptops & MacBooks** (MacBook Pro M4, Dell XPS 15)
3. 🎮 **Gaming Gear & Consoles** (PlayStation 5 Pro, Steam Deck OLED)
4. 📺 **4K OLED TVs & Displays** (LG G4 65" 4K OLED)
5. 🎧 **Wireless Headphones** (Sony WH-1000XM5, AirPods Pro 2)
6. ⌚ **Smartwatches & Wearables** (Apple Watch Ultra 2, Galaxy Watch Ultra)

---

## ✨ Key Capabilities & Features

- **📱 Mobile-First Responsive Design**: Optimized down to 360px–430px touch screens up to 1920px ultrawide monitors with zero horizontal overflow.
- **🏷️ Deal Score™ Engine (0–100)**: Quantitative algorithmic score factoring % drop from average, current vs. all-time low, merchant trust rating, and coupon/rebate availability.
- **📈 Interactive Price History Charts**: Visual price changes across 30 days, 90 days, 180 days, 1 year, and all-time with high/low annotations.
- **🛒 Multi-Merchant Store Comparison**: Compare offers across Amazon, Sharaf DG, Noon, Best Buy, Currys, Argos, Walmart, and more.
- **🔔 Price Drop Alerts**: Modal subscription saving target prices directly to Supabase watchlists with email notification triggers.
- **🔗 Outbound Tracking & Affiliate Attribution**: High-performance `/api/outbound` endpoint that logs analytics clicks and adds verified affiliate tracking tags with `noindex, nofollow` compliance.
- **⚡ Filter Bottom Sheet & Sticky Sidebar**: Native bottom sheet experience on mobile (`FilterSheet.tsx`) and sticky navigation sidebar on desktop.
- **📐 Compact Accordion Mobile Footer**: Touch-friendly expandable footer sections on mobile screens, expanding to a 5-column layout on desktop.
- **🔍 SEO & JSON-LD Structured Data**: Pre-configured `Product`, `AggregateOffer`, `Offer`, and `BreadcrumbList` schemas for rich search snippet indexing.
- **🛡️ Graceful Fallback**: Runs with complete multi-market seed datasets out-of-the-box and seamlessly connects to live Supabase tables when credentials are provided.

---

## 🛠️ Technology Stack

| Layer | Technologies |
| :--- | :--- |
| **Framework** | Next.js 16.1.6 (App Router, Turbopack, Server Components) |
| **Frontend** | React 19, TypeScript, Lucide React Icons |
| **Styling** | Tailwind CSS v4 (Custom Dark Palette: Emerald `#00D27A`, Navy `#071015`, Slate `#091217`) |
| **Database** | PostgreSQL via Supabase (Project ID: `jghpyvawgdfhfqmtiexb`) |
| **Monetization** | Google AdSense reserved CLS-safe slots & Affiliate Outbound Redirects |
| **Deployment** | Vercel Serverless Edge Platform |

---

## 📂 Project Architecture

```
Catch The Price/
├── app/
│   ├── [country]/                  # Dynamic localized routes (/ae, /us, /uk, etc.)
│   │   ├── deals/[category]/       # Category-specific deals & breadcrumbs
│   │   ├── price-drops/[category]/ # Biggest price drop feeds
│   │   ├── product/[slug]/         # Rich product detail page & JSON-LD
│   │   ├── search/                 # Filterable search with sticky sidebar & AdSlots
│   │   └── page.tsx                # 8-part mobile-first homepage sequence
│   ├── api/
│   │   ├── alerts/                 # Price drop watchlist webhook API
│   │   └── outbound/               # Outbound merchant redirect & affiliate tracker
│   ├── globals.css                 # Dark theme custom utilities & design system
│   ├── layout.tsx                  # Root layout with localized CountryProvider
│   ├── robots.ts                   # Search engine crawl rules & exclusions
│   └── sitemap.ts                  # Dynamic multi-country XML sitemap generator
├── components/
│   ├── common/                     # AdSlot, StateViews, NotificationToasts
│   ├── home/                       # Hero, Trending, PriceIntelligence, AlertCTA
│   ├── layout/                     # Header, MobileBottomNav, Accordion Footer
│   ├── product/                    # PriceHistoryChart, MerchantOffersList, DealScoreBadge
│   └── search/                     # SearchBar, ProductCard, FilterSheet
├── context/
│   └── CountryContext.tsx          # Multi-market currency and localized state
├── lib/
│   ├── data/                       # Countries, Categories, Merchants, Seed Products
│   ├── supabase/                   # Client and Server Supabase connections
│   └── types/                      # Full TypeScript interfaces
├── supabase/
│   └── schema.sql                  # Production SQL schema & seed script
└── public/                         # Brand assets, logos, and favicons
```

---

## 🚀 Getting Started

### 1. Prerequisites
- Node.js 20.x or higher
- npm 10.x or yarn / pnpm

### 2. Installation
```bash
git clone https://github.com/dawoodshah2232-svg/catchtheprice.git
cd catchtheprice
npm install
```

### 3. Environment Setup
Copy the example environment template:
```bash
cp .env.example .env.local
```

Populate the required credentials in `.env.local`:
```env
NEXT_PUBLIC_SITE_URL=https://catchtheprice.com
NEXT_PUBLIC_SUPABASE_URL=https://jghpyvawgdfhfqmtiexb.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key_here
NEXT_PUBLIC_DEFAULT_COUNTRY=ae
```

*(Note: If Supabase keys are not set, the platform will safely utilize the built-in multi-country mock dataset).*

### 4. Running Locally
Start the Turbopack development server:
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) (redirects to default localized market `/ae`).

### 5. Production Build
Verify TypeScript compilation and static asset generation:
```bash
npm run build
npm start
```

---

## 🗄️ Database & Supabase Configuration

CatchThePrice is provisioned with a dedicated Supabase PostgreSQL database:
- **Project ID**: `jghpyvawgdfhfqmtiexb`
- **Dashboard**: [https://supabase.com/dashboard/project/jghpyvawgdfhfqmtiexb](https://supabase.com/dashboard/project/jghpyvawgdfhfqmtiexb)

To deploy or inspect the database tables, run the SQL script located at:
```
supabase/schema.sql
```
This includes definitions and indexes for:
1. `categories` — Global taxonomy and slug mappings
2. `merchants` — Verified retailers per jurisdiction with affiliate templates
3. `products` — Core product intelligence and pricing
4. `product_offers` — Live merchant offers, URLs, and availability
5. `price_history` — Timeseries price snapshots for charts
6. `watchlists` — User price-drop subscriptions and target values
7. `outbound_clicks` — Audit log of outbound merchant conversions

---

## ☁️ Deploying to Vercel

CatchThePrice is pre-configured for instant zero-configuration deployment to [Vercel](https://vercel.com).

### Deployment Steps:
1. Push this repository to GitHub.
2. Sign in to [Vercel Dashboard](https://vercel.com) and click **"Add New Project"**.
3. Import `catchtheprice` from your GitHub account.
4. Under **Environment Variables**, add:
   - `NEXT_PUBLIC_SITE_URL`: `https://catchtheprice.com`
   - `NEXT_PUBLIC_SUPABASE_URL`: `https://jghpyvawgdfhfqmtiexb.supabase.co`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`: *(From Supabase API Settings)*
   - `SUPABASE_SERVICE_ROLE_KEY`: *(From Supabase API Settings)*
   - `NEXT_PUBLIC_DEFAULT_COUNTRY`: `ae`
5. Click **"Deploy"**.

---

## 🔒 Security & Quality Standards

- **Dark Theme Only (V1)**: Carefully chosen contrast ratios adhering to WCAG AA guidelines with high-readability text (`#F8FAFC`, `#CBD5E1`, `#94A3B8`).
- **Touch Ergonomics**: All interactive elements maintain a minimum 44px touch-target area for thumb navigation.
- **Affiliate Transparency**: Clear disclosures and redirect protections via `/api/outbound`.
- **CLS Prevention**: Pre-allocated aspect ratios for images and fixed heights for AdSense placeholders prevent Cumulative Layout Shift.

---

© 2026 CatchThePrice (`catchtheprice.com`). All rights reserved.
