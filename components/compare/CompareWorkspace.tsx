'use client';

import React, { useMemo, useState } from 'react';
import { Product } from '@/lib/types';
import { useCountry } from '@/context/CountryContext';
import { ArrowRightLeft, ExternalLink } from 'lucide-react';

interface CompareWorkspaceProps {
  products: Product[];
  isPreview?: boolean;
}

export function CompareWorkspace({ products, isPreview = false }: CompareWorkspaceProps) {
  const { country, formatLocalPrice } = useCountry();
  const [leftId, setLeftId] = useState('');
  const [rightId, setRightId] = useState('');

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
    <div className="space-y-6">
      {isPreview && (
        <div className="rounded-2xl border border-amber-400/25 bg-amber-400/10 px-4 py-3 text-xs text-amber-100">
          Development preview: comparison prices and sample catalog facts on this Vercel build are for interface testing only.
        </div>
      )}

      <section className="rounded-3xl border border-[#162633] bg-[#091217] p-4 sm:p-6">
        <div className="flex items-center gap-3 mb-5">
          <div className="w-10 h-10 rounded-2xl bg-[#00D27A]/10 border border-[#00D27A]/25 text-[#00D27A] flex items-center justify-center">
            <ArrowRightLeft className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-[#F8FAFC]">Compare products</h1>
            <p className="text-xs sm:text-sm text-[#94A3B8] mt-0.5">Choose two products from the same category. Unknown facts stay unknown.</p>
          </div>
        </div>

        {products.length === 0 ? (
          <div className="rounded-2xl border border-[#162633] bg-[#071015] px-4 py-8 text-center">
            <p className="text-sm font-semibold text-[#F8FAFC]">No eligible products are available yet.</p>
            <p className="text-xs text-[#94A3B8] mt-1">The comparison tool will activate as verified catalog data is published.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] gap-3 md:items-end">
            <label className="space-y-1.5">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#94A3B8]">Product 1</span>
              <select
                value={leftId}
                onChange={(event) => resetSecondIfNeeded(event.target.value)}
                className="w-full h-12 rounded-xl border border-[#203648] bg-[#071015] px-3 text-sm text-[#F8FAFC] outline-none focus:border-[#00D27A]"
              >
                <option value="">Select a product</option>
                {products.map((product) => (
                  <option key={product.id} value={product.id}>{product.title}</option>
                ))}
              </select>
            </label>

            <div className="hidden md:flex h-12 items-center justify-center text-[#64748B]">vs</div>

            <label className="space-y-1.5">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#94A3B8]">Product 2</span>
              <select
                value={rightId}
                onChange={(event) => setRightId(event.target.value)}
                disabled={!left}
                className="w-full h-12 rounded-xl border border-[#203648] bg-[#071015] px-3 text-sm text-[#F8FAFC] outline-none focus:border-[#00D27A] disabled:opacity-50"
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
        <section className="overflow-hidden rounded-3xl border border-[#162633] bg-[#091217]">
          <div className="grid grid-cols-[96px_1fr_1fr] sm:grid-cols-[160px_1fr_1fr] border-b border-[#162633]">
            <div className="p-3 sm:p-4 text-[11px] font-bold uppercase tracking-wider text-[#64748B]">Compare</div>
            {[left, right].map((product) => (
              <div key={product.id} className="p-3 sm:p-4 border-l border-[#162633] min-w-0">
                <img src={product.imageUrl} alt="" className="w-full h-24 sm:h-32 object-contain rounded-xl bg-[#071015] mb-3" />
                <div className="text-[10px] font-bold uppercase tracking-wider text-[#00D27A]">{product.brand}</div>
                <h2 className="mt-1 text-xs sm:text-sm font-bold text-[#F8FAFC] leading-snug line-clamp-3">{product.title}</h2>
                <div className="mt-2 text-base sm:text-lg font-extrabold text-[#00D27A]">{formatLocalPrice(product.currentBestPrice)}</div>
                <a href={`/${country}/product/${product.slug}`} className="mt-2 inline-flex items-center gap-1 text-[11px] font-bold text-[#CBD5E1] hover:text-white">
                  Product details <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-[96px_1fr_1fr] sm:grid-cols-[160px_1fr_1fr] border-b border-[#162633]">
            <div className="p-3 sm:p-4 text-xs font-semibold text-[#94A3B8]">Retailer offers</div>
            <div className="p-3 sm:p-4 border-l border-[#162633] text-xs sm:text-sm text-[#F8FAFC]">{left.offersCount}</div>
            <div className="p-3 sm:p-4 border-l border-[#162633] text-xs sm:text-sm text-[#F8FAFC]">{right.offersCount}</div>
          </div>

          {specKeys.map((key) => (
            <div key={key} className="grid grid-cols-[96px_1fr_1fr] sm:grid-cols-[160px_1fr_1fr] border-b last:border-b-0 border-[#162633]">
              <div className="p-3 sm:p-4 text-[11px] sm:text-xs font-semibold text-[#94A3B8] break-words">{key}</div>
              <div className="p-3 sm:p-4 border-l border-[#162633] text-[11px] sm:text-xs text-[#CBD5E1] break-words">{left.specs[key] || '—'}</div>
              <div className="p-3 sm:p-4 border-l border-[#162633] text-[11px] sm:text-xs text-[#CBD5E1] break-words">{right.specs[key] || '—'}</div>
            </div>
          ))}
        </section>
      )}
    </div>
  );
}
