'use client';

import React, { useState } from 'react';
import { useCountry } from '@/context/CountryContext';
import { BrandLogo } from '@/components/common/BrandLogo';
import { CATEGORIES } from '@/lib/data/categories';
import { COUNTRIES } from '@/lib/data/countries';
import { CountryCode } from '@/lib/types';
import { ShieldCheck, TrendingDown, BellRing, ChevronDown, BookOpen } from 'lucide-react';

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
    <footer className="w-full bg-[#071015] border-t border-[#17303A] pt-8 sm:pt-12 pb-24 lg:pb-12 text-[#C8D4D8] text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 pb-7 sm:pb-9 border-b border-[#17303A]">
          <FooterFeature icon={<TrendingDown className="w-5 h-5" />} title="Track price changes" text="Follow real retailer offers and recorded price movement." />
          <FooterFeature icon={<BellRing className="w-5 h-5" />} title="Set price alerts" text="Save products and get notified when your target is reached." />
          <div className="col-span-2 lg:col-span-1">
            <FooterFeature icon={<ShieldCheck className="w-5 h-5" />} title="Retailer checkout" text="CatchThePrice compares. The retailer completes the sale." />
          </div>
        </div>

        <div className="flex flex-col md:grid md:grid-cols-5 gap-7 sm:gap-9 py-8 sm:py-10">
          <div className="md:col-span-2 space-y-4">
            <div className="max-w-[300px]">
              <BrandLogo size="lg" variant="full" />
            </div>

            <p className="text-[#AEBBC1] max-w-sm text-xs sm:text-[13px] leading-relaxed">
              <strong className="text-white">Smarter Shopping for a Brighter Tomorrow.</strong>
              <br />
              Compare prices, understand product value and choose the right time to buy.
            </p>

            <div className="pt-1">
              <div className="text-[10px] uppercase tracking-[0.16em] text-[#6F828B] font-extrabold mb-2">Live markets</div>
              <div className="flex flex-wrap gap-2">
                {LIVE_MARKETS.map((code) => {
                  const c = COUNTRIES[code];
                  const selected = code === country;
                  return (
                    <button
                      key={code}
                      onClick={() => setCountry(code)}
                      className={`inline-flex items-center gap-2 px-3 py-2 rounded-xl text-[11px] transition-colors min-h-[40px] border ${
                        selected
                          ? 'bg-[#0E2A22] text-[#63E6AE] font-bold border-[#1D6E50]'
                          : 'bg-[#0A151A] text-[#C8D4D8] hover:text-white border-[#1A3039] hover:border-[#28434D]'
                      }`}
                    >
                      <span className="text-base leading-none">{c.flag}</span>
                      <span>{c.name}</span>
                      <span className="text-[#7F9199]">· {c.currency}</span>
                    </button>
                  );
                })}
              </div>
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
            <li><a href={`/${country}/compare`} className="footer-link">Compare Products</a></li>
            <li><a href={`/${country}/account?tab=saved`} className="footer-link">Saved Products</a></li>
            <li><a href={`/${country}/blog`} className="footer-link flex items-center gap-1.5"><BookOpen className="w-3 h-3" /> Blog &amp; Guides</a></li>
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

        <div className="pt-5 sm:pt-7 border-t border-[#17303A] text-[10px] sm:text-[11px] text-[#81949D] space-y-3 leading-relaxed">
          <p className="max-w-5xl">
            <strong className="text-[#DDE6E9]">Notice:</strong> CatchThePrice is an independent price-comparison and price-tracking platform. Prices and availability can change. CatchThePrice does not sell products or collect retailer payments. Purchases are completed on third-party retailer websites under their terms.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-between gap-2">
            <p>© {new Date().getFullYear()} CatchThePrice. All rights reserved.</p>
            <p className="font-mono text-[9px] sm:text-[10px] text-[#AAB8BE]">TRACK IT. CATCH THE DROP. PAY LESS.</p>
          </div>
        </div>
      </div>
    </footer>
  );
}

function FooterFeature({ icon, title, text }: { icon: React.ReactNode; title: string; text: string }) {
  return (
    <div className="flex items-start gap-3">
      <div className="w-10 h-10 rounded-xl bg-[#0E2A22] text-[#63E6AE] border border-[#1D4D3C] shrink-0 flex items-center justify-center">
        {icon}
      </div>
      <div className="min-w-0">
        <h4 className="font-extrabold text-white text-[11px] sm:text-sm">{title}</h4>
        <p className="mt-1 text-[#81949D] text-[10px] sm:text-xs leading-relaxed">{text}</p>
      </div>
    </div>
  );
}

function FooterAccordion({ title, id, open, onToggle, children }: {
  title: string;
  id: string;
  open: boolean;
  onToggle: (id: string) => void;
  children: React.ReactNode;
}) {
  return (
    <div className="border-t border-[#17303A] pt-4 md:border-t-0 md:pt-0">
      <button
        type="button"
        onClick={() => onToggle(id)}
        className="w-full min-h-[40px] flex items-center justify-between font-extrabold text-white text-xs tracking-wider uppercase md:pointer-events-none"
      >
        <span>{title}</span>
        <ChevronDown className={`w-4 h-4 text-[#81949D] transition-transform duration-200 md:hidden ${open ? 'rotate-180 text-[#63E6AE]' : ''}`} />
      </button>
      <ul className={`space-y-2 text-[#AEBBC1] overflow-hidden ${open ? 'block mt-2' : 'hidden md:block md:mt-3'}`}>
        {children}
      </ul>
    </div>
  );
}
