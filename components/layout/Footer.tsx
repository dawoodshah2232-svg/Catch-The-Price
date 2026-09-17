'use client';

import React, { useState } from 'react';
import { useCountry } from '@/context/CountryContext';
import { CATEGORIES } from '@/lib/data/categories';
import { COUNTRIES } from '@/lib/data/countries';
import { CountryCode } from '@/lib/types';
import { ShieldCheck, TrendingDown, BellRing, Sparkles, ChevronDown, BookOpen } from 'lucide-react';

const MARKET_CODES: CountryCode[] = ['ae', 'us', 'sa', 'uk', 'ca', 'au'];

export function Footer() {
  const { country, setCountry } = useCountry();
  const [openAccordions, setOpenAccordions] = useState<Record<string, boolean>>({ categories: false, discovery: false, transparency: false });
  const toggleAccordion = (section: string) => setOpenAccordions((prev) => ({ ...prev, [section]: !prev[section] }));

  return (
    <footer className="ctp-footer-dark w-full border-t pt-7 sm:pt-12 pb-24 lg:pb-12 text-xs transition-colors">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-5 gap-y-6 pb-7 sm:pb-10 border-b border-[#1A2B35]">
          {[
            { Icon: TrendingDown, title: 'Price Tracking', text: 'Follow genuine price changes across available offers.' },
            { Icon: Sparkles, title: 'Smart Comparison', text: 'Compare products, specifications and retailer offers.' },
            { Icon: BellRing, title: 'Price Alerts', text: 'Track products and set target-price alerts when available.' },
            { Icon: ShieldCheck, title: 'Retailer Checkout', text: 'Purchases are completed directly on the retailer website.' },
          ].map(({ Icon, title, text }) => (
            <div key={title} className="flex items-start gap-3">
              <div className="p-2 rounded-xl bg-[#0F1C24] text-[#4DE4A5] border border-[#223743] shrink-0"><Icon className="w-4 h-4 sm:w-5 sm:h-5" /></div>
              <div className="min-w-0">
                <h4 className="font-bold chrome-primary text-[11px] sm:text-sm">{title}</h4>
                <p className="mt-0.5 chrome-muted text-[10px] sm:text-xs leading-relaxed">{text}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="flex flex-col md:grid md:grid-cols-5 gap-7 sm:gap-9 py-8 sm:py-11">
          <div className="md:col-span-2 space-y-4 sm:space-y-5">
            <a href={`/${country}`} aria-label="CatchThePrice home" className="block h-[68px] w-[270px] sm:h-[78px] sm:w-[310px]"><img src="/images/catch-the-price-logo.png" alt="CatchThePrice" className="h-full w-full object-contain object-left drop-shadow-[0_5px_12px_rgba(0,0,0,.24)]" /></a>
            <p className="chrome-secondary max-w-md text-xs leading-[1.7]">
              <strong className="chrome-primary">Smarter Shopping for a Brighter Tomorrow.</strong><br />Compare prices. Track drops. Save more.
            </p>

            <div className="pt-1">
              <div className="mb-2 flex items-center gap-2"><span className="h-px w-5 bg-[#2c4a3c]" /><span className="text-[11px] font-bold uppercase tracking-[.12em] text-[#d7e8df]">Markets</span></div>
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
              {MARKET_CODES.map((code) => {
                const c = COUNTRIES[code];
                const isLive = code === 'ae' || code === 'us';
                return (
                  <button
                    key={code}
                    onClick={() => isLive && setCountry(code)}
                    disabled={!isLive}
                    className={`inline-flex min-h-[42px] items-center gap-2 rounded-lg border px-2.5 py-2 text-left text-[11px] transition-all ${
                      code === country
                        ? 'border-[#2b875e] bg-[#123c2c] font-bold text-[#a3f6ca] shadow-[inset_0_1px_0_rgba(255,255,255,.06)]'
                        : isLive
                          ? 'border-[#29424e] bg-[#0f1c24] text-[#e0ebe6] hover:-translate-y-px hover:border-[#4d8070] hover:bg-[#14272e] hover:text-white'
                          : 'cursor-not-allowed border-[#203540] bg-[#0a151b] text-[#95aaa1] opacity-80'
                    }`}
                  >
                    <span className="text-[16px] leading-none">{c.flag}</span><span className="min-w-0 truncate">{c.name}</span>
                  </button>
                );
              })}</div>
            </div>
          </div>

          <FooterAccordion title="Categories" id="categories" open={openAccordions.categories} onToggle={toggleAccordion}>
            {CATEGORIES.map((cat) => <li key={cat.id}><a href={`/${country}/deals/${cat.slug}`} className="footer-link">{cat.name}</a></li>)}
          </FooterAccordion>

          <FooterAccordion title="Discover" id="discovery" open={openAccordions.discovery} onToggle={toggleAccordion}>
            <li><a href={`/${country}/deals/all`} className="footer-link">Today&apos;s Best Deals</a></li>
            <li><a href={`/${country}/price-drops/all`} className="footer-link">Biggest Price Drops</a></li>
            <li><a href={`/${country}/compare`} className="footer-link">Compare Products</a></li>
            <li><a href={`/${country}/account?tab=saved`} className="footer-link">Saved Products</a></li>
            <li><a href={`/${country}/blog`} className="footer-link flex items-center gap-1.5"><BookOpen className="w-3 h-3" /> Blog & Guides</a></li>
          </FooterAccordion>

          <FooterAccordion title="Company" id="transparency" open={openAccordions.transparency} onToggle={toggleAccordion}>
            <li><a href="/about" className="footer-link">About</a></li>
            <li><a href="/contact" className="footer-link">Contact</a></li>
            <li><a href="/how-pricing-works" className="footer-link">How Pricing Works</a></li>
            <li><a href="/data-sources" className="footer-link">Data Sources</a></li>
            <li><a href="/editorial-policy" className="footer-link">Editorial Policy</a></li>
            <li><a href="/affiliate-disclosure" className="footer-link">Affiliate Disclosure</a></li>
            <li><a href="/privacy" className="footer-link">Privacy Policy</a></li>
            <li><a href="/terms" className="footer-link">Terms</a></li>
          </FooterAccordion>
        </div>

        <div className="pt-5 sm:pt-8 border-t border-[#1A2B35] text-[10px] sm:text-[11px] chrome-muted space-y-2 leading-relaxed">
          <p><strong className="chrome-primary">Notice:</strong> CatchThePrice is an independent price-comparison and price-tracking platform. Prices and availability can change. CatchThePrice does not sell products or collect retailer payments.</p>
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-2"><p>© {new Date().getFullYear()} CatchThePrice. All rights reserved.</p><p className="font-mono text-[9px] sm:text-[10px] chrome-secondary">TRACK IT. CATCH THE DROP. PAY LESS.</p></div>
        </div>
      </div>
    </footer>
  );
}

function FooterAccordion({ title, id, open, onToggle, children }: { title: string; id: string; open: boolean; onToggle: (id: string) => void; children: React.ReactNode }) {
  return (
    <div className="border-t border-[#1A2B35] pt-4 md:border-t-0 md:pt-0">
      <button type="button" onClick={() => onToggle(id)} className="w-full min-h-[40px] flex items-center justify-between font-bold chrome-primary text-xs tracking-wider uppercase md:pointer-events-none">
        <span>{title}</span><ChevronDown className={`w-4 h-4 chrome-muted transition-transform duration-200 md:hidden ${open ? 'rotate-180 text-[#67EFB8]' : ''}`} />
      </button>
      <ul className={`space-y-1.5 overflow-hidden ${open ? 'block mt-2' : 'hidden md:block md:mt-3'}`}>{children}</ul>
    </div>
  );
}
