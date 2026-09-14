'use client';

import React from 'react';
import { Sliders } from 'lucide-react';

interface ProductSpecsProps {
  specs: Record<string, string>;
  brand: string;
}

export function ProductSpecs({ specs, brand }: ProductSpecsProps) {
  if (!specs || Object.keys(specs).length === 0) return null;

  return (
    <div className="rounded-2xl bg-ctp-surface border border-ctp p-4 sm:p-6">
      <div className="pb-4 border-b border-ctp flex items-center justify-between">
        <div>
          <h3 className="font-bold text-base sm:text-lg text-slate-100 flex items-center gap-2">
            <Sliders className="w-4 h-4 text-emerald-400" />
            <span>Technical Specifications</span>
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">Verified manufacturer specifications</p>
        </div>
        <span className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-slate-900 border border-ctp text-slate-300">
          Brand: {brand}
        </span>
      </div>

      <div className="mt-4 divide-y divide-ctp">
        {Object.entries(specs).map(([key, value]) => (
          <div key={key} className="py-3 grid grid-cols-1 sm:grid-cols-3 gap-1 sm:gap-4 text-xs">
            <span className="font-semibold text-slate-400">{key}</span>
            <span className="sm:col-span-2 text-slate-200 font-medium">{value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
