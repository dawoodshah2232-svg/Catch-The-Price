'use client';

import React, { useState } from 'react';
import { Product } from '@/lib/types';
import { useCountry } from '@/context/CountryContext';
import { Bell, X, Check, ArrowRight, ShieldCheck, Sparkles } from 'lucide-react';

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

      // Optional API post
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-150">
      <div
        className="relative w-full max-w-md rounded-2xl bg-ctp-surface-elevated border border-ctp-border-bright p-5 sm:p-6 shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200"
        role="dialog"
        aria-modal="true"
      >
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-xl bg-slate-900 text-slate-400 hover:text-white border border-ctp touch-target flex items-center justify-center"
          aria-label="Close modal"
        >
          <X className="w-4 h-4" />
        </button>

        {isSuccess ? (
          <div className="py-8 text-center space-y-3">
            <div className="w-14 h-14 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 mx-auto flex items-center justify-center">
              <Check className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-slate-100">Price Tracker Activated!</h3>
            <p className="text-xs text-slate-300 max-w-xs mx-auto">
              We&apos;re monitoring all {product.offersCount} stores 24/7. You&apos;ll be notified the moment the price drops!
            </p>
          </div>
        ) : (
          <div>
            {/* Modal Header */}
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center justify-center shrink-0">
                <Bell className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-base sm:text-lg text-slate-100 leading-tight">
                  Track This Price
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Catch the drop before inventory sells out
                </p>
              </div>
            </div>

            {/* Product Snapshot */}
            <div className="flex items-center gap-3 p-3 rounded-xl bg-ctp-surface border border-ctp mb-5">
              <img
                src={product.imageUrl}
                alt={product.title}
                className="w-12 h-12 rounded-lg object-contain bg-slate-950 p-1 border border-ctp shrink-0"
              />
              <div className="min-w-0 flex-1">
                <p className="text-xs font-semibold text-slate-100 truncate">{product.title}</p>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-sm font-extrabold text-emerald-400">
                    {formatLocalPrice(product.currentBestPrice)}
                  </span>
                  <span className="text-[11px] text-slate-400">Current Best</span>
                </div>
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-2">
                  When should we alert you?
                </label>

                <div className="space-y-2">
                  {/* Option 1: Any price drop */}
                  <label
                    className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition-all ${
                      alertType === 'any_drop'
                        ? 'bg-emerald-500/10 border-emerald-500 text-slate-100'
                        : 'bg-ctp-surface border-ctp text-slate-300 hover:border-ctp-border-bright'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <input
                        type="radio"
                        name="alertType"
                        checked={alertType === 'any_drop'}
                        onChange={() => setAlertType('any_drop')}
                        className="accent-emerald-500 w-4 h-4"
                      />
                      <span className="text-xs font-medium">Any price drop</span>
                    </div>
                    <span className="text-[11px] text-slate-400">Immediate</span>
                  </label>

                  {/* Option 2: Target Amount */}
                  <label
                    className={`flex flex-col p-3 rounded-xl border cursor-pointer transition-all ${
                      alertType === 'below_amount'
                        ? 'bg-emerald-500/10 border-emerald-500 text-slate-100'
                        : 'bg-ctp-surface border-ctp text-slate-300 hover:border-ctp-border-bright'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <input
                          type="radio"
                          name="alertType"
                          checked={alertType === 'below_amount'}
                          onChange={() => setAlertType('below_amount')}
                          className="accent-emerald-500 w-4 h-4"
                        />
                        <span className="text-xs font-medium">Notify below a specific amount</span>
                      </div>
                    </div>

                    {alertType === 'below_amount' && (
                      <div className="mt-3 flex items-center gap-2 pl-6">
                        <span className="text-xs font-semibold text-slate-400">
                          {countryInfo.currency}
                        </span>
                        <input
                          type="number"
                          value={targetPrice}
                          onChange={(e) => setTargetPrice(e.target.value)}
                          className="w-full bg-slate-900 border border-ctp-border-bright rounded-lg px-3 py-1.5 text-sm text-slate-100 focus:outline-none focus:border-emerald-500"
                          placeholder="Enter your target price"
                          required
                        />
                      </div>
                    )}
                  </label>

                  {/* Option 3: Major deal only */}
                  <label
                    className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition-all ${
                      alertType === 'major_deal'
                        ? 'bg-emerald-500/10 border-emerald-500 text-slate-100'
                        : 'bg-ctp-surface border-ctp text-slate-300 hover:border-ctp-border-bright'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <input
                        type="radio"
                        name="alertType"
                        checked={alertType === 'major_deal'}
                        onChange={() => setAlertType('major_deal')}
                        className="accent-emerald-500 w-4 h-4"
                      />
                      <span className="text-xs font-medium">Major deal only (&gt;15% drop)</span>
                    </div>
                    <span className="text-[11px] text-emerald-400 font-semibold">Deal Score 90+</span>
                  </label>
                </div>
              </div>

              {/* Email field */}
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">
                  Notification Email (optional)
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full bg-ctp-surface border border-ctp rounded-xl px-3.5 py-2.5 text-xs text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-emerald-500"
                />
                <p className="text-[10px] text-slate-400 mt-1 flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3 text-emerald-400" />
                  We never send spam or sell your email address.
                </p>
              </div>

              {/* Submit CTA */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 text-slate-950 font-bold text-sm transition-all shadow-lg flex items-center justify-center gap-2 touch-target"
                >
                  <span>{isSubmitting ? 'Activating Tracker...' : 'Set Price Alert'}</span>
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
