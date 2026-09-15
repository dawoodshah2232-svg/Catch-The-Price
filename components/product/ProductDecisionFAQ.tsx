import React from 'react';
import { HelpCircle, ShieldCheck } from 'lucide-react';
import { Product } from '@/lib/types';

export function ProductDecisionFAQ({ product }: { product: Product }) {
  const hasHistory = product.priceHistory.length > 1;
  const hasMultipleOffers = product.offersCount > 1;

  const items = [
    {
      q: `Where can I buy ${product.title}?`,
      a: hasMultipleOffers
        ? `CatchThePrice currently lists ${product.offersCount} retailer offers for this product in the selected market. Choose an offer above to continue to that retailer.`
        : 'Use the retailer offer shown above to continue to the retailer. CatchThePrice does not process the purchase itself.',
    },
    {
      q: 'Does CatchThePrice sell this product?',
      a: 'No. CatchThePrice compares available product and price information. Checkout, payment, delivery, returns and warranty are handled by the retailer you choose.',
    },
    {
      q: 'How should I read the price shown here?',
      a: 'The headline price is the lowest eligible listed offer currently available in this market from the data CatchThePrice has received. Retailer prices and stock can change after our last check.',
    },
    {
      q: 'Is the price history real?',
      a: hasHistory
        ? 'Yes. The chart is built from recorded observations for this product in the selected market. CatchThePrice does not generate missing historical points.'
        : 'There is not enough genuine price history for this exact product yet. CatchThePrice leaves the history unavailable instead of generating estimated points.',
    },
  ];

  return (
    <section className="rounded-3xl bg-white border border-[#DDE7E3] overflow-hidden shadow-[0_10px_30px_rgba(24,52,43,0.05)]">
      <div className="p-4 sm:p-6 border-b border-[#E5ECE9] flex items-start justify-between gap-3">
        <div>
          <h3 className="font-extrabold text-base sm:text-lg text-[#173028] flex items-center gap-2">
            <HelpCircle className="w-4 h-4 text-[#0B8F58]" /> Product questions
          </h3>
          <p className="text-xs text-[#6D7E78] mt-1">Clear answers about how to use the product and pricing information on this page.</p>
        </div>
        <a href="/how-pricing-works" className="hidden sm:inline-flex text-[11px] font-extrabold text-[#08784B] hover:underline">Methodology →</a>
      </div>

      <div className="divide-y divide-[#EDF2EF]">
        {items.map((item) => (
          <details key={item.q} className="group px-4 sm:px-6 py-4 bg-white open:bg-[#FBFDFC]">
            <summary className="cursor-pointer list-none flex items-center justify-between gap-3 text-sm font-extrabold text-[#243B33]">
              <span>{item.q}</span>
              <span className="text-[#0B8F58] text-lg leading-none transition-transform group-open:rotate-45">+</span>
            </summary>
            <p className="mt-2 pr-6 text-xs sm:text-sm leading-6 text-[#60727A]">{item.a}</p>
          </details>
        ))}
      </div>

      <div className="px-4 sm:px-6 py-3 bg-[#F7FAF8] border-t border-[#E5ECE9] flex items-start gap-2 text-[11px] text-[#73837D]">
        <ShieldCheck className="w-3.5 h-3.5 text-[#0B8F58] shrink-0 mt-0.5" />
        <span>See <a href="/data-sources" className="font-bold text-[#08784B] hover:underline">Data Sources</a> and <a href="/how-pricing-works" className="font-bold text-[#08784B] hover:underline">How Pricing Works</a> for CatchThePrice methodology and limitations.</span>
      </div>
    </section>
  );
}
