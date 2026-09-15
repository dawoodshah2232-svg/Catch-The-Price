'use client';

import React from 'react';
import { ShieldCheck, Lock, RefreshCw, Award } from 'lucide-react';

const PILLARS = [
  {
    icon: Lock,
    title: 'Retailer Checkout',
    description: 'Purchases are completed on the retailer website. CatchThePrice does not collect retailer payments.',
  },
  {
    icon: Award,
    title: 'Clear Comparison',
    description: 'We are building ranking and comparison logic around price, availability and product relevance rather than paid placement.',
  },
  {
    icon: RefreshCw,
    title: 'Fresh Price Data',
    description: 'Approved data sources can refresh product and offer information as new price updates arrive.',
  },
  {
    icon: ShieldCheck,
    title: 'Source Transparency',
    description: 'Product pages are designed to show where pricing and offer information comes from before you click through.',
  },
];

export function TrustPillarsBlock() {
  return (
    <section className="py-10 sm:py-14 bg-white border-y border-[#E2EBE7]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-9">
          <span className="text-xs font-bold uppercase tracking-wider text-[#08784B]">The CatchThePrice standard</span>
          <h2 className="text-xl sm:text-2xl font-extrabold text-[#102027] mt-1.5">Built for smarter shopping decisions</h2>
          <p className="text-xs text-[#64767E] mt-2 leading-relaxed">Simple, transparent tools that help you compare before leaving for a retailer site.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {PILLARS.map((p, idx) => {
            const Icon = p.icon;
            return (
              <div key={idx} className="p-5 sm:p-6 rounded-2xl bg-[#F8FAF9] border border-[#DDE7E3] hover:border-[#A9CBBE] transition-all flex flex-col justify-between group">
                <div>
                  <div className="w-10 h-10 rounded-xl bg-[#EEF8F3] text-[#08784B] border border-[#CFE6DC] flex items-center justify-center mb-4 transition-transform group-hover:scale-105">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="font-bold text-sm text-[#102027]">{p.title}</h3>
                  <p className="text-xs text-[#64767E] mt-2 leading-relaxed">{p.description}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
