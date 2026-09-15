'use client';

import React, { useState } from 'react';
import { useCountry } from '@/context/CountryContext';
import { SearchBar } from '@/components/search/SearchBar';
import { ShieldCheck, TrendingDown, Bell, Laptop, Smartphone, Gamepad2, Cpu } from 'lucide-react';

export function Hero() {
  const { country } = useCountry();
  const [pointer, setPointer] = useState({ x: 0, y: 0 });

  const searchExamples = ['iPhone 17 Pro', 'PS5 Pro', 'MacBook Pro', 'Gaming Laptop'];

  const handleMouseMove = (event: React.MouseEvent<HTMLElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width - 0.5) * 14;
    const y = ((event.clientY - rect.top) / rect.height - 0.5) * 10;
    setPointer({ x, y });
  };

  return (
    <section
      onMouseMove={handleMouseMove}
      onMouseLeave={() => setPointer({ x: 0, y: 0 })}
      className="relative overflow-hidden pt-6 pb-8 sm:pt-14 sm:pb-16 ui-page border-b ui-border"
    >
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-[720px] h-[320px] rounded-full bg-[#00D27A]/10 blur-[100px]" />
        <div className="absolute -bottom-28 right-[10%] w-[360px] h-[260px] rounded-full bg-[#00C996]/8 blur-[90px]" />
      </div>

      <div className="hidden lg:block pointer-events-none absolute inset-0 z-0">
        {[
          { Icon: Laptop, left: '8%', top: '22%', factorX: .5, factorY: .45, rotate: -7 },
          { Icon: Cpu, left: '14%', top: '68%', factorX: -.35, factorY: -.3, rotate: 8 },
          { Icon: Smartphone, left: '88%', top: '22%', factorX: -.45, factorY: .4, rotate: 7 },
          { Icon: Gamepad2, left: '83%', top: '68%', factorX: .35, factorY: -.4, rotate: -6 },
        ].map(({ Icon, left, top, factorX, factorY, rotate }, index) => (
          <div
            key={index}
            className="absolute w-14 h-14 rounded-2xl ui-surface border flex items-center justify-center text-[#0B8F58] shadow-[0_14px_32px_rgba(24,52,43,0.10)] transition-transform duration-200"
            style={{ left, top, transform: `translate3d(${pointer.x * factorX}px, ${pointer.y * factorY}px, 0) rotate(${rotate}deg)` }}
          >
            <Icon className="w-6 h-6" />
          </div>
        ))}
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center relative z-10">
        <div className="inline-flex max-w-full items-center gap-2 px-3 py-1.5 rounded-full ui-surface border text-[9px] sm:text-[11px] font-extrabold text-[#0B8F58] uppercase tracking-[0.14em] mb-3 sm:mb-5 shadow-sm">
          <span className="w-1.5 h-1.5 rounded-full bg-[#00D27A] shrink-0" />
          <span className="truncate">TRACK IT. CATCH THE DROP. PAY LESS.</span>
        </div>

        <h1 className="text-[29px] min-[390px]:text-[32px] sm:text-5xl lg:text-[58px] font-extrabold tracking-[-0.035em] ui-text leading-[1.04] sm:leading-[1.07]">
          Find the right product at a{' '}
          <span className="text-[#0B8F58]">better price.</span>
        </h1>

        <p className="mt-4 text-[13px] sm:text-base ui-secondary max-w-2xl mx-auto leading-relaxed px-1">
          Compare retailer offers, understand price history and make smarter buying decisions without opening ten different tabs.
        </p>

        <div className="mt-6 sm:mt-8 max-w-2xl mx-auto">
          <SearchBar isHero />
        </div>

        <div className="mt-3.5 flex flex-wrap items-center justify-center gap-1.5 sm:gap-2 text-xs">
          <span className="ui-muted font-semibold text-[10px] sm:text-[11px] self-center">Popular:</span>
          {searchExamples.map((term) => (
            <a
              key={term}
              href={`/${country}/search?q=${encodeURIComponent(term)}`}
              className="px-2.5 sm:px-3 py-1.5 rounded-lg ui-surface border hover:border-[#9CCFBA] ui-secondary hover:text-[#0B8F58] text-[10px] sm:text-[11px] font-semibold transition-colors min-h-[36px] inline-flex items-center justify-center"
            >
              {term}
            </a>
          ))}
        </div>

        <div className="mt-6 pt-4 border-t ui-border grid grid-cols-3 gap-1.5 sm:gap-2 max-w-lg mx-auto text-[9px] sm:text-xs ui-secondary">
          <div className="flex flex-col min-[390px]:flex-row items-center justify-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-[#0B8F58] shrink-0" />
            <span>Retailer direct</span>
          </div>
          <div className="flex flex-col min-[390px]:flex-row items-center justify-center gap-1">
            <TrendingDown className="w-3.5 h-3.5 text-[#0B8F58] shrink-0" />
            <span>Price history</span>
          </div>
          <div className="flex flex-col min-[390px]:flex-row items-center justify-center gap-1">
            <Bell className="w-3.5 h-3.5 text-[#0B8F58] shrink-0" />
            <span>Price alerts</span>
          </div>
        </div>
      </div>
    </section>
  );
}
