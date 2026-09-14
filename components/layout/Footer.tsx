'use client';

import React, { useState } from 'react';
import { useCountry } from '@/context/CountryContext';
import { BrandLogo } from '@/components/common/BrandLogo';
import { CATEGORIES } from '@/lib/data/categories';
import { COUNTRIES } from '@/lib/data/countries';
import { CountryCode } from '@/lib/types';
import { ShieldCheck, TrendingDown, BellRing, Sparkles, ExternalLink, ChevronDown } from 'lucide-react';

export function Footer() {
  const { country, setCountry } = useCountry();
  const [openAccordions, setOpenAccordions] = useState<Record<string, boolean>>({
    categories: false,
    discovery: false,
    transparency: false,
  });

  const toggleAccordion = (section: string) => {
    setOpenAccordions((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  return (
    <footer className="w-full bg-[#071015] border-t border-[#162633] pt-8 sm:pt-12 pb-24 lg:pb-12 text-[#CBD5E1] text-xs transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Value Props Strip - Compact on mobile */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 pb-6 sm:pb-10 border-b border-[#162633]">
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-xl bg-[#00D27A]/10 text-[#00D27A] border border-[#00D27A]/25 shrink-0">
              <TrendingDown className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <div>
              <h4 className="font-bold text-[#F8FAFC] text-xs sm:text-sm">Real-Time Price Drops</h4>
              <p className="mt-0.5 text-[#CBD5E1] text-[11px] sm:text-xs leading-relaxed">
                Monitors verified electronics stores continuously to detect dips the moment they occur.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="p-2 rounded-xl bg-[#00C996]/10 text-[#00C996] border border-[#00C996]/25 shrink-0">
              <Sparkles className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <div>
              <h4 className="font-bold text-[#F8FAFC] text-xs sm:text-sm">Proprietary Deal Score</h4>
              <p className="mt-0.5 text-[#CBD5E1] text-[11px] sm:text-xs leading-relaxed">
                0–100 algorithm benchmarks against 90-day moving averages to separate real drops.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="p-2 rounded-xl bg-[#00E6A2]/10 text-[#00E6A2] border border-[#00E6A2]/25 shrink-0">
              <BellRing className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <div>
              <h4 className="font-bold text-[#F8FAFC] text-xs sm:text-sm">Custom Price Alerts</h4>
              <p className="mt-0.5 text-[#CBD5E1] text-[11px] sm:text-xs leading-relaxed">
                Set target price thresholds and receive instant notifications when prices drop.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="p-2 rounded-xl bg-[#00D27A]/10 text-[#00D27A] border border-[#00D27A]/25 shrink-0">
              <ShieldCheck className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <div>
              <h4 className="font-bold text-[#F8FAFC] text-xs sm:text-sm">100% Retailer Checkout</h4>
              <p className="mt-0.5 text-[#CBD5E1] text-[11px] sm:text-xs leading-relaxed">
                You always purchase directly on the official retailer website with valid warranties.
              </p>
            </div>
          </div>
        </div>

        {/* Main Footer Links */}
        <div className="flex flex-col md:grid md:grid-cols-5 gap-6 sm:gap-8 py-6 sm:py-10">
          <div className="md:col-span-2 space-y-3 sm:space-y-4">
            <BrandLogo size="md" variant="full" />
            <p className="text-[#CBD5E1] max-w-sm text-xs leading-relaxed">
              <strong className="text-[#F8FAFC]">Smarter Shopping for a Brighter Tomorrow.</strong>
              <br />
              Compare prices. Track drops. Save more.
            </p>
            
            <div className="flex flex-wrap items-center gap-1.5 pt-1">
              <span className="text-[11px] font-semibold text-[#94A3B8]">Markets:</span>
              {(Object.keys(COUNTRIES) as CountryCode[]).map((code) => {
                const c = COUNTRIES[code];
                return (
                  <button
                    key={code}
                    onClick={() => setCountry(code)}
                    className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] transition-colors touch-target ${
                      code === country
                        ? 'bg-[#00D27A]/15 text-[#00D27A] font-bold border border-[#00D27A]/30'
                        : 'bg-[#091217] text-[#CBD5E1] hover:text-white border border-[#162633]'
                    }`}
                  >
                    <span>{c.flag}</span>
                    <span>{c.currency}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Categories Accordion / Column */}
          <div className="border-t border-[#162633] pt-4 md:border-t-0 md:pt-0">
            <button
              type="button"
              onClick={() => toggleAccordion('categories')}
              className="w-full flex items-center justify-between font-bold text-[#F8FAFC] text-xs tracking-wider uppercase mb-0 md:mb-3 md:pointer-events-none"
            >
              <span>Categories</span>
              <ChevronDown
                className={`w-4 h-4 text-[#94A3B8] transition-transform duration-200 md:hidden ${
                  openAccordions.categories ? 'rotate-180 text-[#00D27A]' : ''
                }`}
              />
            </button>
            <ul
              className={`space-y-2 text-[#CBD5E1] transition-all overflow-hidden ${
                openAccordions.categories ? 'block mt-3' : 'hidden md:block'
              }`}
            >
              {CATEGORIES.map((cat) => (
                <li key={cat.id}>
                  <a
                    href={`/${country}/deals/${cat.slug}`}
                    className="hover:text-[#00D27A] transition-colors block py-1 touch-target flex items-center"
                  >
                    {cat.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Discovery Accordion / Column */}
          <div className="border-t border-[#162633] pt-4 md:border-t-0 md:pt-0">
            <button
              type="button"
              onClick={() => toggleAccordion('discovery')}
              className="w-full flex items-center justify-between font-bold text-[#F8FAFC] text-xs tracking-wider uppercase mb-0 md:mb-3 md:pointer-events-none"
            >
              <span>Discovery</span>
              <ChevronDown
                className={`w-4 h-4 text-[#94A3B8] transition-transform duration-200 md:hidden ${
                  openAccordions.discovery ? 'rotate-180 text-[#00D27A]' : ''
                }`}
              />
            </button>
            <ul
              className={`space-y-2 text-[#CBD5E1] transition-all overflow-hidden ${
                openAccordions.discovery ? 'block mt-3' : 'hidden md:block'
              }`}
            >
              <li>
                <a href={`/${country}/deals/all`} className="hover:text-[#00D27A] transition-colors block py-1 touch-target flex items-center">
                  Today&apos;s Best Deals
                </a>
              </li>
              <li>
                <a href={`/${country}/price-drops/all`} className="hover:text-[#00D27A] transition-colors block py-1 touch-target flex items-center">
                  Biggest Price Drops
                </a>
              </li>
              <li>
                <a href={`/${country}/account?tab=alerts`} className="hover:text-[#00D27A] transition-colors block py-1 touch-target flex items-center">
                  Track Prices
                </a>
              </li>
              <li>
                <a href={`/${country}/account?tab=saved`} className="hover:text-[#00D27A] transition-colors block py-1 touch-target flex items-center">
                  Saved Products
                </a>
              </li>
              <li>
                <a href="/admin" className="hover:text-[#00D27A] transition-colors flex items-center gap-1 py-1 touch-target">
                  <span>Admin Operations</span>
                  <ExternalLink className="w-3 h-3 text-[#94A3B8]" />
                </a>
              </li>
            </ul>
          </div>

          {/* Transparency Accordion / Column */}
          <div className="border-t border-[#162633] pt-4 md:border-t-0 md:pt-0">
            <button
              type="button"
              onClick={() => toggleAccordion('transparency')}
              className="w-full flex items-center justify-between font-bold text-[#F8FAFC] text-xs tracking-wider uppercase mb-0 md:mb-3 md:pointer-events-none"
            >
              <span>Transparency</span>
              <ChevronDown
                className={`w-4 h-4 text-[#94A3B8] transition-transform duration-200 md:hidden ${
                  openAccordions.transparency ? 'rotate-180 text-[#00D27A]' : ''
                }`}
              />
            </button>
            <ul
              className={`space-y-2 text-[#CBD5E1] transition-all overflow-hidden ${
                openAccordions.transparency ? 'block mt-3' : 'hidden md:block'
              }`}
            >
              <li>
                <a href={`/${country}#how-it-works`} className="hover:text-[#00D27A] transition-colors block py-1 touch-target flex items-center">
                  How Pricing Works
                </a>
              </li>
              <li>
                <a href={`/${country}#disclaimer`} className="hover:text-[#00D27A] transition-colors block py-1 touch-target flex items-center">
                  Retailer Checkout Terms
                </a>
              </li>
              <li>
                <a href={`/${country}#affiliate`} className="hover:text-[#00D27A] transition-colors block py-1 touch-target flex items-center">
                  Affiliate Disclosure
                </a>
              </li>
              <li>
                <a href={`/${country}#privacy`} className="hover:text-[#00D27A] transition-colors block py-1 touch-target flex items-center">
                  Privacy Policy
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Legal and Disclaimer Notice */}
        <div className="pt-6 sm:pt-8 border-t border-[#162633] text-[11px] text-[#94A3B8] space-y-2">
          <p>
            <strong className="text-[#F8FAFC]">Notice:</strong> CatchThePrice is an independent price comparison and price-tracking technology platform. CatchThePrice does not sell products or collect customer payments. When clicking outbound links to merchant offers, you complete your transaction on the retailer&apos;s official site under their checkout terms.
          </p>
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-2 text-[#94A3B8]">
            <p>© {new Date().getFullYear()} CatchThePrice (catchtheprice.com). All rights reserved.</p>
            <p className="font-mono text-[10px] text-[#CBD5E1]">TRACK IT. CATCH THE DROP. PAY LESS.</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
