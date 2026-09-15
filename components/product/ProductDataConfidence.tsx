'use client';

import React from 'react';
import { Database, Store, History, Sliders, ShieldCheck } from 'lucide-react';
import { Product } from '@/lib/types';

interface ProductDataConfidenceProps {
  product: Product;
  isPreview?: boolean;
}

export function ProductDataConfidence({ product, isPreview = false }: ProductDataConfidenceProps) {
  const historyCount = product.priceHistory?.length || 0;
  const specsCount = Object.keys(product.specs || {}).length;

  const items = [
    {
      label: 'Retailer offers',
      value: product.offersCount > 0 ? `${product.offersCount} listed` : 'None yet',
      detail: 'Only active offers available for this market.',
      icon: Store,
    },
    {
      label: 'Price history',
      value: historyCount > 1 ? `${historyCount} observations` : 'Building history',
      detail: historyCount > 1 ? 'Based on stored observations.' : 'No long-term trend claimed yet.',
      icon: History,
    },
    {
      label: 'Specifications',
      value: specsCount > 0 ? `${specsCount} fields` : 'Not available',
      detail: 'Missing values are not invented.',
      icon: Sliders,
    },
    {
      label: 'Data mode',
      value: isPreview ? 'Preview only' : 'Production data',
      detail: isPreview ? 'Do not use preview prices for a purchase decision.' : 'Source-backed market data only.',
      icon: Database,
    },
  ];

  return (
    <section className="rounded-3xl border border-[#DDE7E3] bg-white p-4 sm:p-6 shadow-[0_10px_30px_rgba(24,52,43,0.05)]">
      <div className="flex items-start gap-3">
        <div className="w-9 h-9 rounded-xl bg-[#EAF8F1] border border-[#CFE9DD] text-[#0B8F58] flex items-center justify-center shrink-0">
          <ShieldCheck className="w-4 h-4" />
        </div>
        <div>
          <h3 className="font-extrabold text-sm sm:text-base text-[#173028]">What this page actually knows</h3>
          <p className="text-[11px] sm:text-xs text-[#6D7E78] mt-0.5 leading-relaxed">
            CatchThePrice separates confirmed data from information that is still being collected.
          </p>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-2 lg:grid-cols-4 gap-3">
        {items.map((item) => {
          const Icon = item.icon;
          return (
            <div key={item.label} className="rounded-2xl border border-[#E1E9E5] bg-[#F9FCFA] p-3.5 min-w-0">
              <div className="flex items-center gap-2 text-[#6D7E78] text-[10px] font-bold uppercase tracking-wider">
                <Icon className="w-3.5 h-3.5 text-[#0B8F58] shrink-0" />
                <span className="truncate">{item.label}</span>
              </div>
              <div className="mt-2 text-sm font-extrabold text-[#173028]">{item.value}</div>
              <p className="mt-1 text-[10px] sm:text-[11px] text-[#73837D] leading-relaxed">{item.detail}</p>
            </div>
          );
        })}
      </div>
    </section>
  );
}
