'use client';

import React, { useState } from 'react';
import { RefreshCw, CheckCircle2, Clock, Play, Database, FileText } from 'lucide-react';

interface IngestionLog {
  id: string;
  source: string;
  adapter: string;
  itemsFetched: number;
  itemsMatched: number;
  priceDropsDetected: number;
  duration: string;
  status: 'completed' | 'running';
  timestamp: string;
}

export default function AdminIngestionPage() {
  const [logs, setLogs] = useState<IngestionLog[]>([
    {
      id: 'run-104',
      source: 'Amazon UAE Catalog API',
      adapter: 'Amazon PA-API v5',
      itemsFetched: 142,
      itemsMatched: 140,
      priceDropsDetected: 2,
      duration: '4.2s',
      status: 'completed',
      timestamp: '15 mins ago',
    },
    {
      id: 'run-103',
      source: 'Noon UAE Feed Exporter',
      adapter: 'Noon XML Feed Adapter',
      itemsFetched: 98,
      itemsMatched: 97,
      priceDropsDetected: 1,
      duration: '3.1s',
      status: 'completed',
      timestamp: '1 hour ago',
    },
    {
      id: 'run-102',
      source: 'Best Buy Developer API',
      adapter: 'Best Buy B2B JSON',
      itemsFetched: 85,
      itemsMatched: 85,
      priceDropsDetected: 1,
      duration: '2.8s',
      status: 'completed',
      timestamp: '2 hours ago',
    },
    {
      id: 'run-101',
      source: 'Currys UK Affiliate Feed',
      adapter: 'Awin XML Partner Feed',
      itemsFetched: 64,
      itemsMatched: 62,
      priceDropsDetected: 0,
      duration: '3.6s',
      status: 'completed',
      timestamp: '3 hours ago',
    },
  ]);

  const [isRunning, setIsRunning] = useState(false);

  const handleRunPipeline = () => {
    setIsRunning(true);
    const newId = `run-${Date.now().toString().slice(-3)}`;

    setTimeout(() => {
      const newEntry: IngestionLog = {
        id: newId,
        source: 'All Verified Feeds & APIs',
        adapter: 'Unified Ingestion Runner',
        itemsFetched: 389,
        itemsMatched: 384,
        priceDropsDetected: 3,
        duration: '5.8s',
        status: 'completed',
        timestamp: 'Just now',
      };
      setLogs([newEntry, ...logs]);
      setIsRunning(false);
    }, 2500);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-ctp">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-100">Merchant Data Ingestion</h1>
          <p className="text-xs text-slate-400 mt-1">
            Adapters for approved merchant APIs, feeds, normalization, matching, and price drop detection
          </p>
        </div>

        <button
          type="button"
          onClick={handleRunPipeline}
          disabled={isRunning}
          className="px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 text-slate-950 font-bold text-xs transition-all shadow-lg flex items-center gap-2 touch-target"
        >
          <Play className={`w-4 h-4 ${isRunning ? 'animate-spin' : ''}`} />
          <span>{isRunning ? 'Processing Pipeline...' : 'Run Ingestion Pipeline Now'}</span>
        </button>
      </div>

      {/* Pipeline Architecture Graphic Box */}
      <div className="p-5 rounded-2xl bg-ctp-surface border border-ctp space-y-3">
        <h3 className="font-bold text-sm text-slate-200 flex items-center gap-2">
          <Database className="w-4 h-4 text-emerald-400" />
          <span>Automated Ingestion Sequence</span>
        </h3>
        <p className="text-xs text-slate-400">
          CatchThePrice only utilizes permitted merchant feeds and official affiliate APIs. No unauthorized scraping is performed.
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-6 gap-2 pt-2 text-center text-xs">
          <div className="p-2.5 rounded-xl bg-slate-900 border border-ctp">
            <span className="text-[10px] text-emerald-400 font-bold block">1. FETCH</span>
            <span className="text-slate-300 font-medium">Merchant APIs</span>
          </div>
          <div className="p-2.5 rounded-xl bg-slate-900 border border-ctp">
            <span className="text-[10px] text-emerald-400 font-bold block">2. NORMALIZE</span>
            <span className="text-slate-300 font-medium">Title &amp; Specs</span>
          </div>
          <div className="p-2.5 rounded-xl bg-slate-900 border border-ctp">
            <span className="text-[10px] text-emerald-400 font-bold block">3. MATCH</span>
            <span className="text-slate-300 font-medium">Fuzzy Tokens</span>
          </div>
          <div className="p-2.5 rounded-xl bg-slate-900 border border-ctp">
            <span className="text-[10px] text-emerald-400 font-bold block">4. UPDATE</span>
            <span className="text-slate-300 font-medium">Offers &amp; Stock</span>
          </div>
          <div className="p-2.5 rounded-xl bg-slate-900 border border-ctp">
            <span className="text-[10px] text-emerald-400 font-bold block">5. DETECT</span>
            <span className="text-slate-300 font-medium">Price Drops</span>
          </div>
          <div className="p-2.5 rounded-xl bg-slate-900 border border-ctp">
            <span className="text-[10px] text-emerald-400 font-bold block">6. NOTIFY</span>
            <span className="text-slate-300 font-medium">Send Alerts</span>
          </div>
        </div>
      </div>

      {/* Ingestion Runs Table */}
      <div className="rounded-2xl bg-ctp-surface border border-ctp overflow-hidden">
        <div className="p-4 border-b border-ctp flex items-center justify-between">
          <h3 className="font-bold text-sm text-slate-200">Execution History</h3>
          <span className="text-xs text-slate-400">{logs.length} runs recorded</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-ctp-surface-elevated text-slate-400 uppercase tracking-wider text-[10px] border-b border-ctp">
              <tr>
                <th className="p-3.5">Run ID</th>
                <th className="p-3.5">Source / Feed</th>
                <th className="p-3.5">Adapter</th>
                <th className="p-3.5">Items Fetched</th>
                <th className="p-3.5">Matched</th>
                <th className="p-3.5">Drops Detected</th>
                <th className="p-3.5">Duration</th>
                <th className="p-3.5">Time</th>
                <th className="p-3.5 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-ctp">
              {logs.map((log) => (
                <tr key={log.id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="p-3.5 font-mono text-emerald-400 font-semibold">{log.id}</td>
                  <td className="p-3.5 font-semibold text-slate-100">{log.source}</td>
                  <td className="p-3.5 text-slate-400">{log.adapter}</td>
                  <td className="p-3.5">{log.itemsFetched}</td>
                  <td className="p-3.5 text-emerald-400 font-semibold">{log.itemsMatched}</td>
                  <td className="p-3.5 font-bold text-slate-100">
                    {log.priceDropsDetected > 0 ? (
                      <span className="text-emerald-400 font-extrabold">+{log.priceDropsDetected} drops</span>
                    ) : (
                      '0'
                    )}
                  </td>
                  <td className="p-3.5 text-slate-400">{log.duration}</td>
                  <td className="p-3.5 text-slate-400">{log.timestamp}</td>
                  <td className="p-3.5 text-right">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                      Success
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
