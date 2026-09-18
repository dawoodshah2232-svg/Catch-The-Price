'use client';

import React, { useState } from 'react';
import { SpecGroup } from '@/lib/types';
import { Sliders, Monitor, Cpu, Camera, Battery, Smartphone, Wifi, Info } from 'lucide-react';
import { specIcon } from './specIcons';

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
      <div className="flex items-center gap-2 overflow-x-auto pb-1" aria-label="Specification categories">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isSelected = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              aria-pressed={isSelected}
              className={`inline-flex min-h-11 items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold shrink-0 transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-700 cursor-pointer ${
                isSelected
                  ? 'bg-emerald-700 text-white border border-emerald-700 shadow-sm'
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
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 pt-1 items-start">
        {displayGroups.map((group, groupIdx) => {
          const GroupIcon = specIcon(group.category);
          return (
          <div
            key={groupIdx}
            className="rounded-2xl border border-[#EDF2F0] bg-white overflow-hidden"
          >
            {/* Group Header */}
            <div className="bg-[#F4F7F6] px-3.5 py-3 border-b border-[#EDF2F0] flex items-center gap-2">
              <GroupIcon className="size-5 shrink-0 text-emerald-700" aria-hidden="true" />
              <h4 className="text-sm font-extrabold text-[#102027]">
                {group.category}
              </h4>
            </div>

            {/* Spec rows - compact two-column rows */}
            <div className="divide-y divide-[#F1F5F3]">
              {group.specs.map((item, specIdx) => {
                const RowIcon = specIcon(item.name, group.category);
                return (
                <div
                  key={specIdx}
                  className="px-3 py-2.5 grid grid-cols-[minmax(0,0.85fr)_minmax(0,1.3fr)] gap-3 text-xs sm:text-[13px] hover:bg-[#F8FAF9] transition-colors"
                >
                  <div className="min-w-0 font-semibold text-[#435962] flex items-start gap-2 leading-relaxed">
                    <RowIcon className="size-4 mt-0.5 shrink-0" aria-hidden="true" />
                    {item.name}
                  </div>
                  <div className="min-w-0 text-[#20343C] font-medium leading-relaxed wrap-anywhere">
                    {item.value}
                  </div>
                </div>
              ); })}
            </div>
          </div>
        ); })}
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
