'use client';

import React from 'react';
import { Monitor, Cpu, Camera, BatteryCharging, HardDrive, ShieldCheck } from 'lucide-react';

interface KeySpecsSummaryProps {
  specs?: Record<string, string>;
  brand?: string;
  isIPhone16ProMax?: boolean;
}

export function KeySpecsSummary({ specs = {}, brand = '', isIPhone16ProMax = false }: KeySpecsSummaryProps) {
  const items = isIPhone16ProMax
    ? [
        { label: 'Display', value: '6.9" 120Hz OLED', icon: Monitor },
        { label: 'Chip', value: 'A18 Pro (3nm)', icon: Cpu },
        { label: 'Camera', value: '48MP Triple + 5x', icon: Camera },
        { label: 'Battery', value: '4685 mAh', icon: BatteryCharging },
        { label: 'Storage', value: '256GB / 8GB RAM', icon: HardDrive },
        { label: 'Build', value: 'Titanium IP68', icon: ShieldCheck },
      ]
    : [
        { label: 'Brand', value: brand || specs['Brand'] || 'Authentic', icon: ShieldCheck },
        { label: 'Display', value: specs['Display'] || specs['Screen'] || 'Standard Display', icon: Monitor },
        { label: 'Hardware', value: specs['Processor'] || specs['Chip'] || specs['LaunchStatus'] || 'In-Market UAE', icon: Cpu },
        { label: 'Storage', value: specs['Storage'] || specs['Memory'] || 'UAE Retail Spec', icon: HardDrive },
      ];

  return (
    <div className="pt-1">
      {/* Desktop: clean 2-row compact grid or flex wrap */}
      <div className="hidden sm:grid sm:grid-cols-3 gap-2">
        {items.map((item, idx) => {
          const Icon = item.icon;
          return (
            <div
              key={idx}
              className="px-2.5 py-1.5 rounded-xl bg-[#F8FAF9] border border-[#DDE7E3] flex items-center gap-2 text-xs font-bold text-[#102027] hover:border-[#BFD2CA] transition-colors"
            >
              <div className="w-6 h-6 rounded-lg bg-[#E5F8EF] text-[#08784B] flex items-center justify-center shrink-0">
                <Icon className="w-3.5 h-3.5 stroke-[2.4]" />
              </div>
              <div className="min-w-0 truncate">
                <span className="text-[9px] uppercase tracking-wider font-extrabold text-[#73858D] block leading-none mb-0.5">
                  {item.label}
                </span>
                <span className="truncate block leading-tight text-[#102027]">
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
