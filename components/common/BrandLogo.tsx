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

  // 1. Finalized Emerald Growth Tag Icon
  if (variant === 'symbol') {
    const symbolSizes = {
      sm: 'w-7 h-7',
      md: 'w-9 h-9',
      lg: 'w-11 h-11',
    };

    return (
      <a
        href={`/${country}`}
        className={`inline-flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-[#00D27A]/40 rounded-xl group ${className}`}
        aria-label="CatchThePrice Home"
      >
        <img
          src="/images/emerald_growth_tag_icon.png"
          alt="CatchThePrice"
          className={`${symbolSizes[size]} object-contain drop-shadow-md transition-transform duration-200 group-hover:scale-105`}
        />
      </a>
    );
  }

  // 2. Finalized Main CatchThePrice Logo on Transparency
  const heightClasses = {
    sm: 'h-7 sm:h-8',
    md: 'h-8 sm:h-9',
    lg: 'h-10 sm:h-11',
  };

  return (
    <a
      href={`/${country}`}
      className={`inline-flex items-center focus:outline-none focus:ring-2 focus:ring-[#00D27A]/40 rounded-lg group ${className}`}
      aria-label="CatchThePrice Home"
    >
      <img
        src="/images/catchtheprice_logo_on_transparency.png"
        alt="CatchThePrice — TRACK IT. CATCH THE DROP. PAY LESS."
        className={`${heightClasses[size]} w-auto object-contain transition-transform duration-200 group-hover:scale-[1.01] ${
          variant === 'monochrome' ? 'grayscale opacity-75 contrast-125' : ''
        }`}
      />
    </a>
  );
}
