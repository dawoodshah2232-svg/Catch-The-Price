'use client';

import React from 'react';
import { useCountry } from '@/context/CountryContext';
import { getProductBySlug } from '@/lib/data/products';
import { ArrowRight, Sparkles, Scale } from 'lucide-react';

export function SmartComparisonBlock() {
  const { country, formatLocalPrice } = useCountry();

  const iphone = getProductBySlug('iphone-16-pro-max-256gb', country);
  const samsung = getProductBySlug('samsung-galaxy-s24-ultra-512gb', country);

  if (!iphone || !samsung) return null;

  return (
    <section className="py-10 sm:py-14 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-t border-[#162633]">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 mb-8">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-[#00D27A] flex items-center gap-1.5">
            <Scale className="w-3.5 h-3.5" /> Flagship Head-to-Head
          </span>
          <h2 className="text-xl sm:text-2xl font-bold text-[#F8FAFC] mt-1.5">
            Smart Comparison: iPhone 16 Pro Max vs Galaxy S24 Ultra
          </h2>
        </div>
        <p className="text-xs text-[#CBD5E1] max-w-md">
          Live multi-store price analysis to help you decide which premium flagship offers the best value today.
        </p>
      </div>

      {/* Comparison Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
        {/* Product A: iPhone 16 Pro Max */}
        <div className="rounded-3xl bg-[#091217] border border-[#1c2d3a] hover:border-[#00D27A]/40 transition-all p-5 sm:p-6 flex flex-col justify-between relative overflow-hidden group">
          <div className="absolute -top-12 -right-12 w-32 h-32 bg-[#00D27A]/5 rounded-full blur-2xl pointer-events-none" />

          <div>
            <div className="flex items-center justify-between gap-3 mb-4">
              <span className="text-xs font-bold text-[#00D27A] uppercase tracking-wider">{iphone.brand}</span>
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-extrabold bg-[#00D27A]/15 text-[#00D27A] border border-[#00D27A]/30">
                <Sparkles className="w-3.5 h-3.5" /> Deal Score {iphone.dealScore}
              </span>
            </div>

            <div className="flex items-center gap-4 mb-4">
              <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-[#071015] border border-[#162633] p-2 shrink-0 flex items-center justify-center">
                <img
                  src={iphone.imageUrl}
                  alt={iphone.title}
                  className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="min-w-0">
                <h3 className="text-sm sm:text-base font-bold text-[#F8FAFC] leading-snug line-clamp-2">
                  {iphone.title}
                </h3>
                <div className="mt-2 flex items-baseline gap-2">
                  <span className="text-xl sm:text-2xl font-extrabold text-[#00D27A]">
                    {formatLocalPrice(iphone.currentBestPrice)}
                  </span>
                  {iphone.originalPrice > iphone.currentBestPrice && (
                    <span className="text-xs text-[#94A3B8] line-through font-medium">
                      {formatLocalPrice(iphone.originalPrice)}
                    </span>
                  )}
                </div>
                <span className="text-[11px] text-[#94A3B8] mt-0.5 block">
                  Available from {iphone.offersCount} verified retailers
                </span>
              </div>
            </div>

            {/* Spec Highlights */}
            <div className="space-y-2 py-3 border-t border-[#162633] text-xs">
              <div className="flex items-center justify-between">
                <span className="text-[#94A3B8]">Chipset:</span>
                <span className="font-semibold text-[#F8FAFC]">A18 Pro (3nm)</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[#94A3B8]">Camera:</span>
                <span className="font-semibold text-[#F8FAFC]">48MP Fusion + 5x Optical</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[#94A3B8]">Display:</span>
                <span className="font-semibold text-[#F8FAFC]">6.9&quot; Super Retina XDR OLED</span>
              </div>
            </div>
          </div>

          <a
            href={`/${country}/product/${iphone.slug}`}
            className="mt-4 w-full py-2.5 px-4 rounded-xl bg-[#00D27A]/12 hover:bg-[#00D27A] text-[#00D27A] hover:text-[#060D12] border border-[#00D27A]/30 hover:border-[#00D27A] font-bold text-xs flex items-center justify-center gap-2 transition-all duration-200"
          >
            <span>Compare {iphone.offersCount} Store Offers</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </a>
        </div>

        {/* Product B: Galaxy S24 Ultra */}
        <div className="rounded-3xl bg-[#091217] border border-[#1c2d3a] hover:border-[#00D27A]/40 transition-all p-5 sm:p-6 flex flex-col justify-between relative overflow-hidden group">
          <div className="absolute -top-12 -right-12 w-32 h-32 bg-[#00D27A]/5 rounded-full blur-2xl pointer-events-none" />

          <div>
            <div className="flex items-center justify-between gap-3 mb-4">
              <span className="text-xs font-bold text-[#00D27A] uppercase tracking-wider">{samsung.brand}</span>
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-extrabold bg-[#00D27A]/15 text-[#00D27A] border border-[#00D27A]/30">
                <Sparkles className="w-3.5 h-3.5" /> Deal Score {samsung.dealScore}
              </span>
            </div>

            <div className="flex items-center gap-4 mb-4">
              <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-[#071015] border border-[#162633] p-2 shrink-0 flex items-center justify-center">
                <img
                  src={samsung.imageUrl}
                  alt={samsung.title}
                  className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="min-w-0">
                <h3 className="text-sm sm:text-base font-bold text-[#F8FAFC] leading-snug line-clamp-2">
                  {samsung.title}
                </h3>
                <div className="mt-2 flex items-baseline gap-2">
                  <span className="text-xl sm:text-2xl font-extrabold text-[#00D27A]">
                    {formatLocalPrice(samsung.currentBestPrice)}
                  </span>
                  {samsung.originalPrice > samsung.currentBestPrice && (
                    <span className="text-xs text-[#94A3B8] line-through font-medium">
                      {formatLocalPrice(samsung.originalPrice)}
                    </span>
                  )}
                </div>
                <span className="text-[11px] text-[#94A3B8] mt-0.5 block">
                  Available from {samsung.offersCount} verified retailers
                </span>
              </div>
            </div>

            {/* Spec Highlights */}
            <div className="space-y-2 py-3 border-t border-[#162633] text-xs">
              <div className="flex items-center justify-between">
                <span className="text-[#94A3B8]">Chipset:</span>
                <span className="font-semibold text-[#F8FAFC]">Snapdragon 8 Gen 3</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[#94A3B8]">Camera:</span>
                <span className="font-semibold text-[#F8FAFC]">200MP + Galaxy AI Quad Tele</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[#94A3B8]">Display:</span>
                <span className="font-semibold text-[#F8FAFC]">6.8&quot; Dynamic AMOLED 2X 120Hz</span>
              </div>
            </div>
          </div>

          <a
            href={`/${country}/product/${samsung.slug}`}
            className="mt-4 w-full py-2.5 px-4 rounded-xl bg-[#00D27A]/12 hover:bg-[#00D27A] text-[#00D27A] hover:text-[#060D12] border border-[#00D27A]/30 hover:border-[#00D27A] font-bold text-xs flex items-center justify-center gap-2 transition-all duration-200"
          >
            <span>Compare {samsung.offersCount} Store Offers</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>
    </section>
  );
}
