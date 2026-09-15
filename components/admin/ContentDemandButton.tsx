'use client';

import React, { useState } from 'react';
import { Loader2, Radar } from 'lucide-react';

export function ContentDemandButton() {
  const [running, setRunning] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);

  const run = async () => {
    setRunning(true);
    setNotice(null);
    try {
      const response = await fetch('/api/admin/content/discover', { method: 'POST' });
      const payload = await response.json();
      if (!response.ok) throw new Error(payload.error || 'Demand discovery failed');
      const created = Number(payload?.result?.created || 0);
      const zeroResultEvents = Number(payload?.result?.zeroResultEvents || 0);
      setNotice(`${created} new opportunity${created === 1 ? '' : 'ies'} created from ${zeroResultEvents} zero-result search event${zeroResultEvents === 1 ? '' : 's'}.`);
      window.setTimeout(() => window.location.reload(), 700);
    } catch (error) {
      setNotice(error instanceof Error ? error.message : 'Demand discovery failed');
      setRunning(false);
    }
  };

  return (
    <div className="flex flex-col items-start sm:items-end gap-2">
      <button
        type="button"
        onClick={run}
        disabled={running}
        className="min-h-[42px] px-4 rounded-xl bg-emerald-500 hover:bg-emerald-400 disabled:opacity-60 text-slate-950 text-xs font-extrabold inline-flex items-center gap-2"
      >
        {running ? <Loader2 className="w-4 h-4 animate-spin" /> : <Radar className="w-4 h-4" />}
        Discover search demand
      </button>
      {notice && <p className="text-[10px] text-slate-400 max-w-sm sm:text-right">{notice}</p>}
    </div>
  );
}
