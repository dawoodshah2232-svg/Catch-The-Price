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
          className={`flex items-center w-full transition-all duration-200 rounded-2xl border ${
            isHero
              ? 'bg-[#091217] border-[#203648] hover:border-[#00D27A]/60 focus-within:border-[#00D27A] focus-within:ring-2 focus-within:ring-[#00D27A]/25 shadow-2xl'
              : 'bg-[#091217] border-[#162633] hover:border-[#203648] focus-within:border-[#00D27A] focus-within:ring-1 focus-within:ring-[#00D27A]/25'
          }`}
        >
          <div className="pl-4 pr-2 flex items-center pointer-events-none text-[#8E9DAE]">
            <Search className={isHero ? 'w-5 h-5 text-[#00D27A]' : 'w-4 h-4'} />
          </div>

          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => query.trim().length >= 2 && setIsOpen(true)}
            placeholder={
              isHero
                ? 'Search any product, brand or model…'
                : 'Search any product, brand or model…'
            }
            autoFocus={autoFocus}
            className={`w-full bg-transparent text-[#F8FAFC] placeholder:text-[#5B6B7C] focus:outline-none ${
              isHero ? 'py-4 text-sm sm:text-base font-medium' : 'py-2.5 text-xs sm:text-sm'
            }`}
          />

          {query && (
            <button
              type="button"
              onClick={() => {
                setQuery('');
                setIsOpen(false);
              }}
              className="p-1.5 mr-1 text-[#8E9DAE] hover:text-white focus:outline-none touch-target flex items-center justify-center"
              aria-label="Clear search"
            >
              <X className="w-4 h-4" />
            </button>
          )}

          <button
            type="submit"
            className={`flex items-center justify-center font-bold transition-all ${
              isHero
                ? 'mr-2 px-5 py-2.5 rounded-xl bg-[#00D27A] hover:bg-[#00E6A2] text-[#071015] text-sm shadow-md touch-target'
                : 'mr-1 px-3 py-1.5 rounded-lg text-[#00D27A] hover:text-[#00E6A2] text-xs'
            }`}
          >
            {isHero ? 'Catch Price' : <ArrowRight className="w-4 h-4" />}
          </button>
        </div>
      </form>

      {/* Autocomplete Dropdown with image, product name, category, and best price */}
      {isOpen && suggestions.length > 0 && (
        <div className="absolute left-0 right-0 top-full mt-2 rounded-2xl bg-[#0f1c24] border border-[#203648] shadow-2xl overflow-hidden z-50 animate-in fade-in zoom-in-95 duration-150">
          <div className="px-4 py-2 bg-[#091217] border-b border-[#162633] flex items-center justify-between text-xs text-[#8E9DAE]">
            <span className="flex items-center gap-1.5 font-bold text-[#00D27A]">
              <Sparkles className="w-3.5 h-3.5" /> Product Suggestions
            </span>
            <span className="text-[11px]">Press Enter to search all</span>
          </div>

          <div className="divide-y divide-[#162633]">
            {suggestions.map((product) => (
              <button
                key={product.id}
                onClick={() => handleSelectProduct(product.slug)}
                className="w-full flex items-center gap-3 p-3.5 text-left hover:bg-[#152733] transition-colors group"
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
                  <div className="text-[11px] text-[#8E9DAE] flex items-center gap-2 mt-0.5">
                    <span className="font-medium text-[#5B6B7C] uppercase tracking-wider">{product.brand}</span>
                    <span>•</span>
                    <span className="text-[#8E9DAE]">{product.categoryName}</span>
                    <span>•</span>
                    <span className="text-[#00D27A] font-bold">
                      {formatLocalPrice(product.currentBestPrice)}
                    </span>
                  </div>
                </div>
                <div className="shrink-0 text-right">
                  <span className="inline-block px-2 py-0.5 rounded-lg text-[10px] font-extrabold bg-[#00D27A]/10 text-[#00D27A] border border-[#00D27A]/25">
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
            <span>See all results for &ldquo;{query}&rdquo;</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      )}
    </div>
  );
}
