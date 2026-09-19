'use client';

import React from 'react';
import { KeySpecItem } from '@/lib/types';
import { specIcon } from './specIcons';

interface KeySpecsSummaryProps {
  keySpecs?: KeySpecItem[];
  specs?: Record<string, string>;
  brand?: string;
  category?: string;
  isIPhone16ProMax?: boolean;
}

export function KeySpecsSummary({
  keySpecs,
  specs = {},
  brand = '',
  category = '',
  isIPhone16ProMax = false,
}: KeySpecsSummaryProps) {
  let items: { label: string; value: string; icon: ReturnType<typeof specIcon> }[] = [];

  if (keySpecs && keySpecs.length > 0) {
    items = keySpecs.map((item) => ({
      label: item.label,
      value: item.value,
      icon: specIcon(item.label, category),
    }));
  } else if (isIPhone16ProMax) {
    items = [
      { label: 'Display', value: '6.9" 120Hz OLED', icon: specIcon('Display') },
      { label: 'Chip', value: 'A18 Pro (3nm)', icon: specIcon('Chip') },
      { label: 'Camera', value: '48MP Triple + 5x', icon: specIcon('Camera') },
      { label: 'Battery', value: '4685 mAh', icon: specIcon('Battery') },
      { label: 'Storage', value: '256GB / 8GB RAM', icon: specIcon('Storage') },
      { label: 'Build', value: 'Titanium IP68', icon: specIcon('Build') },
    ];
  } else {
    // Dynamic extraction from specs
    const candidates = [
      { label: 'Display', keys: ['Display', 'Screen', 'Panel'] },
      { label: 'Processor', keys: ['Processor', 'Chip', 'CPU', 'Platform'] },
      { label: 'Memory', keys: ['RAM', 'Memory'] },
      { label: 'Storage', keys: ['Storage', 'Capacity', 'Drive'] },
      { label: 'Camera', keys: ['Camera', 'Sensor', 'Main Camera'] },
      { label: 'Battery', keys: ['Battery', 'Runtime', 'Battery Life'] },
      { label: 'Graphics', keys: ['Graphics', 'GPU'] },
      { label: 'Connectivity', keys: ['Wireless', 'Wi-Fi', 'Bluetooth', 'Connectivity'] },
      { label: 'Audio', keys: ['Audio', 'Sound', 'ANC', 'Driver'] },
    ];

    for (const c of candidates) {
      if (items.length >= 6) break;
      for (const k of c.keys) {
        if (specs[k]) {
          items.push({ label: c.label, value: specs[k], icon: specIcon(c.label, category) });
          break;
        }
      }
    }

    if (items.length === 0) {
      items = [
        { label: 'Brand', value: brand || specs['Brand'] || 'Authentic', icon: specIcon('Brand') },
        { label: 'Display', value: specs['Display'] || specs['Screen'] || 'Standard Display', icon: specIcon('Display') },
        { label: 'Hardware', value: specs['Processor'] || specs['Chip'] || specs['LaunchStatus'] || 'In-Market UAE', icon: specIcon('Processor') },
        { label: 'Storage', value: specs['Storage'] || specs['Memory'] || 'UAE Retail Spec', icon: specIcon('Storage') },
      ];
    }
  }

  return (
    <div className="pt-1">
      {/* Desktop: clean 2-row compact grid or flex wrap */}
      <div className="hidden sm:grid sm:grid-cols-3 gap-2">
        {items.map((item, idx) => {
          const Icon = item.icon;
          return (
            <div
              key={idx}
              className="px-3 py-3 rounded-xl bg-[#F8FAF9] border border-[#DDE7E3] flex items-center gap-2.5 text-xs font-bold text-[#102027] hover:border-[#BFD2CA] transition-colors"
            >
              <div className="w-8 h-8 rounded-lg bg-[#E5F8EF] text-[#08784B] flex items-center justify-center shrink-0">
                <Icon className="w-5 h-5 stroke-2" />
              </div>
              <div className="min-w-0">
                <span className="text-[9px] uppercase tracking-wider font-extrabold text-[#73858D] block leading-none mb-0.5">
                  {item.label}
                </span>
                <span className="block leading-snug text-[#102027]">
                  {item.value}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Mobile: horizontal swipeable compact chips */}
      <div className="sm:hidden flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
        {items.map((item, idx) => {
          const Icon = item.icon;
          return (
            <div
              key={idx}
              className="shrink-0 px-2.5 py-1.5 rounded-xl bg-[#F8FAF9] border border-[#DDE7E3] flex items-center gap-1.5 text-[11px] font-bold text-[#102027]"
            >
              <Icon className="w-3.5 h-3.5 text-[#08784B] shrink-0 stroke-[2.2]" />
              <span className="text-[10px] text-[#73858D]">{item.label}:</span>
              <span className="whitespace-nowrap">{item.value}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
