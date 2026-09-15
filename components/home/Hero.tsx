'use client';

import React, { useState } from 'react';
import { useCountry } from '@/context/CountryContext';
import { SearchBar } from '@/components/search/SearchBar';
import { ShieldCheck, TrendingDown, Bell, Laptop, Smartphone, Gamepad2, Cpu } from 'lucide-react';

export function Hero() {
  const { country } = useCountry();
  const [pointer, setPointer] = useState({ x: 0, y: 0 });

  const searchExamples = [
    'iPhone 17 Pro',
    'PS5 Pro',
    'MacBook Pro',
    'Gaming Laptop',
  ];

  const handleMouseMove = (event: React.MouseEvent<HTMLElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width - 0.5) * 16;
    const y = ((event.clientY - rect.top) / rect.height - 0.5) * 12;
    setPointer({ x, y });
  };

  return (
    <section
      onMouseMove={handleMouseMove}
      onMouseLeave={() => setPointer({ x: 0, y: 0 })}
      className="relative overflow-hidden pt-5 pb-7 sm:pt-12 sm:pb-14 bg-[#071015] border-b border-[#162633]"
    >
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 max-w-3xl h-44 bg-[#00D27A]/10 blur-[90px] pointer-events-none rounded-full" />

      {/* Desktop-only ambient product cues. They follow the cursor subtly so the hero feels alive without becoming distracting. */}
      <div className="hidden lg:block pointer-events-none absolute inset-0 z-0">
        <div
          className="absolute left-[8%] top-[20%] w-14 h-14 rounded-2xl border border-[#1a3039] bg-[#091217]/85 backdrop-blur-md flex items-center justify-center text-[#5ee9b1] shadow-2xl transition-transform duration-200"
          style={{ transform: `translate3d(${pointer.x * 0.55}px, ${pointer.y * 0.55}px, 0) rotate(-7deg)` }}
        >
          <Laptop className="w-7 h-7" />
        </div>
        <div
          className="absolute left-[14%] bottom-[16%] w-11 h-11 rounded-2xl border border-[#1a3039] bg-[#0a151a]/85 backdrop-blur-md flex items-center justify-center text-[#4edaa5] transition-transform duration-200"
          style={{ transform: `translate3d(${pointer.x * -0.35}px, ${pointer.y * -0.35}px, 0) rotate(8deg)` }}
        >
          <Cpu className="w-5 h-5" />
        </div>
        <div
          className="absolute right-[10%] top-[18%] w-12 h-12 rounded-2xl border border-[#1a3039] bg-[#091217]/85 backdrop-blur-md flex items-center justify-center text-[#5ee9b1] shadow-2xl transition-transform duration-200"
          style={{ transform: `translate3d(${pointer.x * -0.5}px, ${pointer.y * 0.45}px, 0) rotate(7deg)` }}
        >
          <Smartphone className="w-6 h-6" />
        </div>
        <div
          className="absolute right-[16%] bottom-[15%] w-14 h-14 rounded-2xl border border-[#1a3039] bg-[#0a151a]/85 backdrop-blur-md flex items-center justify-center text-[#4edaa5] transition-transform duration-200"
          style={{ transform: `translate3d(${pointer.x * 0.4}px, ${pointer.y * -0.45}px, 0) rotate(-6deg)` }}
        >
          <Gamepad2 className="w-7 h-7" />
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center relative z-10">
        <div className="inline-flex max-w-full items-center gap-2 px-3 py-1 rounded-full bg-[#091217] border border-[#162633] text-[9px] sm:text-[11px] font-bold text-[#CBD5E1] uppercase tracking-wider mb-3 sm:mb-4">
          <span className="w-1.5 h-1.5 rounded-full bg-[#00D27A] shrink-0" />
          <span className="truncate">TRACK IT. CATCH THE DROP. PAY LESS.</span>
        </div>

        <h1 className="text-[27px] min-[390px]:text-[30px] sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-[#F8FAFC] leading-[1.08] sm:leading-[1.15]">
          Smarter Shopping for a{' '}
          <span className="text-[#00D27A]">Brighter Tomorrow.</span>
        </h1>

        <p className="mt-3 text-[13px] sm:text-base text-[#CBD5E1] max-w-xl mx-auto leading-relaxed px-1">
          Compare prices across stores, track price changes and choose when the price is right.
        </p>

        <div className="mt-5 sm:mt-7 max-w-2xl mx-auto">
          <SearchBar isHero={true} />
        </div>

        <div className="mt-3 flex flex-wrap items-center justify-center gap-1.5 sm:gap-2 text-xs">
          <span className="text-[#94A3B8] font-semibold text-[10px] sm:text-[11px] self-center">Popular:</span>
          {searchExamples.map((term) => (
            <a
              key={term}
              href={`/${country}/search?q=${encodeURIComponent(term)}`}
              className="px-2.5 sm:px-3 py-1.5 rounded-lg bg-[#091217] hover:bg-[#0f1c24] border border-[#162633] hover:border-[#00D27A]/50 text-[#CBD5E1] hover:text-[#00E6A2] text-[10px] sm:text-[11px] font-medium transition-colors min-h-[36px] inline-flex items-center justify-center"
            >
              {term}
            </a>
          ))}
        </div>

        <div className="mt-5 pt-4 border-t border-[#162633]/80 grid grid-cols-3 gap-1.5 sm:gap-2 max-w-md mx-auto text-[9px] sm:text-xs text-[#CBD5E1]">
          <div className="flex flex-col min-[390px]:flex-row items-center justify-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-[#00D27A] shrink-0" />
            <span>Store Direct</span>
          </div>
          <div className="flex flex-col min-[390px]:flex-row items-center justify-center gap-1">
            <TrendingDown className="w-3.5 h-3.5 text-[#00C996] shrink-0" />
            <span>Price History</span>
          </div>
          <div className="flex flex-col min-[390px]:flex-row items-center justify-center gap-1">
            <Bell className="w-3.5 h-3.5 text-[#00E6A2] shrink-0" />
            <span>Price Alerts</span>
          </div>
        </div>
      </div>
    </section>
  );
}
