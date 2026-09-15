'use client';

import React from 'react';
import { Sparkles, CheckCircle, AlertCircle, Info } from 'lucide-react';

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
    <section className="rounded-3xl bg-white border border-[#DDE7E3] p-4 sm:p-6 shadow-[0_10px_30px_rgba(24,52,43,0.05)]">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-4 border-b border-[#E5ECE9]">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-[#EAF8F1] text-[#0B8F58] border border-[#CFE9DD] flex items-center justify-center">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-extrabold text-sm sm:text-base text-[#173028]">Buying summary</h3>
            <p className="text-[11px] text-[#6D7E78]">Editorial guidance based only on product facts available to CatchThePrice.</p>
          </div>
        </div>

        <span className="self-start sm:self-auto px-2.5 py-1 rounded-full text-[11px] font-extrabold bg-[#F3F7F5] text-[#51635D] border border-[#DDE7E3]">
          Decision support
        </span>
      </div>

      <div className="mt-4 p-4 rounded-2xl bg-[#F7FAF8] border border-[#E1E9E5] text-xs sm:text-sm text-[#334B43] leading-relaxed">
        <strong className="text-[#0B8F58] font-extrabold block mb-1">Verdict on {productTitle}</strong>
        {summary.verdict}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
        <div className="rounded-2xl border border-[#DDE7E3] bg-[#FBFDFC] p-4">
          <h4 className="text-xs font-extrabold uppercase tracking-wider text-[#0B8F58] flex items-center gap-1.5">
            <CheckCircle className="w-3.5 h-3.5" /> Strengths
          </h4>
          <ul className="space-y-2 mt-3">
            {summary.pros.map((pro, idx) => (
              <li key={idx} className="flex items-start gap-2 text-xs text-[#455B53]">
                <span className="text-[#0B8F58] text-sm leading-none">•</span>
                <span>{pro}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-2xl border border-[#E8E1D7] bg-[#FFFCF7] p-4">
          <h4 className="text-xs font-extrabold uppercase tracking-wider text-[#9A6B2F] flex items-center gap-1.5">
            <AlertCircle className="w-3.5 h-3.5" /> Considerations
          </h4>
          <ul className="space-y-2 mt-3">
            {summary.cons.map((con, idx) => (
              <li key={idx} className="flex items-start gap-2 text-xs text-[#65574A]">
                <span className="text-[#B37A34] text-sm leading-none">•</span>
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
