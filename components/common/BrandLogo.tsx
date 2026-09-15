'use client';

import React from 'react';
import { useCountry } from '@/context/CountryContext';

interface BrandLogoProps {
  variant?: 'full' | 'symbol' | 'monochrome';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function BrandLogo({ variant = 'full', size = 'md', className = '' }: BrandLogoProps) {
  const { country } = useCountry();

  const symbolSizes = {
    sm: 'w-7 h-7',
    md: 'w-9 h-9',
    lg: 'w-12 h-12',
  };

  const fullSizes = {
    sm: 'h-7 max-w-[142px]',
    md: 'h-9 max-w-[190px]',
    lg: 'h-12 max-w-[248px]',
  };

  const isSymbol = variant === 'symbol';
  const src = isSymbol
    ? '/images/emerald_growth_tag_icon.png'
    : '/images/catchtheprice_logo_on_transparency.png';

  return (
    <a
      href={`/${country}`}
      className={`inline-flex items-center rounded-xl focus:outline-none focus:ring-2 focus:ring-[#00D27A]/40 ${className}`}
      aria-label="CatchThePrice Home"
    >
      <img
        src={src}
        alt={isSymbol ? '' : 'CatchThePrice'}
        className={`${isSymbol ? symbolSizes[size] : fullSizes[size]} w-auto shrink-0 object-contain ${
          variant === 'monochrome' ? 'grayscale opacity-85' : ''
        }`}
      />
    </a>
  );
}
