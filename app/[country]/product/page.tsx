import type { Metadata } from 'next';
import { Search, ArrowRight, GitCompareArrows, ShieldCheck } from 'lucide-react';

interface ProductLandingProps {
  params: Promise<{ country: string }>;
}

export const metadata: Metadata = {
  title: 'Product Price Comparison | CatchThePrice',
  description: 'Search for a product to compare retailer offers, specifications and available price history.',
  robots: { index: false, follow: true },
};

export default async function ProductLandingPage({ params }: ProductLandingProps) {
  const { country } = await params;

  return (
    <div className="min-h-[65vh] ui-page px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
      <div className="max-w-5xl mx-auto">
        <section className="rounded-[30px] ui-surface border ui-shadow p-6 sm:p-10 text-center overflow-hidden relative">
          <div className="absolute -top-20 right-[-40px] w-72 h-72 rounded-full bg-[#00D27A]/10 blur-[85px] pointer-events-none" />
          <div className="relative z-10 max-w-2xl mx-auto">
            <div className="w-12 h-12 rounded-2xl bg-[#EAF8F1] border border-[#CFE9DD] text-[#0B8F58] flex items-center justify-center mx-auto">
              <Search className="w-5 h-5" />
            </div>
            <p className="mt-5 text-[10px] sm:text-xs font-extrabold uppercase tracking-[0.18em] text-[#0B8F58]">Product intelligence</p>
            <h1 className="mt-2 text-2xl sm:text-4xl font-extrabold ui-text tracking-tight">Find a product, then make the decision here.</h1>
            <p className="mt-3 text-sm ui-secondary leading-relaxed">
              Every real product page can combine eligible retailer offers, structured specifications, available price history, comparison tools and alternatives. We only publish those details when the source data is verified.
            </p>

            <div className="mt-6 flex flex-col sm:flex-row justify-center gap-3">
              <a href={`/${country}/search`} className="min-h-[46px] px-5 rounded-xl bg-[#0B8F58] hover:bg-[#08784B] text-white font-extrabold text-sm inline-flex items-center justify-center gap-2">
                Search products <ArrowRight className="w-4 h-4" />
              </a>
              <a href={`/${country}/compare`} className="min-h-[46px] px-5 rounded-xl ui-soft border ui-text font-extrabold text-sm inline-flex items-center justify-center gap-2">
                <GitCompareArrows className="w-4 h-4 text-[#0B8F58]" /> Compare products
              </a>
            </div>
          </div>
        </section>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-5">
          {[
            ['Retailer offers', 'Compare eligible listings for the exact product and market.'],
            ['Price history', 'Historical charts only appear after genuine observations exist.'],
            ['Buying context', 'Specifications, alternatives and decision support stay source-backed.'],
          ].map(([title, text]) => (
            <div key={title} className="rounded-2xl ui-surface border p-4 sm:p-5">
              <ShieldCheck className="w-4 h-4 text-[#0B8F58]" />
              <h2 className="mt-3 text-sm font-extrabold ui-text">{title}</h2>
              <p className="mt-1 text-xs ui-secondary leading-relaxed">{text}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
