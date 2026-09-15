'use client';

import React from 'react';
import { Product } from '@/lib/types';
import { useCountry } from '@/context/CountryContext';
import { GitCompareArrows, ArrowRight } from 'lucide-react';

interface QuickCompareSectionProps {
  current: Product;
  alternatives: Product[];
}

export function QuickCompareSection({ current, alternatives }: QuickCompareSectionProps) {
  const { country, formatLocalPrice } = useCountry();
  const products = [current, ...alternatives.slice(0, 2)];

  if (products.length < 2) return null;

  const commonSpecKeys = Array.from(
    new Set(products.flatMap((p) => Object.keys(p.specs || {})))
  ).slice(0, 4);

  return (
    <section className="rounded-3xl border border-[#162633] bg-[#091217] overflow-hidden">
      <div className="p-4 sm:p-5 border-b border-[#162633] flex items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-[#62efb7] text-[11px] font-bold uppercase tracking-wider">
            <GitCompareArrows className="w-4 h-4" /> Quick Compare
          </div>
          <h2 className="mt-1 text-lg sm:text-xl font-extrabold text-white">See the differences before you decide</h2>
          <p className="text-[11px] sm:text-xs text-[#9FB0BA] mt-1">A simple side-by-side view of price, deal score and key specifications.</p>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[680px] text-left">
          <thead>
            <tr className="border-b border-[#162633]">
              <th className="p-3 sm:p-4 text-[10px] uppercase tracking-wider text-[#7F929D] w-[140px]">Compare</th>
              {products.map((p) => (
                <th key={p.id} className="p-3 sm:p-4 align-top min-w-[180px]">
                  <div className="flex items-center gap-2.5">
                    <img src={p.imageUrl} alt="" className="w-11 h-11 rounded-xl bg-[#071015] object-contain p-1.5 border border-[#162633]" />
                    <div className="min-w-0">
                      <div className="text-[10px] uppercase text-[#00D27A] font-bold">{p.brand}</div>
                      <div className="text-xs font-bold text-white line-clamp-2 leading-snug">{p.title}</div>
                    </div>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-[#162633] text-xs">
            <tr>
              <td className="p-3 sm:p-4 text-[#8FA1AC] font-semibold">Best price</td>
              {products.map((p) => (
                <td key={p.id} className="p-3 sm:p-4 text-[#5BE8AD] font-extrabold">{formatLocalPrice(p.currentBestPrice)}</td>
              ))}
            </tr>
            <tr>
              <td className="p-3 sm:p-4 text-[#8FA1AC] font-semibold">Deal score</td>
              {products.map((p) => (
                <td key={p.id} className="p-3 sm:p-4 text-white font-bold">{p.dealScore}/100</td>
              ))}
            </tr>
            <tr>
              <td className="p-3 sm:p-4 text-[#8FA1AC] font-semibold">Stores</td>
              {products.map((p) => (
                <td key={p.id} className="p-3 sm:p-4 text-[#D7E0E5]">{p.offersCount} compared</td>
              ))}
            </tr>
            {commonSpecKeys.map((key) => (
              <tr key={key}>
                <td className="p-3 sm:p-4 text-[#8FA1AC] font-semibold">{key}</td>
                {products.map((p) => (
                  <td key={p.id} className="p-3 sm:p-4 text-[#D7E0E5]">{p.specs?.[key] || '—'}</td>
                ))}
              </tr>
            ))}
            <tr>
              <td className="p-3 sm:p-4 text-[#8FA1AC] font-semibold">View</td>
              {products.map((p) => (
                <td key={p.id} className="p-3 sm:p-4">
                  <a
                    href={`/${country}/product/${p.slug}`}
                    className="inline-flex items-center gap-1.5 text-[#62efb7] font-bold hover:text-white transition-colors"
                  >
                    Product details <ArrowRight className="w-3.5 h-3.5" />
                  </a>
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>
    </section>
  );
}
