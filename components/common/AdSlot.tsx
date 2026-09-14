'use client';

import React from 'react';

interface AdSlotProps {
  slotId: string;
  format?: 'banner' | 'rectangle' | 'in-feed';
  className?: string;
}

export function AdSlot({ slotId, format = 'banner', className = '' }: AdSlotProps) {
  const formatClasses = {
    banner: 'h-[90px] max-w-[728px]',
    rectangle: 'h-[250px] max-w-[300px]',
    'in-feed': 'h-[110px] max-w-full',
  };

  return (
    <div
      className={`w-full mx-auto my-8 flex flex-col items-center justify-center p-3 rounded-2xl bg-[#071015]/60 border border-[#162633]/60 transition-all ${className}`}
      aria-label="Advertisement Placement"
    >
      <div className="text-[9px] uppercase tracking-widest text-[#5B6B7C] font-bold mb-1.5">
        Sponsored Advertisement
      </div>

      <div
        className={`w-full ${formatClasses[format]} rounded-xl border border-dashed border-[#162633] bg-[#091217]/50 flex flex-col items-center justify-center p-3 text-center`}
      >
        <span className="text-xs text-[#8E9DAE] font-medium">Google AdSense Reserved Slot</span>
        <span className="text-[10px] text-[#5B6B7C] mt-0.5 font-mono">ID: {slotId}</span>
      </div>
    </div>
  );
}
