# CatchThePrice — AI-Powered Shopping Intelligence & Price Tracking

> **TRACK IT. CATCH THE DROP. PAY LESS.**
>
> *Smarter Shopping for a Brighter Tomorrow.*

CatchThePrice (`https://catchtheprice.com`, `/ae`) is a high-performance, mobile-first shopping intelligence and price-comparison platform for the UAE and US markets.

---

## 🚀 Core Features

### 🛒 Consumer Experience
- **Multi-Retailer Price Comparison**: Side-by-side comparison across top regional merchants (Amazon, Noon, SharafDG, Virgin, Best Buy, etc.).
- **Price History & Trend Analysis**: Interactive historical charts displaying recorded highs, lows, and 90-day medians.
- **Rules-First Deal Score**: Algorithmic 0–100 scoring based on actual historical discounts, avoiding fake retailer MSRP drops.
- **Persistent User Accounts**: Multi-device saved products, custom target-price tracking, and synchronized browsing history.
- **Instant Price-Drop Alerts**: Email and in-app notifications when retailer prices hit target thresholds.
- **Notification Center**: Centralized inbox with read/unread filtering for price drops and deal digests.
- **Localized Shopping Experience**: Dedicated localized routes for UAE (`/ae` - AED) and USA (`/us` - USD).

### ⚙️ Automation & Matching Engines
- **Multi-Stage Identity Resolution**: High-precision matching via GTIN/EAN, MPN + Brand, and normalized token Levenshtein scoring.
- **Price Tracking & Deduplication**: 24-hour window deduplication preventing database bloat while maintaining price history accuracy.
- **Background Automation Engine**: 12 core automated jobs covering feed ingestion, price checks, deal detection, content discovery, and affiliate link validation.
- **Human Review Exception Queue**: Automated routing of low-confidence matches and job failures to back-office operators.

### 🛡️ Admin & Back-Office
- **Automation Jobs Dashboard (`/admin/automation`)**: Manual job triggers, execution schedules, and real-time run logs.
- **Exception Review Queue (`/admin/review`)**: Operator resolution center for product matches, price anomalies, and system alerts.
- **Deals Monitor (`/admin/deals`)**: Scored deals analyzer with discount verification.
- **System Health & Audit Logs (`/admin/system`)**: Database latency checks, email connection status, and administrator action logs.
- **Search & Conversion Analytics (`/admin/analytics`)**: Live shopper search queries, click-through rates, and device breakdown.

---

## 🛠️ Technology Stack

- **Framework**: Next.js 16 (App Router, Turbopack, React 19)
- **Language**: TypeScript (Strict Mode)
- **Styling**: Tailwind CSS v4 (Mobile-first responsive design, signature emerald green `#00A859`)
- **Database & Auth**: Supabase (PostgreSQL with strict Row Level Security, GoTrue PKCE Auth)
- **Email Dispatch**: Resend / Sendgrid with safe development console fallback
- **Hosting**: Vercel

---

## 📁 Repository Structure

```
├── app/                        # Next.js App Router routes
│   ├── [country]/              # Localized consumer routes (/ae, /us)
│   │   ├── account/            # Customer account views (saved, alerts, notifications, history, settings)
│   │   ├── compare/            # Side-by-side product comparison
│   │   ├── product/[slug]/     # Canonical product details & offers
│   │   ├── search/             # Real-time search & filtering
│   │   └── ...                 # Localized auth pages (login, signup, forgot-password)
│   ├── admin/                  # Protected administrative back-office
│   ├── api/                    # Server Route Handlers (account, admin, outbound, catalog)
│   └── auth/callback/          # Supabase PKCE OAuth callback
├── components/                 # React UI components (account, admin, product, layout)
├── docs/                       # Comprehensive documentation
│   ├── SETUP.md                # Operator setup, Supabase config, and migrations
│   ├── ARCHITECTURE.md         # Database schemas, security, and engine architecture
│   └── AUTOMATION.md           # 12 automation jobs and exception handling
├── lib/                        # Business logic, engines, and utilities
│   ├── automation/             # Background job runner and scheduler
│   ├── deals/                  # Algorithmic deal scoring engine
│   ├── email/                  # Multi-provider email dispatcher & templates
│   ├── matching/               # Multi-stage product matching engine
│   ├── pricing/                # Price tracking, deduplication, and statistics
│   └── supabase/               # Browser and server Supabase clients
├── scripts/                    # Release audit, runtime smoke, and bootstrapping scripts
└── supabase/migrations/        # Production SQL migrations with RLS
```

---

## 🔑 Environment Variables

Copy `.env.example` to `.env.local` for local development. Only set actual values in your local environment or Vercel dashboard:

```env
NEXT_PUBLIC_SITE_URL=
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
ADMIN_EMAILS=
CRON_SECRET=
ENABLE_DEMO_CATALOG=
NEXT_PUBLIC_DEFAULT_COUNTRY=
BESTBUY_API_KEY=
NEXT_PUBLIC_ADSENSE_CLIENT_ID=
NEXT_PUBLIC_ADSENSE_TEST_MODE=
RESEND_API_KEY=
EMAIL_FROM=
```

> [!WARNING]
> Never commit actual API keys or secrets to version control. `SUPABASE_SERVICE_ROLE_KEY` must remain strictly server-side.

---

## 🚦 Getting Started

### Local Development

```bash
# 1. Install dependencies
npm install

# 2. Run local development server
npm run dev
```

Visit `http://localhost:3000/ae` to explore the application.

### Production Release Verification

CatchThePrice maintains a strict 5-stage quality pipeline. Run all checks before opening a pull request or deploying:

```bash
# 1. TypeScript type check
npm run typecheck

# 2. ESLint code standard check
npm run lint

# 3. Next.js production build
npm run build

# 4. Release invariant audit (15 rules)
npm run audit:release

# 5. Runtime smoke test
npm run smoke
```

---

## 📚 Documentation

For full details on setup, architecture, and background automation:
- **[Operator Setup Guide](file:///e:/Website/CatchThePrice%20v2/docs/SETUP.md)**
- **[System Architecture Reference](file:///e:/Website/CatchThePrice%20v2/docs/ARCHITECTURE.md)**
- **[Background Automation Manual](file:///e:/Website/CatchThePrice%20v2/docs/AUTOMATION.md)**
- **[Autonomous Engineering Handoff](file:///e:/Website/CatchThePrice%20v2/AI_HANDOFF.md)**

---

© 2026 CatchThePrice. All rights reserved.
