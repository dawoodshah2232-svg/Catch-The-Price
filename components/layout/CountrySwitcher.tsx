'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useCountry } from '@/context/CountryContext';
import { COUNTRIES } from '@/lib/data/countries';
import { CountryCode } from '@/lib/types';
import { ChevronDown, Check } from 'lucide-react';

interface CountrySwitcherProps { compact?: boolean; onDark?: boolean; }
const LIVE_MARKETS: CountryCode[] = ['ae', 'us'];

export function CountrySwitcher({ compact = false, onDark = false }: CountrySwitcherProps) {
  const { country, countryInfo, setCountry } = useCountry();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) setIsOpen(false);
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (code: CountryCode) => {
    setCountry(code);
    setIsOpen(false);
  };

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`h-10 ${compact ? 'min-w-[44px] px-3' : 'min-w-[222px] px-3.5'} flex items-center justify-center gap-2 rounded-lg border text-xs font-semibold whitespace-nowrap transition-colors focus:outline-none focus:ring-2 focus:ring-[#00D27A]/20 ${
          onDark
            ? 'bg-[#0F1C24] border-[#223743] text-[#E7F1ED] hover:border-[#355361]'
            : 'ui-surface hover:border-[#9CCFBA] ui-text'
        }`}
        aria-expanded={isOpen}
        aria-label="Select market and currency"
      >
        <span className="text-[17px] leading-none" aria-hidden="true">{countryInfo.flag}</span>
        {!compact && <span className="min-w-0 flex-1 text-left">{countryInfo.name}</span>}
        {!compact && <span className={onDark ? 'text-[#b8c9c1]' : 'ui-muted'}>{countryInfo.currency}</span>}
        <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${onDark ? 'text-[#93A9A0]' : 'ui-muted'} ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="ctp-popover-light absolute right-0 mt-2 w-72 rounded-2xl border shadow-[0_18px_48px_rgba(24,52,43,0.16)] p-2.5 z-[70]">
          <div className="px-2.5 py-2 border-b border-[#E3EBE7] mb-1.5">
            <p className="text-xs font-extrabold text-[#102027]">Choose your market</p>
            <p className="text-[10px] text-[#73858D] mt-0.5">Only live regions can be selected.</p>
          </div>

          <div className="space-y-1.5">
            {LIVE_MARKETS.map((code) => {
              const c = COUNTRIES[code];
              const isSelected = code === country;
              return (
                <button
                  key={code}
                  onClick={() => handleSelect(code)}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-left border transition-colors ${
                    isSelected ? 'bg-[#EAF8F1] border-[#B9E5D0]' : 'border-transparent hover:bg-[#F4F8F6]'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-xl leading-none">{c.flag}</span>
                    <div>
                      <div className="font-semibold text-xs text-[#102027]">{c.name}</div>
                      <div className="text-[10px] text-[#73858D] mt-0.5">{c.currency} · {c.symbol}</div>
                    </div>
                  </div>
                  {isSelected && <Check className="w-4 h-4 text-[#0B8F58]" />}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
