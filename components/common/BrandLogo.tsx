'use client';

import React from 'react';
import { useCountry } from '@/context/CountryContext';

interface BrandLogoProps {
  variant?: 'full' | 'symbol' | 'monochrome';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

function TagMark({ className = '' }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 120 120"
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="ctpTag" x1="20" y1="10" x2="94" y2="104" gradientUnits="userSpaceOnUse">
          <stop stopColor="#63F5C8" />
          <stop offset="0.38" stopColor="#00E6A2" />
          <stop offset="0.72" stopColor="#00C996" />
          <stop offset="1" stopColor="#008D65" />
        </linearGradient>
        <filter id="ctpGlow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="2.2" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* price-tag body */}
      <path
        d="M19 20C19 13.373 24.373 8 31 8H72.5C77.202 8 81.713 9.868 85.038 13.193L108.807 36.962C113.493 41.648 113.493 49.245 108.807 53.931L61.931 100.807C57.245 105.493 49.648 105.493 44.962 100.807L21.193 77.038C17.868 73.713 16 69.202 16 64.5V23C16 21.343 17.343 20 19 20Z"
        fill="url(#ctpTag)"
        filter="url(#ctpGlow)"
      />

      {/* punched hole */}
      <circle cx="77" cy="27" r="8.5" fill="#071015" />
      <circle cx="77" cy="27" r="5.1" fill="#0A151B" />

      {/* short wire loop */}
      <path
        d="M76.5 26.5C80.4 10.4 95.9 7.8 103.5 16.1C110.1 23.3 105.8 31.8 101.2 36.3"
        stroke="#071015"
        strokeWidth="5.8"
        strokeLinecap="round"
      />

      {/* growth line / arrow */}
      <path
        d="M28 74L47 55L59.5 65L87.5 37.5"
        stroke="#071015"
        strokeWidth="9"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M73.5 37.5H87.5V51.5"
        stroke="#071015"
        strokeWidth="9"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function BrandLogo({ variant = 'full', size = 'md', className = '' }: BrandLogoProps) {
  const { country } = useCountry();

  const symbolSizes = {
    sm: 'w-7 h-7',
    md: 'w-9 h-9',
    lg: 'w-12 h-12',
  };

  const textSizes = {
    sm: 'text-[14px]',
    md: 'text-[18px] sm:text-[20px]',
    lg: 'text-[24px] sm:text-[28px]',
  };

  if (variant === 'symbol') {
    return (
      <a
        href={`/${country}`}
        className={`inline-flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-[#00D27A]/40 rounded-xl group ${className}`}
        aria-label="CatchThePrice Home"
      >
        <TagMark className={`${symbolSizes[size]} drop-shadow-[0_4px_14px_rgba(0,210,122,0.18)] transition-transform duration-200 group-hover:scale-[1.03]`} />
      </a>
    );
  }

  const isMono = variant === 'monochrome';

  return (
    <a
      href={`/${country}`}
      className={`inline-flex items-center gap-2.5 focus:outline-none focus:ring-2 focus:ring-[#00D27A]/40 rounded-xl group ${className}`}
      aria-label="CatchThePrice Home"
    >
      <TagMark
        className={`${symbolSizes[size]} shrink-0 transition-transform duration-200 group-hover:scale-[1.02] ${
          isMono ? 'grayscale opacity-80' : 'drop-shadow-[0_4px_14px_rgba(0,210,122,0.18)]'
        }`}
      />
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
