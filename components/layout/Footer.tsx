'use client';

import React from 'react';
import { useCountry } from '@/context/CountryContext';
import { BrandLogo } from '@/components/common/BrandLogo';
import { CATEGORIES } from '@/lib/data/categories';
import { COUNTRIES } from '@/lib/data/countries';
import { CountryCode } from '@/lib/types';
import { ShieldCheck, TrendingDown, BellRing, Sparkles, ExternalLink } from 'lucide-react';

export function Footer() {
  const { country, setCountry } = useCountry();

  return (
    <footer className="w-full bg-[#071015] border-t border-[#162633] pt-12 pb-28 lg:pb-12 text-[#8E9DAE] text-xs transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Value Props Strip */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 pb-12 border-b border-[#162633]">
          <div className="flex items-start gap-3.5">
            <div className="p-2.5 rounded-2xl bg-[#00D27A]/10 text-[#00D27A] border border-[#00D27A]/25 shrink-0">
              <TrendingDown className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-[#F8FAFC] text-sm">Real-Time Price Drops</h4>
              <p className="mt-1 text-[#8E9DAE] text-xs leading-relaxed">
                Monitors verified electronics stores continuously to detect dips the moment they occur.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3.5">
            <div className="p-2.5 rounded-2xl bg-[#00C996]/10 text-[#00C996] border border-[#00C996]/25 shrink-0">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-[#F8FAFC] text-sm">Proprietary Deal Score</h4>
              <p className="mt-1 text-[#8E9DAE] text-xs leading-relaxed">
                0–100 algorithm benchmarks against 90-day moving averages to separate real drops from artificial markups.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3.5">
            <div className="p-2.5 rounded-2xl bg-[#00E6A2]/10 text-[#00E6A2] border border-[#00E6A2]/25 shrink-0">
              <BellRing className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-[#F8FAFC] text-sm">Custom Price Alerts</h4>
              <p className="mt-1 text-[#8E9DAE] text-xs leading-relaxed">
                Set target price thresholds and receive instant notifications when prices drop into your budget.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3.5">
            <div className="p-2.5 rounded-2xl bg-[#00D27A]/10 text-[#00D27A] border border-[#00D27A]/25 shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-[#F8FAFC] text-sm">100% Retailer Checkout</h4>
              <p className="mt-1 text-[#8E9DAE] text-xs leading-relaxed">
                You always purchase directly on the official retailer website with valid manufacturer warranties.
              </p>
            </div>
          </div>
        </div>

        {/* Main Footer Links */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 py-10">
          <div className="col-span-2 space-y-4">
            <BrandLogo size="md" variant="full" />
            <p className="text-[#8E9DAE] max-w-sm text-xs leading-relaxed">
              <strong>Smarter Shopping for a Brighter Tomorrow.</strong>
              <br />
              Compare prices. Track drops. Save more.
            </p>
            
            <div className="flex flex-wrap items-center gap-1.5 pt-1">
              <span className="text-[11px] font-semibold text-[#5B6B7C]">Markets:</span>
              {(Object.keys(COUNTRIES) as CountryCode[]).map((code) => {
                const c = COUNTRIES[code];
                return (
                  <button
                    key={code}
                    onClick={() => setCountry(code)}
                    className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] transition-colors ${
                      code === country
                        ? 'bg-[#00D27A]/15 text-[#00D27A] font-bold border border-[#00D27A]/30'
                        : 'bg-[#091217] text-[#8E9DAE] hover:text-white border border-[#162633]'
                    }`}
                  >
                    <span>{c.flag}</span>
                    <span>{c.currency}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <h5 className="font-bold text-[#F8FAFC] text-xs tracking-wider uppercase mb-3.5">
              Categories
            </h5>
            <ul className="space-y-2">
              {CATEGORIES.map((cat) => (
                <li key={cat.id}>
                  <a
                    href={`/${country}/deals/${cat.slug}`}
                    className="hover:text-[#00D27A] transition-colors"
                  >
                    {cat.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h5 className="font-bold text-[#F8FAFC] text-xs tracking-wider uppercase mb-3.5">
              Discovery
            </h5>
            <ul className="space-y-2">
              <li>
                <a href={`/${country}/deals/all`} className="hover:text-[#00D27A] transition-colors">
                  Today&apos;s Best Deals
                </a>
              </li>
              <li>
                <a href={`/${country}/price-drops/all`} className="hover:text-[#00D27A] transition-colors">
                  Biggest Price Drops
                </a>
              </li>
              <li>
                <a href={`/${country}/account?tab=alerts`} className="hover:text-[#00D27A] transition-colors">
                  Track Prices
                </a>
              </li>
              <li>
                <a href={`/${country}/account?tab=saved`} className="hover:text-[#00D27A] transition-colors">
                  Saved Products
                </a>
              </li>
              <li>
                <a href="/admin" className="hover:text-[#00D27A] transition-colors flex items-center gap-1">
                  <span>Admin Operations</span>
                  <ExternalLink className="w-3 h-3 text-[#5B6B7C]" />
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h5 className="font-bold text-[#F8FAFC] text-xs tracking-wider uppercase mb-3.5">
              Transparency
            </h5>
            <ul className="space-y-2">
              <li>
                <a href={`/${country}#how-it-works`} className="hover:text-[#00D27A] transition-colors">
                  How Pricing Works
                </a>
              </li>
              <li>
                <a href={`/${country}#disclaimer`} className="hover:text-[#00D27A] transition-colors">
                  Retailer Checkout Terms
                </a>
              </li>
              <li>
                <a href={`/${country}#affiliate`} className="hover:text-[#00D27A] transition-colors">
                  Affiliate Disclosure
                </a>
              </li>
              <li>
                <a href={`/${country}#privacy`} className="hover:text-[#00D27A] transition-colors">
                  Privacy Policy
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Legal and Disclaimer Notice */}
        <div className="pt-8 border-t border-[#162633] text-[11px] text-[#5B6B7C] space-y-2">
          <p>
            <strong className="text-[#8E9DAE]">Notice:</strong> CatchThePrice is an independent price comparison and price-tracking technology platform. CatchThePrice does not sell products or collect customer payments. When clicking outbound links to merchant offers, you complete your transaction on the retailer&apos;s official site under their checkout terms.
          </p>
          <div className="pt-3 flex flex-col sm:flex-row items-center justify-between gap-2 text-[#5B6B7C]">
            <p>© {new Date().getFullYear()} CatchThePrice (catchtheprice.com). All rights reserved.</p>
            <p className="font-mono text-[10px]">TRACK IT. CATCH THE DROP. PAY LESS.</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
