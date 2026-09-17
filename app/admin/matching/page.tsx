import React from 'react';
import { CheckCircle2, GitMerge, Layers3, SearchX } from 'lucide-react';
import { getServerSupabase } from '@/lib/supabase/server';
import { IngestionReviewActions } from '@/components/admin/IngestionReviewActions';

type StagedItem = {
  id: string;
  source_id: string;
  source_product_id: string;
  raw_title: string;
  normalized_title: string;
  brand: string | null;
  category_slug: string | null;
  price: number | string;
  currency: string;
  gtin: string | null;
  mpn: string | null;
  model: string | null;
  image_url: string | null;
  match_status: string;
  review_status: string;
  product_id: string | null;
  confidence: number | string | null;
  published_offer_id: string | null;
  created_at: string;
  updated_at: string;
};

type MatchRow = {
  id: string;
  source_name: string;
  source_product_id: string;
  product_id: string | null;
  confidence: number | string;
  match_method: string;
  raw_title: string | null;
  created_at: string;
  products: { name: string; slug: string } | { name: string; slug: string }[] | null;
};

type ProductOption = {
  id: string;
  name: string;
  brand: string | null;
  model: string | null;
  status: string;
};

type SourceRow = { id: string; name: string; country_code: string };

function relation<T>(value: T | T[] | null): T | null {
  if (!value) return null;
  return Array.isArray(value) ? value[0] || null : value;
}

function confidenceBand(value: number) {
  if (value >= 95) return { label: 'Exact / approved', className: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' };
  if (value >= 80) return { label: 'Review', className: 'bg-amber-500/10 text-amber-300 border-amber-500/30' };
  return { label: 'Manual', className: 'bg-rose-500/10 text-rose-300 border-rose-500/30' };
}

function stateClass(state: string) {
  if (state === 'published') return 'border-emerald-500/30 bg-emerald-500/10 text-emerald-300';
  if (state === 'approved') return 'border-cyan-500/30 bg-cyan-500/10 text-cyan-200';
  if (state === 'rejected') return 'border-rose-500/30 bg-rose-500/10 text-rose-300';
  return 'border-amber-500/30 bg-amber-500/10 text-amber-200';
}

export default async function AdminMatchingPage() {
  const supabase = getServerSupabase();
  let staged: StagedItem[] = [];
  let matches: MatchRow[] = [];
  let products: ProductOption[] = [];
  let sources: SourceRow[] = [];
  let readError = false;

  if (supabase) {
    const [stagedResult, matchesResult, productsResult, sourcesResult] = await Promise.all([
      supabase
        .from('ingestion_items')
        .select('id,source_id,source_product_id,raw_title,normalized_title,brand,category_slug,price,currency,gtin,mpn,model,image_url,match_status,review_status,product_id,confidence,published_offer_id,created_at,updated_at')
        .order('updated_at', { ascending: false })
        .limit(200),
      supabase
        .from('product_matches')
        .select('id,source_name,source_product_id,product_id,confidence,match_method,raw_title,created_at,products(name,slug)')
        .order('created_at', { ascending: false })
        .limit(100),
      supabase
        .from('products')
        .select('id,name,brand,model,status')
        .order('brand')
        .order('name')
        .limit(500),
      supabase.from('ingestion_sources').select('id,name,country_code'),
    ]);

    staged = (stagedResult.data || []) as StagedItem[];
    matches = (matchesResult.data || []) as MatchRow[];
    products = (productsResult.data || []) as ProductOption[];
    sources = (sourcesResult.data || []) as SourceRow[];
    readError = Boolean(stagedResult.error || matchesResult.error || productsResult.error || sourcesResult.error);
  } else {
    readError = true;
  }

  const sourceMap = new Map(sources.map((source) => [source.id, source]));
  const pendingCount = staged.filter((item) => item.review_status === 'pending').length;
  const approvedCount = staged.filter((item) => item.review_status === 'approved').length;
  const publishedCount = staged.filter((item) => item.review_status === 'published').length;
  const rejectedCount = staged.filter((item) => item.review_status === 'rejected').length;

  return (
    <div className="space-y-6">
      <div className="pb-6 border-b border-ctp">
        <span className="text-[10px] uppercase tracking-[0.18em] font-extrabold text-emerald-400">Human-gated publishing</span>
        <h1 className="text-2xl font-extrabold text-slate-100 mt-1">Product matching & publishing desk</h1>
        <p className="text-xs text-slate-400 mt-1 max-w-3xl">
          Every feed item must be tied to the exact canonical product before it can become public. Create a new canonical product only when necessary; otherwise assign an existing exact variant. Publishing re-checks source rights, product image permission and retailer destination.
        </p>
      </div>

      {readError && (
        <div className="rounded-2xl border border-rose-500/30 bg-rose-500/10 p-4 text-xs text-rose-100">
          Could not read one or more live matching tables from Supabase.
        </div>
      )}

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <Metric label="Pending review" value={pendingCount} tone="text-amber-200" />
        <Metric label="Approved match" value={approvedCount} tone="text-cyan-200" />
        <Metric label="Published" value={publishedCount} tone="text-emerald-400" />
        <Metric label="Rejected" value={rejectedCount} tone="text-rose-300" />
      </div>

      <section className="rounded-2xl bg-ctp-surface border border-ctp overflow-hidden">
        <div className="p-4 border-b border-ctp flex items-center justify-between gap-3">
          <div>
            <h2 className="text-sm font-bold text-slate-100 flex items-center gap-2"><Layers3 className="w-4 h-4 text-cyan-300" /> Staged feed review</h2>
            <p className="text-[10px] text-slate-500 mt-1">Only real items staged by approved ingestion runs</p>
          </div>
          <span className="text-xs text-slate-400">{staged.length}</span>
        </div>

        {staged.length === 0 ? (
          <div className="p-10 text-center">
            <SearchX className="w-8 h-8 text-slate-600 mx-auto" />
            <h3 className="text-sm font-bold text-slate-200 mt-3">No staged feed items yet</h3>
            <p className="text-xs text-slate-400 mt-1">This will populate after an approved merchant/feed source is connected and run.</p>
          </div>
        ) : (
          <div className="divide-y divide-ctp">
            {staged.map((item) => {
              const source = sourceMap.get(item.source_id);
              return (
                <div key={item.id} className="p-4 grid xl:grid-cols-[minmax(0,1fr)_250px] gap-4 items-start">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-[10px] font-bold rounded-lg border border-ctp bg-slate-900 px-2 py-1 text-slate-300">{source?.name || 'Unknown source'}</span>
                      {source?.country_code && <span className="text-[10px] uppercase font-extrabold text-slate-500">{source.country_code}</span>}
                      <span className={`px-2 py-1 rounded-lg text-[10px] font-extrabold border ${stateClass(item.review_status)}`}>{item.review_status}</span>
                      <span className="font-mono text-[10px] text-slate-600">{item.source_product_id}</span>
                    </div>

                    <div className="mt-3 grid sm:grid-cols-[1fr_auto] gap-3">
                      <div className="min-w-0">
                        <h3 className="text-sm font-extrabold text-slate-100 break-words">{item.normalized_title}</h3>
                        {item.raw_title !== item.normalized_title && <p className="mt-1 text-[10px] text-slate-500 break-words">Source: {item.raw_title}</p>}
                        <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-[10px] text-slate-400">
                          <span><strong className="text-slate-300">Brand:</strong> {item.brand || 'Unknown'}</span>
                          <span><strong className="text-slate-300">Category:</strong> {item.category_slug || 'Unclassified'}</span>
                          <span><strong className="text-slate-300">Price:</strong> {item.currency} {Number(item.price).toLocaleString()}</span>
                        </div>
                      </div>

                      {item.image_url && (
                        <div className="w-20 h-20 rounded-xl bg-white border border-slate-700 p-2 flex items-center justify-center overflow-hidden">
                          <img src={item.image_url} alt="" className="max-w-full max-h-full object-contain" />
                        </div>
                      )}
                    </div>

                    <div className="mt-3 grid grid-cols-2 sm:grid-cols-4 gap-2 text-[10px]">
                      <Evidence label="GTIN / UPC / EAN" value={item.gtin} />
                      <Evidence label="MPN" value={item.mpn} />
                      <Evidence label="Model" value={item.model} />
                      <Evidence label="Match confidence" value={item.confidence ? `${Number(item.confidence).toFixed(1)}%` : null} />
                    </div>

                    {item.product_id && (
                      <div className="mt-3 text-[10px] text-slate-400">
                        Canonical product ID: <span className="font-mono text-cyan-200">{item.product_id}</span>
                        {item.published_offer_id && <> · Offer ID: <span className="font-mono text-emerald-300">{item.published_offer_id}</span></>}
                      </div>
                    )}
                  </div>

                  <IngestionReviewActions
                    itemId={item.id}
                    reviewStatus={item.review_status}
                    currentProductId={item.product_id}
                    products={products}
                  />
                </div>
              );
            })}
          </div>
        )}
      </section>

      <section className="space-y-3">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h2 className="text-sm font-bold text-slate-100">Match evidence log</h2>
            <p className="text-[10px] text-slate-500 mt-1">Auditable rows recorded when a match is approved or a canonical product is created</p>
          </div>
          <span className="text-xs text-slate-400">{matches.length}</span>
        </div>

        {matches.length === 0 ? (
          <div className="rounded-2xl bg-ctp-surface border border-ctp p-8 text-center text-xs text-slate-400">No match decisions have been recorded yet.</div>
        ) : (
          matches.map((item) => {
            const confidence = Number(item.confidence) || 0;
            const band = confidenceBand(confidence);
            const product = relation(item.products);
            return (
              <div key={item.id} className="p-4 rounded-2xl bg-ctp-surface border border-ctp flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-2 flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-xs font-semibold px-2 py-0.5 rounded bg-slate-900 border border-ctp text-slate-300">{item.source_name}</span>
                    <span className="text-[10px] text-slate-500 font-mono">{item.source_product_id}</span>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-extrabold border ${band.className}`}>{confidence.toFixed(1)}% · {band.label}</span>
                  </div>
                  <div><span className="text-[10px] text-slate-500 uppercase font-semibold block">Source title</span><p className="text-xs text-slate-300 break-words">{item.raw_title || 'Not recorded'}</p></div>
                  <div><span className="text-[10px] text-slate-500 uppercase font-semibold block">Canonical product</span><p className="text-xs font-bold text-slate-100">{product?.name || 'Product unavailable'}</p><p className="text-[10px] text-slate-500 mt-0.5">Method: {item.match_method}</p></div>
                </div>
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-xs font-bold shrink-0"><CheckCircle2 className="w-4 h-4" /> Decision recorded</span>
              </div>
            );
          })
        )}
      </section>

      <div className="rounded-2xl border border-ctp bg-slate-900/50 p-4 text-[11px] text-slate-400 flex items-start gap-2">
        <GitMerge className="w-4 h-4 text-emerald-400 shrink-0" />
        Publishing is deliberately human-gated. A staged item cannot publish until a canonical product is approved, source rights are active, an HTTPS retailer destination is valid, and a rights-cleared product image exists.
      </div>
    </div>
  );
}

function Metric({ label, value, tone }: { label: string; value: number; tone: string }) {
  return <div className="rounded-2xl bg-ctp-surface border border-ctp p-4"><div className="text-[10px] uppercase tracking-wider font-bold text-slate-500">{label}</div><div className={`text-2xl font-extrabold mt-1 ${tone}`}>{value}</div></div>;
}

function Evidence({ label, value }: { label: string; value: string | null }) {
  return (
    <div className="rounded-xl border border-ctp bg-[#071015] px-2.5 py-2 min-w-0">
      <div className="text-[9px] uppercase tracking-wider text-slate-600 font-bold">{label}</div>
      <div className={`mt-0.5 truncate font-mono ${value ? 'text-slate-300' : 'text-slate-600'}`} title={value || undefined}>{value || 'Not provided'}</div>
    </div>
  );
}
