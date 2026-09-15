'use client';

import React from 'react';
import { Offer } from '@/lib/types';
import { useCountry } from '@/context/CountryContext';
import { ExternalLink, ShieldCheck, CheckCircle2, Truck, Clock } from 'lucide-react';

interface MerchantOffersListProps {
  offers: Offer[];
  productTitle: string;
}

function formatCheckedAt(value?: string): string {
  if (!value) return 'Update time unavailable';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return `Checked ${new Intl.DateTimeFormat('en', {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  }).format(date)}`;
}

export function MerchantOffersList({ offers }: MerchantOffersListProps) {
  const { formatLocalPrice, country } = useCountry();

  if (!offers || offers.length === 0) {
    return (
      <div className="p-6 rounded-2xl bg-white border border-[#DDE7E3] text-center text-[#65777F]">
        No active retailer offers are available for this market yet.
      </div>
    );
  }

  const sortedOffers = [...offers].sort((a, b) => a.price - b.price);

  return (
    <section className="rounded-[24px] bg-white border border-[#DDE7E3] p-4 sm:p-6 space-y-4 shadow-[0_10px_30px_rgba(25,55,45,0.05)]">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 pb-4 border-b border-[#EDF2F0]">
        <div>
          <h3 className="font-extrabold text-base sm:text-lg text-[#102027]">
            Compare retailer offers
          </h3>
          <p className="text-[11px] sm:text-xs text-[#73858D] mt-1">
            {offers.length} active {offers.length === 1 ? 'listing' : 'listings'} for this exact market and product.
          </p>
        </div>
        <div className="text-[10px] sm:text-[11px] text-[#73858D] flex items-center gap-1.5 self-start sm:self-auto">
          <Clock className="w-3.5 h-3.5 text-[#08784B]" />
          <span>Times are shown per source record</span>
        </div>
      </div>

      <div className="divide-y divide-[#EDF2F0]">
        {sortedOffers.map((offer, index) => {
          const isBest = index === 0;
          const outboundHref = `/api/outbound?offerId=${encodeURIComponent(offer.id)}&country=${country}`;
          const primaryStoreWord = offer.merchantName.split(' ')[0];

          return (
            <div
              key={offer.id}
              className={`py-4 flex flex-col sm:grid sm:grid-cols-[minmax(170px,1.2fr)_minmax(150px,1fr)_auto] sm:items-center gap-3 sm:gap-5 ${
                isBest ? 'bg-[#F4FAF7] -mx-3 px-3 sm:-mx-4 sm:px-4 rounded-2xl' : ''
              }`}
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-[#F8FAF9] border border-[#E1E9E6] p-2 flex items-center justify-center shrink-0">
                  {offer.merchantLogo ? (
                    <img src={offer.merchantLogo} alt="" className="max-h-full max-w-full object-contain rounded-md" />
                  ) : (
                    <span className="text-sm font-extrabold text-[#08784B]">{offer.merchantName.charAt(0)}</span>
                  )}
                </div>

                <div className="min-w-0">
                  <div className="flex items-center gap-2 min-w-0">
                    <h4 className="font-extrabold text-sm text-[#102027] truncate">{offer.merchantName}</h4>
                    {isBest && (
                      <span className="shrink-0 px-1.5 py-0.5 rounded-md text-[9px] font-extrabold bg-[#E1F5EB] text-[#08784B] border border-[#C5E8D8]">
                        Lowest listed
                      </span>
                    )}
                  </div>
                  <div className="text-[10px] text-[#829198] mt-1">{formatCheckedAt(offer.lastCheckedAt)}</div>
                </div>
              </div>

              <div className="flex flex-wrap sm:flex-col items-center sm:items-start gap-x-3 gap-y-1 text-[10px] sm:text-[11px] text-[#65777F]">
                <div className="flex items-center gap-1.5 min-w-0">
                  <Truck className="w-3.5 h-3.5 text-[#08784B] shrink-0" />
                  <span className="truncate">{offer.shippingInfo || 'See retailer for delivery details'}</span>
                </div>
                <div className={`flex items-center gap-1.5 font-bold ${offer.inStock ? 'text-[#08784B]' : 'text-[#A65353]'}`}>
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>{offer.inStock ? 'Listed in stock' : 'Listed unavailable'}</span>
                </div>
              </div>

              <div className="flex items-center justify-between sm:justify-end gap-3 pt-2 sm:pt-0 border-t sm:border-t-0 border-[#EDF2F0]">
                <div className="text-left sm:text-right">
                  <div className="text-lg sm:text-xl font-extrabold text-[#08784B] leading-none">
                    {formatLocalPrice(offer.price)}
                  </div>
                  {offer.originalPrice > offer.price && (
                    <div className="text-[10px] text-[#829198] line-through mt-1 font-medium">
                      {formatLocalPrice(offer.originalPrice)}
                    </div>
                  )}
                </div>

                <a
                  href={outboundHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl text-xs transition-all duration-200 touch-target shrink-0 ${
                    isBest
                      ? 'bg-[#00D27A] hover:bg-[#00E6A2] text-[#071015] font-extrabold shadow-md'
                      : 'bg-[#00D27A]/10 hover:bg-[#00D27A] text-[#00D27A] hover:text-[#060D12] border border-[#00D27A]/30 hover:border-[#00D27A] font-bold'
                  }`}
                >
                  <span>Visit {primaryStoreWord}</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-4 pt-4 border-t border-[#EDF2F0] flex items-start gap-3 text-[#65777F] text-[11px] sm:text-xs bg-[#F8FAF9] p-4 rounded-2xl">
        <ShieldCheck className="w-5 h-5 text-[#08784B] shrink-0 mt-0.5" />
        <p className="leading-relaxed">
          <strong className="text-[#20343C]">CatchThePrice does not sell products or collect payment.</strong>{' '}
          Price, stock, delivery and warranty terms can change on the retailer site, so confirm the final details before purchasing.
        </p>
      </div>
    </section>
  );
}
