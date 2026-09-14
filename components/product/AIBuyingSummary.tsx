'use client';

import React from 'react';
import { Sparkles, CheckCircle, AlertCircle, Clock } from 'lucide-react';

interface AIBuyingSummaryProps {
  summary?: {
    verdict: string;
    pros: string[];
    cons: string[];
    bestTimeToBuy: boolean;
  };
  productTitle: string;
  dealScore: number;
}

export function AIBuyingSummary({ summary, productTitle, dealScore }: AIBuyingSummaryProps) {
  if (!summary) return null;

  return (
    <div className="rounded-2xl bg-ctp-surface border border-ctp p-4 sm:p-6">
      {/* Header */}
      <div className="flex items-center justify-between gap-3 pb-4 border-b border-ctp">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center justify-center">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-bold text-sm sm:text-base text-slate-100 flex items-center gap-2">
              CatchThePrice AI Buying Analysis
            </h3>
            <p className="text-[11px] text-slate-400">Synthesized from 90-day multi-store price history</p>
          </div>
        </div>

        <div className="shrink-0">
          <span
            className={`px-2.5 py-1 rounded-full text-xs font-bold border ${
              summary.bestTimeToBuy
                ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                : 'bg-amber-500/10 text-amber-400 border-amber-500/30'
            }`}
          >
            {summary.bestTimeToBuy ? 'Recommended Buy' : 'Wait for Promotion'}
          </span>
        </div>
      </div>

      {/* Verdict */}
      <div className="mt-4 p-3.5 rounded-xl bg-slate-900/60 border border-ctp text-xs sm:text-sm text-slate-200 leading-relaxed">
        <strong className="text-emerald-400 font-semibold block mb-1">Verdict:</strong>
        {summary.verdict}
      </div>

      {/* Pros & Cons Columns */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 pt-2">
        {/* Pros */}
        <div className="space-y-2">
          <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
            <CheckCircle className="w-3.5 h-3.5" /> What Users Love
          </h4>
          <ul className="space-y-1.5">
            {summary.pros.map((pro, idx) => (
              <li key={idx} className="flex items-start gap-2 text-xs text-slate-300">
                <span className="text-emerald-400 text-sm leading-none">•</span>
                <span>{pro}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Cons */}
        <div className="space-y-2">
          <h4 className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
            <AlertCircle className="w-3.5 h-3.5" /> Things to Consider
          </h4>
          <ul className="space-y-1.5">
            {summary.cons.map((con, idx) => (
              <li key={idx} className="flex items-start gap-2 text-xs text-slate-300">
                <span className="text-amber-400 text-sm leading-none">•</span>
                <span>{con}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
