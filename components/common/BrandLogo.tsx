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
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-13 h-13',
  };

  const fullSizes = {
    sm: 'h-8 max-w-[168px]',
    md: 'h-10 max-w-[222px]',
    lg: 'h-[52px] max-w-[286px]',
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
