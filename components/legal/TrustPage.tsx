import React from 'react';
import { BrandLogo } from '@/components/common/BrandLogo';

export type TrustSection = {
  title: string;
  body: React.ReactNode;
};

export function TrustPage({
  eyebrow,
  title,
  intro,
  sections,
  updated = '15 September 2026',
}: {
  eyebrow: string;
  title: string;
  intro: string;
  sections: TrustSection[];
  updated?: string;
}) {
  return (
    <main className="min-h-screen bg-[#F4F7F6] text-[#102027]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-14">
        <div className="mb-8">
          <BrandLogo size="md" variant="full" />
        </div>

        <div className="rounded-[28px] bg-white border border-[#DDE7E3] p-5 sm:p-8 shadow-[0_12px_34px_rgba(25,55,45,0.06)]">
          <div className="text-[10px] sm:text-xs font-extrabold uppercase tracking-[0.18em] text-[#08784B]">{eyebrow}</div>
          <h1 className="text-2xl sm:text-4xl font-extrabold mt-2 leading-tight">{title}</h1>
          <p className="mt-3 text-sm sm:text-base text-[#52636B] leading-relaxed max-w-3xl">{intro}</p>
          <div className="mt-4 text-[11px] text-[#829198]">Last updated: {updated}</div>
        </div>

        <div className="mt-5 space-y-4">
          {sections.map((section) => (
            <section key={section.title} className="rounded-2xl bg-white border border-[#DDE7E3] p-5 sm:p-6">
              <h2 className="text-base sm:text-lg font-extrabold text-[#102027]">{section.title}</h2>
              <div className="mt-2 text-sm text-[#52636B] leading-7 space-y-2">{section.body}</div>
            </section>
          ))}
        </div>

        <div className="mt-6 text-xs text-[#73858D] flex flex-wrap gap-x-4 gap-y-2">
          <a href="/about" className="hover:text-[#08784B]">About</a>
          <a href="/how-pricing-works" className="hover:text-[#08784B]">How pricing works</a>
          <a href="/data-sources" className="hover:text-[#08784B]">Data sources</a>
          <a href="/editorial-policy" className="hover:text-[#08784B]">Editorial policy</a>
          <a href="/affiliate-disclosure" className="hover:text-[#08784B]">Affiliate disclosure</a>
          <a href="/privacy" className="hover:text-[#08784B]">Privacy</a>
          <a href="/terms" className="hover:text-[#08784B]">Terms</a>
          <a href="/contact" className="hover:text-[#08784B]">Contact</a>
        </div>
      </div>
    </main>
  );
}
