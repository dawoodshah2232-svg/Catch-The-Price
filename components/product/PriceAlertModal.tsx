'use client';

import React, { useState } from 'react';
import { Product } from '@/lib/types';
import { useCountry } from '@/context/CountryContext';
import { Bell, X, Check, ArrowRight, ShieldCheck, AlertCircle } from 'lucide-react';

interface PriceAlertModalProps {
  product: Product;
  isOpen: boolean;
  onClose: () => void;
}

export function PriceAlertModal({ product, isOpen, onClose }: PriceAlertModalProps) {
  const { country, countryInfo, formatLocalPrice, addAlert } = useCountry();
  const [alertType, setAlertType] = useState<'any_drop' | 'below_amount' | 'major_deal'>('any_drop');
  const [targetPrice, setTargetPrice] = useState<string>(
    Math.round(product.currentBestPrice * 0.9).toString()
  );
  const [email, setEmail] = useState('');
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
          email: email.trim() || undefined,
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
      setErrorMessage(
        error instanceof Error ? error.message : 'We could not save this price alert. Please try again.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setIsSuccess(false);
    setErrorMessage(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-[#071015]/85 backdrop-blur-sm animate-in fade-in duration-150">
      <div
        className="relative w-full max-w-md rounded-t-3xl sm:rounded-3xl bg-[#091217] border border-[#162633] p-5 sm:p-6 shadow-2xl overflow-hidden animate-in slide-in-from-bottom duration-200"
        role="dialog"
        aria-modal="true"
        aria-labelledby="price-alert-title"
      >
        <div className="sm:hidden -mt-2 pb-3 flex justify-center">
          <div className="w-12 h-1.5 rounded-full bg-[#162633]" />
        </div>

        <button
          type="button"
          onClick={handleClose}
          className="absolute top-4 right-4 p-2 rounded-xl bg-[#071015] text-[#CBD5E1] hover:text-white border border-[#162633] touch-target flex items-center justify-center"
          aria-label="Close"
        >
          <X className="w-4 h-4" />
        </button>

        {isSuccess ? (
          <div className="py-8 text-center space-y-3">
            <div className="w-14 h-14 rounded-2xl bg-[#00D27A]/15 text-[#00D27A] border border-[#00D27A]/40 mx-auto flex items-center justify-center">
              <Check className="w-8 h-8" />
            </div>
            <h3 id="price-alert-title" className="text-xl font-bold text-[#F8FAFC]">
              Price alert saved
            </h3>
            <p className="text-xs text-[#CBD5E1] max-w-xs mx-auto leading-relaxed">
              Your alert was saved successfully. We will only claim email delivery after the verification and notification service is active.
            </p>
            <button
              type="button"
              onClick={handleClose}
              className="mt-3 px-5 py-2.5 rounded-xl bg-[#0f1c24] border border-[#203648] text-sm font-bold text-[#F8FAFC]"
            >
              Done
            </button>
          </div>
        ) : (
          <div>
            <div className="flex items-center gap-3 mb-4 pr-10">
              <div className="w-10 h-10 rounded-2xl bg-[#00D27A]/10 text-[#00D27A] border border-[#00D27A]/25 flex items-center justify-center shrink-0">
                <Bell className="w-5 h-5" />
              </div>
              <div>
                <h3 id="price-alert-title" className="font-bold text-base sm:text-lg text-[#F8FAFC] leading-tight">
                  Track Price
                </h3>
                <p className="text-xs text-[#CBD5E1] mt-0.5">
                  Save a target and check back when prices change
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 rounded-2xl bg-[#071015] border border-[#162633] mb-5">
              <img
                src={product.imageUrl}
                alt={product.title}
                className="w-12 h-12 rounded-xl object-contain bg-[#091217] p-1 border border-[#162633] shrink-0"
              />
              <div className="min-w-0 flex-1">
                <p className="text-xs font-bold text-[#F8FAFC] truncate">{product.title}</p>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-sm font-extrabold text-[#00D27A]">
                    {formatLocalPrice(product.currentBestPrice)}
                  </span>
                  <span className="text-[10px] text-[#94A3B8] font-semibold">Displayed price</span>
                </div>
              </div>
            </div>

            {errorMessage && (
              <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-200 text-xs flex items-start gap-2" role="alert">
                <AlertCircle className="w-4 h-4 text-red-300 shrink-0 mt-0.5" />
                <span>{errorMessage}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#F8FAFC] mb-2">
                  Alert Trigger Options
                </label>

                <div className="space-y-2">
                  <label
                    className={`flex items-center justify-between p-3.5 rounded-2xl border cursor-pointer transition-all ${
                      alertType === 'any_drop'
                        ? 'bg-[#00D27A]/10 border-[#00D27A] text-[#F8FAFC]'
                        : 'bg-[#071015] border-[#162633] text-[#CBD5E1] hover:border-[#203648]'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <input
                        type="radio"
                        name="alertType"
                        checked={alertType === 'any_drop'}
                        onChange={() => setAlertType('any_drop')}
                        className="accent-[#00D27A] w-4 h-4"
                      />
                      <span className="text-xs font-semibold">Notify me on any drop</span>
                    </div>
                  </label>

                  <label
                    className={`flex flex-col p-3.5 rounded-2xl border cursor-pointer transition-all ${
                      alertType === 'below_amount'
                        ? 'bg-[#00D27A]/10 border-[#00D27A] text-[#F8FAFC]'
                        : 'bg-[#071015] border-[#162633] text-[#CBD5E1] hover:border-[#203648]'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <input
                          type="radio"
                          name="alertType"
                          checked={alertType === 'below_amount'}
                          onChange={() => setAlertType('below_amount')}
                          className="accent-[#00D27A] w-4 h-4"
                        />
                        <span className="text-xs font-semibold">Notify below target price</span>
                      </div>
                    </div>

                    {alertType === 'below_amount' && (
                      <div className="mt-3 flex items-center gap-2 pl-7">
                        <span className="text-xs font-bold text-[#CBD5E1]">{countryInfo.currency}</span>
                        <input
                          type="number"
                          min="1"
                          step="0.01"
                          value={targetPrice}
                          onChange={(e) => setTargetPrice(e.target.value)}
                          className="w-full bg-[#091217] border border-[#203648] rounded-xl px-3.5 py-2 text-sm text-[#F8FAFC] focus:outline-none focus:border-[#00D27A]"
                          placeholder="Enter your target price"
                          required
                        />
                      </div>
                    )}
                  </label>

                  <label
                    className={`flex items-center justify-between p-3.5 rounded-2xl border cursor-pointer transition-all ${
                      alertType === 'major_deal'
                        ? 'bg-[#00D27A]/10 border-[#00D27A] text-[#F8FAFC]'
                        : 'bg-[#071015] border-[#162633] text-[#CBD5E1] hover:border-[#203648]'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <input
                        type="radio"
                        name="alertType"
                        checked={alertType === 'major_deal'}
                        onChange={() => setAlertType('major_deal')}
                        className="accent-[#00D27A] w-4 h-4"
                      />
                      <span className="text-xs font-semibold">Notify only for major deals</span>
                    </div>
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#F8FAFC] mb-1.5">
                  Email for future notifications
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your.email@example.com"
                  className="w-full bg-[#071015] border border-[#162633] rounded-2xl px-3.5 py-3 text-xs text-[#F8FAFC] placeholder:text-[#94A3B8] focus:outline-none focus:border-[#00D27A]"
                />
                <p className="text-[10px] text-[#94A3B8] mt-1.5 flex items-start gap-1">
                  <ShieldCheck className="w-3 h-3 text-[#00D27A] shrink-0 mt-0.5" />
                  <span>Email delivery will be activated only after verification is configured.</span>
                </p>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3.5 rounded-2xl btn-conversion-primary disabled:opacity-50 text-sm font-extrabold flex items-center justify-center gap-2 touch-target"
                >
                  <span>{isSubmitting ? 'Saving Alert...' : 'Save Price Alert'}</span>
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
