'use client';

import React from 'react';
import { Scale, LineChart, BellRing, ShieldCheck } from 'lucide-react';

export function PriceIntelligenceSection() {
  const steps = [
    {
      step: '01',
      title: 'Compare',
      description: 'We check prices across verified stores in real-time.',
      icon: Scale,
      color: '#00D27A',
    },
    {
      step: '02',
      title: 'Track',
      description: 'We monitor price changes and analyze 90-day history.',
      icon: LineChart,
      color: '#00C996',
    },
    {
      step: '03',
      title: 'Catch',
      description: 'You get alerted the moment the price drops to your target.',
      icon: BellRing,
      color: '#00E6A2',
    },
  ];

  return (
    <section className="py-10 sm:py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-t border-[#162633]">
      <div className="text-center max-w-2xl mx-auto mb-10">
        <span className="text-xs font-bold uppercase tracking-wider text-[#00D27A]">
          Shopping Intelligence
        </span>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-[#F8FAFC] mt-1.5">
          How CatchThePrice Works
        </h2>
        <p className="text-xs sm:text-sm text-[#8E9DAE] mt-2">
          Independent price intelligence engineered to save you real money on every electronics purchase.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {steps.map((item) => {
          const Icon = item.icon;
          return (
            <div
              key={item.title}
              className="p-6 rounded-3xl bg-[#091217] border border-[#162633] hover:border-[#203648] transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div
                    className="w-12 h-12 rounded-2xl flex items-center justify-center border"
                    style={{
                      backgroundColor: `${item.color}15`,
                      borderColor: `${item.color}35`,
                      color: item.color,
                    }}
                  >
                    <Icon className="w-6 h-6 stroke-[1.75]" />
                  </div>
                  <span className="font-mono text-xs font-bold text-[#5B6B7C]">STEP {item.step}</span>
                </div>

                <h3 className="text-lg font-bold text-[#F8FAFC]">{item.title}</h3>
                <p className="text-xs sm:text-sm text-[#8E9DAE] mt-2 leading-relaxed">
                  {item.description}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-[#162633]/70 flex items-center gap-1.5 text-[11px] font-semibold" style={{ color: item.color }}>
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Verified Data Engine</span>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
