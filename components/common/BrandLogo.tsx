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

  const iconSizes = {
    sm: 'w-7 h-7',
    md: 'w-9 h-9',
    lg: 'w-12 h-12',
  };

  const textSizes = {
    sm: 'text-[15px]',
    md: 'text-[19px] sm:text-[21px]',
    lg: 'text-[25px] sm:text-[28px]',
  };

  const isMono = variant === 'monochrome';

  if (variant === 'symbol') {
    return (
      <a
        href={`/${country}`}
        className={`inline-flex items-center justify-center rounded-xl focus:outline-none focus:ring-2 focus:ring-[#00D27A]/40 ${className}`}
        aria-label="CatchThePrice Home"
      >
        <img
          src="/images/emerald_growth_tag_icon.png"
          alt=""
          className={`${iconSizes[size]} object-contain ${isMono ? 'grayscale opacity-80' : ''}`}
        />
      </a>
    );
  }

  return (
    <a
      href={`/${country}`}
      className={`inline-flex items-center gap-1.5 sm:gap-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#00D27A]/40 ${className}`}
      aria-label="CatchThePrice Home"
    >
      <img
        src="/images/emerald_growth_tag_icon.png"
        alt=""
        className={`${iconSizes[size]} shrink-0 object-contain ${isMono ? 'grayscale opacity-80' : ''}`}
      />
      <span className={`${textSizes[size]} leading-none font-extrabold tracking-[-0.045em] whitespace-nowrap`}>
        <span className={isMono ? 'text-white/80' : 'text-[#F8FAFC]'}>CatchThe</span>
        <span className={isMono ? 'text-white/80' : 'text-[#00D27A]'}>Price</span>
      </span>
    </a>
  );
}
