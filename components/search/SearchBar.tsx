'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useCountry } from '@/context/CountryContext';
import { getAllProducts } from '@/lib/data/products';
import { Product } from '@/lib/types';
import { Search, X, TrendingUp, Sparkles, ArrowRight } from 'lucide-react';

interface SearchBarProps {
  isHero?: boolean;
  autoFocus?: boolean;
  className?: string;
  onSearchSubmitted?: () => void;
}

export function SearchBar({
  isHero = false,
  autoFocus = false,
  className = '',
  onSearchSubmitted,
}: SearchBarProps) {
  const { country, formatLocalPrice } = useCountry();
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [suggestions, setSuggestions] = useState<Product[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);

  const allProducts = getAllProducts(country);

  useEffect(() => {
    if (query.trim().length >= 2) {
      const q = query.toLowerCase();
      const filtered = allProducts
        .filter(
          (p) =>
            p.title.toLowerCase().includes(q) ||
            p.brand.toLowerCase().includes(q) ||
            p.categoryName.toLowerCase().includes(q)
        )
        .slice(0, 5);
      setSuggestions(filtered);
      setIsOpen(true);
    } else {
      setSuggestions([]);
      setIsOpen(false);
    }
  }, [query, country]);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    setIsOpen(false);
    onSearchSubmitted?.();
    router.push(`/${country}/search?q=${encodeURIComponent(query.trim())}`);
  };

  const handleSelectProduct = (slug: string) => {
    setIsOpen(false);
    setQuery('');
    onSearchSubmitted?.();
    router.push(`/${country}/product/${slug}`);
  };

  return (
    <div className={`relative w-full ${className}`} ref={containerRef}>
      <form onSubmit={handleSubmit} className="relative w-full">
        <div
          className={`flex items-center w-full transition-all duration-200 rounded-xl border ${
            isHero
              ? 'bg-ctp-surface-elevated/90 border-ctp-border-bright hover:border-emerald-500/50 focus-within:border-emerald-500 focus-within:ring-2 focus-within:ring-emerald-500/30 shadow-xl'
              : 'bg-ctp-surface border-ctp hover:border-ctp-border-bright focus-within:border-emerald-500 focus-within:ring-1 focus-within:ring-emerald-500/30'
          }`}
        >
          <div className="pl-3.5 pr-2 flex items-center pointer-events-none text-slate-400">
            <Search className={isHero ? 'w-5 h-5 text-emerald-400' : 'w-4 h-4'} />
          </div>

          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => query.trim().length >= 2 && setIsOpen(true)}
            placeholder={
              isHero
                ? 'Search phones, laptops, PS5, TVs, smartwatches...'
                : 'Search products or brands...'
            }
            autoFocus={autoFocus}
            className={`w-full bg-transparent text-slate-100 placeholder:text-slate-400 focus:outline-none ${
              isHero ? 'py-3.5 text-sm sm:text-base' : 'py-2 text-xs sm:text-sm'
            }`}
          />

          {query && (
            <button
              type="button"
              onClick={() => {
                setQuery('');
                setIsOpen(false);
              }}
              className="p-1.5 mr-1.5 text-slate-400 hover:text-slate-200 focus:outline-none"
              aria-label="Clear search"
            >
              <X className="w-4 h-4" />
            </button>
          )}

          <button
            type="submit"
            className={`flex items-center justify-center font-medium transition-all ${
              isHero
                ? 'mr-2 px-4 py-2 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-semibold text-sm shadow-md'
                : 'mr-1 px-3 py-1.5 rounded-lg text-emerald-400 hover:text-emerald-300 text-xs'
            }`}
          >
            {isHero ? 'Catch Price' : <ArrowRight className="w-4 h-4" />}
          </button>
        </div>
      </form>

      {/* Autocomplete Dropdown */}
      {isOpen && suggestions.length > 0 && (
        <div className="absolute left-0 right-0 top-full mt-2 rounded-xl bg-ctp-surface-elevated border border-ctp-border-bright shadow-2xl overflow-hidden z-50 animate-in fade-in zoom-in-95 duration-150">
          <div className="px-3 py-2 bg-ctp-surface border-b border-ctp flex items-center justify-between text-xs text-slate-400">
            <span className="flex items-center gap-1.5 font-medium text-emerald-400">
              <Sparkles className="w-3.5 h-3.5" /> Matching Products
            </span>
            <span>Press Enter to search all</span>
          </div>

          <div className="divide-y divide-ctp">
            {suggestions.map((product) => (
              <button
                key={product.id}
                onClick={() => handleSelectProduct(product.slug)}
                className="w-full flex items-center gap-3 p-3 text-left hover:bg-slate-800/60 transition-colors group"
              >
                <img
                  src={product.imageUrl}
                  alt={product.title}
                  className="w-10 h-10 object-cover rounded-lg bg-slate-900 border border-ctp shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <p className="text-xs sm:text-sm font-medium text-slate-100 truncate group-hover:text-emerald-400 transition-colors">
                    {product.title}
                  </p>
                  <p className="text-[11px] text-slate-400 flex items-center gap-2 mt-0.5">
                    <span>{product.brand}</span>
                    <span>•</span>
                    <span className="text-emerald-400 font-semibold">
                      {formatLocalPrice(product.currentBestPrice)}
                    </span>
                    <span className="text-slate-400 line-through">
                      {formatLocalPrice(product.originalPrice)}
                    </span>
                  </p>
                </div>
                <div className="shrink-0 text-right">
                  <span className="inline-block px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    {product.dealScore} Score
                  </span>
                </div>
              </button>
            ))}
          </div>

          <button
            onClick={handleSubmit}
            className="w-full py-2.5 px-3 bg-ctp-surface hover:bg-slate-800/80 text-center text-xs font-medium text-emerald-400 flex items-center justify-center gap-1.5 border-t border-ctp"
          >
            <span>View all results for &quot;{query}&quot;</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      )}
    </div>
  );
}
