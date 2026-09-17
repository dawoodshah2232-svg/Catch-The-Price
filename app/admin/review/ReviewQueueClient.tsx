'use client';

import React, { useState } from 'react';
import { Check, X, ShieldAlert } from 'lucide-react';

export function ReviewQueueClient({ initialItems }: { initialItems: any[] }) {
  const [items, setItems] = useState(initialItems);
  const [activeQueue, setActiveQueue] = useState<string>('all');
  const [resolvingId, setResolvingId] = useState<string | null>(null);

  async function handleResolve(id: string, resolution: 'RESOLVED' | 'DISMISSED') {
    setResolvingId(id);
    try {
      const res = await fetch('/api/admin/review', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, resolution, notes: `Marked ${resolution} by administrator` }),
      });

      if (res.ok) {
        setItems((prev) => prev.filter((item) => item.id !== id));
      }
    } catch {
      // Ignored
    } finally {
      setResolvingId(null);
    }
  }

  const filtered = activeQueue === 'all' ? items : items.filter((i) => i.queue_type === activeQueue);

  function getQueueBadge(type: string) {
    switch (type) {
      case 'PRODUCT_MATCH_REVIEW':
        return { label: 'Match Review', color: 'bg-blue-500/20 text-blue-400 border-blue-500/30' };
      case 'DATA_QUALITY':
        return { label: 'Data Quality', color: 'bg-amber-500/20 text-amber-400 border-amber-500/30' };
      case 'CONTENT_REVIEW':
        return { label: 'Content Draft', color: 'bg-purple-500/20 text-purple-400 border-purple-500/30' };
      case 'AUTOMATION_FAILURES':
      default:
        return { label: 'Job Failure', color: 'bg-red-500/20 text-red-400 border-red-500/30' };
    }
  }

  return (
    <div className="space-y-6">
      {/* Queue Type Tabs */}
      <div className="flex items-center gap-1 overflow-x-auto pb-1">
        {[
          { id: 'all', label: `All Exceptions (${items.length})` },
          { id: 'PRODUCT_MATCH_REVIEW', label: 'Match Reviews' },
          { id: 'DATA_QUALITY', label: 'Data Quality' },
          { id: 'CONTENT_REVIEW', label: 'Content Review' },
          { id: 'AUTOMATION_FAILURES', label: 'Failures' },
        ].map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveQueue(tab.id)}
            className={`rounded-xl px-3 py-1.5 text-xs font-bold transition-colors shrink-0 ${
              activeQueue === tab.id
                ? 'bg-emerald-500 text-black'
                : 'bg-slate-900 text-slate-300 hover:text-white border border-ctp'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {filtered.length > 0 ? (
        <div className="space-y-3">
          {filtered.map((item) => {
            const badge = getQueueBadge(item.queue_type);
            return (
              <div
                key={item.id}
                className="rounded-2xl border border-ctp bg-ctp-surface p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className={`rounded px-2 py-0.5 text-[10px] font-bold border ${badge.color}`}>
                      {badge.label}
                    </span>
                    {item.priority && (
                      <span className="rounded bg-slate-800 px-1.5 py-0.5 text-[10px] uppercase font-mono font-bold text-slate-400">
                        {item.priority}
                      </span>
                    )}
                    {item.confidence && (
                      <span className="text-[11px] font-mono text-slate-400">
                        Confidence: {item.confidence}%
                      </span>
                    )}
                  </div>

                  <h3 className="mt-1 text-xs font-extrabold text-white">{item.title}</h3>

                  {item.payload && (
                    <pre className="mt-2 rounded-lg bg-slate-950/80 p-2 text-[10px] text-slate-300 overflow-x-auto max-h-24">
                      {JSON.stringify(item.payload, null, 2)}
                    </pre>
                  )}

                  <span className="mt-2 block text-[10px] text-slate-500">
                    Enqueued on {new Date(item.created_at).toLocaleString()}
                  </span>
                </div>

                <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                  <button
                    type="button"
                    onClick={() => handleResolve(item.id, 'RESOLVED')}
                    disabled={resolvingId === item.id}
                    className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-500 px-3 py-1.5 text-xs font-bold text-black hover:bg-emerald-400 disabled:opacity-50 transition-colors"
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>Resolve</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleResolve(item.id, 'DISMISSED')}
                    disabled={resolvingId === item.id}
                    className="inline-flex items-center gap-1.5 rounded-xl border border-ctp bg-slate-800 px-3 py-1.5 text-xs font-bold text-slate-300 hover:text-white disabled:opacity-50 transition-colors"
                  >
                    <X className="w-3.5 h-3.5" />
                    <span>Dismiss</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="rounded-2xl border border-dashed border-ctp p-10 text-center text-xs text-slate-500">
          <ShieldAlert className="mx-auto w-8 h-8 text-slate-600 mb-2" />
          <span>No pending exception items in this queue. Automation and matching pipelines are operating normally.</span>
        </div>
      )}
    </div>
  );
}
