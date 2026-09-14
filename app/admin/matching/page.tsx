'use client';

import React, { useState } from 'react';
import { GitMerge, Check, Flag, Sparkles, CheckCircle2 } from 'lucide-react';

interface MatchItem {
  id: string;
  rawTitle: string;
  merchant: string;
  rawPrice: string;
  matchedTitle: string;
  confidence: number;
  status: 'pending' | 'verified' | 'flagged';
}

export default function AdminMatchingPage() {
  const [matches, setMatches] = useState<MatchItem[]>([
    {
      id: 'match-1',
      rawTitle: 'Apple iPhone 16 Pro Max 256 GB Titane Désert 5G Dual SIM',
      merchant: 'Amazon UAE',
      rawPrice: 'AED 4,033',
      matchedTitle: 'Apple iPhone 16 Pro Max (256GB, Desert Titanium)',
      confidence: 99.4,
      status: 'pending',
    },
    {
      id: 'match-2',
      rawTitle: 'Samsung S24 Ultra 5G Grey 512GB with Stylus Bundle',
      merchant: 'Noon UAE',
      rawPrice: 'AED 4,217',
      matchedTitle: 'Samsung Galaxy S24 Ultra (512GB, Titanium Gray, AI Enabled)',
      confidence: 98.2,
      status: 'pending',
    },
    {
      id: 'match-3',
      rawTitle: 'Playstation 5 Pro 2000GB SSD Ed. White Black',
      merchant: 'Sharaf DG',
      rawPrice: 'AED 2,492',
      matchedTitle: 'Sony PlayStation 5 Pro Console (2TB SSD, PSSR AI Upscaling)',
      confidence: 97.6,
      status: 'pending',
    },
    {
      id: 'match-4',
      rawTitle: 'WH1000XM5B Sony Noise Cancelling Over-Ear Headset',
      merchant: 'Amazon UAE',
      rawPrice: 'AED 1,204',
      matchedTitle: 'Sony WH-1000XM5 Wireless Active Noise Canceling Headphones (Black)',
      confidence: 99.1,
      status: 'pending',
    },
  ]);

  const handleVerify = (id: string) => {
    setMatches((prev) =>
      prev.map((m) => (m.id === id ? { ...m, status: 'verified' } : m))
    );
  };

  const handleFlag = (id: string) => {
    setMatches((prev) =>
      prev.map((m) => (m.id === id ? { ...m, status: 'flagged' } : m))
    );
  };

  return (
    <div className="space-y-6">
      <div className="pb-6 border-b border-ctp">
        <h1 className="text-2xl font-extrabold text-slate-100">Product Matching Queue</h1>
        <p className="text-xs text-slate-400 mt-1">
          Review automated title normalization and multi-merchant SKU grouping
        </p>
      </div>

      <div className="space-y-3">
        {matches.map((item) => (
          <div
            key={item.id}
            className="p-4 rounded-2xl bg-ctp-surface border border-ctp flex flex-col md:flex-row md:items-center justify-between gap-4"
          >
            <div className="space-y-1.5 flex-1">
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold px-2 py-0.5 rounded bg-slate-900 border border-ctp text-slate-300">
                  {item.merchant}
                </span>
                <span className="text-xs font-extrabold text-emerald-400">{item.rawPrice}</span>
                <span className="text-[11px] text-slate-400 flex items-center gap-1 ml-2">
                  <Sparkles className="w-3 h-3 text-emerald-400" />
                  {item.confidence}% match confidence
                </span>
              </div>

              <div>
                <span className="text-[10px] text-slate-400 uppercase font-semibold block">
                  Raw Retailer Listing:
                </span>
                <p className="text-xs text-slate-300 font-mono">{item.rawTitle}</p>
              </div>

              <div className="pt-1">
                <span className="text-[10px] text-slate-400 uppercase font-semibold block">
                  Matched Platform Catalog Item:
                </span>
                <p className="text-xs font-bold text-slate-100">{item.matchedTitle}</p>
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex items-center gap-2 pt-2 md:pt-0 border-t md:border-t-0 border-ctp shrink-0">
              {item.status === 'verified' ? (
                <span className="px-3 py-1.5 rounded-xl bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 text-xs font-bold flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4" />
                  Verified
                </span>
              ) : item.status === 'flagged' ? (
                <span className="px-3 py-1.5 rounded-xl bg-red-500/15 text-red-400 border border-red-500/30 text-xs font-bold flex items-center gap-1.5">
                  <Flag className="w-4 h-4" />
                  Flagged for Review
                </span>
              ) : (
                <>
                  <button
                    type="button"
                    onClick={() => handleVerify(item.id)}
                    className="px-3 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs transition-all shadow-sm flex items-center gap-1"
                  >
                    <Check className="w-3.5 h-3.5" />
                    Approve Match
                  </button>
                  <button
                    type="button"
                    onClick={() => handleFlag(item.id)}
                    className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-red-500/10 text-slate-400 hover:text-red-400 border border-ctp text-xs transition-all flex items-center gap-1"
                  >
                    <Flag className="w-3.5 h-3.5" />
                    Flag
                  </button>
                </>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
