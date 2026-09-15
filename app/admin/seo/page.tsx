import React from 'react';
import { AlertTriangle, CheckCircle2, ExternalLink, FileSearch, Globe, SearchX } from 'lucide-react';
import { getServerSupabase } from '@/lib/supabase/server';

type ProductRow = {
  id: string;
  name: string;
  slug: string;
  brand: string | null;
  category_id: string | null;
  image_url: string | null;
  description: string | null;
  status: string;
};

type OfferRow = {
  product_id: string;
  country_code: string;
  is_active: boolean;
  availability: string;
};

const TRUST_ROUTES = [
  ['/about', 'About'],
  ['/contact', 'Contact'],
  ['/privacy', 'Privacy Policy'],
  ['/terms', 'Terms'],
  ['/affiliate-disclosure', 'Affiliate Disclosure'],
  ['/editorial-policy', 'Editorial Policy'],
  ['/data-sources', 'Data Sources'],
  ['/how-pricing-works', 'How Pricing Works'],
] as const;

export default async function AdminSeoPage() {
  const supabase = getServerSupabase();
  let products: ProductRow[] = [];
  let offers: OfferRow[] = [];
  let readError = false;

  if (supabase) {
    const [productsResult, offersResult] = await Promise.all([
      supabase
        .from('products')
        .select('id,name,slug,brand,category_id,image_url,description,status')
        .eq('status', 'active')
        .order('name')
        .limit(1000),
      supabase
        .from('offers')
        .select('product_id,country_code,is_active,availability')
        .eq('is_active', true),
    ]);
    products = (productsResult.data || []) as ProductRow[];
    offers = (offersResult.data || []) as OfferRow[];
    readError = Boolean(productsResult.error || offersResult.error);
  } else {
    readError = true;
  }

  const eligibleOffers = offers.filter((offer) => offer.availability === 'in_stock');
  const productsWithAe = new Set(eligibleOffers.filter((offer) => offer.country_code === 'ae').map((offer) => offer.product_id));
  const productsWithUs = new Set(eligibleOffers.filter((offer) => offer.country_code === 'us').map((offer) => offer.product_id));

  const missingImage = products.filter((product) => !product.image_url).length;
  const missingDescription = products.filter((product) => !product.description?.trim()).length;
  const missingCategory = products.filter((product) => !product.category_id).length;
  const noLiveOffer = products.filter(
    (product) => !productsWithAe.has(product.id) && !productsWithUs.has(product.id)
  ).length;
  const issueCount = missingImage + missingDescription + missingCategory + noLiveOffer;

  return (
    <div className="space-y-6">
      <div className="pb-6 border-b border-ctp">
        <span className="text-[10px] uppercase tracking-[0.18em] font-extrabold text-emerald-400">Production SEO readiness</span>
        <h1 className="text-2xl font-extrabold text-slate-100 mt-1">SEO &amp; structured data</h1>
        <p className="text-xs text-slate-400 mt-1 max-w-3xl">
          This screen reports what CatchThePrice can verify itself. Google indexing and rankings are not claimed until Search Console is connected.
        </p>
      </div>

      {readError && (
        <div className="rounded-2xl border border-rose-500/30 bg-rose-500/10 p-4 text-xs text-rose-100">
          Live catalog SEO diagnostics could not be read from Supabase.
        </div>
      )}

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <Metric label="Active products" value={products.length} note="Canonical product records" />
        <Metric label="UAE product pages" value={productsWithAe.size} note="Products with a live UAE offer" />
        <Metric label="US product pages" value={productsWithUs.size} note="Products with a live US offer" />
        <Metric label="Catalog issues" value={issueCount} note="Missing fields / live offers" warning={issueCount > 0} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <section className="rounded-2xl bg-ctp-surface border border-ctp overflow-hidden">
          <div className="p-4 border-b border-ctp">
            <h2 className="font-bold text-sm text-slate-100 flex items-center gap-2"><FileSearch className="w-4 h-4 text-emerald-400" /> Catalog quality gates</h2>
            <p className="text-[10px] text-slate-500 mt-1">Only source-backed active products should become indexable product pages.</p>
          </div>
          <div className="divide-y divide-ctp text-xs">
            <QualityRow label="Missing product image" value={missingImage} />
            <QualityRow label="Missing description" value={missingDescription} />
            <QualityRow label="Missing category" value={missingCategory} />
            <QualityRow label="No in-stock UAE/US offer" value={noLiveOffer} />
          </div>
        </section>

        <section className="rounded-2xl bg-ctp-surface border border-ctp overflow-hidden">
          <div className="p-4 border-b border-ctp">
            <h2 className="font-bold text-sm text-slate-100 flex items-center gap-2"><Globe className="w-4 h-4 text-emerald-400" /> Crawl &amp; market scope</h2>
            <p className="text-[10px] text-slate-500 mt-1">Current launch scope is intentionally narrow.</p>
          </div>
          <div className="p-4 space-y-3 text-xs">
            <StatusRow good label="Launch markets" value="UAE + United States only" />
            <StatusRow good label="robots.txt" value="Admin/API/search and future markets blocked" href="/robots.txt" />
            <StatusRow good label="sitemap.xml" value="Launch markets only; live product URLs only" href="/sitemap.xml" />
            <StatusRow label="Google Search Console" value="Not connected yet — no indexing claims shown" />
            <StatusRow label="Rank tracking" value="Not connected yet" />
          </div>
        </section>
      </div>

      <section className="rounded-2xl bg-ctp-surface border border-ctp overflow-hidden">
        <div className="p-4 border-b border-ctp flex items-center justify-between gap-3">
          <div>
            <h2 className="font-bold text-sm text-slate-100">Trust &amp; publisher pages</h2>
            <p className="text-[10px] text-slate-500 mt-1">Required trust pages currently present in the application.</p>
          </div>
          <span className="text-xs text-emerald-400 font-bold">{TRUST_ROUTES.length} routes</span>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-2 p-4">
          {TRUST_ROUTES.map(([href, label]) => (
            <a key={href} href={href} target="_blank" rel="noopener noreferrer" className="rounded-xl border border-ctp bg-slate-900/50 px-3 py-3 text-xs text-slate-300 hover:text-white hover:border-emerald-500/30 flex items-center justify-between gap-2">
              <span>{label}</span><ExternalLink className="w-3.5 h-3.5 text-emerald-400" />
            </a>
          ))}
        </div>
      </section>

      <section className="rounded-2xl border border-ctp bg-slate-900/50 p-4 text-[11px] text-slate-400 flex items-start gap-2">
        {products.length > 0 && issueCount === 0 ? <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" /> : <SearchX className="w-4 h-4 text-amber-300 shrink-0" />}
        <span>
          Product JSON-LD is emitted only for non-preview product pages. Do not treat schema presence as Google validation; rich-result eligibility must be verified separately after the real domain and Search Console are connected.
        </span>
      </section>
    </div>
  );
}

function Metric({ label, value, note, warning = false }: { label: string; value: number; note: string; warning?: boolean }) {
  return (
    <div className="rounded-2xl bg-ctp-surface border border-ctp p-4">
      <div className="text-[10px] uppercase tracking-wider font-bold text-slate-500">{label}</div>
      <div className={`text-2xl font-extrabold mt-1 ${warning && value > 0 ? 'text-amber-300' : 'text-slate-100'}`}>{value.toLocaleString()}</div>
      <div className="text-[10px] text-slate-500 mt-1">{note}</div>
    </div>
  );
}

function QualityRow({ label, value }: { label: string; value: number }) {
  const good = value === 0;
  return (
    <div className="px-4 py-3 flex items-center justify-between gap-3">
      <span className="text-slate-300">{label}</span>
      <span className={`inline-flex items-center gap-1.5 font-extrabold ${good ? 'text-emerald-400' : 'text-amber-300'}`}>
        {good ? <CheckCircle2 className="w-3.5 h-3.5" /> : <AlertTriangle className="w-3.5 h-3.5" />}
        {value}
      </span>
    </div>
  );
}

function StatusRow({ label, value, good = false, href }: { label: string; value: string; good?: boolean; href?: string }) {
  const content = (
    <div className="flex items-start justify-between gap-3">
      <span className="text-slate-500">{label}</span>
      <span className={`text-right font-semibold ${good ? 'text-emerald-300' : 'text-slate-300'}`}>{value}</span>
    </div>
  );
  return href ? <a href={href} target="_blank" rel="noopener noreferrer" className="block hover:bg-slate-800/30 rounded-lg p-1 -m-1">{content}</a> : content;
}
