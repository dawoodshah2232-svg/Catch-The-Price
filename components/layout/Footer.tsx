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
    <footer className="w-full bg-ctp-surface border-t border-ctp pt-12 pb-24 md:pb-12 text-slate-400 text-xs transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Value Props Strip */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 pb-12 border-b border-ctp">
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shrink-0">
              <TrendingDown className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-semibold text-slate-200 text-sm">Real-Time Price Drops</h4>
              <p className="mt-1 text-slate-400 text-xs">
                We monitor verified electronics retailers 24/7 to catch drops the second they happen.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 shrink-0">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-semibold text-slate-200 text-sm">Proprietary Deal Score</h4>
              <p className="mt-1 text-slate-400 text-xs">
                0–100 algorithm analyzes 90-day pricing history to filter fake sales from genuine bargains.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shrink-0">
              <BellRing className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-semibold text-slate-200 text-sm">Custom Price Alerts</h4>
              <p className="mt-1 text-slate-400 text-xs">
                Set your dream budget or target discount and get instant notifications when prices hit your goal.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-semibold text-slate-200 text-sm">100% Retailer Checkout</h4>
              <p className="mt-1 text-slate-400 text-xs">
                You always purchase directly from verified retailers with official warranties.
              </p>
            </div>
          </div>
        </div>

        {/* Main Footer Links */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 py-10">
          <div className="col-span-2">
            <BrandLogo size="md" />
            <p className="mt-3 text-slate-400 max-w-sm text-xs leading-relaxed">
              CatchThePrice is a global price comparison, deals discovery, and price-tracking platform. 
              Track it. Catch the drop. Pay less.
            </p>
            
            <div className="mt-4 flex flex-wrap gap-2">
              <span className="text-[11px] font-medium text-slate-300">Supported Markets:</span>
              {(Object.keys(COUNTRIES) as CountryCode[]).map((code) => {
                const c = COUNTRIES[code];
                return (
                  <button
                    key={code}
                    onClick={() => setCountry(code)}
                    className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] transition-colors ${
                      code === country
                        ? 'bg-emerald-500/20 text-emerald-300 font-semibold border border-emerald-500/40'
                        : 'bg-slate-800 text-slate-400 hover:text-slate-200'
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
            <h5 className="font-semibold text-slate-200 text-xs tracking-wider uppercase mb-3">
              Categories
            </h5>
            <ul className="space-y-2">
              {CATEGORIES.map((cat) => (
                <li key={cat.id}>
                  <a
                    href={`/${country}/deals/${cat.slug}`}
                    className="hover:text-emerald-400 transition-colors"
                  >
                    {cat.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h5 className="font-semibold text-slate-200 text-xs tracking-wider uppercase mb-3">
              Features
            </h5>
            <ul className="space-y-2">
              <li>
                <a href={`/${country}/deals/all`} className="hover:text-emerald-400 transition-colors">
                  Today&apos;s Top Deals
                </a>
              </li>
              <li>
                <a href={`/${country}/price-drops/all`} className="hover:text-emerald-400 transition-colors">
                  Biggest Price Drops
                </a>
              </li>
              <li>
                <a href={`/${country}/account?tab=alerts`} className="hover:text-emerald-400 transition-colors">
                  Set Price Tracker
                </a>
              </li>
              <li>
                <a href={`/${country}/account?tab=saved`} className="hover:text-emerald-400 transition-colors">
                  Saved Products
                </a>
              </li>
              <li>
                <a href="/admin" className="hover:text-emerald-400 transition-colors flex items-center gap-1">
                  <span>Admin Portal</span>
                  <ExternalLink className="w-3 h-3 text-slate-400" />
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h5 className="font-semibold text-slate-200 text-xs tracking-wider uppercase mb-3">
              Transparency
            </h5>
            <ul className="space-y-2">
              <li>
                <a href={`/${country}#disclaimer`} className="hover:text-emerald-400 transition-colors">
                  Retailer Checkout Terms
                </a>
              </li>
              <li>
                <a href={`/${country}#affiliate`} className="hover:text-emerald-400 transition-colors">
                  Affiliate Disclosure
                </a>
              </li>
              <li>
                <a href={`/${country}#privacy`} className="hover:text-emerald-400 transition-colors">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href={`/${country}#contact`} className="hover:text-emerald-400 transition-colors">
                  Contact Support
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Affiliate Disclosure & Legal Notice */}
        <div className="pt-8 border-t border-ctp text-[11px] text-slate-400 space-y-2">
          <p>
            <strong className="text-slate-400">Notice:</strong> CatchThePrice is an independent price comparison and tracking platform. CatchThePrice is not an online store and does not sell products or collect customer payments. When you click &quot;Buy on [Retailer]&quot;, you are redirected to the official retailer&apos;s site where you finalize your transaction under their terms and privacy policies.
          </p>
          <p>
            <strong className="text-slate-400">Affiliate Disclosure:</strong> CatchThePrice may earn a commission when you click external merchant links and complete a purchase. This never impacts product prices or Deal Score evaluations.
          </p>
          <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-2 text-slate-400">
            <p>© {new Date().getFullYear()} CatchThePrice (catchtheprice.com). All rights reserved.</p>
            <p>Designed for UAE, USA, UK, Canada & Australia.</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
