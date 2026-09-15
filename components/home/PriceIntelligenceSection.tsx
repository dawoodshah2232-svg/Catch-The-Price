'use client';

import React from 'react';
import { Scale, LineChart, BellRing, ShieldCheck } from 'lucide-react';

export function PriceIntelligenceSection() {
  const steps = [
    { step: '01', title: 'Compare', description: 'Compare current store listings for the same product in one place.', icon: Scale },
    { step: '02', title: 'Track', description: 'Follow saved products and review available price history over time.', icon: LineChart },
    { step: '03', title: 'Catch', description: 'Set a target and keep an eye on the price you actually want to pay.', icon: BellRing },
  ];

  return (
    <section className="py-8 sm:py-14 bg-[#F8FAF9] border-y border-[#E2EBE7]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-6 sm:mb-9">
          <span className="text-xs font-bold uppercase tracking-wider text-[#08784B]">Shopping intelligence</span>
          <h2 className="text-xl sm:text-3xl font-extrabold text-[#102027] mt-1">How CatchThePrice works</h2>
          <p className="text-xs sm:text-sm text-[#64767E] mt-1.5 leading-relaxed">
            A simple flow designed to help shoppers compare, watch and decide with more confidence.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-6">
          {steps.map((item) => {
            const Icon = item.icon;
            return (
              <div key={item.title} className="p-5 sm:p-6 rounded-2xl sm:rounded-3xl bg-white border border-[#DDE7E3] hover:border-[#A9CBBE] shadow-[0_10px_26px_rgba(29,71,57,.05)] transition-all flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-11 h-11 rounded-2xl flex items-center justify-center bg-[#EEF8F3] border border-[#CFE6DC] text-[#08784B]">
                      <Icon className="w-5 h-5 stroke-[1.75]" />
                    </div>
                    <span className="font-mono text-[11px] font-bold text-[#8A999F]">STEP {item.step}</span>
                  </div>
                  <h3 className="text-base sm:text-lg font-bold text-[#102027]">{item.title}</h3>
                  <p className="text-xs sm:text-sm text-[#64767E] mt-1.5 leading-relaxed">{item.description}</p>
                </div>
                <div className="mt-5 pt-4 border-t border-[#E4ECE8] flex items-center gap-1.5 text-[11px] font-semibold text-[#08784B]">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Transparent data workflow</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
