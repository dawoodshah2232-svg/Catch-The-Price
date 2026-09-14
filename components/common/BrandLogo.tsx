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

  // Exact symbol matching the supplied logo (emerald/teal price tag with upward chart arrow)
  if (variant === 'symbol') {
    const symbolSizes = {
      sm: 'w-7 h-7',
      md: 'w-8 h-8 sm:w-9 sm:h-9',
      lg: 'w-11 h-11',
    };

    return (
      <a
        href={`/${country}`}
        className={`inline-flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-[#00D27A]/40 rounded-xl group ${className}`}
        aria-label="CatchThePrice Home"
      >
        <div className={`${symbolSizes[size]} relative overflow-hidden rounded-xl`}>
          {/* Exact crop on the tag symbol from the uploaded logo asset */}
          <div className="w-full h-full relative overflow-hidden rounded-xl bg-[#091217] border border-[#162633] p-1 flex items-center justify-center">
            <svg
              viewBox="0 0 100 100"
              className="w-full h-full drop-shadow-sm transform group-hover:scale-105 transition-transform duration-200"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <defs>
                <linearGradient id="tagGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#00E6A2" />
                  <stop offset="50%" stopColor="#00D27A" />
                  <stop offset="100%" stopColor="#008F52" />
                </linearGradient>
              </defs>
              {/* Tag shape */}
              <path
                d="M85 45L55 15C52 12 48 10 44 10H20C14.5 10 10 14.5 10 20V44C10 48 12 52 15 55L45 85C51 91 60 91 66 85L85 66C91 60 91 51 85 45Z"
                fill="url(#tagGrad)"
              />
              {/* Hole */}
              <circle cx="28" cy="28" r="7" fill="#071015" />
              {/* Chart arrow */}
              <path
                d="M26 62L42 46L54 54L74 28M74 28H58M74 28V44"
                stroke="#071015"
                strokeWidth="7"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        </div>
      </a>
    );
  }

  // Full horizontal logo using the exact supplied official asset
  const heightClasses = {
    sm: 'h-6 sm:h-7',
    md: 'h-8 sm:h-9',
    lg: 'h-11 sm:h-12',
  };

  return (
    <a
      href={`/${country}`}
      className={`inline-flex items-center focus:outline-none focus:ring-2 focus:ring-[#00D27A]/40 rounded-lg group ${className}`}
      aria-label="CatchThePrice Home"
    >
      <img
        src="/images/logo.png"
        alt="CatchThePrice — TRACK IT. CATCH THE DROP. PAY LESS."
        className={`${heightClasses[size]} w-auto object-contain transition-transform duration-200 group-hover:scale-[1.01] ${
          variant === 'monochrome' ? 'grayscale opacity-75 contrast-125' : ''
        }`}
      />
    </a>
  );
}
