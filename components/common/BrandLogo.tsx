'use client';

import React from 'react';
import { useCountry } from '@/context/CountryContext';

interface BrandLogoProps {
  variant?: 'full' | 'symbol' | 'monochrome';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  onDark?: boolean;
}

export function BrandLogo({ variant = 'full', size = 'md', className = '', onDark = false }: BrandLogoProps) {
  const { country } = useCountry();

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

  if (onDark) {
    const symbolSizes = {
      sm: 'w-7 h-7',
      md: 'w-8 h-8 sm:w-9 sm:h-9',
      lg: 'w-10 h-10 sm:w-11 sm:h-11',
    };
    const wordSizes = {
      sm: 'text-[15px] sm:text-base',
      md: 'text-[18px] sm:text-xl',
      lg: 'text-xl sm:text-2xl',
    };

    return (
      <a
        href={`/${country}`}
        className={`inline-flex items-center gap-2 focus:outline-none focus:ring-2 focus:ring-[#00D27A]/40 rounded-xl group ${className}`}
        aria-label="CatchThePrice Home"
      >
        <img
          src="/images/emerald_growth_tag_icon.png"
          alt=""
          className={`${symbolSizes[size]} object-contain drop-shadow-md transition-transform duration-200 group-hover:scale-105`}
        />
        <span className={`${wordSizes[size]} font-black tracking-[-0.035em] leading-none whitespace-nowrap`}>
          <span className="text-white">CatchThe</span><span className="text-[#00D27A]">Price</span>
        </span>
      </a>
    );
  }

  const heightClasses = {
    sm: 'h-8 sm:h-9',
    md: 'h-9 sm:h-11',
    lg: 'h-12 sm:h-14',
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
