'use client';

import React from 'react';

interface AdSlotProps {
  slotId: string;
  format?: 'banner' | 'rectangle' | 'in-feed';
  className?: string;
}

export function AdSlot({ slotId, format = 'banner', className = '' }: AdSlotProps) {
  const formatClasses = {
    banner: 'h-[50px] sm:h-[68px] max-w-[728px]',
    rectangle: 'h-[180px] sm:h-[220px] max-w-[300px]',
    'in-feed': 'h-[54px] sm:h-[74px] max-w-full',
  };

  return (
    <div
      className={`w-full mx-auto my-4 sm:my-6 flex flex-col items-center justify-center p-2.5 rounded-2xl bg-[#071015]/30 border border-[#162633]/40 transition-all ${className}`}
      aria-label="Advertisement Placement"
    >
      <div className="text-[9px] uppercase tracking-widest text-[#64748B] font-semibold mb-1">
        Sponsored Advertisement
      </div>

      <div
        className={`w-full ${formatClasses[format]} rounded-xl border border-dashed border-[#162633]/60 bg-[#091217]/30 flex flex-col items-center justify-center p-2 text-center`}
      >
        <span className="text-xs text-[#94A3B8] font-medium">Google AdSense Reserved Slot</span>
        <span className="text-[10px] text-[#64748B] font-mono">ID: {slotId}</span>
      </div>
    </div>
  );
}
