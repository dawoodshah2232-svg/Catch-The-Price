'use client';

import React, { useMemo, useState } from 'react';
import { Product } from '@/lib/types';
import { useCountry } from '@/context/CountryContext';
import { ArrowRightLeft, ExternalLink, ShieldCheck } from 'lucide-react';

interface CompareWorkspaceProps {
  products: Product[];
  isPreview?: boolean;
  initialLeftId?: string;
  initialRightId?: string;
}

export function CompareWorkspace({
  products,
  isPreview = false,
  initialLeftId = '',
  initialRightId = '',
}: CompareWorkspaceProps) {
  const { country, formatLocalPrice } = useCountry();
  const [leftId, setLeftId] = useState(products.some((p) => p.id === initialLeftId) ? initialLeftId : '');
  const [rightId, setRightId] = useState(products.some((p) => p.id === initialRightId) ? initialRightId : '');

  const left = products.find((product) => product.id === leftId);
  const right = products.find((product) => product.id === rightId);

  const rightOptions = left
    ? products.filter((product) => product.categorySlug === left.categorySlug && product.id !== left.id)
    : products;

  const specKeys = useMemo(() => {
    if (!left || !right) return [];
    return [...new Set([...Object.keys(left.specs), ...Object.keys(right.specs)])];
  }, [left, right]);

  const resetSecondIfNeeded = (nextLeftId: string) => {
    setLeftId(nextLeftId);
    const nextLeft = products.find((product) => product.id === nextLeftId);
    const currentRight = products.find((product) => product.id === rightId);
    if (nextLeft && currentRight && currentRight.categorySlug !== nextLeft.categorySlug) {
      setRightId('');
    }
  };

  return (
    <div className="space-y-5 sm:space-y-6">
      {isPreview && (
        <div className="rounded-2xl border border-amber-300 bg-amber-50 px-4 py-3 text-xs text-amber-900">
          Development preview: comparison prices and sample catalog facts on this Vercel build are for interface testing only.
        </div>
      )}

      <section className="rounded-[26px] border border-[#DDE7E3] bg-white p-4 sm:p-6 shadow-[0_12px_34px_rgba(25,55,45,0.06)]">
        <div className="flex items-start gap-3 mb-5">
          <div className="w-10 h-10 rounded-2xl bg-[#E8F7F0] border border-[#CDEADB] text-[#08784B] flex items-center justify-center shrink-0">
            <ArrowRightLeft className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[10px] font-extrabold uppercase tracking-[0.16em] text-[#08784B]">Decision tool</div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-[#102027] mt-0.5">Compare products side by side</h1>
            <p className="text-xs sm:text-sm text-[#65777F] mt-1">Choose two products from the same category. Missing facts stay unknown rather than being guessed.</p>
          </div>
        </div>

        {products.length === 0 ? (
          <div className="rounded-2xl border border-[#DDE7E3] bg-[#F8FAF9] px-4 py-8 text-center">
            <p className="text-sm font-semibold text-[#102027]">No eligible products are available yet.</p>
            <p className="text-xs text-[#73858D] mt-1">The comparison tool activates as verified catalog data is published.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] gap-3 md:items-end">
            <label className="space-y-1.5">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#73858D]">Product 1</span>
              <select
                value={leftId}
                onChange={(event) => resetSecondIfNeeded(event.target.value)}
                className="w-full h-12 rounded-xl border border-[#CFE0DA] bg-white px-3 text-sm text-[#102027] outline-none focus:border-[#0B8F58] focus:ring-2 focus:ring-[#00D27A]/10"
              >
                <option value="">Select a product</option>
                {products.map((product) => (
                  <option key={product.id} value={product.id}>{product.title}</option>
                ))}
              </select>
            </label>

            <div className="hidden md:flex h-12 items-center justify-center text-[#829198] text-xs font-bold">VS</div>

            <label className="space-y-1.5">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#73858D]">Product 2</span>
              <select
                value={rightId}
                onChange={(event) => setRightId(event.target.value)}
                disabled={!left}
                className="w-full h-12 rounded-xl border border-[#CFE0DA] bg-white px-3 text-sm text-[#102027] outline-none focus:border-[#0B8F58] focus:ring-2 focus:ring-[#00D27A]/10 disabled:bg-[#F4F7F6] disabled:text-[#9AA9A3]"
              >
                <option value="">Select a comparison</option>
                {rightOptions.map((product) => (
                  <option key={product.id} value={product.id}>{product.title}</option>
                ))}
              </select>
            </label>
          </div>
        )}
      </section>

      {left && right && (
        <section className="overflow-hidden rounded-[26px] border border-[#DDE7E3] bg-white shadow-[0_12px_34px_rgba(25,55,45,0.05)]">
          <div className="grid grid-cols-[92px_1fr_1fr] sm:grid-cols-[160px_1fr_1fr] border-b border-[#EDF2F0] bg-[#FBFCFC]">
            <div className="p-3 sm:p-4 text-[10px] font-extrabold uppercase tracking-wider text-[#829198]">Compare</div>
            {[left, right].map((product) => (
              <div key={product.id} className="p-3 sm:p-4 border-l border-[#EDF2F0] min-w-0">
                <div className="w-full h-24 sm:h-32 rounded-xl bg-white border border-[#EDF2F0] p-2 flex items-center justify-center mb-3">
                  <img src={product.imageUrl} alt="" className="w-full h-full object-contain" />
                </div>
                <div className="text-[9px] font-extrabold uppercase tracking-wider text-[#08784B]">{product.brand}</div>
                <h2 className="mt-1 text-[11px] sm:text-sm font-extrabold text-[#102027] leading-snug line-clamp-3">{product.title}</h2>
                <div className="mt-2 text-sm sm:text-lg font-extrabold text-[#08784B]">{formatLocalPrice(product.currentBestPrice)}</div>
                <a href={`/${country}/product/${product.slug}`} className="mt-2 inline-flex items-center gap-1 text-[10px] sm:text-[11px] font-bold text-[#52636B] hover:text-[#08784B]">
                  Product details <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            ))}
          </div>

          <CompareRow label="Retailer offers" left={String(left.offersCount)} right={String(right.offersCount)} />
          <CompareRow label="Current best" left={formatLocalPrice(left.currentBestPrice)} right={formatLocalPrice(right.currentBestPrice)} emphasize />

          {specKeys.length > 0 ? (
            specKeys.map((key) => (
              <CompareRow key={key} label={key} left={left.specs[key] || '—'} right={right.specs[key] || '—'} />
            ))
          ) : (
            <div className="p-4 text-xs text-[#73858D]">No structured specification fields are available for both products yet.</div>
          )}

          <div className="p-4 sm:p-5 border-t border-[#EDF2F0] bg-[#F8FAF9] flex items-start gap-2.5 text-[10px] sm:text-xs text-[#65777F]">
            <ShieldCheck className="w-4 h-4 text-[#08784B] shrink-0 mt-0.5" />
            <p>Comparison values come from the structured product records available to CatchThePrice for this market. Confirm final retailer details before purchase.</p>
          </div>
        </section>
      )}
    </div>
  );
}

function CompareRow({ label, left, right, emphasize = false }: { label: string; left: string; right: string; emphasize?: boolean }) {
  return (
    <div className="grid grid-cols-[92px_1fr_1fr] sm:grid-cols-[160px_1fr_1fr] border-b last:border-b-0 border-[#EDF2F0]">
      <div className="p-3 sm:p-4 text-[10px] sm:text-xs font-semibold text-[#73858D] break-words bg-[#FBFCFC]">{label}</div>
      <div className={`p-3 sm:p-4 border-l border-[#EDF2F0] text-[10px] sm:text-xs break-words ${emphasize ? 'font-extrabold text-[#08784B]' : 'text-[#31474F]'}`}>{left}</div>
      <div className={`p-3 sm:p-4 border-l border-[#EDF2F0] text-[10px] sm:text-xs break-words ${emphasize ? 'font-extrabold text-[#08784B]' : 'text-[#31474F]'}`}>{right}</div>
    </div>
  );
}
