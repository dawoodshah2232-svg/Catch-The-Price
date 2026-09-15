'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useCountry } from '@/context/CountryContext';
import { Product } from '@/lib/types';
import { Search, X, ArrowRight, Sparkles } from 'lucide-react';

interface SearchBarProps {
  isHero?: boolean;
  autoFocus?: boolean;
  className?: string;
  onSearchSubmitted?: () => void;
  chrome?: boolean;
}

export function SearchBar({ isHero = false, autoFocus = false, className = '', onSearchSubmitted, chrome = false }: SearchBarProps) {
  const { country, formatLocalPrice } = useCountry();
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [suggestions, setSuggestions] = useState<Product[]>([]);
  const [catalog, setCatalog] = useState<Product[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let active = true;
    fetch(`/api/catalog?country=${encodeURIComponent(country)}`, { cache: 'no-store' })
      .then(async (response) => {
        if (!response.ok) throw new Error('Catalog request failed');
        return response.json();
      })
      .then((payload) => {
        if (!active) return;
        setCatalog(Array.isArray(payload?.products) ? payload.products : []);
      })
      .catch(() => {
        if (active) setCatalog([]);
      });
    return () => { active = false; };
  }, [country]);

  useEffect(() => {
    if (query.trim().length >= 2) {
      const q = query.toLowerCase();
      setSuggestions(
        catalog
          .filter((p) => p.title.toLowerCase().includes(q) || p.brand.toLowerCase().includes(q) || p.categoryName.toLowerCase().includes(q))
          .slice(0, 5)
      );
      setIsOpen(true);
    } else {
      setSuggestions([]);
      setIsOpen(false);
    }
  }, [query, catalog]);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) setIsOpen(false);
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

  const shellClass = chrome
    ? 'bg-white border-[#CBD9D3] text-[#102027]'
    : 'ui-surface';

  return (
    <div className={`relative w-full ${className}`} ref={containerRef}>
      <form onSubmit={handleSubmit} className="relative w-full">
        <div className={`flex items-center w-full min-w-0 transition-all duration-200 rounded-2xl border ${shellClass} ${
          isHero
            ? 'shadow-[0_12px_32px_rgba(24,52,43,0.10)] hover:border-[#A7D7C1] focus-within:border-[#0B8F58] focus-within:ring-2 focus-within:ring-[#00D27A]/15'
            : 'shadow-sm hover:border-[#B8D6C8] focus-within:border-[#0B8F58] focus-within:ring-2 focus-within:ring-[#00D27A]/12'
        }`}>
          <div className="pl-3.5 sm:pl-4 pr-2 flex items-center pointer-events-none shrink-0">
            <Search className={isHero ? 'w-5 h-5 text-[#0B8F58]' : 'w-4 h-4 text-[#0B8F58]'} />
          </div>

          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => query.trim().length >= 2 && setIsOpen(true)}
            placeholder="Search products, brands or models…"
            autoFocus={autoFocus}
            className={`min-w-0 flex-1 bg-transparent placeholder:text-[#8A9A94] focus:outline-none ${chrome ? 'text-[#102027]' : 'ui-text'} ${
              isHero ? 'py-3.5 sm:py-5 text-[13px] sm:text-base font-medium' : 'py-2.5 sm:py-3 text-[13px] sm:text-sm font-medium'
            }`}
          />

          {!isHero && !query && (
            <div className="hidden xl:flex items-center pr-2 pointer-events-none">
              <kbd className={`inline-flex items-center px-1.5 py-0.5 text-[10px] font-mono border rounded-md ${chrome ? 'text-[#73858D] bg-[#F4F7F6] border-[#DDE7E3]' : 'ui-muted ui-soft'}`}>/</kbd>
            </div>
          )}

          {query && (
            <button
              type="button"
              onClick={() => { setQuery(''); setIsOpen(false); }}
              className={`p-2 mr-0.5 hover:text-[#0B8F58] focus:outline-none touch-target flex items-center justify-center min-h-[40px] min-w-[40px] shrink-0 ${chrome ? 'text-[#73858D]' : 'ui-muted'}`}
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
                : 'mr-1.5 p-2 rounded-xl text-[#0B8F58] hover:bg-[#EAF8F1] min-h-[40px] min-w-[40px] touch-target'
            }`}
          >
            {isHero ? <><ArrowRight className="w-4 h-4 stroke-[2.7] sm:hidden" /><span className="hidden sm:inline">Search prices</span></> : <ArrowRight className="w-4 h-4 stroke-[2.5]" />}
          </button>
        </div>
      </form>

      {isOpen && suggestions.length > 0 && (
        <div className="absolute left-0 right-0 top-full mt-2 rounded-2xl bg-white border border-[#DDE7E3] text-[#102027] shadow-[0_18px_48px_rgba(24,52,43,0.16)] overflow-hidden z-50">
          <div className="px-3 sm:px-4 py-2 bg-[#F8FAF9] border-b border-[#E2EAE6] flex items-center justify-between gap-3 text-xs text-[#52636B]">
            <span className="flex items-center gap-1.5 font-bold text-[#0B8F58] min-w-0"><Sparkles className="w-3.5 h-3.5 shrink-0" /> Product suggestions</span>
            <span className="hidden sm:inline text-[11px] text-[#73858D]">Press Enter to search all</span>
          </div>

          <div className="divide-y divide-[#DDE7E3]">
            {suggestions.map((product) => (
              <button key={product.id} onClick={() => handleSelectProduct(product.slug)} className="w-full flex items-center gap-3 p-3 text-left hover:bg-[#F4F8F6] transition-colors group min-w-0">
                <img src={product.imageUrl} alt={product.title} className="w-11 h-11 object-contain rounded-xl bg-white p-1 border border-[#DDE7E3] shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-xs sm:text-sm font-semibold text-[#102027] truncate group-hover:text-[#0B8F58] transition-colors">{product.title}</p>
                  <div className="text-[10px] sm:text-[11px] text-[#52636B] flex items-center gap-1.5 mt-0.5 min-w-0">
                    <span className="font-semibold text-[#73858D] uppercase tracking-wider shrink-0">{product.brand}</span><span>•</span><span className="truncate">{product.categoryName}</span>
                    <span className="hidden sm:inline">•</span><span className="hidden sm:inline text-[#0B8F58] font-extrabold shrink-0">{formatLocalPrice(product.currentBestPrice)}</span>
                  </div>
                </div>
              </button>
            ))}
          </div>

          <button onClick={handleSubmit} className="w-full py-2.5 px-4 bg-[#F8FAF9] hover:bg-[#EAF8F1] text-center text-xs font-bold text-[#0B8F58] flex items-center justify-center gap-1.5 border-t border-[#E2EAE6]">
            <span className="truncate">See all results for &ldquo;{query}&rdquo;</span><ArrowRight className="w-3.5 h-3.5 shrink-0" />
          </button>
        </div>
      )}
    </div>
  );
}
