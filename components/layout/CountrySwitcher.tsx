'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useCountry } from '@/context/CountryContext';
import { COUNTRIES } from '@/lib/data/countries';
import { CountryCode } from '@/lib/types';
import { ChevronDown, Check } from 'lucide-react';

interface CountrySwitcherProps {
  compact?: boolean;
}

const LIVE_MARKETS: CountryCode[] = ['ae', 'us'];

export function CountrySwitcher({ compact = false }: CountrySwitcherProps) {
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
        className="h-11 flex items-center gap-2 px-3 rounded-xl bg-[#0A151A] border border-[#1A3039] hover:border-[#28434D] text-xs font-semibold text-white transition-colors focus:outline-none focus:ring-2 focus:ring-[#00D27A]/30"
        aria-expanded={isOpen}
        aria-label="Select market and currency"
      >
        <span className="text-lg leading-none">{countryInfo.flag}</span>
        {!compact && <span>{countryInfo.currency}</span>}
        <ChevronDown className={`w-3.5 h-3.5 text-[#91A1A8] transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-72 rounded-2xl bg-[#0B171D] border border-[#1D343E] shadow-2xl p-2.5 z-[70]">
          <div className="px-2.5 py-2 border-b border-[#1A3039] mb-1.5">
            <p className="text-xs font-extrabold text-white">Choose your market</p>
            <p className="text-[10px] text-[#91A1A8] mt-0.5">Only live regions can be selected.</p>
          </div>

          <div className="space-y-1.5">
            {LIVE_MARKETS.map((code) => {
              const c = COUNTRIES[code];
              const isSelected = code === country;
              return (
                <button
                  key={code}
                  onClick={() => handleSelect(code)}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-left transition-colors ${
                    isSelected
                      ? 'bg-[#0E2A22] border border-[#1D6E50]'
                      : 'border border-transparent hover:bg-[#102128]'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-xl leading-none">{c.flag}</span>
                    <div>
                      <div className="font-semibold text-xs text-white">{c.name}</div>
                      <div className="text-[10px] text-[#91A1A8] mt-0.5">{c.currency} · {c.symbol}</div>
                    </div>
                  </div>
                  {isSelected && <Check className="w-4 h-4 text-[#63E6AE]" />}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
