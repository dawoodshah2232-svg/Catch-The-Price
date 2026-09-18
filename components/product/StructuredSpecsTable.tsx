'use client';

import React, { useState } from 'react';
import { SpecGroup } from '@/lib/types';
import { Sliders, Monitor, Cpu, Camera, Battery, Smartphone, Wifi, Info } from 'lucide-react';

interface StructuredSpecsTableProps {
  specGroups?: SpecGroup[];
  fallbackSpecs?: Record<string, string>;
  brand?: string;
}

export function StructuredSpecsTable({ specGroups, fallbackSpecs = {}, brand = '' }: StructuredSpecsTableProps) {
  const [activeTab, setActiveTab] = useState<string>('all');

  // If specGroups is passed, use it directly. Otherwise build groups from fallbackSpecs.
  const groups: SpecGroup[] = (specGroups && specGroups.length > 0)
    ? specGroups
    : [
        {
          category: 'General',
          specs: Object.entries(fallbackSpecs).map(([name, value]) => ({ name, value })),
        },
      ];

  if (groups.length === 0 || (groups.length === 1 && groups[0].specs.length === 0)) {
    return null;
  }

  const tabs = [
    { id: 'all', name: 'All Specifications', icon: Sliders },
    { id: 'display', name: 'Display', icon: Monitor },
    { id: 'platform', name: 'Platform & Chip', icon: Cpu },
    { id: 'camera', name: 'Camera', icon: Camera },
    { id: 'battery', name: 'Battery & Power', icon: Battery },
    { id: 'body', name: 'Body & Build', icon: Smartphone },
    { id: 'connectivity', name: 'Connectivity', icon: Wifi },
  ];

  // Filter groups based on activeTab
  const filteredGroups = activeTab === 'all'
    ? groups
    : groups.filter((group) => {
        const cat = group.category.toLowerCase();
        if (activeTab === 'display') return cat.includes('display') || cat.includes('screen');
        if (activeTab === 'platform') return cat.includes('platform') || cat.includes('chip') || cat.includes('memory');
        if (activeTab === 'camera') return cat.includes('camera');
        if (activeTab === 'battery') return cat.includes('battery') || cat.includes('power') || cat.includes('charging');
        if (activeTab === 'body') return cat.includes('body') || cat.includes('build') || cat.includes('color');
        if (activeTab === 'connectivity') return cat.includes('connect') || cat.includes('audio') || cat.includes('sensor');
        return true;
      });

  const displayGroups = filteredGroups.length > 0 ? filteredGroups : groups;

  return (
    <section className="rounded-[24px] bg-white border border-[#DDE7E3] p-4 sm:p-6 shadow-[0_8px_24px_rgba(25,55,45,0.04)] space-y-4">
      {/* Header */}
      <div className="pb-3 border-b border-[#EDF2F0] flex items-center justify-between gap-3">
        <div>
          <h3 className="font-extrabold text-base sm:text-lg text-[#102027] flex items-center gap-2">
            <Sliders className="w-4 h-4 text-[#08784B]" />
            <span>Technical Specifications</span>
          </h3>
          <p className="text-xs text-[#73858D] mt-0.5">
            Verified hardware architecture and regional specifications
          </p>
        </div>
        {brand && (
          <span className="text-[11px] font-bold px-2.5 py-1 rounded-xl bg-[#F4F7F6] border border-[#DDE7E3] text-[#31474F]">
            {brand}
          </span>
        )}
      </div>

      {/* Specification Category Tabs (Functional & Clickable) */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isSelected = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold shrink-0 transition-all cursor-pointer ${
                isSelected
                  ? 'bg-[#E5F8EF] text-[#08784B] border border-[#C7EEDC] shadow-2xs'
                  : 'bg-[#F4F7F6] text-[#60727A] hover:text-[#102027] border border-[#DDE7E3] hover:border-[#BFD2CA]'
              }`}
            >
              <Icon className="w-3.5 h-3.5 stroke-[2.2]" />
              <span>{tab.name}</span>
            </button>
          );
        })}
      </div>

      {/* Information-Rich Two-Column Specification Rows */}
      <div className="space-y-4 pt-1">
        {displayGroups.map((group, groupIdx) => (
          <div
            key={groupIdx}
            className="rounded-2xl border border-[#EDF2F0] bg-white overflow-hidden"
          >
            {/* Group Header */}
            <div className="bg-[#F8FAF9] px-3.5 py-2 border-b border-[#EDF2F0] flex items-center justify-between">
              <h4 className="text-[11px] font-extrabold uppercase tracking-wider text-[#08784B]">
                {group.category}
              </h4>
              <span className="text-[10px] text-[#829198] font-semibold">
                {group.specs.length} specs
              </span>
            </div>

            {/* Spec rows - compact two-column rows */}
            <div className="divide-y divide-[#F1F5F3]">
              {group.specs.map((item, specIdx) => (
                <div
                  key={specIdx}
                  className="px-3.5 py-2 grid grid-cols-1 sm:grid-cols-12 gap-1 sm:gap-4 text-xs hover:bg-[#FBFDFB] transition-colors"
                >
                  <div className="sm:col-span-4 font-semibold text-[#60727A] flex items-center">
                    {item.name}
                  </div>
                  <div className="sm:col-span-8 text-[#102027] font-medium leading-relaxed break-words">
                    {item.value}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Small Trust Note */}
      <div className="pt-1 flex items-start gap-2 text-[11px] text-[#73858D] leading-relaxed">
        <Info className="w-3.5 h-3.5 mt-0.5 text-[#08784B] shrink-0" />
        <span>
          Specifications are verified against official manufacturer documentation and UAE retailer hardware releases.
        </span>
      </div>
    </section>
  );
}
