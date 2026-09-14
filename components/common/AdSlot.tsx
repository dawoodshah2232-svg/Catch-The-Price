'use client';

import React from 'react';

interface AdSlotProps {
  slotId: string;
  format?: 'banner' | 'rectangle' | 'in-feed';
  className?: string;
}

export function AdSlot({ slotId, format = 'banner', className = '' }: AdSlotProps) {
  // Dimension styles matching standard IAB / Google AdSense units
  const formatClasses = {
    banner: 'h-[90px] max-w-[728px]',
    rectangle: 'h-[250px] max-w-[300px]',
    'in-feed': 'h-[120px] max-w-full',
  };

  return (
    <div
      className={`w-full mx-auto my-6 flex flex-col items-center justify-center rounded-2xl bg-ctp-surface/40 border border-ctp-border-subtle p-3 text-center transition-all ${className}`}
      aria-label="Advertisement"
    >
      <div className="text-[10px] uppercase tracking-widest text-slate-500 font-semibold mb-1">
        Sponsored Advertisement
      </div>

      <div
        className={`w-full ${formatClasses[format]} rounded-xl border border-dashed border-ctp/80 bg-slate-950/30 flex flex-col items-center justify-center p-4`}
      >
        <span className="text-xs text-slate-400 font-medium">Google AdSense Placement</span>
        <span className="text-[10px] text-slate-400 mt-0.5">Slot ID: {slotId}</span>
      </div>
    </div>
  );
}
