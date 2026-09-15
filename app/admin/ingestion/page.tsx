import React from 'react';
import { Database, FileText, AlertTriangle, CheckCircle2, Clock, ShieldCheck } from 'lucide-react';
import { getServerSupabase } from '@/lib/supabase/server';

type SourceRow = {
  id: string;
  name: string;
  source_type: string;
  country_code: string;
  base_url: string | null;
  is_active: boolean;
  updated_at: string;
};

type RunRow = {
  id: string;
  source_id: string | null;
  status: string;
  items_seen: number;
  items_created: number;
  items_updated: number;
  error_message: string | null;
  started_at: string | null;
  finished_at: string | null;
  created_at: string;
};

function formatTime(value?: string | null) {
  if (!value) return '—';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat('en', {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  }).format(date);
}

export default async function AdminIngestionPage() {
  const supabase = getServerSupabase();

  let sources: SourceRow[] = [];
  let runs: RunRow[] = [];
  let readError = false;

  if (supabase) {
    const [sourcesResult, runsResult] = await Promise.all([
      supabase
        .from('ingestion_sources')
        .select('id,name,source_type,country_code,base_url,is_active,updated_at')
        .order('updated_at', { ascending: false }),
      supabase
        .from('ingestion_runs')
        .select('id,source_id,status,items_seen,items_created,items_updated,error_message,started_at,finished_at,created_at')
        .order('created_at', { ascending: false })
        .limit(50),
    ]);

    readError = Boolean(sourcesResult.error || runsResult.error);
    sources = (sourcesResult.data || []) as SourceRow[];
    runs = (runsResult.data || []) as RunRow[];
  } else {
    readError = true;
  }

  const sourceMap = new Map(sources.map((source) => [source.id, source]));
  const activeSources = sources.filter((source) => source.is_active).length;
  const completedRuns = runs.filter((run) => run.status === 'completed' || run.status === 'success').length;
  const failedRuns = runs.filter((run) => run.status === 'failed' || run.status === 'error').length;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 pb-6 border-b border-ctp">
        <div>
          <span className="text-[10px] font-extrabold uppercase tracking-[0.18em] text-emerald-400">Live operations data</span>
          <h1 className="text-2xl font-extrabold text-slate-100 mt-1">Merchant data ingestion</h1>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl">
            This screen reads the real ingestion_sources and ingestion_runs tables. No sample runs or simulated success records are displayed.
          </p>
        </div>
        <div className="text-[10px] text-slate-400 rounded-xl border border-ctp bg-slate-900 px-3 py-2">
          Manual run controls stay disabled until the first approved source adapter is connected.
        </div>
      </div>

      {readError && (
        <div className="rounded-2xl border border-rose-500/30 bg-rose-500/10 p-4 flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-rose-300 shrink-0" />
          <div>
            <h2 className="text-sm font-bold text-rose-100">Could not read ingestion state</h2>
            <p className="text-xs text-rose-100/75 mt-1">Check the server Supabase configuration before enabling any production feed.</p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="rounded-2xl bg-ctp-surface border border-ctp p-4">
          <div className="text-[10px] uppercase tracking-wider font-bold text-slate-500">Configured sources</div>
          <div className="text-2xl font-extrabold text-slate-100 mt-1">{sources.length}</div>
          <div className="text-[10px] text-slate-400 mt-1">{activeSources} active</div>
        </div>
        <div className="rounded-2xl bg-ctp-surface border border-ctp p-4">
          <div className="text-[10px] uppercase tracking-wider font-bold text-slate-500">Recorded runs</div>
          <div className="text-2xl font-extrabold text-slate-100 mt-1">{runs.length}</div>
          <div className="text-[10px] text-slate-400 mt-1">Last 50 shown</div>
        </div>
        <div className="rounded-2xl bg-ctp-surface border border-ctp p-4">
          <div className="text-[10px] uppercase tracking-wider font-bold text-slate-500">Completed</div>
          <div className="text-2xl font-extrabold text-emerald-400 mt-1">{completedRuns}</div>
          <div className="text-[10px] text-slate-400 mt-1">Persisted successes only</div>
        </div>
        <div className="rounded-2xl bg-ctp-surface border border-ctp p-4">
          <div className="text-[10px] uppercase tracking-wider font-bold text-slate-500">Failed</div>
          <div className="text-2xl font-extrabold text-rose-300 mt-1">{failedRuns}</div>
          <div className="text-[10px] text-slate-400 mt-1">Needs review</div>
        </div>
      </div>

      <section className="p-5 rounded-2xl bg-ctp-surface border border-ctp space-y-4">
        <div className="flex items-start gap-3">
          <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
            <ShieldCheck className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-bold text-sm text-slate-100">Approved-source pipeline</h3>
            <p className="text-xs text-slate-400 mt-1">
              Fetch → normalize → identify exact variant → match → persist offers → record price observation → publish only when source rights allow it.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-6 gap-2 text-center text-[10px]">
          {['FETCH', 'NORMALIZE', 'IDENTIFY', 'MATCH', 'PERSIST', 'PUBLISH'].map((step, index) => (
            <div key={step} className="p-2.5 rounded-xl bg-slate-900 border border-ctp">
              <span className="text-emerald-400 font-extrabold block">{index + 1}. {step}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-2xl bg-ctp-surface border border-ctp overflow-hidden">
        <div className="p-4 border-b border-ctp flex items-center justify-between gap-3">
          <div>
            <h3 className="font-bold text-sm text-slate-200 flex items-center gap-2"><Database className="w-4 h-4 text-emerald-400" /> Sources</h3>
            <p className="text-[10px] text-slate-500 mt-1">Real rows from ingestion_sources</p>
          </div>
          <span className="text-xs text-slate-400">{sources.length}</span>
        </div>

        {sources.length === 0 ? (
          <div className="p-8 text-center">
            <FileText className="w-8 h-8 text-slate-600 mx-auto" />
            <h4 className="text-sm font-bold text-slate-200 mt-3">No source is connected yet</h4>
            <p className="text-xs text-slate-400 mt-1 max-w-lg mx-auto">
              This is the correct production state until an API, affiliate feed, merchant export, or other permitted source is approved and configured.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-ctp-surface-elevated text-slate-500 uppercase tracking-wider text-[10px] border-b border-ctp">
                <tr><th className="p-3.5">Source</th><th className="p-3.5">Type</th><th className="p-3.5">Market</th><th className="p-3.5">Updated</th><th className="p-3.5 text-right">Status</th></tr>
              </thead>
              <tbody className="divide-y divide-ctp">
                {sources.map((source) => (
                  <tr key={source.id}>
                    <td className="p-3.5 font-semibold text-slate-100">{source.name}</td>
                    <td className="p-3.5 text-slate-400">{source.source_type}</td>
                    <td className="p-3.5 uppercase">{source.country_code}</td>
                    <td className="p-3.5 text-slate-400">{formatTime(source.updated_at)}</td>
                    <td className="p-3.5 text-right">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${source.is_active ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' : 'bg-slate-800 text-slate-400 border-slate-700'}`}>
                        {source.is_active ? 'Active' : 'Disabled'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <section className="rounded-2xl bg-ctp-surface border border-ctp overflow-hidden">
        <div className="p-4 border-b border-ctp flex items-center justify-between">
          <div>
            <h3 className="font-bold text-sm text-slate-200 flex items-center gap-2"><Clock className="w-4 h-4 text-emerald-400" /> Execution history</h3>
            <p className="text-[10px] text-slate-500 mt-1">Real rows from ingestion_runs</p>
          </div>
          <span className="text-xs text-slate-400">{runs.length}</span>
        </div>

        {runs.length === 0 ? (
          <div className="p-8 text-center text-xs text-slate-400">No real ingestion run has been recorded yet.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-ctp-surface-elevated text-slate-500 uppercase tracking-wider text-[10px] border-b border-ctp">
                <tr><th className="p-3.5">Run</th><th className="p-3.5">Source</th><th className="p-3.5">Seen</th><th className="p-3.5">Created</th><th className="p-3.5">Updated</th><th className="p-3.5">Started</th><th className="p-3.5 text-right">Status</th></tr>
              </thead>
              <tbody className="divide-y divide-ctp">
                {runs.map((run) => {
                  const source = run.source_id ? sourceMap.get(run.source_id) : undefined;
                  const ok = run.status === 'completed' || run.status === 'success';
                  return (
                    <tr key={run.id}>
                      <td className="p-3.5 font-mono text-[10px] text-slate-400">{run.id.slice(0, 8)}</td>
                      <td className="p-3.5 font-semibold text-slate-100">{source?.name || 'Unknown source'}</td>
                      <td className="p-3.5">{run.items_seen || 0}</td>
                      <td className="p-3.5">{run.items_created || 0}</td>
                      <td className="p-3.5">{run.items_updated || 0}</td>
                      <td className="p-3.5 text-slate-400">{formatTime(run.started_at || run.created_at)}</td>
                      <td className="p-3.5 text-right">
                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold border ${ok ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' : 'bg-rose-500/10 text-rose-300 border-rose-500/30'}`}>
                          {ok && <CheckCircle2 className="w-3 h-3" />}{run.status}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}
