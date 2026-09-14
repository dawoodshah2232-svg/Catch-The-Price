'use client';

import React, { useState } from 'react';
import { Product } from '@/lib/types';
import { useCountry } from '@/context/CountryContext';
import { Bell, X, Check, ArrowRight, ShieldCheck } from 'lucide-react';

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

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const parsedTarget = alertType === 'below_amount' ? parseFloat(targetPrice) : undefined;

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

      // API call to record tracker
      fetch('/api/alerts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId: product.id,
          targetPrice: parsedTarget,
          alertType,
          email: email.trim() || undefined,
          country,
        }),
      }).catch(() => {});

      setIsSubmitting(false);
      setIsSuccess(true);
      setTimeout(() => {
        setIsSuccess(false);
        onClose();
      }, 2000);
    } catch {
      setIsSubmitting(false);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-[#071015]/85 backdrop-blur-sm animate-in fade-in duration-150">
      <div
        className="relative w-full max-w-md rounded-t-3xl sm:rounded-3xl bg-[#091217] border border-[#162633] p-5 sm:p-6 shadow-2xl overflow-hidden animate-in slide-in-from-bottom duration-200"
        role="dialog"
        aria-modal="true"
      >
        {/* Mobile drag handle */}
        <div className="sm:hidden -mt-2 pb-3 flex justify-center">
          <div className="w-12 h-1.5 rounded-full bg-[#162633]" />
        </div>

        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-xl bg-[#071015] text-[#8E9DAE] hover:text-white border border-[#162633] touch-target flex items-center justify-center"
          aria-label="Close"
        >
          <X className="w-4 h-4" />
        </button>

        {isSuccess ? (
          <div className="py-8 text-center space-y-3">
            <div className="w-14 h-14 rounded-2xl bg-[#00D27A]/15 text-[#00D27A] border border-[#00D27A]/40 mx-auto flex items-center justify-center">
              <Check className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-[#F8FAFC]">Price Tracker Activated!</h3>
            <p className="text-xs text-[#8E9DAE] max-w-xs mx-auto">
              We&apos;re monitoring all {product.offersCount} stores 24/7. You will be alerted the minute the price hits your target.
            </p>
          </div>
        ) : (
          <div>
            {/* Modal Header */}
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-2xl bg-[#00D27A]/10 text-[#00D27A] border border-[#00D27A]/25 flex items-center justify-center shrink-0">
                <Bell className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-base sm:text-lg text-[#F8FAFC] leading-tight">
                  Track Price
                </h3>
                <p className="text-xs text-[#8E9DAE] mt-0.5">
                  Catch the drop before items sell out
                </p>
              </div>
            </div>

            {/* Product Snapshot */}
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
                  <span className="text-[10px] text-[#5B6B7C]">Current Lowest</span>
                </div>
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#F8FAFC] mb-2">
                  Alert Trigger Options
                </label>

                <div className="space-y-2">
                  {/* Option 1: Notify me on any drop */}
                  <label
                    className={`flex items-center justify-between p-3.5 rounded-2xl border cursor-pointer transition-all ${
                      alertType === 'any_drop'
                        ? 'bg-[#00D27A]/10 border-[#00D27A] text-[#F8FAFC]'
                        : 'bg-[#071015] border-[#162633] text-[#8E9DAE] hover:border-[#203648]'
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
                    <span className="text-[10px] text-[#00D27A] font-bold">Fastest</span>
                  </label>

                  {/* Option 2: Notify below: AED ______ */}
                  <label
                    className={`flex flex-col p-3.5 rounded-2xl border cursor-pointer transition-all ${
                      alertType === 'below_amount'
                        ? 'bg-[#00D27A]/10 border-[#00D27A] text-[#F8FAFC]'
                        : 'bg-[#071015] border-[#162633] text-[#8E9DAE] hover:border-[#203648]'
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
                        <span className="text-xs font-bold text-[#8E9DAE]">
                          {countryInfo.currency}
                        </span>
                        <input
                          type="number"
                          value={targetPrice}
                          onChange={(e) => setTargetPrice(e.target.value)}
                          className="w-full bg-[#091217] border border-[#203648] rounded-xl px-3.5 py-2 text-sm text-[#F8FAFC] focus:outline-none focus:border-[#00D27A]"
                          placeholder="Enter your target price"
                          required
                        />
                      </div>
                    )}
                  </label>

                  {/* Option 3: Notify only for major deals */}
                  <label
                    className={`flex items-center justify-between p-3.5 rounded-2xl border cursor-pointer transition-all ${
                      alertType === 'major_deal'
                        ? 'bg-[#00D27A]/10 border-[#00D27A] text-[#F8FAFC]'
                        : 'bg-[#071015] border-[#162633] text-[#8E9DAE] hover:border-[#203648]'
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
                    <span className="text-[10px] text-[#00E6A2] font-bold">Deal Score 90+</span>
                  </label>
                </div>
              </div>

              {/* Email notification */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#F8FAFC] mb-1.5">
                  Email Notification
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your.email@example.com"
                  className="w-full bg-[#071015] border border-[#162633] rounded-2xl px-3.5 py-3 text-xs text-[#F8FAFC] placeholder:text-[#5B6B7C] focus:outline-none focus:border-[#00D27A]"
                />
                <p className="text-[10px] text-[#5B6B7C] mt-1.5 flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3 text-[#00D27A]" />
                  Push notification support ready. No spam ever.
                </p>
              </div>

              {/* Submit CTA */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3.5 rounded-2xl bg-[#00D27A] hover:bg-[#00E6A2] disabled:opacity-50 text-[#071015] font-extrabold text-sm transition-all shadow-xl shadow-[#00D27A]/20 flex items-center justify-center gap-2 touch-target"
                >
                  <span>{isSubmitting ? 'Activating Tracker...' : 'Track Price Now'}</span>
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
