'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useCountry } from '@/context/CountryContext';
import { COUNTRIES } from '@/lib/data/countries';
import { CountryCode } from '@/lib/types';
import { ChevronDown, Check } from 'lucide-react';

interface CountrySwitcherProps { compact?: boolean; shortLabel?: boolean; }
const LIVE_MARKETS: CountryCode[] = ['ae', 'us'];

export function CountrySwitcher({ compact = false, shortLabel = false }: CountrySwitcherProps) {
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
        className={`h-10 ${compact ? 'min-w-[38px] gap-1 px-2' : `${shortLabel ? 'min-w-[82px]' : 'min-w-[222px]'} gap-2 px-3.5`} flex items-center justify-center rounded-xl border border-[#67d7a2] bg-[#ECFDF5] py-2.5 text-xs font-semibold text-[#065F46] whitespace-nowrap shadow-[inset_0_1px_0_rgba(255,255,255,.8)] transition-all hover:-translate-y-px hover:border-[#00C16A] hover:bg-[#dff9eb] hover:shadow-[0_4px_10px_rgba(0,193,106,.14)] focus:border-[#00C16A] focus:outline-none focus:ring-2 focus:ring-[#00C16A]/25`}
        aria-expanded={isOpen}
        aria-label="Select country"
      >
        <span className="text-[17px] leading-none" aria-hidden="true">{countryInfo.flag}</span>
        {!compact && <span className={shortLabel ? '' : 'min-w-0 flex-1 text-left'}>{shortLabel ? (country === 'ae' ? 'UAE' : 'USA') : countryInfo.name}</span>}
        {!compact && !shortLabel && <span className="text-[#065F46]">{countryInfo.currency}</span>}
        <ChevronDown className={`w-3.5 h-3.5 text-[#047857] transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
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
