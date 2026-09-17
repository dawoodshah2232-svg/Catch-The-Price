'use client';

import React, { useState } from 'react';
import { Play } from 'lucide-react';

export function AutomationTriggerButton({ jobType }: { jobType: string; jobName?: string }) {
  const [running, setRunning] = useState(false);
  const [result, setResult] = useState<{ ok: boolean; msg: string } | null>(null);

  async function handleRun() {
    setRunning(true);
    setResult(null);

    try {
      const res = await fetch('/api/admin/automation/run', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ jobType }),
      });

      const data = await res.json();
      if (res.ok) {
        setResult({ ok: true, msg: data.result?.summary || 'Completed successfully' });
      } else {
        setResult({ ok: false, msg: data.error || 'Execution failed' });
      }
    } catch (err: any) {
      setResult({ ok: false, msg: err?.message || 'Network error' });
    } finally {
      setRunning(false);
      setTimeout(() => setResult(null), 5000);
    }
  }

  return (
    <div className="flex items-center gap-2">
      {result && (
        <span
          className={`text-[11px] font-bold ${
            result.ok ? 'text-emerald-400' : 'text-red-400'
          }`}
        >
          {result.msg}
        </span>
      )}

      <button
        type="button"
        onClick={handleRun}
        disabled={running}
        className="inline-flex items-center gap-1.5 rounded-xl border border-ctp bg-slate-800/80 px-3 py-1.5 text-xs font-bold text-slate-200 hover:border-emerald-500 hover:text-white disabled:opacity-50 transition-colors"
      >
        <Play className="w-3 h-3 text-emerald-400" />
        <span>{running ? 'Running…' : 'Run Now'}</span>
      </button>
    </div>
  );
}
