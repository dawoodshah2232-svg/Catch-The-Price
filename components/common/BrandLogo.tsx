'use client';

import React from 'react';
import Link from 'next/navigation';
import Image from 'next/image';
import { useCountry } from '@/context/CountryContext';

interface BrandLogoProps {
  size?: 'sm' | 'md' | 'lg';
  showTagline?: boolean;
  className?: string;
}

export function BrandLogo({ size = 'md', showTagline = false, className = '' }: BrandLogoProps) {
  const { country } = useCountry();

  const heightClasses = {
    sm: 'h-7',
    md: 'h-9 sm:h-10',
    lg: 'h-12 sm:h-14',
  };

  return (
    <a
      href={`/${country}`}
      className={`inline-flex items-center gap-2.5 focus:outline-none focus:ring-2 focus:ring-emerald-500/40 rounded-lg group ${className}`}
      aria-label="CatchThePrice Home"
    >
      <div className="relative flex items-center">
        <img
          src="/images/logo.png"
          alt="CatchThePrice - Track It. Catch the Drop. Pay Less."
          className={`${heightClasses[size]} w-auto object-contain transition-transform duration-200 group-hover:scale-[1.02]`}
        />
      </div>
    </a>
  );
}
