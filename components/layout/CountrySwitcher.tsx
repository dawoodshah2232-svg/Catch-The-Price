'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useCountry } from '@/context/CountryContext';
import { COUNTRIES } from '@/lib/data/countries';
import { CountryCode } from '@/lib/types';
import { ChevronDown, Globe2, Check } from 'lucide-react';

interface CountrySwitcherProps {
  compact?: boolean;
}

export function CountrySwitcher({ compact = false }: CountrySwitcherProps) {
  const { country, countryInfo, setCountry } = useCountry();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
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
        className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-ctp-surface border border-ctp hover:border-ctp-border-bright text-xs font-medium text-slate-200 transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500/40 touch-target"
        aria-expanded={isOpen}
        aria-label="Select Market and Currency"
      >
        <span className="text-base leading-none">{countryInfo.flag}</span>
        {!compact && <span className="font-semibold text-slate-100">{countryInfo.currency}</span>}
        <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-64 rounded-xl bg-ctp-surface-elevated border border-ctp-border-bright shadow-2xl p-2 z-50 animate-in fade-in zoom-in-95 duration-150">
          <div className="px-3 py-2 border-b border-ctp mb-1">
            <p className="text-xs font-semibold text-slate-300">Select Market & Currency</p>
            <p className="text-[11px] text-slate-400">Prices and stores update instantly</p>
          </div>

          <div className="space-y-1">
            {(Object.keys(COUNTRIES) as CountryCode[]).map((code) => {
              const c = COUNTRIES[code];
              const isSelected = code === country;
              return (
                <button
                  key={code}
                  onClick={() => handleSelect(code)}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-left text-xs transition-colors ${
                    isSelected
                      ? 'bg-emerald-500/10 text-emerald-400 font-semibold border border-emerald-500/30'
                      : 'text-slate-300 hover:bg-slate-800/60 hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <span className="text-lg leading-none">{c.flag}</span>
                    <div>
                      <div className="font-medium text-slate-100">{c.name}</div>
                      <div className="text-[11px] text-slate-400">{c.currency} ({c.symbol})</div>
                    </div>
                  </div>
                  {isSelected && <Check className="w-4 h-4 text-emerald-400" />}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
