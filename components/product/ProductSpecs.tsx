'use client';

import React from 'react';
import { Sliders, Info } from 'lucide-react';

interface ProductSpecsProps {
  specs: Record<string, string>;
  brand: string;
}

export function ProductSpecs({ specs, brand }: ProductSpecsProps) {
  if (!specs || Object.keys(specs).length === 0) return null;

  return (
    <section className="rounded-3xl bg-white border border-[#DDE7E3] overflow-hidden shadow-[0_10px_30px_rgba(24,52,43,0.05)]">
      <div className="p-4 sm:p-6 border-b border-[#E5ECE9] flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h3 className="font-extrabold text-base sm:text-lg text-[#173028] flex items-center gap-2">
            <Sliders className="w-4 h-4 text-[#0B8F58]" />
            <span>Technical specifications</span>
          </h3>
          <p className="text-xs text-[#6D7E78] mt-0.5">Structured specifications currently available for this exact listing.</p>
        </div>
        <span className="self-start sm:self-auto text-xs font-bold px-2.5 py-1 rounded-xl bg-[#F4F8F6] border border-[#DDE7E3] text-[#51635D]">
          Brand: {brand}
        </span>
      </div>

      <div className="divide-y divide-[#EDF2EF]">
        {Object.entries(specs).map(([key, value], index) => (
          <div key={key} className={`px-4 sm:px-6 py-3.5 grid grid-cols-[minmax(110px,0.8fr)_minmax(0,1.4fr)] gap-4 text-xs ${index % 2 === 1 ? 'bg-[#FBFDFC]' : 'bg-white'}`}>
            <span className="font-bold text-[#6D7E78] break-words">{key}</span>
            <span className="text-[#2D443C] font-semibold break-words">{value}</span>
          </div>
        ))}
      </div>

      <div className="px-4 sm:px-6 py-3 border-t border-[#E5ECE9] bg-[#F7FAF8] flex items-start gap-2 text-[11px] text-[#73837D]">
        <Info className="w-3.5 h-3.5 shrink-0 mt-0.5 text-[#0B8F58]" />
        <span>Specifications are shown only when present in our structured source data. CatchThePrice does not fill missing values by guessing.</span>
      </div>
    </section>
  );
}
