'use client';

import React from 'react';
import { Offer } from '@/lib/types';
import { useCountry } from '@/context/CountryContext';
import { ExternalLink, ShieldCheck, CheckCircle2, Truck, Clock } from 'lucide-react';

interface MerchantOffersListProps {
  offers: Offer[];
  productTitle: string;
}

export function MerchantOffersList({ offers, productTitle }: MerchantOffersListProps) {
  const { formatLocalPrice, country } = useCountry();

  if (!offers || offers.length === 0) {
    return (
      <div className="p-6 rounded-2xl bg-ctp-surface border border-ctp text-center text-slate-400">
        No active merchant offers found for this region.
      </div>
    );
  }

  // Sort offers by price ascending
  const sortedOffers = [...offers].sort((a, b) => a.price - b.price);

  return (
    <div className="rounded-2xl bg-ctp-surface border border-ctp p-4 sm:p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-ctp">
        <div>
          <h3 className="font-bold text-base sm:text-lg text-slate-100 flex items-center gap-2">
            <span>Compare Store Prices ({offers.length})</span>
            <span className="text-[11px] font-normal px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              Live Verified
            </span>
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Compare prices, delivery estimates, and merchant ratings across verified sellers
          </p>
        </div>

        <div className="text-[11px] text-slate-400 flex items-center gap-1.5 self-start sm:self-auto">
          <Clock className="w-3.5 h-3.5 text-emerald-400" />
          <span>Last checked {offers[0]?.lastCheckedAt || 'just now'}</span>
        </div>
      </div>

      {/* Offers Rows */}
      <div className="divide-y divide-ctp mt-2">
        {sortedOffers.map((offer, index) => {
          const isBest = index === 0;
          const outboundHref = `/api/outbound?offerId=${encodeURIComponent(
            offer.id
          )}&country=${country}&targetUrl=${encodeURIComponent(offer.url)}&productTitle=${encodeURIComponent(
            productTitle
          )}&merchantName=${encodeURIComponent(offer.merchantName)}&price=${offer.price}`;

          return (
            <div
              key={offer.id}
              className={`py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-colors ${
                isBest ? 'bg-emerald-500/[0.03] -mx-4 px-4 sm:-mx-6 sm:px-6 rounded-xl' : ''
              }`}
            >
              {/* Merchant Details */}
              <div className="flex items-start sm:items-center gap-3 min-w-[200px]">
                <div className="w-11 h-11 rounded-xl bg-slate-900 border border-ctp p-1.5 flex items-center justify-center shrink-0">
                  <img
                    src={offer.merchantLogo}
                    alt={offer.merchantName}
                    className="max-h-full max-w-full object-contain rounded-md"
                  />
                </div>

                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="font-bold text-sm text-slate-100">{offer.merchantName}</h4>
                    {isBest && (
                      <span className="px-1.5 py-0.2 rounded text-[10px] font-extrabold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                        Best Price
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2 text-xs text-slate-400 mt-0.5">
                    <span className="flex items-center gap-1 text-amber-400">
                      ★ {offer.merchantRating}
                    </span>
                    <span>•</span>
                    <span className="text-slate-300">{offer.condition}</span>
                  </div>
                </div>
              </div>

              {/* Shipping and Stock status */}
              <div className="flex sm:flex-col items-center sm:items-start justify-between sm:justify-center text-xs text-slate-400 gap-1">
                <div className="flex items-center gap-1.5 text-slate-300">
                  <Truck className="w-3.5 h-3.5 text-emerald-400" />
                  <span>{offer.shippingInfo}</span>
                </div>
                <div className="flex items-center gap-1.5 text-emerald-400 font-medium">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>{offer.inStock ? 'In Stock' : 'Out of Stock'}</span>
                </div>
              </div>

              {/* Price & Outbound CTA */}
              <div className="flex items-center justify-between sm:justify-end gap-4 pt-2 sm:pt-0 border-t sm:border-t-0 border-ctp/40">
                <div className="text-left sm:text-right">
                  <div className="text-lg sm:text-xl font-extrabold text-emerald-400 leading-none">
                    {formatLocalPrice(offer.price)}
                  </div>
                  {offer.originalPrice && offer.originalPrice > offer.price && (
                    <div className="text-[11px] text-slate-400 line-through mt-0.5">
                      {formatLocalPrice(offer.originalPrice)}
                    </div>
                  )}
                </div>

                <a
                  href={outboundHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-bold transition-all touch-target shadow-sm shrink-0 ${
                    isBest
                      ? 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-emerald-500/20'
                      : 'bg-ctp-surface-elevated hover:bg-slate-800 text-slate-100 border border-ctp-border-bright hover:border-emerald-500/50'
                  }`}
                >
                  <span>Buy on {offer.merchantName.split(' ')[0]}</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          );
        })}
      </div>

      {/* Honest Retailer Disclaimer Notice */}
      <div className="mt-4 pt-4 border-t border-ctp flex items-start gap-2.5 text-slate-400 text-xs bg-slate-900/40 p-3.5 rounded-xl">
        <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
        <p className="leading-relaxed">
          <strong className="text-slate-300">You&apos;ll complete your purchase on the retailer&apos;s official website.</strong> CatchThePrice connects you to verified authorized retailers. Prices and stock availability update in real-time.
        </p>
      </div>
    </div>
  );
}
