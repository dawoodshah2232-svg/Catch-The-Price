'use client';

import React, { useState } from 'react';
import { Play, Loader2, CheckCircle2, AlertTriangle } from 'lucide-react';

export function AlertEvaluationButton() {
  const [running, setRunning] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const run = async () => {
    setRunning(true);
    setMessage(null);
    setSuccess(false);
    try {
      const response = await fetch('/api/admin/alerts/evaluate', { method: 'POST' });
      const payload = await response.json();
      if (!response.ok || !payload.ok) throw new Error(payload.error || 'Alert evaluation failed');

      const result = payload.result;
      setSuccess(true);
      setMessage(
        `Evaluated ${result.evaluated}. Queued ${result.triggered} new event${result.triggered === 1 ? '' : 's'}; ${result.duplicatesSuppressed} duplicate${result.duplicatesSuppressed === 1 ? '' : 's'} suppressed.`
      );
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Alert evaluation failed');
    } finally {
      setRunning(false);
    }
  };

  return (
    <div className="flex flex-col items-stretch sm:items-end gap-2">
      <button
        type="button"
        onClick={run}
        disabled={running}
        className="min-h-[42px] px-4 rounded-xl bg-emerald-500 hover:bg-emerald-400 disabled:bg-slate-800 disabled:text-slate-500 text-slate-950 text-xs font-extrabold inline-flex items-center justify-center gap-2 transition-colors"
      >
        {running ? <Loader2 className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4" />}
        {running ? 'Evaluating…' : 'Evaluate alerts now'}
      </button>
      {message && (
        <div className={`max-w-md text-[10px] flex items-start gap-1.5 ${success ? 'text-emerald-300' : 'text-rose-300'}`}>
          {success ? <CheckCircle2 className="w-3.5 h-3.5 shrink-0" /> : <AlertTriangle className="w-3.5 h-3.5 shrink-0" />}
          <span>{message}</span>
        </div>
      )}
    </div>
  );
}
