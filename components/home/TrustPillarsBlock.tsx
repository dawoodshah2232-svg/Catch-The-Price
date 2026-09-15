'use client';

import React from 'react';
import { ShieldCheck, Lock, RefreshCw, Award } from 'lucide-react';

const PILLARS = [
  {
    icon: Lock,
    title: '100% Direct Checkout',
    description: 'You complete your order directly on the authorized retailer’s official checkout. CatchThePrice never collects your payment details.',
  },
  {
    icon: Award,
    title: 'Zero Paid Ranking Bias',
    description: 'Stores cannot purchase higher search positions or inflate Deal Scores. Price and genuine value dictate every ranking.',
  },
  {
    icon: RefreshCw,
    title: 'Automated Price Sync',
    description: 'We continuously poll authorized API feeds and merchant catalogs to alert you the exact hour a price drop occurs.',
  },
  {
    icon: ShieldCheck,
    title: 'Official Warranties',
    description: 'Every verified store in our index supplies genuine manufacturer warranties valid in your local market.',
  },
];

export function TrustPillarsBlock() {
  return (
    <section className="py-10 sm:py-14 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-t border-[#162633]">
      <div className="text-center max-w-2xl mx-auto mb-10">
        <span className="text-xs font-bold uppercase tracking-wider text-[#00D27A]">
          The CatchThePrice Standard
        </span>
        <h2 className="text-xl sm:text-2xl font-bold text-[#F8FAFC] mt-1.5">
          Built for Shoppers, Never Retailers
        </h2>
        <p className="text-xs text-[#CBD5E1] mt-2 leading-relaxed">
          Transparent, unbiased price intelligence engineered to save you real money on every purchase.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {PILLARS.map((p, idx) => {
          const Icon = p.icon;
          return (
            <div
              key={idx}
              className="p-5 sm:p-6 rounded-2xl bg-[#091217] border border-[#162633] hover:border-[#203648] transition-all flex flex-col justify-between group"
            >
              <div>
                <div className="w-10 h-10 rounded-xl bg-[#00D27A]/10 text-[#00D27A] border border-[#00D27A]/25 flex items-center justify-center mb-4 transition-transform group-hover:scale-105">
                  <Icon className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-sm text-[#F8FAFC] group-hover:text-white">
                  {p.title}
                </h3>
                <p className="text-xs text-[#94A3B8] mt-2 leading-relaxed">
                  {p.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
