'use client';

import React from 'react';
import { Offer } from '@/lib/types';
import { useCountry } from '@/context/CountryContext';
import { ExternalLink, ShieldCheck, Truck, Clock, Store } from 'lucide-react';

interface RetailerPriceComparisonProps {
  offers: Offer[];
  productTitle: string;
  onOpenAlertModal?: () => void;
}

export function RetailerPriceComparison({
  offers,
  productTitle,
}: RetailerPriceComparisonProps) {
  const { formatLocalPrice, country } = useCountry();

  const validOffers = (offers || [])
    .filter((offer) => offer.price > 0 && Number.isFinite(offer.price))
    .sort((a, b) => a.price - b.price);

  if (validOffers.length === 0) {
    return (
      <section className="rounded-[24px] bg-white border border-[#DDE7E3] p-4 sm:p-5 shadow-[0_8px_24px_rgba(25,55,45,0.04)] space-y-3.5">
        <div className="flex items-center justify-between gap-2 pb-3 border-b border-[#EDF2F0]">
          <div className="flex items-center gap-2">
            <Store className="w-4 h-4 text-[#08784B]" />
            <h3 className="font-extrabold text-base text-[#102027]">Shop this product</h3>
          </div>
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-[#E5F8EF] text-[#08784B] border border-[#C7EEDC]">
            UAE retailers
          </span>
        </div>

        <div className="rounded-xl border border-[#EDF2F0] bg-[#F8FAF9] p-3.5 sm:p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <div className="h-8 w-20 rounded-lg bg-white border border-[#DDE7E3] p-1 flex items-center justify-center shadow-2xs">
                <img src="/images/merchants/amazon.svg" alt="Amazon UAE" className="h-5 object-contain" />
              </div>
              <span className="text-xs font-bold text-[#829198]">+</span>
              <div className="h-8 w-20 rounded-lg bg-white border border-[#DDE7E3] p-1 flex items-center justify-center shadow-2xs">
                <img src="/images/merchants/noon.svg" alt="Noon UAE" className="h-5 object-contain" />
              </div>
            </div>
            <div className="min-w-0">
              <p className="text-xs text-[#20343C] font-semibold leading-snug">Retailer links appear when a verified product-specific affiliate destination is available.</p>
              <p className="text-[11px] text-[#73858D] mt-0.5">Prices are not shown unless supplied by an approved retailer data source.</p>
            </div>
          </div>
        </div>

        <div className="flex items-start gap-2 text-[11px] text-[#73858D]">
          <ShieldCheck className="w-3.5 h-3.5 text-[#08784B] shrink-0" />
          <span>CatchThePrice may earn a commission from qualifying purchases. Retailer prices and availability can change on the retailer website.</span>
        </div>
      </section>
    );
  }

  return (
    <section className="rounded-[24px] bg-white border border-[#DDE7E3] p-4 sm:p-6 shadow-[0_8px_24px_rgba(25,55,45,0.04)] space-y-3.5">
      <div className="flex items-center justify-between gap-2 pb-3 border-b border-[#EDF2F0]">
        <div className="flex items-center gap-2">
          <Store className="w-4 h-4 text-[#08784B]" />
          <h3 className="font-extrabold text-base text-[#102027]">Compare Store Prices ({validOffers.length})</h3>
          <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-[#E5F8EF] text-[#08784B] border border-[#C7EEDC]">Verified Retailers</span>
        </div>
        <div className="text-xs text-[#73858D] flex items-center gap-1.5">
          <Clock className="w-3.5 h-3.5 text-[#08784B]" />
          <span>Updated recently</span>
        </div>
      </div>

      <div className="divide-y divide-[#EDF2F0]">
        {validOffers.map((offer, index) => {
          const isBest = index === 0;
          const outboundHref = `/api/outbound?offerId=${encodeURIComponent(offer.id)}&country=${country}`;
          return (
            <div key={offer.id} className={`py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition-colors ${isBest ? 'bg-[#F4FBF7] -mx-4 px-4 sm:-mx-6 sm:px-6 rounded-xl' : ''}`}>
              <div className="flex items-center gap-3 min-w-[200px]">
                <div className="w-10 h-10 rounded-xl bg-white border border-[#DDE7E3] p-1.5 flex items-center justify-center shrink-0 shadow-2xs">
                  {offer.merchantLogo ? <img src={offer.merchantLogo} alt={offer.merchantName} className="max-h-full max-w-full object-contain" /> : <Store className="w-4 h-4 text-[#08784B]" />}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="font-extrabold text-sm text-[#102027]">{offer.merchantName}</h4>
                    {isBest && <span className="px-1.5 py-0.5 rounded text-[9px] font-extrabold bg-[#0B8F58] text-white">Lowest</span>}
                  </div>
                  <div className="text-[11px] text-[#73858D]">Retailer offer</div>
                </div>
              </div>

              <div className="flex items-center gap-4 text-xs text-[#60727A]">
                <div className="flex items-center gap-1.5 font-medium"><Truck className="w-3.5 h-3.5 text-[#08784B]" /><span>{offer.shippingInfo || 'See retailer for delivery'}</span></div>
                <div className="text-[11px] font-bold text-[#08784B] flex items-center gap-1"><span>●</span> {offer.inStock ? 'In Stock' : 'Check availability'}</div>
              </div>

              <div className="flex items-center justify-between sm:justify-end gap-3.5">
                <div className="text-left sm:text-right">
                  <div className="text-base sm:text-lg font-extrabold text-[#08784B]">{formatLocalPrice(offer.price)}</div>
                  {offer.originalPrice > offer.price && <div className="text-xs text-[#829198] line-through font-medium">{formatLocalPrice(offer.originalPrice)}</div>}
                </div>
                <a href={outboundHref} target="_blank" rel="sponsored noopener" className="min-h-[38px] px-4 rounded-xl bg-[#0B8F58] hover:bg-[#08784B] text-white text-xs font-extrabold flex items-center gap-1.5 transition-colors shadow-2xs">
                  <span>View Deal</span><ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          );
        })}
      </div>

      <div className="pt-1 flex items-start gap-2 text-[11px] text-[#73858D]">
        <ShieldCheck className="w-3.5 h-3.5 text-[#08784B] shrink-0" />
        <span>Prices shown here must come from approved data sources. CatchThePrice may earn a commission from qualifying purchases.</span>
      </div>
    </section>
  );
}
