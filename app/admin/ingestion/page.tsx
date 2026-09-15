'use client';

import React, { useCallback, useEffect, useState } from 'react';
import { AlertTriangle, CheckCircle2, Database, Key, Loader2, Play, RefreshCw, ShieldCheck } from 'lucide-react';

type Readiness = 'disabled' | 'pending_rights' | 'missing_credentials' | 'ready' | 'invalid_config';

type SourceRow = {
  id: string;
  name: string;
  sourceType: string;
  country: string;
  baseUrl: string | null;
  adapter: string;
  rightsId: string;
  rightsStatus: string;
  rightsReady: boolean;
  credentialReady: boolean;
  credentialEnvKey: string | null;
  isActive: boolean;
  readiness: Readiness;
  updatedAt: string | null;
};

type RunRow = {
  id: string;
  sourceId: string;
  sourceName: string;
  country: string;
  status: string;
  itemsSeen: number;
  itemsStaged: number;
  itemsRejected: number;
  itemsCreated: number;
  itemsUpdated: number;
  error: string | null;
  startedAt: string | null;
  finishedAt: string | null;
  createdAt: string;
};

function readinessLabel(value: Readiness) {
  if (value === 'ready') return 'Ready';
  if (value === 'pending_rights') return 'Rights pending';
  if (value === 'missing_credentials') return 'Credential missing';
  if (value === 'invalid_config') return 'Config incomplete';
  return 'Disabled';
}

function timeLabel(value?: string | null) {
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

export default function AdminIngestionPage() {
  const [sources, setSources] = useState<SourceRow[]>([]);
  const [runs, setRuns] = useState<RunRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [runningSource, setRunningSource] = useState<string | null>(null);
  const [changingSource, setChangingSource] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/admin/ingestion', { cache: 'no-store' });
      const payload = await response.json();
      if (!response.ok) throw new Error(payload.error || 'Could not load ingestion data');
      setSources(Array.isArray(payload.sources) ? payload.sources : []);
      setRuns(Array.isArray(payload.runs) ? payload.runs : []);
    } catch (error) {
      setNotice(error instanceof Error ? error.message : 'Could not load ingestion data');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const runSource = async (sourceId: string) => {
    setRunningSource(sourceId);
    setNotice(null);
    try {
      const response = await fetch('/api/admin/ingestion/run', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sourceId }),
      });
      const payload = await response.json();
      if (!response.ok) throw new Error(payload.error || 'Ingestion run failed');
      setNotice(`Staged ${payload.staged} item${payload.staged === 1 ? '' : 's'} for review. Nothing was auto-published.`);
      await load();
    } catch (error) {
      setNotice(error instanceof Error ? error.message : 'Ingestion run failed');
      await load();
    } finally {
      setRunningSource(null);
    }
  };

  const changeSourceState = async (source: SourceRow, isActive: boolean) => {
    setChangingSource(source.id);
    setNotice(null);
    try {
      const response = await fetch('/api/admin/ingestion', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sourceId: source.id, isActive }),
      });
      const payload = await response.json();
      if (!response.ok) throw new Error(payload.error || 'Could not update source state');
      setNotice(`${source.name} ${isActive ? 'enabled' : 'disabled'}.`);
      await load();
    } catch (error) {
      setNotice(error instanceof Error ? error.message : 'Could not update source state');
    } finally {
      setChangingSource(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-ctp">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-100">Data Sources &amp; Ingestion</h1>
          <p className="text-xs text-slate-400 mt-1 max-w-3xl">
            Real source connectors only. Every run is rights-gated, staged for review, and kept separate from the public catalog until approved.
          </p>
        </div>
        <button
          type="button"
          onClick={load}
          disabled={loading}
          className="min-h-[42px] px-3.5 rounded-xl bg-slate-900 border border-ctp text-xs font-bold text-slate-200 hover:text-white flex items-center gap-2 disabled:opacity-50"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} /> Refresh
        </button>
      </div>

      {notice && (
        <div className="rounded-2xl border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-xs text-amber-200 flex items-start gap-2.5">
          <AlertTriangle className="w-4 h-4 mt-0.5 shrink-0" />
          <span>{notice}</span>
        </div>
      )}

      <section className="space-y-3">
        <div className="flex items-center justify-between gap-3">
          <h2 className="font-bold text-sm text-slate-100 flex items-center gap-2">
            <Key className="w-4 h-4 text-emerald-400" /> Source readiness
          </h2>
          <span className="text-[11px] text-slate-500">{sources.length} configured source{sources.length === 1 ? '' : 's'}</span>
        </div>

        {loading ? (
          <div className="rounded-2xl border border-ctp bg-ctp-surface p-8 text-center text-xs text-slate-400">
            <Loader2 className="w-5 h-5 animate-spin mx-auto mb-2" /> Loading real source status…
          </div>
        ) : sources.length === 0 ? (
          <div className="rounded-2xl border border-ctp bg-ctp-surface p-6">
            <h3 className="font-bold text-sm text-slate-100">No live source connector is configured yet.</h3>
            <p className="mt-1.5 text-xs text-slate-400 leading-relaxed">
              This is intentional: CatchThePrice will not create fake retailer connections. Add an approved API/feed only after its usage rights and credentials are available.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-3.5">
            {sources.map((source) => {
              const ready = source.readiness === 'ready';
              const isRunning = runningSource === source.id;
              const isChanging = changingSource === source.id;
              const canEnable = source.rightsReady && source.credentialReady;

              return (
                <article key={source.id} className="rounded-2xl border border-ctp bg-ctp-surface p-4 space-y-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="font-bold text-sm text-slate-100">{source.name}</h3>
                        <span className="px-2 py-0.5 rounded-md text-[9px] font-extrabold bg-slate-900 border border-ctp text-slate-400 uppercase">
                          {source.country || '—'} · {source.adapter}
                        </span>
                      </div>
                      <p className="mt-1 text-[11px] text-slate-500 truncate">{source.baseUrl || 'No public merchant URL set'}</p>
                    </div>
                    <span className={`shrink-0 px-2 py-1 rounded-lg border text-[10px] font-extrabold ${
                      ready
                        ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                        : 'bg-amber-500/10 border-amber-500/30 text-amber-300'
                    }`}>
                      {readinessLabel(source.readiness)}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-[11px]">
                    <div className="rounded-xl bg-slate-950/60 border border-ctp p-3">
                      <div className="text-slate-500">Source rights</div>
                      <div className={`mt-1 font-bold ${source.rightsReady ? 'text-emerald-400' : 'text-amber-300'}`}>
                        {source.rightsStatus}
                      </div>
                    </div>
                    <div className="rounded-xl bg-slate-950/60 border border-ctp p-3">
                      <div className="text-slate-500">Private credential</div>
                      <div className={`mt-1 font-bold ${source.credentialReady ? 'text-emerald-400' : 'text-amber-300'}`}>
                        {source.credentialReady ? 'Available' : source.credentialEnvKey || 'Missing'}
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center justify-between gap-2 pt-3 border-t border-ctp">
                    <div className="text-[10px] text-slate-500">
                      <span className="font-mono">{source.rightsId || 'no-rights-id'}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => changeSourceState(source, !source.isActive)}
                        disabled={Boolean(changingSource) || (!source.isActive && !canEnable)}
                        className="min-h-[40px] px-3 rounded-xl bg-slate-900 border border-ctp disabled:opacity-40 text-[10px] font-bold text-slate-300 hover:text-white"
                      >
                        {isChanging ? 'Saving…' : source.isActive ? 'Disable' : 'Enable'}
                      </button>
                      <button
                        type="button"
                        onClick={() => runSource(source.id)}
                        disabled={!ready || Boolean(runningSource) || Boolean(changingSource)}
                        className="min-h-[40px] px-3.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 disabled:bg-slate-800 disabled:text-slate-500 text-slate-950 text-[11px] font-extrabold flex items-center gap-1.5 transition-colors"
                      >
                        {isRunning ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Play className="w-3.5 h-3.5" />}
                        {isRunning ? 'Running…' : 'Fetch & stage'}
                      </button>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>

      <section className="rounded-2xl bg-ctp-surface border border-ctp p-5">
        <h3 className="font-bold text-sm text-slate-100 flex items-center gap-2">
          <Database className="w-4 h-4 text-emerald-400" /> Production flow
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 mt-4 text-center text-[10px]">
          {['Rights gate', 'Official API/feed', 'Normalize', 'Match & review', 'Publish offer'].map((label, index) => (
            <div key={label} className="rounded-xl bg-slate-950/60 border border-ctp p-3">
              <span className="block font-extrabold text-emerald-400">{index + 1}</span>
              <span className="mt-1 block text-slate-300 font-semibold">{label}</span>
            </div>
          ))}
        </div>
        <p className="mt-3 text-[11px] text-slate-500 flex items-start gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" /> No source can auto-publish from a fetch. Items first enter the matching/review queue.
        </p>
      </section>

      <section className="rounded-2xl bg-ctp-surface border border-ctp overflow-hidden">
        <div className="p-4 border-b border-ctp flex items-center justify-between">
          <h3 className="font-bold text-sm text-slate-100">Real execution history</h3>
          <span className="text-xs text-slate-500">{runs.length} run{runs.length === 1 ? '' : 's'}</span>
        </div>

        {runs.length === 0 ? (
          <div className="p-8 text-center text-xs text-slate-500">No real ingestion run has been executed yet.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-ctp-surface-elevated text-slate-500 uppercase tracking-wider text-[10px] border-b border-ctp">
                <tr>
                  <th className="p-3.5">Source</th>
                  <th className="p-3.5">Seen</th>
                  <th className="p-3.5">Staged</th>
                  <th className="p-3.5">Rejected</th>
                  <th className="p-3.5">Started</th>
                  <th className="p-3.5 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-ctp">
                {runs.map((run) => (
                  <tr key={run.id} className="hover:bg-slate-800/30">
                    <td className="p-3.5">
                      <div className="font-semibold text-slate-100">{run.sourceName}</div>
                      <div className="text-[10px] text-slate-500 uppercase">{run.country} · {run.id.slice(0, 8)}</div>
                      {run.error && <div className="text-[10px] text-red-400 mt-1 max-w-xs">{run.error}</div>}
                    </td>
                    <td className="p-3.5">{run.itemsSeen}</td>
                    <td className="p-3.5 text-emerald-400 font-bold">{run.itemsStaged}</td>
                    <td className="p-3.5">{run.itemsRejected}</td>
                    <td className="p-3.5 text-slate-500 whitespace-nowrap">{timeLabel(run.startedAt || run.createdAt)}</td>
                    <td className="p-3.5 text-right">
                      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-lg border text-[10px] font-extrabold ${
                        run.status === 'completed'
                          ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                          : run.status === 'failed'
                            ? 'bg-red-500/10 border-red-500/30 text-red-400'
                            : 'bg-amber-500/10 border-amber-500/30 text-amber-300'
                      }`}>
                        {run.status === 'completed' && <CheckCircle2 className="w-3 h-3" />}
                        {run.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}
