'use client';

import React from 'react';
import { useCountry } from '@/context/CountryContext';
import { Bell, ArrowRight, ShieldCheck, UserRound } from 'lucide-react';

export function PriceAlertCTASection() {
  const { country } = useCountry();

  return (
    <section className="py-8 sm:py-14 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-t border-[#162633]">
      <div className="rounded-3xl bg-gradient-to-r from-[#091217] via-[#0f1c24] to-[#091217] border border-[#162633] p-5 sm:p-10 text-center max-w-4xl mx-auto relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#00D27A]/10 blur-3xl pointer-events-none rounded-full" />

        <div className="relative z-10 max-w-xl mx-auto space-y-3.5">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#00D27A]/15 border border-[#00D27A]/30 text-xs font-bold text-[#00D27A]">
            <Bell className="w-3.5 h-3.5" />
            <span>Price tracking</span>
          </div>

          <h2 className="text-2xl sm:text-4xl font-extrabold text-[#F8FAFC] tracking-tight">
            Waiting for a better price?
          </h2>

          <p className="text-xs sm:text-sm text-[#CBD5E1] leading-relaxed">
            Open a live product, choose your target and save the alert to your CatchThePrice account. Price tracking only uses genuine product and offer records available for your selected market.
          </p>

          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
            <a
              href={`/${country}/search`}
              className="w-full sm:w-auto px-7 py-3.5 rounded-2xl bg-[#00D27A] hover:bg-[#00E6A2] text-[#071015] font-extrabold text-sm transition-all touch-target flex items-center justify-center gap-2"
            >
              <span>Find a product to track</span>
              <ArrowRight className="w-4 h-4" />
            </a>
            <a
              href={`/${country}/account?tab=alerts`}
              className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-[#111E27] hover:bg-[#162633] border border-[#28404F] text-[#F8FAFC] font-bold text-sm transition-colors touch-target flex items-center justify-center gap-2"
            >
              <UserRound className="w-4 h-4 text-[#00D27A]" />
              <span>My alerts</span>
            </a>
          </div>

          <div className="pt-1 flex items-start justify-center gap-2 text-[11px] text-[#94A3B8] max-w-md mx-auto">
            <ShieldCheck className="w-3.5 h-3.5 text-[#00D27A] shrink-0 mt-0.5" />
            <span>Alert saving is account-backed. Email delivery is only shown as active after verification and notification delivery are configured.</span>
          </div>
        </div>
      </div>
    </section>
  );
}
