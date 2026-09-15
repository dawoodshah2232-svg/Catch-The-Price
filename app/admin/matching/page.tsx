import React from 'react';
import { GitMerge, ShieldAlert, CheckCircle2, SearchX } from 'lucide-react';
import { getServerSupabase } from '@/lib/supabase/server';

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
  let matches: MatchRow[] = [];
  let readError = false;

  if (supabase) {
    const { data, error } = await supabase
      .from('product_matches')
      .select('id,source_name,source_product_id,product_id,confidence,match_method,raw_title,created_at,products(name,slug)')
      .order('created_at', { ascending: false })
      .limit(200);
    matches = (data || []) as MatchRow[];
    readError = Boolean(error);
  } else {
    readError = true;
  }

  const reviewCount = matches.filter((m) => Number(m.confidence) >= 80 && Number(m.confidence) < 95).length;
  const manualCount = matches.filter((m) => Number(m.confidence) < 80).length;
  const autoSafeCount = matches.filter((m) => Number(m.confidence) >= 95).length;

  return (
    <div className="space-y-6">
      <div className="pb-6 border-b border-ctp">
        <span className="text-[10px] uppercase tracking-[0.18em] font-extrabold text-emerald-400">Real matching records</span>
        <h1 className="text-2xl font-extrabold text-slate-100 mt-1">Product matching queue</h1>
        <p className="text-xs text-slate-400 mt-1 max-w-2xl">
          Confidence rules: 95–100% can be auto-accepted by the future pipeline, 80–94% requires review, and below 80% stays manual. This screen does not simulate approvals.
        </p>
      </div>

      {readError && <div className="rounded-2xl border border-rose-500/30 bg-rose-500/10 p-4 text-xs text-rose-100">Could not read product_matches from Supabase.</div>}

      <div className="grid grid-cols-3 gap-3">
        <div className="rounded-2xl bg-ctp-surface border border-ctp p-4"><div className="text-[10px] uppercase tracking-wider font-bold text-slate-500">Auto-safe</div><div className="text-2xl font-extrabold text-emerald-400 mt-1">{autoSafeCount}</div></div>
        <div className="rounded-2xl bg-ctp-surface border border-ctp p-4"><div className="text-[10px] uppercase tracking-wider font-bold text-slate-500">Review</div><div className="text-2xl font-extrabold text-amber-300 mt-1">{reviewCount}</div></div>
        <div className="rounded-2xl bg-ctp-surface border border-ctp p-4"><div className="text-[10px] uppercase tracking-wider font-bold text-slate-500">Manual</div><div className="text-2xl font-extrabold text-rose-300 mt-1">{manualCount}</div></div>
      </div>

      {matches.length === 0 ? (
        <div className="rounded-2xl bg-ctp-surface border border-ctp p-10 text-center">
          <SearchX className="w-8 h-8 text-slate-600 mx-auto" />
          <h3 className="text-sm font-bold text-slate-200 mt-3">No real matching records yet</h3>
          <p className="text-xs text-slate-400 mt-1">The queue will populate after the first approved source feed is ingested.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {matches.map((item) => {
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

                  <div>
                    <span className="text-[10px] text-slate-500 uppercase font-semibold block">Raw source title</span>
                    <p className="text-xs text-slate-300 font-mono break-words">{item.raw_title || 'Not recorded'}</p>
                  </div>

                  <div>
                    <span className="text-[10px] text-slate-500 uppercase font-semibold block">Candidate canonical product</span>
                    <p className="text-xs font-bold text-slate-100">{product?.name || 'No product assigned'}</p>
                    <p className="text-[10px] text-slate-500 mt-0.5">Method: {item.match_method}</p>
                  </div>
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
          })}
        </div>
      )}

      <div className="rounded-2xl border border-ctp bg-slate-900/50 p-4 text-[11px] text-slate-400 flex items-start gap-2">
        <GitMerge className="w-4 h-4 text-emerald-400 shrink-0" />
        Review/approve write controls will only be enabled after we add an auditable decision field and server-side admin action. Until then this page is read-only by design.
      </div>
    </div>
  );
}
