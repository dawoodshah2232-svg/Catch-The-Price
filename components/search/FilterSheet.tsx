'use client';

import React from 'react';
import { CATEGORIES } from '@/lib/data/categories';
import { MERCHANTS } from '@/lib/data/merchants';
import { useCountry } from '@/context/CountryContext';
import { X, SlidersHorizontal, Check, RotateCcw, ArrowUpDown } from 'lucide-react';

export interface FilterState {
  category: string;
  brand: string;
  merchant: string;
  minPrice: string;
  maxPrice: string;
  minDiscount: string;
  minDealScore: string;
  inStockOnly: boolean;
  sortBy?: 'deal_score' | 'price_asc' | 'price_desc' | 'biggest_drop' | 'popular' | 'newest';
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

  const sortOptions = [
    { label: 'Best Deal', value: 'deal_score' },
    { label: 'Lowest Price', value: 'price_asc' },
    { label: 'Biggest Drop', value: 'biggest_drop' },
    { label: 'Most Popular', value: 'popular' },
    { label: 'Newest', value: 'newest' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-[#071015]/80 backdrop-blur-sm animate-in fade-in duration-150">
      <div
        className="w-full max-w-lg max-h-[85vh] rounded-t-3xl sm:rounded-3xl bg-[#091217] border border-[#162633] flex flex-col shadow-2xl overflow-hidden animate-in slide-in-from-bottom duration-200"
        role="dialog"
        aria-modal="true"
      >
        {/* Drag handle for mobile */}
        <div className="sm:hidden pt-3 flex justify-center">
          <div className="w-12 h-1.5 rounded-full bg-[#162633]" />
        </div>

        {/* Header */}
        <div className="px-5 py-4 border-b border-[#162633] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="w-4 h-4 text-[#00D27A]" />
            <h3 className="font-bold text-base text-[#F8FAFC]">Filter &amp; Sort</h3>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onReset}
              className="text-xs text-[#CBD5E1] hover:text-[#00D27A] flex items-center gap-1 px-2 py-1 rounded-lg font-medium"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-xl bg-[#071015] text-[#CBD5E1] hover:text-white border border-[#162633]"
              aria-label="Close filters"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Scrollable Filters Body */}
        <div className="p-5 overflow-y-auto space-y-6 text-xs flex-1">
          {/* Sort By Facet */}
          <div>
            <label className="block font-bold text-[#F8FAFC] uppercase tracking-wider text-[11px] mb-2.5 flex items-center gap-1.5">
              <ArrowUpDown className="w-3.5 h-3.5 text-[#00D27A]" />
              <span>Sort By</span>
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {sortOptions.map((opt) => {
                const isSelected = (filters.sortBy || 'deal_score') === opt.value;
                return (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => onFiltersChange({ ...filters, sortBy: opt.value as any })}
                    className={`px-3 py-2 rounded-xl transition-all touch-target font-semibold text-left ${
                      isSelected
                        ? 'bg-[#00D27A] text-[#071015] shadow-sm'
                        : 'bg-[#071015] border border-[#162633] text-[#CBD5E1] hover:border-[#203648]'
                    }`}
                  >
                    {opt.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* 1. Category */}
          <div>
            <label className="block font-bold text-[#F8FAFC] uppercase tracking-wider text-[11px] mb-2.5">
              Category
            </label>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => onFiltersChange({ ...filters, category: '' })}
                className={`px-3 py-2 rounded-xl transition-all touch-target font-medium ${
                  !filters.category
                    ? 'bg-[#00D27A] text-[#071015] font-bold shadow-sm'
                    : 'bg-[#071015] border border-[#162633] text-[#CBD5E1] hover:border-[#203648]'
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
                        ? 'bg-[#00D27A] text-[#071015] font-bold shadow-sm'
                        : 'bg-[#071015] border border-[#162633] text-[#CBD5E1] hover:border-[#203648]'
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
            <label className="block font-bold text-[#F8FAFC] uppercase tracking-wider text-[11px] mb-2.5">
              Brand
            </label>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => onFiltersChange({ ...filters, brand: '' })}
                className={`px-3 py-2 rounded-xl transition-all touch-target font-medium ${
                  !filters.brand
                    ? 'bg-[#00D27A] text-[#071015] font-bold shadow-sm'
                    : 'bg-[#071015] border border-[#162633] text-[#CBD5E1] hover:border-[#203648]'
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
                        ? 'bg-[#00D27A] text-[#071015] font-bold shadow-sm'
                        : 'bg-[#071015] border border-[#162633] text-[#CBD5E1] hover:border-[#203648]'
                    }`}
                  >
                    {b}
                  </button>
                );
              })}
            </div>
          </div>

          {/* 3. Deal Score Filter */}
          <div>
            <label className="block font-bold text-[#F8FAFC] uppercase tracking-wider text-[11px] mb-2.5">
              Minimum Deal Score
            </label>
            <div className="grid grid-cols-4 gap-2">
              {[
                { label: 'All', value: '' },
                { label: 'Score 75+', value: '75' },
                { label: 'Score 85+', value: '85' },
                { label: 'Score 90+', value: '90' },
              ].map((tier) => {
                const isSelected = filters.minDealScore === tier.value;
                return (
                  <button
                    key={tier.label}
                    type="button"
                    onClick={() => onFiltersChange({ ...filters, minDealScore: tier.value })}
                    className={`py-2 px-1 text-center rounded-xl transition-all touch-target font-semibold ${
                      isSelected
                        ? 'bg-[#00D27A] text-[#071015] font-bold'
                        : 'bg-[#071015] border border-[#162633] text-[#CBD5E1]'
                    }`}
                  >
                    {tier.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* 4. Price Range */}
          <div>
            <label className="block font-bold text-[#F8FAFC] uppercase tracking-wider text-[11px] mb-2.5">
              Price Range ({countryInfo.currency})
            </label>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <span className="text-[10px] text-[#94A3B8] block mb-1 font-semibold">Min Price</span>
                <input
                  type="number"
                  placeholder="0"
                  value={filters.minPrice}
                  onChange={(e) => onFiltersChange({ ...filters, minPrice: e.target.value })}
                  className="w-full bg-[#071015] border border-[#162633] rounded-xl px-3.5 py-2.5 text-[#F8FAFC] placeholder:text-[#94A3B8] focus:outline-none focus:border-[#00D27A]"
                />
              </div>
              <div>
                <span className="text-[10px] text-[#94A3B8] block mb-1 font-semibold">Max Price</span>
                <input
                  type="number"
                  placeholder="50,000"
                  value={filters.maxPrice}
                  onChange={(e) => onFiltersChange({ ...filters, maxPrice: e.target.value })}
                  className="w-full bg-[#071015] border border-[#162633] rounded-xl px-3.5 py-2.5 text-[#F8FAFC] placeholder:text-[#94A3B8] focus:outline-none focus:border-[#00D27A]"
                />
              </div>
            </div>
          </div>

          {/* 5. Discount Filter */}
          <div>
            <label className="block font-bold text-[#F8FAFC] uppercase tracking-wider text-[11px] mb-2.5">
              Minimum Discount %
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
                    className={`py-2 px-1 text-center rounded-xl transition-all touch-target font-semibold ${
                      isSelected
                        ? 'bg-[#00D27A] text-[#071015] font-bold'
                        : 'bg-[#071015] border border-[#162633] text-[#CBD5E1]'
                    }`}
                  >
                    {disc.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* 6. Merchant / Store */}
          {countryMerchants.length > 0 && (
            <div>
              <label className="block font-bold text-[#F8FAFC] uppercase tracking-wider text-[11px] mb-2.5">
                Store / Retailer
              </label>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => onFiltersChange({ ...filters, merchant: '' })}
                  className={`px-3 py-2 rounded-xl transition-all touch-target font-medium ${
                    !filters.merchant
                      ? 'bg-[#00D27A] text-[#071015] font-bold shadow-sm'
                      : 'bg-[#071015] border border-[#162633] text-[#CBD5E1] hover:border-[#203648]'
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
                          ? 'bg-[#00D27A] text-[#071015] font-bold shadow-sm'
                          : 'bg-[#071015] border border-[#162633] text-[#CBD5E1] hover:border-[#203648]'
                      }`}
                    >
                      {m.name}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* 7. Availability */}
          <div className="pt-2">
            <label className="flex items-center gap-3 p-3 rounded-2xl bg-[#071015] border border-[#162633] cursor-pointer">
              <input
                type="checkbox"
                checked={filters.inStockOnly}
                onChange={(e) => onFiltersChange({ ...filters, inStockOnly: e.target.checked })}
                className="w-4 h-4 accent-[#00D27A] rounded"
              />
              <span className="font-semibold text-[#F8FAFC]">Show In-Stock Products Only</span>
            </label>
          </div>
        </div>

        {/* Footer Apply CTA - High Conversion */}
        <div className="p-4 border-t border-[#162633] bg-[#091217] flex items-center gap-3">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-3.5 rounded-2xl btn-conversion-primary text-sm font-extrabold flex items-center justify-center gap-2 touch-target"
          >
            <span>Apply Filters ({totalResults} Results)</span>
            <Check className="w-4 h-4 stroke-[3]" />
          </button>
        </div>
      </div>
    </div>
  );
}
