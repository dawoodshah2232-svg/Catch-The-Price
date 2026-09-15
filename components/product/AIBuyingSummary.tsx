'use client';

import React from 'react';
import { Sparkles, CheckCircle2, AlertCircle } from 'lucide-react';

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

export function AIBuyingSummary({ summary, productTitle }: AIBuyingSummaryProps) {
  if (!summary) return null;

  return (
    <div className="rounded-3xl bg-[#091217] border border-[#162633] p-5 sm:p-7 space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#162633]">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-[#00D27A]/10 text-[#00D27A] border border-[#00D27A]/25 flex items-center justify-center shrink-0">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-base sm:text-lg text-[#F8FAFC] flex items-center gap-2">
              CatchThePrice AI Buying Analysis
            </h3>
            <p className="text-xs text-[#CBD5E1] mt-0.5">Synthesized from 90-day multi-store pricing intelligence</p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <span
            className={`px-3 py-1 rounded-full text-xs font-extrabold border ${
              summary.bestTimeToBuy
                ? 'bg-[#00D27A]/15 text-[#00D27A] border-[#00D27A]/30'
                : 'bg-amber-500/15 text-amber-400 border-amber-500/30'
            }`}
          >
            {summary.bestTimeToBuy ? 'Recommended Buy' : 'Wait for Promotion'}
          </span>
        </div>
      </div>

      {/* Verdict Callout */}
      <div className="p-4 rounded-2xl bg-[#071015] border border-[#162633] text-xs sm:text-sm text-[#CBD5E1] leading-relaxed">
        <strong className="text-[#00D27A] font-bold block mb-1">Expert Consensus Verdict:</strong>
        {summary.verdict}
      </div>

      {/* Pros & Cons Columns */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
        {/* Pros */}
        <div className="p-4 rounded-2xl bg-[#071015]/60 border border-[#162633] space-y-2.5">
          <h4 className="text-xs font-bold uppercase tracking-wider text-[#00D27A] flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4" /> Why Shoppers Love It
          </h4>
          <ul className="space-y-2">
            {summary.pros.map((pro, idx) => (
              <li key={idx} className="flex items-start gap-2 text-xs text-[#CBD5E1]">
                <span className="text-[#00D27A] font-bold">•</span>
                <span>{pro}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Cons */}
        <div className="p-4 rounded-2xl bg-[#071015]/60 border border-[#162633] space-y-2.5">
          <h4 className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
            <AlertCircle className="w-4 h-4" /> Things to Keep in Mind
          </h4>
          <ul className="space-y-2">
            {summary.cons.map((con, idx) => (
              <li key={idx} className="flex items-start gap-2 text-xs text-[#CBD5E1]">
                <span className="text-amber-400 font-bold">•</span>
                <span>{con}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="mt-4 flex items-start gap-2 text-[11px] text-[#6D7E78] leading-relaxed">
        <Info className="w-3.5 h-3.5 shrink-0 mt-0.5 text-[#0B8F58]" />
        <span>CatchThePrice does not invent missing specifications or retailer facts. If source data is incomplete, this section should remain limited rather than guessing.</span>
      </div>
    </section>
  );
}
