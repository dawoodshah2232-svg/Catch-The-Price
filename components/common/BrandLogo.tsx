'use client';

import React from 'react';
import { useCountry } from '@/context/CountryContext';

interface BrandLogoProps {
  variant?: 'full' | 'symbol' | 'monochrome';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

function ExactTagMark({ size, mono = false }: { size: 'sm' | 'md' | 'lg'; mono?: boolean }) {
  const frame = {
    sm: 'w-7 h-7',
    md: 'w-9 h-9',
    lg: 'w-12 h-12',
  }[size];

  const image = {
    sm: 'h-[48px] left-[-4px] top-[-9px]',
    md: 'h-[62px] left-[-5px] top-[-12px]',
    lg: 'h-[82px] left-[-7px] top-[-16px]',
  }[size];

  return (
    <span
      className={`relative ${frame} shrink-0 overflow-hidden rounded-[22%] ${
        mono ? 'grayscale opacity-80' : 'drop-shadow-[0_4px_14px_rgba(0,210,122,0.20)]'
      }`}
      aria-hidden="true"
    >
      <img
        src="/images/logo.png"
        alt=""
        className={`absolute max-w-none w-auto ${image}`}
      />
    </span>
  );
}

export function BrandLogo({ variant = 'full', size = 'md', className = '' }: BrandLogoProps) {
  const { country } = useCountry();
  const isMono = variant === 'monochrome';

  const textSizes = {
    sm: 'text-[15px]',
    md: 'text-[19px] sm:text-[21px]',
    lg: 'text-[25px] sm:text-[29px]',
  };

  if (variant === 'symbol') {
    return (
      <a
        href={`/${country}`}
        className={`inline-flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-[#00D27A]/40 rounded-xl group ${className}`}
        aria-label="CatchThePrice Home"
      >
        <span className="transition-transform duration-200 group-hover:scale-[1.03]">
          <ExactTagMark size={size} />
        </span>
      </a>
    );
  }

  return (
    <a
      href={`/${country}`}
      className={`inline-flex items-center gap-2 focus:outline-none focus:ring-2 focus:ring-[#00D27A]/40 rounded-xl group min-w-0 ${className}`}
      aria-label="CatchThePrice Home"
    >
      <span className="transition-transform duration-200 group-hover:scale-[1.02]">
        <ExactTagMark size={size} mono={isMono} />
      </span>
      <span
        className={`${textSizes[size]} leading-none font-extrabold tracking-[-0.035em] whitespace-nowrap ${
          isMono ? 'text-white/80' : ''
        }`}
      >
        <span className={isMono ? '' : 'text-[#F8FAFC]'}>CatchThe</span>
        <span className={isMono ? '' : 'text-[#00D27A]'}>Price</span>
      </span>
    </a>
  );
}
