'use client';

import React, { useState } from 'react';
import { Sliders, Cpu, Monitor, Camera, Battery, Info } from 'lucide-react';

interface ProductSpecsProps {
  specs: Record<string, string>;
  brand: string;
}

export function ProductSpecs({ specs, brand }: ProductSpecsProps) {
  const [activeCategory, setActiveCategory] = useState('all');

  if (!specs || Object.keys(specs).length === 0) return null;

  const entries = Object.entries(specs);
  const categories = [
    { id: 'all', name: 'All specs', icon: Sliders, filter: () => true },
    { id: 'display', name: 'Display', icon: Monitor, filter: ([k]: [string, string]) => /display|screen|resolution|refresh|panel/i.test(k) },
    { id: 'performance', name: 'Performance', icon: Cpu, filter: ([k]: [string, string]) => /processor|chip|cpu|ram|memory|storage|os|gpu/i.test(k) },
    { id: 'camera', name: 'Camera', icon: Camera, filter: ([k]: [string, string]) => /camera|sensor|zoom|lens|video|mp/i.test(k) },
    { id: 'battery', name: 'Battery', icon: Battery, filter: ([k]: [string, string]) => /battery|charging|watt|mah/i.test(k) },
  ];

  const currentCategory = categories.find((c) => c.id === activeCategory) || categories[0];
  const filteredEntries = entries.filter(currentCategory.filter);
  const displayEntries = filteredEntries.length > 0 ? filteredEntries : entries;

  return (
    <section className="rounded-[24px] bg-white border border-[#DDE7E3] p-4 sm:p-6 shadow-[0_10px_30px_rgba(25,55,45,0.05)]">
      <div className="pb-4 border-b border-[#EDF2F0] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h3 className="font-extrabold text-sm sm:text-base text-[#173028] flex items-center gap-2">
            <Sliders className="w-4 h-4 text-[#08784B]" />
            <span>Product specifications</span>
          </h3>
          <p className="text-[11px] sm:text-xs text-[#73837D] mt-1">
            Structured specification fields currently available for this exact product record.
          </p>
        </div>
        <span className="text-[10px] sm:text-xs font-semibold px-2.5 py-1 rounded-xl bg-[#F8FAF9] border border-[#E1E9E5] text-[#65777F] self-start sm:self-auto">
          Brand: <strong className="text-[#20343C]">{brand}</strong>
        </span>
      </div>

      <div className="flex flex-wrap items-center gap-1.5 pt-4 pb-2">
        {categories.map((cat) => {
          const Icon = cat.icon;
          const isSelected = activeCategory === cat.id;
          const count = entries.filter(cat.filter).length;
          if (cat.id !== 'all' && count === 0) return null;

          return (
            <button
              key={cat.id}
              type="button"
              onClick={() => setActiveCategory(cat.id)}
              className={`inline-flex items-center gap-1.5 min-h-[40px] px-3 py-1.5 rounded-xl text-[11px] font-semibold transition-colors ${
                isSelected
                  ? 'bg-[#EAF8F1] text-[#08784B] border border-[#CFE9DD] font-extrabold'
                  : 'bg-[#F8FAF9] text-[#65777F] hover:text-[#20343C] border border-[#E1E9E5] hover:border-[#C9D9D2]'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{cat.name}</span>
            </button>
          );
        })}
      </div>

      <div className="mt-3 divide-y divide-[#EDF2F0]">
        {displayEntries.map(([key, value]) => (
          <div key={key} className="py-3 grid grid-cols-1 sm:grid-cols-3 gap-1 sm:gap-4 text-xs">
            <span className="font-semibold text-[#73837D]">{key}</span>
            <span className="sm:col-span-2 text-[#20343C] font-medium leading-relaxed">{value}</span>
          </div>
        ))}
      </div>

      <div className="mt-4 pt-3 border-t border-[#EDF2F0] flex items-start gap-2 text-[10px] sm:text-[11px] text-[#7A8983] leading-relaxed">
        <Info className="w-3.5 h-3.5 mt-0.5 shrink-0" />
        <span>Specifications can vary by region or variant. CatchThePrice does not fill missing fields by guessing; confirm critical details with the retailer or manufacturer before purchase.</span>
      </div>
    </section>
  );
}
