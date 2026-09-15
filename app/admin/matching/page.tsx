import React from 'react';
import { GitMerge, ShieldAlert, CheckCircle2, SearchX, Layers3 } from 'lucide-react';
import { getServerSupabase } from '@/lib/supabase/server';

type StagedItem = {
  id: string;
  source_id: string;
  run_id: string;
  source_product_id: string;
  raw_title: string;
  normalized_title: string;
  brand: string | null;
  category_slug: string | null;
  price: number | string;
  currency: string;
  match_status: string;
  product_id: string | null;
  confidence: number | string | null;
  created_at: string;
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

function relation<T>(value: T | T[] | null): T | null {
  if (!value) return null;
  return Array.isArray(value) ? value[0] || null : value;
}

function confidenceBand(value: number) {
  if (value >= 95) return { label: 'Auto-safe', className: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' };
  if (value >= 80) return { label: 'Review', className: 'bg-amber-500/10 text-amber-300 border-amber-500/30' };
  return { label: 'Manual', className: 'bg-rose-500/10 text-rose-300 border-rose-500/30' };
}

export default async function AdminMatchingPage() {
  const supabase = getServerSupabase();
  let staged: StagedItem[] = [];
  let matches: MatchRow[] = [];
  let readError = false;

  if (supabase) {
    const [stagedResult, matchesResult] = await Promise.all([
      supabase
        .from('ingestion_items')
        .select('id,source_id,run_id,source_product_id,raw_title,normalized_title,brand,category_slug,price,currency,match_status,product_id,confidence,created_at')
        .order('created_at', { ascending: false })
        .limit(200),
      supabase
        .from('product_matches')
        .select('id,source_name,source_product_id,product_id,confidence,match_method,raw_title,created_at,products(name,slug)')
        .order('created_at', { ascending: false })
        .limit(200),
    ]);
    staged = (stagedResult.data || []) as StagedItem[];
    matches = (matchesResult.data || []) as MatchRow[];
    readError = Boolean(stagedResult.error || matchesResult.error);
  } else {
    readError = true;
  }

  const reviewCount = matches.filter((m) => Number(m.confidence) >= 80 && Number(m.confidence) < 95).length;
  const manualCount = matches.filter((m) => Number(m.confidence) < 80).length;
  const autoSafeCount = matches.filter((m) => Number(m.confidence) >= 95).length;
  const pendingStageCount = staged.filter((item) => item.match_status === 'pending').length;

  return (
    <div className="space-y-6">
      <div className="pb-6 border-b border-ctp">
        <span className="text-[10px] uppercase tracking-[0.18em] font-extrabold text-emerald-400">Real matching records</span>
        <h1 className="text-2xl font-extrabold text-slate-100 mt-1">Product matching queue</h1>
        <p className="text-xs text-slate-400 mt-1 max-w-2xl">
          Feed items are staged first. Matching evidence is recorded separately. Nothing in this screen is simulated and no staged item becomes public automatically.
        </p>
      </div>

      {readError && <div className="rounded-2xl border border-rose-500/30 bg-rose-500/10 p-4 text-xs text-rose-100">Could not read the live matching tables from Supabase.</div>}

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="rounded-2xl bg-ctp-surface border border-ctp p-4"><div className="text-[10px] uppercase tracking-wider font-bold text-slate-500">Pending staged</div><div className="text-2xl font-extrabold text-cyan-300 mt-1">{pendingStageCount}</div></div>
        <div className="rounded-2xl bg-ctp-surface border border-ctp p-4"><div className="text-[10px] uppercase tracking-wider font-bold text-slate-500">Auto-safe</div><div className="text-2xl font-extrabold text-emerald-400 mt-1">{autoSafeCount}</div></div>
        <div className="rounded-2xl bg-ctp-surface border border-ctp p-4"><div className="text-[10px] uppercase tracking-wider font-bold text-slate-500">Review</div><div className="text-2xl font-extrabold text-amber-300 mt-1">{reviewCount}</div></div>
        <div className="rounded-2xl bg-ctp-surface border border-ctp p-4"><div className="text-[10px] uppercase tracking-wider font-bold text-slate-500">Manual</div><div className="text-2xl font-extrabold text-rose-300 mt-1">{manualCount}</div></div>
      </div>

      <section className="rounded-2xl bg-ctp-surface border border-ctp overflow-hidden">
        <div className="p-4 border-b border-ctp flex items-center justify-between gap-3">
          <div>
            <h2 className="text-sm font-bold text-slate-100 flex items-center gap-2"><Layers3 className="w-4 h-4 text-cyan-300" /> Staged feed items</h2>
            <p className="text-[10px] text-slate-500 mt-1">Normalized but not published</p>
          </div>
          <span className="text-xs text-slate-400">{staged.length}</span>
        </div>

        {staged.length === 0 ? (
          <div className="p-8 text-center">
            <SearchX className="w-8 h-8 text-slate-600 mx-auto" />
            <h3 className="text-sm font-bold text-slate-200 mt-3">No staged feed items yet</h3>
            <p className="text-xs text-slate-400 mt-1">They will appear after the first approved source run.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-ctp-surface-elevated text-slate-500 uppercase tracking-wider text-[10px] border-b border-ctp">
                <tr><th className="p-3.5">Source item</th><th className="p-3.5">Normalized title</th><th className="p-3.5">Category</th><th className="p-3.5">Price</th><th className="p-3.5 text-right">State</th></tr>
              </thead>
              <tbody className="divide-y divide-ctp">
                {staged.map((item) => (
                  <tr key={item.id}>
                    <td className="p-3.5"><div className="font-mono text-[10px] text-slate-500">{item.source_product_id}</div><div className="mt-1 max-w-sm break-words">{item.raw_title}</div></td>
                    <td className="p-3.5"><div className="font-semibold text-slate-100 max-w-sm break-words">{item.normalized_title}</div><div className="text-[10px] text-slate-500 mt-1">{item.brand || 'Unknown brand'}</div></td>
                    <td className="p-3.5 text-slate-400">{item.category_slug || 'Unclassified'}</td>
                    <td className="p-3.5 whitespace-nowrap font-bold text-slate-100">{item.currency} {Number(item.price).toLocaleString()}</td>
                    <td className="p-3.5 text-right"><span className="px-2 py-0.5 rounded text-[10px] font-bold border border-cyan-500/25 bg-cyan-500/10 text-cyan-300">{item.match_status}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <section className="space-y-3">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h2 className="text-sm font-bold text-slate-100">Recorded match evidence</h2>
            <p className="text-[10px] text-slate-500 mt-1">Rows from product_matches</p>
          </div>
          <span className="text-xs text-slate-400">{matches.length}</span>
        </div>

        {matches.length === 0 ? (
          <div className="rounded-2xl bg-ctp-surface border border-ctp p-8 text-center text-xs text-slate-400">No real product-match records yet.</div>
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
                  <div><span className="text-[10px] text-slate-500 uppercase font-semibold block">Raw source title</span><p className="text-xs text-slate-300 font-mono break-words">{item.raw_title || 'Not recorded'}</p></div>
                  <div><span className="text-[10px] text-slate-500 uppercase font-semibold block">Candidate canonical product</span><p className="text-xs font-bold text-slate-100">{product?.name || 'No product assigned'}</p><p className="text-[10px] text-slate-500 mt-0.5">Method: {item.match_method}</p></div>
                </div>
                <div className="shrink-0">
                  {confidence >= 95 ? (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-xs font-bold"><CheckCircle2 className="w-4 h-4" /> Auto-safe band</span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500/10 text-amber-300 border border-amber-500/30 text-xs font-bold"><ShieldAlert className="w-4 h-4" /> Human review needed</span>
                  )}
                </div>
              </div>
            );
          })
        )}
      </section>

      <div className="rounded-2xl border border-ctp bg-slate-900/50 p-4 text-[11px] text-slate-400 flex items-start gap-2">
        <GitMerge className="w-4 h-4 text-emerald-400 shrink-0" />
        Publishing remains disabled until auditable match approval and exact-variant persistence are implemented.
      </div>
    </div>
  );
}
