'use client';

import React from 'react';
import { Sparkles, CheckCircle2, AlertCircle, Info } from 'lucide-react';

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

export function AIBuyingSummary({ summary }: AIBuyingSummaryProps) {
  if (!summary) return null;

  return (
    <section className="rounded-[24px] bg-white border border-[#DDE7E3] p-4 sm:p-6 shadow-[0_10px_30px_rgba(25,55,45,0.05)]">
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 pb-4 border-b border-[#EDF2F0]">
        <div className="flex items-start gap-3">
          <div className="w-9 h-9 rounded-xl bg-[#EAF8F1] text-[#08784B] border border-[#CFE9DD] flex items-center justify-center shrink-0">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-extrabold text-sm sm:text-base text-[#173028]">Buying summary</h3>
            <p className="text-[11px] sm:text-xs text-[#73837D] mt-0.5 leading-relaxed">
              A short decision aid generated from the structured product information available to CatchThePrice. It is not a customer-review score or an independent lab test.
            </p>
          </div>
        </div>

        <span className={`self-start px-2.5 py-1 rounded-lg text-[10px] font-extrabold border ${
          summary.bestTimeToBuy
            ? 'bg-[#EAF8F1] text-[#08784B] border-[#CFE9DD]'
            : 'bg-amber-50 text-amber-800 border-amber-200'
        }`}>
          {summary.bestTimeToBuy ? 'Worth considering' : 'Compare before buying'}
        </span>
      </div>

      <div className="mt-4 rounded-2xl bg-[#F8FAF9] border border-[#E1E9E5] p-4 text-xs sm:text-sm text-[#40534B] leading-relaxed">
        <strong className="text-[#173028] font-extrabold block mb-1">Summary</strong>
        {summary.verdict}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-4">
        <div className="rounded-2xl bg-[#F9FCFA] border border-[#E1E9E5] p-4">
          <h4 className="text-[11px] font-extrabold uppercase tracking-wider text-[#08784B] flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5" /> Potential strengths
          </h4>
          <ul className="space-y-2 mt-3">
            {summary.pros.map((pro, idx) => (
              <li key={idx} className="flex items-start gap-2 text-xs text-[#52636B]">
                <span className="text-[#0B8F58] font-bold">•</span>
                <span>{pro}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-2xl bg-[#FFFCF5] border border-[#EEE4C8] p-4">
          <h4 className="text-[11px] font-extrabold uppercase tracking-wider text-amber-800 flex items-center gap-1.5">
            <AlertCircle className="w-3.5 h-3.5" /> Things to check
          </h4>
          <ul className="space-y-2 mt-3">
            {summary.cons.map((con, idx) => (
              <li key={idx} className="flex items-start gap-2 text-xs text-[#625C4D]">
                <span className="text-amber-700 font-bold">•</span>
                <span>{con}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="mt-4 flex items-start gap-2 text-[10px] sm:text-[11px] text-[#7A8983] leading-relaxed">
        <Info className="w-3.5 h-3.5 mt-0.5 shrink-0" />
        <span>Confirm specifications, warranty, stock and final price on the retailer or manufacturer website before purchasing.</span>
      </div>
    </section>
  );
}
