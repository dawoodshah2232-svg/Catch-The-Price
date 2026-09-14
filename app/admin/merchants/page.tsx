'use client';

import React from 'react';
import { MERCHANTS } from '@/lib/data/merchants';
import { Store, CheckCircle, ExternalLink, Globe } from 'lucide-react';

export default function AdminMerchantsPage() {
  return (
    <div className="space-y-6">
      <div className="pb-6 border-b border-ctp">
        <h1 className="text-2xl font-extrabold text-slate-100">Verified Merchants &amp; Feeds</h1>
        <p className="text-xs text-slate-400 mt-1">
          Configured retailer adapters, ratings, and affiliate tracking parameters
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {MERCHANTS.map((m) => (
          <div key={m.id} className="p-4 rounded-2xl bg-ctp-surface border border-ctp space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-xl bg-slate-900 border border-ctp flex items-center justify-center p-1">
                  <img src={m.logoUrl} alt={m.name} className="max-h-full max-w-full object-contain" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-slate-100">{m.name}</h3>
                  <span className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">
                    Market: {m.country.toUpperCase()}
                  </span>
                </div>
              </div>

              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
                <CheckCircle className="w-3 h-3" />
                Active
              </span>
            </div>

            <div className="text-xs space-y-1 pt-2 border-t border-ctp text-slate-300">
              <div className="flex justify-between">
                <span className="text-slate-400">Domain:</span>
                <span className="font-medium text-slate-200">{m.domain}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Rating:</span>
                <span className="font-medium text-amber-400">★ {m.rating} ({m.reviewCount.toLocaleString()})</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Tracking:</span>
                <span className="font-mono text-[10px] text-emerald-400 truncate max-w-[150px]">
                  {m.affiliateTemplate ? 'Affiliate Enabled' : 'Direct Link'}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
