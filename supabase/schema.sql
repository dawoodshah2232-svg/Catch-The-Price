-- =========================================================
-- CatchThePrice (catchtheprice.com) Database Schema
-- Production PostgreSQL schema for Supabase
-- =========================================================

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- 1. CATEGORIES TABLE
CREATE TABLE IF NOT EXISTS public.categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL,
    slug VARCHAR(100) UNIQUE NOT NULL,
    icon VARCHAR(50),
    description TEXT,
    parent_id UUID REFERENCES public.categories(id) ON DELETE SET NULL,
    sort_order INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_categories_slug ON public.categories(slug);

-- 2. MERCHANTS TABLE
CREATE TABLE IF NOT EXISTS public.merchants (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(150) NOT NULL,
    slug VARCHAR(100) UNIQUE NOT NULL,
    domain VARCHAR(255) NOT NULL,
    logo_url TEXT,
    rating NUMERIC(2, 1) DEFAULT 4.5,
    country VARCHAR(10) NOT NULL, -- 'ae', 'us', 'uk', 'ca', 'au'
    affiliate_template TEXT, -- e.g. '{url}&tag=catchtheprice-{country}-20'
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_merchants_country ON public.merchants(country);
CREATE INDEX IF NOT EXISTS idx_merchants_slug ON public.merchants(slug);

-- 3. PRODUCTS TABLE
CREATE TABLE IF NOT EXISTS public.products (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(300) NOT NULL,
    slug VARCHAR(350) UNIQUE NOT NULL,
    brand VARCHAR(100) NOT NULL,
    category_id UUID REFERENCES public.categories(id) ON DELETE SET NULL,
    description TEXT,
    image_url TEXT NOT NULL,
    gallery JSONB DEFAULT '[]'::jsonb,
    specs JSONB DEFAULT '{}'::jsonb,
    current_best_price NUMERIC(12, 2) NOT NULL,
    original_price NUMERIC(12, 2) NOT NULL,
    deal_score INT DEFAULT 70 CHECK (deal_score BETWEEN 0 AND 100),
    currency VARCHAR(10) DEFAULT 'AED',
    country VARCHAR(10) DEFAULT 'ae',
    is_trending BOOLEAN DEFAULT FALSE,
    is_top_deal BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_products_country ON public.products(country);
CREATE INDEX IF NOT EXISTS idx_products_category ON public.products(category_id);
CREATE INDEX IF NOT EXISTS idx_products_slug ON public.products(slug);
CREATE INDEX IF NOT EXISTS idx_products_deal_score ON public.products(deal_score DESC);
CREATE INDEX IF NOT EXISTS idx_products_title_trgm ON public.products USING gin (title gin_trgm_ops);

-- 4. OFFERS TABLE (Merchant Specific Offers for a Product)
CREATE TABLE IF NOT EXISTS public.offers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
    merchant_id UUID NOT NULL REFERENCES public.merchants(id) ON DELETE CASCADE,
    url TEXT NOT NULL,
    price NUMERIC(12, 2) NOT NULL,
    original_price NUMERIC(12, 2),
    currency VARCHAR(10) NOT NULL,
    in_stock BOOLEAN DEFAULT TRUE,
    shipping_info VARCHAR(150) DEFAULT 'Standard Shipping',
    condition VARCHAR(50) DEFAULT 'Brand New',
    affiliate_url TEXT,
    last_checked_at TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_offers_product ON public.offers(product_id);
CREATE INDEX IF NOT EXISTS idx_offers_merchant ON public.offers(merchant_id);
CREATE INDEX IF NOT EXISTS idx_offers_price ON public.offers(price ASC);

-- 5. PRICE HISTORY TABLE
CREATE TABLE IF NOT EXISTS public.price_history (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
    merchant_id UUID REFERENCES public.merchants(id) ON DELETE SET NULL,
    price NUMERIC(12, 2) NOT NULL,
    currency VARCHAR(10) NOT NULL,
    recorded_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_price_history_product_date ON public.price_history(product_id, recorded_at DESC);

-- 6. PROFILES TABLE (Linked with Supabase Auth)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email VARCHAR(255) UNIQUE NOT NULL,
    full_name VARCHAR(150),
    avatar_url TEXT,
    default_country VARCHAR(10) DEFAULT 'ae',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. WATCHLISTS TABLE (Price Tracking)
CREATE TABLE IF NOT EXISTS public.watchlists (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    email VARCHAR(255), -- Support guest alerts via email
    product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
    target_price NUMERIC(12, 2),
    alert_type VARCHAR(50) DEFAULT 'any_drop', -- 'any_drop', 'below_amount', 'major_deal'
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_watchlists_product ON public.watchlists(product_id);
CREATE INDEX IF NOT EXISTS idx_watchlists_user ON public.watchlists(user_id);

-- 8. ALERT EVENTS TABLE (Triggered drops)
CREATE TABLE IF NOT EXISTS public.alert_events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    watchlist_id UUID REFERENCES public.watchlists(id) ON DELETE CASCADE,
    product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
    old_price NUMERIC(12, 2) NOT NULL,
    new_price NUMERIC(12, 2) NOT NULL,
    drop_percentage NUMERIC(5, 2) NOT NULL,
    status VARCHAR(50) DEFAULT 'sent', -- 'pending', 'sent', 'failed'
    triggered_at TIMESTAMPTZ DEFAULT NOW()
);

-- 9. INGESTION SOURCES TABLE
CREATE TABLE IF NOT EXISTS public.ingestion_sources (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(150) NOT NULL,
    merchant_id UUID REFERENCES public.merchants(id) ON DELETE CASCADE,
    adapter_type VARCHAR(50) NOT NULL, -- 'feed', 'api', 'catalog'
    config JSONB DEFAULT '{}'::jsonb,
    is_active BOOLEAN DEFAULT TRUE,
    last_run_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 10. INGESTION RUNS TABLE
CREATE TABLE IF NOT EXISTS public.ingestion_runs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    source_id UUID REFERENCES public.ingestion_sources(id) ON DELETE CASCADE,
    status VARCHAR(50) DEFAULT 'in_progress', -- 'in_progress', 'completed', 'failed'
    items_fetched INT DEFAULT 0,
    items_processed INT DEFAULT 0,
    items_matched INT DEFAULT 0,
    errors JSONB DEFAULT '[]'::jsonb,
    started_at TIMESTAMPTZ DEFAULT NOW(),
    completed_at TIMESTAMPTZ
);

-- 11. PRODUCT MATCHES TABLE
CREATE TABLE IF NOT EXISTS public.product_matches (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    raw_title TEXT NOT NULL,
    matched_product_id UUID REFERENCES public.products(id) ON DELETE SET NULL,
    confidence_score NUMERIC(5, 2) NOT NULL,
    status VARCHAR(50) DEFAULT 'auto_matched', -- 'auto_matched', 'flagged', 'manual_verified'
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 12. SEO PAGES TABLE
CREATE TABLE IF NOT EXISTS public.seo_pages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    route VARCHAR(300) UNIQUE NOT NULL,
    title VARCHAR(255) NOT NULL,
    meta_description TEXT NOT NULL,
    canonical_url TEXT NOT NULL,
    json_ld JSONB DEFAULT '{}'::jsonb,
    last_updated TIMESTAMPTZ DEFAULT NOW()
);

-- 13. OUTBOUND CLICKS TABLE (Analytics & Affiliate Tracking)
CREATE TABLE IF NOT EXISTS public.outbound_clicks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    offer_id UUID REFERENCES public.offers(id) ON DELETE SET NULL,
    product_id UUID REFERENCES public.products(id) ON DELETE SET NULL,
    merchant_id UUID REFERENCES public.merchants(id) ON DELETE SET NULL,
    country VARCHAR(10) NOT NULL,
    price NUMERIC(12, 2),
    currency VARCHAR(10),
    referrer TEXT,
    user_agent TEXT,
    ip_hash VARCHAR(64),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_outbound_clicks_created ON public.outbound_clicks(created_at DESC);

-- Enable Row Level Security (RLS)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.watchlists ENABLE ROW LEVEL SECURITY;

-- Read policies for public tables
CREATE POLICY "Public read categories" ON public.categories FOR SELECT USING (true);
CREATE POLICY "Public read merchants" ON public.merchants FOR SELECT USING (true);
CREATE POLICY "Public read products" ON public.products FOR SELECT USING (true);
CREATE POLICY "Public read offers" ON public.offers FOR SELECT USING (true);
CREATE POLICY "Public read price_history" ON public.price_history FOR SELECT USING (true);
CREATE POLICY "Public read seo_pages" ON public.seo_pages FOR SELECT USING (true);
