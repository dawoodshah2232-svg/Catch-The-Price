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
      <div className="p-6 rounded-2xl bg-[#091217] border border-[#162633] text-center text-[#CBD5E1]">
        No active merchant offers found for this region.
      </div>
    );
  }

  const sortedOffers = [...offers].sort((a, b) => a.price - b.price);

  return (
    <div className="rounded-3xl bg-[#091217] border border-[#162633] p-4 sm:p-6 space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-[#162633]">
        <div>
          <h3 className="font-bold text-base sm:text-lg text-[#F8FAFC] flex items-center gap-2">
            <span>Compare Store Offers ({offers.length})</span>
            <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-[#00D27A]/15 text-[#00D27A] border border-[#00D27A]/30">
              Verified Retailers
            </span>
          </h3>
          <p className="text-xs text-[#CBD5E1] mt-0.5">
            Always buying directly from authorized stores with manufacturer warranty
          </p>
        </div>

        <div className="text-[11px] text-[#94A3B8] flex items-center gap-1.5 self-start sm:self-auto">
          <Clock className="w-3.5 h-3.5 text-[#00D27A]" />
          <span>Updated 8 min ago</span>
        </div>
      </div>

      {/* Offers Rows */}
      <div className="divide-y divide-[#162633]">
        {sortedOffers.map((offer, index) => {
          const isBest = index === 0;
          const outboundHref = `/api/outbound?offerId=${encodeURIComponent(
            offer.id
          )}&country=${country}&targetUrl=${encodeURIComponent(offer.url)}&productTitle=${encodeURIComponent(
            productTitle
          )}&merchantName=${encodeURIComponent(offer.merchantName)}&price=${offer.price}`;

          const primaryStoreWord = offer.merchantName.split(' ')[0];

          return (
            <div
              key={offer.id}
              className={`py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-colors ${
                isBest ? 'bg-[#00D27A]/[0.03] -mx-4 px-4 sm:-mx-6 sm:px-6 rounded-2xl' : ''
              }`}
            >
              {/* Merchant Details */}
              <div className="flex items-start sm:items-center gap-3.5 min-w-[210px]">
                <div className="w-12 h-12 rounded-2xl bg-[#071015] border border-[#162633] p-2 flex items-center justify-center shrink-0">
                  <img
                    src={offer.merchantLogo}
                    alt={offer.merchantName}
                    className="max-h-full max-w-full object-contain rounded-md"
                  />
                </div>

                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="font-bold text-sm text-[#F8FAFC]">{offer.merchantName}</h4>
                    {isBest && (
                      <span className="px-1.5 py-0.5 rounded text-[10px] font-extrabold bg-[#00D27A] text-[#071015]">
                        Best Price
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2 text-xs text-[#CBD5E1] mt-0.5">
                    <span className="text-amber-400 font-semibold">★ {offer.merchantRating}</span>
                    <span>•</span>
                    <span className="text-[#94A3B8]">Updated 8 min ago</span>
                  </div>
                </div>
              </div>

              {/* Shipping and Stock */}
              <div className="flex sm:flex-col items-center sm:items-start justify-between sm:justify-center text-xs text-[#CBD5E1] gap-1">
                <div className="flex items-center gap-1.5 text-[#F8FAFC]">
                  <Truck className="w-3.5 h-3.5 text-[#00D27A]" />
                  <span>{offer.shippingInfo}</span>
                </div>
                <div className="flex items-center gap-1.5 text-[#00D27A] font-semibold text-[11px]">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>{offer.inStock ? 'In Stock' : 'Out of Stock'}</span>
                </div>
              </div>

              {/* Price & Outbound CTA */}
              <div className="flex items-center justify-between sm:justify-end gap-4 pt-2 sm:pt-0 border-t sm:border-t-0 border-[#162633]/60">
                <div className="text-left sm:text-right">
                  <div className="text-lg sm:text-xl font-extrabold text-[#00D27A] leading-none">
                    {formatLocalPrice(offer.price)}
                  </div>
                  {offer.originalPrice && offer.originalPrice > offer.price && (
                    <div className="text-[11px] text-[#94A3B8] line-through mt-0.5 font-medium">
                      {formatLocalPrice(offer.originalPrice)}
                    </div>
                  )}
                </div>

                {/* Explicit Outbound Buy Button - High-Conversion CTA */}
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
                  <span>Buy on {primaryStoreWord}</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          );
        })}
      </div>

      {/* Honest Retailer Notice */}
      <div className="mt-4 pt-4 border-t border-[#162633] flex items-start gap-3 text-[#CBD5E1] text-xs bg-[#071015] p-4 rounded-2xl">
        <ShieldCheck className="w-5 h-5 text-[#00D27A] shrink-0 mt-0.5" />
        <p className="leading-relaxed">
          <strong className="text-[#F8FAFC]">CatchThePrice does not sell products or collect payments.</strong> When clicking &quot;Buy on [Store]&quot;, you are redirected to complete your purchase safely on the retailer&apos;s official website.
        </p>
      </div>
    </div>
  );
}
