'use client';

import React, { useState } from 'react';
import { useCountry } from '@/context/CountryContext';
import { BrandLogo } from '@/components/common/BrandLogo';
import { CATEGORIES } from '@/lib/data/categories';
import { COUNTRIES } from '@/lib/data/countries';
import { CountryCode } from '@/lib/types';
import { ShieldCheck, TrendingDown, BellRing, Sparkles, ChevronDown, BookOpen } from 'lucide-react';

const LIVE_MARKETS: CountryCode[] = ['ae', 'us'];

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
    <footer className="w-full bg-[#071015] border-t border-[#162633] pt-7 sm:pt-12 pb-24 lg:pb-12 text-[#CBD5E1] text-xs transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 pb-6 sm:pb-10 border-b border-[#162633]">
          <div className="flex items-start gap-2.5">
            <div className="p-2 rounded-xl bg-[#00D27A]/10 text-[#00D27A] border border-[#00D27A]/25 shrink-0">
              <TrendingDown className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <div className="min-w-0">
              <h4 className="font-bold text-[#F8FAFC] text-[11px] sm:text-sm">Price Tracking</h4>
              <p className="mt-0.5 text-[#94A3B8] text-[10px] sm:text-xs leading-relaxed">
                Follow price changes across available offers.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-2.5">
            <div className="p-2 rounded-xl bg-[#00C996]/10 text-[#00C996] border border-[#00C996]/25 shrink-0">
              <Sparkles className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <div className="min-w-0">
              <h4 className="font-bold text-[#F8FAFC] text-[11px] sm:text-sm">Deal Score</h4>
              <p className="mt-0.5 text-[#94A3B8] text-[10px] sm:text-xs leading-relaxed">
                A simple signal to help compare listed offers.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-2.5">
            <div className="p-2 rounded-xl bg-[#00E6A2]/10 text-[#00E6A2] border border-[#00E6A2]/25 shrink-0">
              <BellRing className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <div className="min-w-0">
              <h4 className="font-bold text-[#F8FAFC] text-[11px] sm:text-sm">Price Alerts</h4>
              <p className="mt-0.5 text-[#94A3B8] text-[10px] sm:text-xs leading-relaxed">
                Track products and set target-price alerts.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-2.5">
            <div className="p-2 rounded-xl bg-[#00D27A]/10 text-[#00D27A] border border-[#00D27A]/25 shrink-0">
              <ShieldCheck className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <div className="min-w-0">
              <h4 className="font-bold text-[#F8FAFC] text-[11px] sm:text-sm">Retailer Checkout</h4>
              <p className="mt-0.5 text-[#94A3B8] text-[10px] sm:text-xs leading-relaxed">
                Purchases are completed on the retailer&apos;s website.
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-col md:grid md:grid-cols-5 gap-5 sm:gap-8 py-6 sm:py-10">
          <div className="md:col-span-2 space-y-3 sm:space-y-4">
            <BrandLogo size="md" variant="full" />
            <p className="text-[#CBD5E1] max-w-sm text-xs leading-relaxed">
              <strong className="text-[#F8FAFC]">Smarter Shopping for a Brighter Tomorrow.</strong>
              <br />
              Compare prices. Track drops. Save more.
            </p>

            <div className="flex flex-wrap items-center gap-1.5 pt-1">
              <span className="text-[11px] font-semibold text-[#94A3B8]">Live markets:</span>
              {LIVE_MARKETS.map((code) => {
                const c = COUNTRIES[code];
                return (
                  <button
                    key={code}
                    onClick={() => setCountry(code)}
                    className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] transition-colors min-h-[36px] ${
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

          <FooterAccordion title="Categories" id="categories" open={openAccordions.categories} onToggle={toggleAccordion}>
            {CATEGORIES.map((cat) => (
              <li key={cat.id}>
                <a href={`/${country}/deals/${cat.slug}`} className="footer-link">{cat.name}</a>
              </li>
            ))}
          </FooterAccordion>

          <FooterAccordion title="Discover" id="discovery" open={openAccordions.discovery} onToggle={toggleAccordion}>
            <li><a href={`/${country}/deals/all`} className="footer-link">Today&apos;s Best Deals</a></li>
            <li><a href={`/${country}/price-drops/all`} className="footer-link">Biggest Price Drops</a></li>
            <li><a href={`/${country}/account?tab=alerts`} className="footer-link">Track Prices</a></li>
            <li><a href={`/${country}/account?tab=saved`} className="footer-link">Saved Products</a></li>
            <li><a href={`/${country}/blog`} className="footer-link flex items-center gap-1.5"><BookOpen className="w-3 h-3" /> Blog & Guides</a></li>
          </FooterAccordion>

          <FooterAccordion title="Company" id="transparency" open={openAccordions.transparency} onToggle={toggleAccordion}>
            <li><a href="/about" className="footer-link">About</a></li>
            <li><a href="/contact" className="footer-link">Contact</a></li>
            <li><a href="/how-pricing-works" className="footer-link">How Pricing Works</a></li>
            <li><a href="/affiliate-disclosure" className="footer-link">Affiliate Disclosure</a></li>
            <li><a href="/privacy" className="footer-link">Privacy Policy</a></li>
            <li><a href="/terms" className="footer-link">Terms</a></li>
          </FooterAccordion>
        </div>

        <div className="pt-5 sm:pt-8 border-t border-[#162633] text-[10px] sm:text-[11px] text-[#94A3B8] space-y-2 leading-relaxed">
          <p>
            <strong className="text-[#F8FAFC]">Notice:</strong> CatchThePrice is an independent price-comparison and price-tracking platform. Prices and availability can change. CatchThePrice does not sell products or collect retailer payments. Purchases are completed on third-party retailer websites under their terms.
          </p>
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-2 text-[#94A3B8]">
            <p>© {new Date().getFullYear()} CatchThePrice. All rights reserved.</p>
            <p className="font-mono text-[9px] sm:text-[10px] text-[#CBD5E1]">TRACK IT. CATCH THE DROP. PAY LESS.</p>
          </div>
        </div>
      </div>
    </footer>
  );
}

function FooterAccordion({
  title,
  id,
  open,
  onToggle,
  children,
}: {
  title: string;
  id: string;
  open: boolean;
  onToggle: (id: string) => void;
  children: React.ReactNode;
}) {
  return (
    <div className="border-t border-[#162633] pt-4 md:border-t-0 md:pt-0">
      <button
        type="button"
        onClick={() => onToggle(id)}
        className="w-full min-h-[40px] flex items-center justify-between font-bold text-[#F8FAFC] text-xs tracking-wider uppercase md:pointer-events-none"
      >
        <span>{title}</span>
        <ChevronDown className={`w-4 h-4 text-[#94A3B8] transition-transform duration-200 md:hidden ${open ? 'rotate-180 text-[#00D27A]' : ''}`} />
      </button>
      <ul className={`space-y-1.5 text-[#CBD5E1] overflow-hidden ${open ? 'block mt-2' : 'hidden md:block md:mt-3'}`}>
        {children}
      </ul>
    </div>
  );
}
