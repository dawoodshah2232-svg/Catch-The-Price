'use client';

import React, { useState } from 'react';
import { useCountry } from '@/context/CountryContext';
import { Bell, ArrowRight, ShieldCheck, Sparkles } from 'lucide-react';
import { PriceAlertModal } from '@/components/product/PriceAlertModal';
import { getAllProducts } from '@/lib/data/products';

export function PriceAlertCTASection() {
  const { country } = useCountry();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const products = getAllProducts(country);
  const defaultProduct = products[0];

  return (
    <section className="py-8 sm:py-14 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-t border-[#162633]">
      <div className="rounded-3xl bg-gradient-to-r from-[#091217] via-[#0f1c24] to-[#091217] border border-[#162633] p-5 sm:p-10 text-center max-w-4xl mx-auto relative overflow-hidden shadow-2xl">
        {/* Restrained emerald accent in background */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#00D27A]/10 blur-3xl pointer-events-none rounded-full" />

        <div className="relative z-10 max-w-xl mx-auto space-y-3.5">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#00D27A]/15 border border-[#00D27A]/30 text-xs font-bold text-[#00D27A]">
            <Bell className="w-3.5 h-3.5" />
            <span>Never Overpay Again</span>
          </div>

          <h2 className="text-2xl sm:text-4xl font-extrabold text-[#F8FAFC] tracking-tight">
            Waiting for a better price?
          </h2>

          <p className="text-xs sm:text-sm text-[#CBD5E1] leading-relaxed">
            Set a target budget on any phone, laptop, TV, or console. CatchThePrice scans verified stores 24/7 and alerts you the moment the price plunges.
          </p>

          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              type="button"
              onClick={() => setIsModalOpen(true)}
              className="w-full sm:w-auto px-8 py-3.5 rounded-2xl btn-conversion-primary font-extrabold text-sm sm:text-base transition-all touch-target flex items-center justify-center gap-2"
            >
              <span>Track a Product</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <div className="pt-1 flex items-center justify-center gap-3 sm:gap-4 text-[11px] text-[#94A3B8]">
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-3 h-3 text-[#00D27A]" /> 100% Free
            </span>
            <span>•</span>
            <span>No account required</span>
            <span>•</span>
            <span>Unsubscribe anytime</span>
          </div>
        </div>
      </div>

      {defaultProduct && (
        <PriceAlertModal
          product={defaultProduct}
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </section>
  );
}
