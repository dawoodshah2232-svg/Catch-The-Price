'use client';

import React, { useState } from 'react';
import { Sliders, Cpu, Monitor, Camera, Battery } from 'lucide-react';

interface ProductSpecsProps {
  specs: Record<string, string>;
  brand: string;
}

export function ProductSpecs({ specs, brand }: ProductSpecsProps) {
  const [activeCategory, setActiveCategory] = useState('all');

  if (!specs || Object.keys(specs).length === 0) return null;

  const entries = Object.entries(specs);

  // Group specs into intuitive categories
  const categories = [
    {
      id: 'all',
      name: 'All Specs',
      icon: Sliders,
      filter: () => true,
    },
    {
      id: 'display',
      name: 'Display',
      icon: Monitor,
      filter: ([k]: [string, string]) => /display|screen|resolution|refresh|panel/i.test(k),
    },
    {
      id: 'performance',
      name: 'Performance',
      icon: Cpu,
      filter: ([k]: [string, string]) => /processor|chip|cpu|ram|memory|storage|os|gpu/i.test(k),
    },
    {
      id: 'camera',
      name: 'Camera',
      icon: Camera,
      filter: ([k]: [string, string]) => /camera|sensor|zoom|lens|video|mp/i.test(k),
    },
    {
      id: 'battery',
      name: 'Battery',
      icon: Battery,
      filter: ([k]: [string, string]) => /battery|charging|watt|mah/i.test(k),
    },
  ];

  const currentCategory = categories.find((c) => c.id === activeCategory) || categories[0];
  const filteredEntries = entries.filter(currentCategory.filter);
  const displayEntries = filteredEntries.length > 0 ? filteredEntries : entries;

  return (
    <div className="rounded-3xl bg-[#091217] border border-[#162633] p-5 sm:p-7">
      <div className="pb-4 border-b border-[#162633] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h3 className="font-bold text-base sm:text-lg text-[#F8FAFC] flex items-center gap-2">
            <Sliders className="w-4 h-4 text-[#00D27A]" />
            <span>Technical Specifications</span>
          </h3>
          <p className="text-xs text-[#CBD5E1] mt-0.5">Verified official manufacturer specifications</p>
        </div>
        <span className="text-xs font-semibold px-2.5 py-1 rounded-xl bg-[#071015] border border-[#162633] text-[#CBD5E1] self-start sm:self-auto">
          Brand: <strong className="text-[#F8FAFC]">{brand}</strong>
        </span>
      </div>

      {/* Category Pills */}
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
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all touch-target ${
                isSelected
                  ? 'bg-[#00D27A]/15 text-[#00D27A] border border-[#00D27A]/30 font-bold'
                  : 'bg-[#071015] text-[#CBD5E1] hover:text-white border border-[#162633] hover:border-[#203648]'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{cat.name}</span>
            </button>
          );
        })}
      </div>

      {/* Specs List */}
      <div className="mt-3 divide-y divide-[#162633]">
        {displayEntries.map(([key, value]) => (
          <div key={key} className="py-3 grid grid-cols-1 sm:grid-cols-3 gap-1 sm:gap-4 text-xs">
            <span className="font-semibold text-[#94A3B8]">{key}</span>
            <span className="sm:col-span-2 text-[#F8FAFC] font-medium leading-relaxed">{value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
