'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useCountry } from '@/context/CountryContext';
import { getAllProducts } from '@/lib/data/products';
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
          className={`flex items-center w-full min-w-0 transition-all duration-200 rounded-2xl border ${
            isHero
              ? 'bg-[#091217] border-[#203648] hover:border-[#00D27A]/60 focus-within:border-[#00D27A] focus-within:ring-2 focus-within:ring-[#00D27A]/25 shadow-2xl'
              : 'bg-[#091217] border-[#162633] hover:border-[#203648] focus-within:border-[#00D27A] focus-within:ring-1 focus-within:ring-[#00D27A]/25'
          }`}
        >
          <div className="pl-3.5 sm:pl-4 pr-2 flex items-center pointer-events-none text-[#CBD5E1] shrink-0">
            <Search className={isHero ? 'w-5 h-5 text-[#00D27A]' : 'w-4 h-4'} />
          </div>

          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => query.trim().length >= 2 && setIsOpen(true)}
            placeholder={isHero ? 'Search products, brands or models…' : 'Search products, brands or models…'}
            autoFocus={autoFocus}
            className={`min-w-0 flex-1 bg-transparent text-[#F8FAFC] placeholder:text-[#94A3B8] focus:outline-none ${
              isHero ? 'py-3.5 sm:py-5 text-[13px] sm:text-base font-medium' : 'py-3.5 text-[13px] sm:text-sm'
            }`}
          />

          {query && (
            <button
              type="button"
              onClick={() => {
                setQuery('');
                setIsOpen(false);
              }}
              className="p-2 mr-0.5 text-[#CBD5E1] hover:text-white focus:outline-none touch-target flex items-center justify-center min-h-[44px] min-w-[44px] shrink-0"
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
                ? 'mr-1.5 sm:mr-2 px-3 sm:px-6 py-2.5 sm:py-3.5 min-h-[46px] sm:min-h-[48px] rounded-xl btn-conversion-primary text-xs sm:text-base shadow-md touch-target font-extrabold'
                : 'mr-1.5 p-2.5 rounded-xl text-[#00D27A] hover:text-[#00E6A2] min-h-[44px] min-w-[44px] touch-target'
            }`}
          >
            {isHero ? (
              <>
                <ArrowRight className="w-4 h-4 stroke-[2.7] sm:hidden" />
                <span className="hidden sm:inline">Catch Price</span>
              </>
            ) : (
              <ArrowRight className="w-4 h-4 stroke-[2.5]" />
            )}
          </button>
        </div>
      </form>

      {isOpen && suggestions.length > 0 && (
        <div className="absolute left-0 right-0 top-full mt-2 rounded-2xl bg-[#0f1c24] border border-[#203648] shadow-2xl overflow-hidden z-50 animate-in fade-in zoom-in-95 duration-150">
          <div className="px-3 sm:px-4 py-2 bg-[#091217] border-b border-[#162633] flex items-center justify-between gap-3 text-xs text-[#CBD5E1]">
            <span className="flex items-center gap-1.5 font-bold text-[#00D27A] min-w-0">
              <Sparkles className="w-3.5 h-3.5 shrink-0" /> Product Suggestions
            </span>
            <span className="hidden sm:inline text-[11px] text-[#94A3B8]">Press Enter to search all</span>
          </div>

          <div className="divide-y divide-[#162633]">
            {suggestions.map((product) => (
              <button
                key={product.id}
                onClick={() => handleSelectProduct(product.slug)}
                className="w-full flex items-center gap-3 p-3 text-left hover:bg-[#152733] transition-colors group min-w-0"
              >
                <img
                  src={product.imageUrl}
                  alt={product.title}
                  className="w-11 h-11 object-contain rounded-xl bg-[#071015] p-1 border border-[#162633] shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <p className="text-xs sm:text-sm font-semibold text-[#F8FAFC] truncate group-hover:text-[#00D27A] transition-colors">
                    {product.title}
                  </p>
                  <div className="text-[10px] sm:text-[11px] text-[#CBD5E1] flex items-center gap-1.5 mt-0.5 min-w-0">
                    <span className="font-semibold text-[#94A3B8] uppercase tracking-wider shrink-0">{product.brand}</span>
                    <span>•</span>
                    <span className="truncate">{product.categoryName}</span>
                    <span className="hidden sm:inline">•</span>
                    <span className="hidden sm:inline text-[#00D27A] font-extrabold shrink-0">
                      {formatLocalPrice(product.currentBestPrice)}
                    </span>
                  </div>
                </div>
                <div className="hidden sm:block shrink-0 text-right">
                  <span className="inline-block px-2 py-0.5 rounded-lg text-[10px] font-extrabold bg-[#00D27A]/15 text-[#00D27A] border border-[#00D27A]/30">
                    Score {product.dealScore}
                  </span>
                </div>
              </button>
            ))}
          </div>

          <button
            onClick={handleSubmit}
            className="w-full py-2.5 px-4 bg-[#091217] hover:bg-[#152733] text-center text-xs font-bold text-[#00D27A] flex items-center justify-center gap-1.5 border-t border-[#162633]"
          >
            <span className="truncate">See all results for &ldquo;{query}&rdquo;</span>
            <ArrowRight className="w-3.5 h-3.5 shrink-0" />
          </button>
        </div>
      )}
    </div>
  );
}
