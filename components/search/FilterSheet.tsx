'use client';

import React from 'react';
import { CATEGORIES } from '@/lib/data/categories';
import { MERCHANTS } from '@/lib/data/merchants';
import { useCountry } from '@/context/CountryContext';
import { X, SlidersHorizontal, Check, RotateCcw } from 'lucide-react';

export interface FilterState {
  category: string;
  brand: string;
  merchant: string;
  minPrice: string;
  maxPrice: string;
  minDiscount: string;
  inStockOnly: boolean;
}

interface FilterSheetProps {
  isOpen: boolean;
  onClose: () => void;
  filters: FilterState;
  onFiltersChange: (filters: FilterState) => void;
  onReset: () => void;
  totalResults: number;
}

export function FilterSheet({
  isOpen,
  onClose,
  filters,
  onFiltersChange,
  onReset,
  totalResults,
}: FilterSheetProps) {
  const { country, countryInfo } = useCountry();

  if (!isOpen) return null;

  const brands = ['Apple', 'Samsung', 'Sony', 'Google', 'LG', 'Dell', 'Valve'];
  const countryMerchants = MERCHANTS.filter((m) => m.country === country);

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-150">
      <div
        className="w-full max-w-lg max-h-[85vh] rounded-t-3xl sm:rounded-3xl bg-ctp-surface-elevated border border-ctp-border-bright flex flex-col shadow-2xl overflow-hidden animate-in slide-in-from-bottom duration-200"
        role="dialog"
        aria-modal="true"
      >
        {/* Drag handle for mobile */}
        <div className="sm:hidden pt-3 flex justify-center">
          <div className="w-12 h-1.5 rounded-full bg-slate-700" />
        </div>

        {/* Header */}
        <div className="px-5 py-4 border-b border-ctp flex items-center justify-between">
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="w-4 h-4 text-emerald-400" />
            <h3 className="font-bold text-base text-slate-100">Filter Products</h3>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onReset}
              className="text-xs text-slate-400 hover:text-emerald-400 flex items-center gap-1 px-2 py-1 rounded-lg"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-lg bg-slate-900 text-slate-400 hover:text-white border border-ctp"
              aria-label="Close filters"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Scrollable Filters Body */}
        <div className="p-5 overflow-y-auto space-y-6 text-xs flex-1">
          {/* 1. Category */}
          <div>
            <label className="block font-bold text-slate-200 uppercase tracking-wider text-[11px] mb-2.5">
              Category
            </label>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => onFiltersChange({ ...filters, category: '' })}
                className={`px-3 py-2 rounded-xl transition-all touch-target font-medium ${
                  !filters.category
                    ? 'bg-emerald-500 text-slate-950 font-bold shadow-sm'
                    : 'bg-ctp-surface border border-ctp text-slate-300 hover:border-ctp-border-bright'
                }`}
              >
                All Categories
              </button>
              {CATEGORIES.map((cat) => {
                const isSelected = filters.category === cat.slug;
                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => onFiltersChange({ ...filters, category: isSelected ? '' : cat.slug })}
                    className={`px-3 py-2 rounded-xl transition-all touch-target font-medium ${
                      isSelected
                        ? 'bg-emerald-500 text-slate-950 font-bold shadow-sm'
                        : 'bg-ctp-surface border border-ctp text-slate-300 hover:border-ctp-border-bright'
                    }`}
                  >
                    {cat.name}
                  </button>
                );
              })}
            </div>
          </div>

          {/* 2. Brand */}
          <div>
            <label className="block font-bold text-slate-200 uppercase tracking-wider text-[11px] mb-2.5">
              Brand
            </label>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => onFiltersChange({ ...filters, brand: '' })}
                className={`px-3 py-2 rounded-xl transition-all touch-target font-medium ${
                  !filters.brand
                    ? 'bg-emerald-500 text-slate-950 font-bold shadow-sm'
                    : 'bg-ctp-surface border border-ctp text-slate-300 hover:border-ctp-border-bright'
                }`}
              >
                All Brands
              </button>
              {brands.map((b) => {
                const isSelected = filters.brand === b;
                return (
                  <button
                    key={b}
                    type="button"
                    onClick={() => onFiltersChange({ ...filters, brand: isSelected ? '' : b })}
                    className={`px-3 py-2 rounded-xl transition-all touch-target font-medium ${
                      isSelected
                        ? 'bg-emerald-500 text-slate-950 font-bold shadow-sm'
                        : 'bg-ctp-surface border border-ctp text-slate-300 hover:border-ctp-border-bright'
                    }`}
                  >
                    {b}
                  </button>
                );
              })}
            </div>
          </div>

          {/* 3. Retailer / Merchant */}
          {countryMerchants.length > 0 && (
            <div>
              <label className="block font-bold text-slate-200 uppercase tracking-wider text-[11px] mb-2.5">
                Merchant / Store
              </label>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => onFiltersChange({ ...filters, merchant: '' })}
                  className={`px-3 py-2 rounded-xl transition-all touch-target font-medium ${
                    !filters.merchant
                      ? 'bg-emerald-500 text-slate-950 font-bold shadow-sm'
                      : 'bg-ctp-surface border border-ctp text-slate-300 hover:border-ctp-border-bright'
                  }`}
                >
                  All Stores
                </button>
                {countryMerchants.map((m) => {
                  const isSelected = filters.merchant === m.name;
                  return (
                    <button
                      key={m.id}
                      type="button"
                      onClick={() =>
                        onFiltersChange({ ...filters, merchant: isSelected ? '' : m.name })
                      }
                      className={`px-3 py-2 rounded-xl transition-all touch-target font-medium ${
                        isSelected
                          ? 'bg-emerald-500 text-slate-950 font-bold shadow-sm'
                          : 'bg-ctp-surface border border-ctp text-slate-300 hover:border-ctp-border-bright'
                      }`}
                    >
                      {m.name}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* 4. Price Range */}
          <div>
            <label className="block font-bold text-slate-200 uppercase tracking-wider text-[11px] mb-2.5">
              Price Range ({countryInfo.currency})
            </label>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <span className="text-[10px] text-slate-400 block mb-1">Min Price</span>
                <input
                  type="number"
                  placeholder="0"
                  value={filters.minPrice}
                  onChange={(e) => onFiltersChange({ ...filters, minPrice: e.target.value })}
                  className="w-full bg-ctp-surface border border-ctp rounded-xl px-3 py-2 text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-emerald-500"
                />
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block mb-1">Max Price</span>
                <input
                  type="number"
                  placeholder="50,000"
                  value={filters.maxPrice}
                  onChange={(e) => onFiltersChange({ ...filters, maxPrice: e.target.value })}
                  className="w-full bg-ctp-surface border border-ctp rounded-xl px-3 py-2 text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>
          </div>

          {/* 5. Discount Minimum */}
          <div>
            <label className="block font-bold text-slate-200 uppercase tracking-wider text-[11px] mb-2.5">
              Minimum Price Drop
            </label>
            <div className="grid grid-cols-4 gap-2">
              {[
                { label: 'Any', value: '' },
                { label: '10%+', value: '10' },
                { label: '15%+', value: '15' },
                { label: '25%+', value: '25' },
              ].map((disc) => {
                const isSelected = filters.minDiscount === disc.value;
                return (
                  <button
                    key={disc.label}
                    type="button"
                    onClick={() => onFiltersChange({ ...filters, minDiscount: disc.value })}
                    className={`py-2 px-1 text-center rounded-xl transition-all touch-target font-medium ${
                      isSelected
                        ? 'bg-emerald-500 text-slate-950 font-bold'
                        : 'bg-ctp-surface border border-ctp text-slate-300'
                    }`}
                  >
                    {disc.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* 6. Availability */}
          <div className="pt-2">
            <label className="flex items-center gap-3 p-3 rounded-xl bg-ctp-surface border border-ctp cursor-pointer">
              <input
                type="checkbox"
                checked={filters.inStockOnly}
                onChange={(e) => onFiltersChange({ ...filters, inStockOnly: e.target.checked })}
                className="w-4 h-4 accent-emerald-500 rounded"
              />
              <span className="font-medium text-slate-200">Show In-Stock Products Only</span>
            </label>
          </div>
        </div>

        {/* Footer Apply CTA */}
        <div className="p-4 border-t border-ctp bg-ctp-surface flex items-center gap-3">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-sm transition-all shadow-lg flex items-center justify-center gap-2 touch-target"
          >
            <span>Show {totalResults} Results</span>
            <Check className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
