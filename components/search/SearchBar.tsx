'use client';

import React, { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCountry } from '@/context/CountryContext';
import { Product } from '@/lib/types';
import { Search, X, ArrowRight, Sparkles } from 'lucide-react';

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
  const [catalog, setCatalog] = useState<Product[]>([]);
  const [suggestions, setSuggestions] = useState<Product[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let active = true;
    fetch(`/api/catalog?country=${encodeURIComponent(country)}`, { cache: 'no-store' })
      .then(async (response) => {
        if (!response.ok) return { products: [] };
        return response.json();
      })
      .then((payload) => {
        if (!active) return;
        setCatalog(Array.isArray(payload.products) ? payload.products : []);
      })
      .catch(() => {
        if (active) setCatalog([]);
      });

    return () => {
      active = false;
    };
  }, [country]);

  useEffect(() => {
    if (query.trim().length < 2) {
      setSuggestions([]);
      setIsOpen(false);
      return;
    }

    const q = query.toLowerCase();
    const filtered = catalog
      .filter(
        (product) =>
          product.title.toLowerCase().includes(q) ||
          product.brand.toLowerCase().includes(q) ||
          product.categoryName.toLowerCase().includes(q)
      )
      .slice(0, 5);

    setSuggestions(filtered);
    setIsOpen(filtered.length > 0);
  }, [query, catalog]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
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
          className={`flex items-center w-full min-w-0 transition-all duration-200 rounded-2xl border bg-white ${
            isHero
              ? 'border-[#D6E4DE] hover:border-[#AFCFC2] focus-within:border-[#0B8F58] focus-within:ring-4 focus-within:ring-[#00D27A]/10 shadow-[0_12px_36px_rgba(0,0,0,0.22)]'
              : 'border-[#D6E4DE] hover:border-[#B7CBC3] focus-within:border-[#0B8F58] focus-within:ring-2 focus-within:ring-[#00D27A]/10 shadow-sm'
          }`}
        >
          <div className="pl-3.5 sm:pl-4 pr-2 flex items-center pointer-events-none shrink-0">
            <Search className={isHero ? 'w-5 h-5 text-[#0B8F58]' : 'w-4 h-4 text-[#557168]'} />
          </div>

          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            onFocus={() => suggestions.length > 0 && setIsOpen(true)}
            placeholder="Search products, brands or models…"
            autoFocus={autoFocus}
            className={`min-w-0 flex-1 bg-transparent text-[#102027] placeholder:text-[#829198] focus:outline-none ${
              isHero ? 'py-3.5 sm:py-5 text-[13px] sm:text-base font-semibold' : 'py-3.5 text-[13px] sm:text-sm'
            }`}
          />

          {query && (
            <button
              type="button"
              onClick={() => {
                setQuery('');
                setIsOpen(false);
              }}
              className="p-2 mr-0.5 text-[#73858D] hover:text-[#20343C] focus:outline-none touch-target flex items-center justify-center min-h-[44px] min-w-[44px] shrink-0"
              aria-label="Clear search"
            >
              <X className="w-4 h-4" />
            </button>
          )}

          <button
            type="submit"
            aria-label="Search"
            className={`flex items-center justify-center font-bold transition-all shrink-0 ${
              isHero
                ? 'mr-1.5 sm:mr-2 px-3 sm:px-6 py-2.5 sm:py-3.5 min-h-[46px] sm:min-h-[48px] rounded-xl bg-[#0B8F58] hover:bg-[#08784B] text-white text-xs sm:text-base shadow-sm touch-target font-extrabold'
                : 'mr-1.5 p-2.5 rounded-xl text-[#08784B] hover:bg-[#EAF5F0] min-h-[44px] min-w-[44px] touch-target'
            }`}
          >
            {isHero ? (
              <>
                <ArrowRight className="w-4 h-4 stroke-[2.7] sm:hidden" />
                <span className="hidden sm:inline">Search prices</span>
              </>
            ) : (
              <ArrowRight className="w-4 h-4 stroke-[2.5]" />
            )}
          </button>
        </div>
      </form>

      {isOpen && suggestions.length > 0 && (
        <div className="absolute left-0 right-0 top-full mt-2 rounded-2xl bg-white border border-[#DDE7E3] shadow-[0_18px_50px_rgba(16,32,39,0.18)] overflow-hidden z-50">
          <div className="px-3 sm:px-4 py-2 bg-[#F8FAF9] border-b border-[#E5ECE9] flex items-center justify-between gap-3 text-xs text-[#52636B]">
            <span className="flex items-center gap-1.5 font-extrabold text-[#08784B] min-w-0">
              <Sparkles className="w-3.5 h-3.5 shrink-0" /> Product suggestions
            </span>
            <span className="hidden sm:inline text-[11px] text-[#829198]">Enter to search all</span>
          </div>

          <div className="divide-y divide-[#EDF2F0]">
            {suggestions.map((product) => (
              <button
                key={product.id}
                type="button"
                onClick={() => handleSelectProduct(product.slug)}
                className="w-full flex items-center gap-3 p-3 text-left hover:bg-[#F6FAF8] transition-colors group min-w-0"
              >
                <img
                  src={product.imageUrl}
                  alt={product.title}
                  className="w-11 h-11 object-contain rounded-xl bg-[#F8FAF9] p-1 border border-[#E1E9E6] shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <p className="text-xs sm:text-sm font-bold text-[#102027] truncate group-hover:text-[#08784B] transition-colors">
                    {product.title}
                  </p>
                  <div className="text-[10px] sm:text-[11px] text-[#65777F] flex items-center gap-1.5 mt-0.5 min-w-0">
                    <span className="font-bold text-[#73858D] uppercase tracking-wider shrink-0">{product.brand}</span>
                    <span>•</span>
                    <span className="truncate">{product.categoryName}</span>
                    <span className="hidden sm:inline">•</span>
                    <span className="hidden sm:inline text-[#08784B] font-extrabold shrink-0">
                      {formatLocalPrice(product.currentBestPrice)}
                    </span>
                  </div>
                </div>
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={(event) => handleSubmit(event as unknown as React.FormEvent)}
            className="w-full py-2.5 px-4 bg-[#F8FAF9] hover:bg-[#EEF6F2] text-center text-xs font-extrabold text-[#08784B] flex items-center justify-center gap-1.5 border-t border-[#E5ECE9]"
          >
            <span className="truncate">See all results for “{query}”</span>
            <ArrowRight className="w-3.5 h-3.5 shrink-0" />
          </button>
        </div>
      )}
    </div>
  );
}
