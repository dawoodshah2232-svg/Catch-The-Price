import React from 'react';

export function ProductCardSkeleton() {
  return (
    <div className="rounded-2xl bg-[#091217] border border-[#162633] p-4 space-y-3 animate-pulse">
      <div className="w-full aspect-[4/3] rounded-xl bg-[#0f1c24]" />
      <div className="w-16 h-3 rounded bg-[#162633]" />
      <div className="w-full h-4 rounded bg-[#162633]" />
      <div className="w-2/3 h-4 rounded bg-[#162633]" />
      <div className="pt-2 border-t border-[#162633] flex justify-between items-center">
        <div className="w-24 h-6 rounded bg-[#162633]" />
        <div className="w-16 h-4 rounded bg-[#162633]" />
      </div>
    </div>
  );
}

export function ProductDetailSkeleton() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8 animate-pulse">
      <div className="w-48 h-4 rounded bg-[#162633]" />
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-5 aspect-square rounded-3xl bg-[#091217] border border-[#162633]" />
        <div className="lg:col-span-7 space-y-4">
          <div className="w-24 h-4 rounded bg-[#162633]" />
          <div className="w-3/4 h-8 rounded bg-[#162633]" />
          <div className="w-full h-16 rounded bg-[#162633]" />
          <div className="w-full h-32 rounded-3xl bg-[#091217] border border-[#162633]" />
        </div>
      </div>
    </div>
  );
}
