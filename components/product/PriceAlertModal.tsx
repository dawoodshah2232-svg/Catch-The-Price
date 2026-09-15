'use client';

import React, { useState } from 'react';
import { Product } from '@/lib/types';
import { useCountry } from '@/context/CountryContext';
import { Bell, X, Check, ArrowRight, ShieldCheck, AlertCircle, Sparkles } from 'lucide-react';

interface PriceAlertModalProps {
  product: Product;
  isOpen: boolean;
  onClose: () => void;
}

export function PriceAlertModal({ product, isOpen, onClose }: PriceAlertModalProps) {
  const { country, countryInfo, formatLocalPrice, addAlert } = useCountry();
  const [alertType, setAlertType] = useState<'any_drop' | 'below_amount'>('any_drop');
  const [targetPrice, setTargetPrice] = useState<string>(Math.round(product.currentBestPrice * 0.9).toString());
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      const parsedTarget = alertType === 'below_amount' ? parseFloat(targetPrice) : undefined;
      const response = await fetch('/api/alerts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId: product.id,
          targetPrice: parsedTarget,
          alertType,
          country,
        }),
      });

      const result = await response.json().catch(() => null);
      if (!response.ok || !result?.success) {
        throw new Error(result?.error || 'We could not save this price alert. Please try again.');
      }

      addAlert({
        productId: product.id,
        productTitle: product.title,
        productImage: product.imageUrl,
        currentPrice: product.currentBestPrice,
        targetPrice: parsedTarget,
        alertType,
        currency: product.currency,
        country,
        isActive: true,
      });

      setIsSuccess(true);
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'We could not save this price alert. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setIsSuccess(false);
    setErrorMessage(null);
    onClose();
  };

  const optionClass = (active: boolean) =>
    `flex items-center justify-between p-3.5 rounded-2xl border cursor-pointer transition-all ${
      active
        ? 'bg-[#EAF8F1] border-[#0B8F58] text-[#173028] shadow-[0_8px_20px_rgba(11,143,88,0.08)]'
        : 'bg-white border-[#DDE7E3] text-[#52636B] hover:border-[#BFD2CA] hover:bg-[#FBFDFC]'
    }`;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-[#102027]/35 backdrop-blur-sm animate-in fade-in duration-150">
      <div
        className="relative w-full max-w-md rounded-t-[28px] sm:rounded-[28px] bg-white border border-[#DDE7E3] p-5 sm:p-6 shadow-[0_24px_80px_rgba(24,52,43,0.18)] overflow-hidden animate-in slide-in-from-bottom duration-200"
        role="dialog"
        aria-modal="true"
        aria-labelledby="price-alert-title"
      >
        <div className="sm:hidden -mt-2 pb-3 flex justify-center">
          <div className="w-12 h-1.5 rounded-full bg-[#D9E4E0]" />
        </div>

        <button
          type="button"
          onClick={handleClose}
          className="absolute top-4 right-4 p-2 rounded-xl bg-[#F4F7F6] text-[#65777F] hover:text-[#102027] border border-[#DDE7E3] touch-target flex items-center justify-center"
          aria-label="Close"
        >
          <X className="w-4 h-4" />
        </button>

        {isSuccess ? (
          <div className="py-8 text-center space-y-3">
            <div className="w-14 h-14 rounded-2xl bg-[#EAF8F1] text-[#0B8F58] border border-[#CFE9DD] mx-auto flex items-center justify-center">
              <Check className="w-8 h-8" />
            </div>
            <h3 id="price-alert-title" className="text-xl font-extrabold text-[#102027]">Price alert saved</h3>
            <p className="text-xs text-[#65777F] max-w-xs mx-auto leading-relaxed">
              This trigger is saved to your signed-in account. CatchThePrice will keep queued and delivered notification states separate until a verified delivery provider is connected.
            </p>
            <button
              type="button"
              onClick={handleClose}
              className="mt-3 px-5 py-2.5 rounded-xl bg-[#F3F8F6] border border-[#D5E2DD] text-sm font-extrabold text-[#20343C]"
            >
              Done
            </button>
          </div>
        ) : (
          <div>
            <div className="flex items-center gap-3 mb-4 pr-10">
              <div className="w-10 h-10 rounded-2xl bg-[#EAF8F1] text-[#0B8F58] border border-[#CFE9DD] flex items-center justify-center shrink-0">
                <Bell className="w-5 h-5" />
              </div>
              <div>
                <h3 id="price-alert-title" className="font-extrabold text-base sm:text-lg text-[#102027] leading-tight">Track price</h3>
                <p className="text-xs text-[#73858D] mt-0.5">Save a trigger for this exact product</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 rounded-2xl bg-[#F8FAF9] border border-[#DDE7E3] mb-5">
              <img
                src={product.imageUrl}
                alt={product.title}
                className="w-12 h-12 rounded-xl object-contain bg-white p-1 border border-[#DDE7E3] shrink-0"
              />
              <div className="min-w-0 flex-1">
                <p className="text-xs font-extrabold text-[#102027] truncate">{product.title}</p>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-sm font-extrabold text-[#0B8F58]">{formatLocalPrice(product.currentBestPrice)}</span>
                  <span className="text-[10px] text-[#829198] font-semibold">Current listed price</span>
                </div>
              </div>
            </div>

            {errorMessage && (
              <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-start gap-2" role="alert">
                <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                <span>{errorMessage}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-extrabold uppercase tracking-wider text-[#31474F] mb-2">Alert trigger</label>
                <div className="space-y-2">
                  <label className={optionClass(alertType === 'any_drop')}>
                    <div className="flex items-center gap-3">
                      <input type="radio" name="alertType" checked={alertType === 'any_drop'} onChange={() => setAlertType('any_drop')} className="accent-[#0B8F58] w-4 h-4" />
                      <span className="text-xs font-semibold">Notify me when a lower stored price is observed</span>
                    </div>
                  </label>

                  <label className={`flex flex-col ${optionClass(alertType === 'below_amount')}`}>
                    <div className="flex items-center gap-3">
                      <input type="radio" name="alertType" checked={alertType === 'below_amount'} onChange={() => setAlertType('below_amount')} className="accent-[#0B8F58] w-4 h-4" />
                      <span className="text-xs font-semibold">Notify below my target price</span>
                    </div>

                    {alertType === 'below_amount' && (
                      <div className="mt-3 flex items-center gap-2 pl-7 w-full">
                        <span className="text-xs font-bold text-[#52636B]">{countryInfo.currency}</span>
                        <input
                          type="number"
                          min="1"
                          step="0.01"
                          value={targetPrice}
                          onChange={(e) => setTargetPrice(e.target.value)}
                          className="w-full bg-white border border-[#CFE0DA] rounded-xl px-3.5 py-2 text-sm text-[#102027] focus:outline-none focus:border-[#0B8F58]"
                          placeholder="Enter your target price"
                          required
                        />
                      </div>
                    )}
                  </label>

                  <div className="p-3.5 rounded-2xl border border-[#E3EAE7] bg-[#F8FAF9] text-[#73858D] flex items-center gap-3">
                    <Sparkles className="w-4 h-4 text-[#A0AEA9] shrink-0" />
                    <div>
                      <div className="text-xs font-semibold text-[#52636B]">Major-deal alerts are coming later</div>
                      <div className="text-[10px] mt-0.5">We will only enable them after a transparent deterministic rule is approved.</div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl bg-[#F8FAF9] border border-[#DDE7E3] p-3 flex items-start gap-2 text-[10px] text-[#73858D] leading-relaxed">
                <ShieldCheck className="w-3.5 h-3.5 text-[#0B8F58] shrink-0 mt-0.5" />
                <span>Your signed-in account email is used as the notification destination. Email delivery itself stays disabled until verification and a delivery provider are configured.</span>
              </div>

              <div className="pt-1">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3.5 rounded-2xl bg-[#0B8F58] hover:bg-[#08784B] disabled:opacity-50 text-white text-sm font-extrabold flex items-center justify-center gap-2 touch-target transition-colors"
                >
                  <span>{isSubmitting ? 'Saving alert…' : 'Save price alert'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
