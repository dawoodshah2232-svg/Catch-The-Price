'use client';

import React, { useCallback, useEffect, useState } from 'react';
import { AlertTriangle, CheckCircle2, FileCheck2, Loader2, Save, ShieldCheck } from 'lucide-react';

type RightsRow = {
  id: string;
  retailer: string;
  market: 'ae' | 'us';
  status: 'DISABLED' | 'PENDING' | 'ACTIVE' | 'REVOKED';
  approval_reference: string | null;
  approved_at: string | null;
  pricing_right: boolean;
  image_right: boolean;
  history_right: boolean;
  affiliate_link_right: boolean;
  ai_processing_right: boolean;
  retention_notes: string | null;
  notes: string;
  updated_at: string;
};

function toLocalDateTime(value: string | null) {
  if (!value) return '';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '';
  const offset = date.getTimezoneOffset();
  return new Date(date.getTime() - offset * 60_000).toISOString().slice(0, 16);
}

export default function SourceRightsPage() {
  const [sources, setSources] = useState<RightsRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<string | null>(null);
  const [editing, setEditing] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/admin/source-rights', { cache: 'no-store' });
      const payload = await response.json();
      if (!response.ok) throw new Error(payload.error || 'Could not load source rights');
      setSources(Array.isArray(payload.sources) ? payload.sources : []);
    } catch (error) {
      setNotice(error instanceof Error ? error.message : 'Could not load source rights');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const updateLocal = (id: string, patch: Partial<RightsRow>) => {
    setSources((current) => current.map((source) => (source.id === id ? { ...source, ...patch } : source)));
  };

  const save = async (source: RightsRow) => {
    setSaving(source.id);
    setNotice(null);
    try {
      const response = await fetch('/api/admin/source-rights', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: source.id,
          status: source.status,
          approvalReference: source.approval_reference || '',
          approvedAt: source.approved_at || '',
          pricingRight: source.pricing_right,
          imageRight: source.image_right,
          historyRight: source.history_right,
          affiliateLinkRight: source.affiliate_link_right,
          aiProcessingRight: source.ai_processing_right,
          retentionNotes: source.retention_notes || '',
          notes: source.notes || '',
        }),
      });
      const payload = await response.json();
      if (!response.ok) throw new Error(payload.error || 'Could not save source rights');
      setNotice(`${source.retailer} rights record saved.`);
      setEditing(null);
      await load();
    } catch (error) {
      setNotice(error instanceof Error ? error.message : 'Could not save source rights');
    } finally {
      setSaving(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="pb-6 border-b border-ctp">
        <h1 className="text-2xl font-extrabold text-slate-100">Source Rights Registry</h1>
        <p className="text-xs text-slate-400 mt-1 max-w-3xl">
          CatchThePrice will not publish retailer data just because it is technically accessible. Record the exact evidence and permitted uses before activating a source.
        </p>
      </div>

      {notice && (
        <div className="rounded-2xl border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-xs text-amber-100 flex items-start gap-2">
          <AlertTriangle className="w-4 h-4 mt-0.5 shrink-0" /> {notice}
        </div>
      )}

      <div className="rounded-2xl border border-ctp bg-ctp-surface p-4 flex items-start gap-3">
        <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
        <div className="text-xs text-slate-400 leading-relaxed">
          <strong className="text-slate-200">Activation rule:</strong> ACTIVE requires dated approval evidence plus permission to publish pricing and send users to the retailer. Image, history and AI-processing permissions are tracked separately and are enforced by the ingestion workflow.
        </div>
      </div>

      {loading ? (
        <div className="py-12 text-center text-xs text-slate-500">
          <Loader2 className="w-5 h-5 animate-spin mx-auto mb-2" /> Loading registry…
        </div>
      ) : (
        <div className="space-y-3">
          {sources.map((source) => {
            const isEditing = editing === source.id;
            return (
              <article key={source.id} className="rounded-2xl border border-ctp bg-ctp-surface overflow-hidden">
                <div className="p-4 flex flex-col md:flex-row md:items-center justify-between gap-3">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h2 className="font-bold text-sm text-slate-100">{source.retailer}</h2>
                      <span className="px-2 py-0.5 rounded-md border border-ctp bg-slate-950 text-[9px] font-bold text-slate-400 uppercase">{source.market}</span>
                      <span className={`px-2 py-0.5 rounded-md border text-[9px] font-extrabold ${
                        source.status === 'ACTIVE'
                          ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                          : source.status === 'REVOKED'
                            ? 'bg-red-500/10 border-red-500/30 text-red-400'
                            : 'bg-amber-500/10 border-amber-500/30 text-amber-300'
                      }`}>
                        {source.status}
                      </span>
                    </div>
                    <div className="mt-2 flex flex-wrap gap-1.5 text-[9px]">
                      {[
                        ['Price', source.pricing_right],
                        ['Images', source.image_right],
                        ['History', source.history_right],
                        ['Retailer link', source.affiliate_link_right],
                        ['AI use', source.ai_processing_right],
                      ].map(([label, allowed]) => (
                        <span key={String(label)} className={`px-2 py-1 rounded-lg border ${allowed ? 'border-emerald-500/25 text-emerald-400 bg-emerald-500/5' : 'border-ctp text-slate-600 bg-slate-950/50'}`}>
                          {String(label)} {allowed ? '✓' : '—'}
                        </span>
                      ))}
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => setEditing(isEditing ? null : source.id)}
                    className="min-h-[40px] px-3.5 rounded-xl bg-slate-900 border border-ctp text-xs font-bold text-slate-200 hover:text-white"
                  >
                    {isEditing ? 'Close' : 'Review record'}
                  </button>
                </div>

                {isEditing && (
                  <div className="border-t border-ctp bg-slate-950/30 p-4 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      <label className="space-y-1.5 text-[11px] text-slate-400">
                        <span className="font-semibold">Status</span>
                        <select
                          value={source.status}
                          onChange={(event) => updateLocal(source.id, { status: event.target.value as RightsRow['status'] })}
                          className="w-full h-11 rounded-xl bg-slate-950 border border-ctp px-3 text-xs text-slate-200"
                        >
                          <option value="PENDING">PENDING</option>
                          <option value="ACTIVE">ACTIVE</option>
                          <option value="DISABLED">DISABLED</option>
                          <option value="REVOKED">REVOKED</option>
                        </select>
                      </label>

                      <label className="space-y-1.5 text-[11px] text-slate-400 md:col-span-2">
                        <span className="font-semibold">Approval / terms evidence reference</span>
                        <input
                          value={source.approval_reference || ''}
                          onChange={(event) => updateLocal(source.id, { approval_reference: event.target.value })}
                          placeholder="Agreement ID, approved email, program terms reference…"
                          className="w-full h-11 rounded-xl bg-slate-950 border border-ctp px-3 text-xs text-slate-200 placeholder:text-slate-600"
                        />
                      </label>

                      <label className="space-y-1.5 text-[11px] text-slate-400">
                        <span className="font-semibold">Approval date/time</span>
                        <input
                          type="datetime-local"
                          value={toLocalDateTime(source.approved_at)}
                          onChange={(event) => updateLocal(source.id, { approved_at: event.target.value ? new Date(event.target.value).toISOString() : null })}
                          className="w-full h-11 rounded-xl bg-slate-950 border border-ctp px-3 text-xs text-slate-200"
                        />
                      </label>

                      <div className="md:col-span-2 grid grid-cols-2 sm:grid-cols-5 gap-2">
                        {[
                          ['pricing_right', 'Price'],
                          ['image_right', 'Images'],
                          ['history_right', 'History'],
                          ['affiliate_link_right', 'Retailer link'],
                          ['ai_processing_right', 'AI use'],
                        ].map(([field, label]) => (
                          <label key={field} className="rounded-xl border border-ctp bg-slate-950 p-3 flex items-center gap-2 text-[10px] text-slate-300">
                            <input
                              type="checkbox"
                              checked={Boolean(source[field as keyof RightsRow])}
                              onChange={(event) => updateLocal(source.id, { [field]: event.target.checked } as Partial<RightsRow>)}
                              className="accent-emerald-500"
                            />
                            {label}
                          </label>
                        ))}
                      </div>
                    </div>

                    <label className="block space-y-1.5 text-[11px] text-slate-400">
                      <span className="font-semibold">Rights / compliance notes</span>
                      <textarea
                        value={source.notes || ''}
                        onChange={(event) => updateLocal(source.id, { notes: event.target.value })}
                        rows={3}
                        className="w-full rounded-xl bg-slate-950 border border-ctp p-3 text-xs text-slate-200"
                      />
                    </label>

                    <label className="block space-y-1.5 text-[11px] text-slate-400">
                      <span className="font-semibold">Retention limits</span>
                      <textarea
                        value={source.retention_notes || ''}
                        onChange={(event) => updateLocal(source.id, { retention_notes: event.target.value })}
                        rows={2}
                        className="w-full rounded-xl bg-slate-950 border border-ctp p-3 text-xs text-slate-200"
                      />
                    </label>

                    {source.status === 'ACTIVE' && (
                      <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 p-3 text-[11px] text-amber-200 flex items-start gap-2">
                        <FileCheck2 className="w-4 h-4 mt-0.5 shrink-0" /> ACTIVE should only be saved after the evidence above has actually been obtained and reviewed.
                      </div>
                    )}

                    <div className="flex justify-end">
                      <button
                        type="button"
                        onClick={() => save(source)}
                        disabled={saving === source.id}
                        className="min-h-[42px] px-4 rounded-xl bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 text-slate-950 text-xs font-extrabold flex items-center gap-2"
                      >
                        {saving === source.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                        Save rights record
                      </button>
                    </div>
                  </div>
                )}
              </article>
            );
          })}
        </div>
      )}

      {!loading && sources.some((source) => source.status === 'ACTIVE') && (
        <div className="text-xs text-emerald-400 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4" /> At least one source has an active rights record.
        </div>
      )}
    </div>
  );
}
