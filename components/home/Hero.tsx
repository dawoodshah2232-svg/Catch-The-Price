'use client';

import React, { useState } from 'react';
import { useCountry } from '@/context/CountryContext';
import { ArrowRight, Scale, Laptop, Smartphone, Gamepad2, Cpu, TrendingDown, ShieldCheck } from 'lucide-react';

export function Hero() {
  const { country } = useCountry();
  const [pointer, setPointer] = useState({ x: 0, y: 0 });

  const handleMouseMove = (event: React.MouseEvent<HTMLElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width - 0.5) * 12;
    const y = ((event.clientY - rect.top) / rect.height - 0.5) * 8;
    setPointer({ x, y });
  };

  const quickLinks = [
    ['Phones', `/${country}/deals/phones`],
    ['Laptops', `/${country}/deals/laptops`],
    ['Gaming', `/${country}/deals/gaming`],
    ['PC Components', `/${country}/deals/pc-components`],
  ];

  return (
    <section
      onMouseMove={handleMouseMove}
      onMouseLeave={() => setPointer({ x: 0, y: 0 })}
      className="relative overflow-hidden bg-[linear-gradient(135deg,#F7FBF9_0%,#ECF7F1_55%,#E4F2EC_100%)] border-b border-[#DDE7E3]"
    >
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-28 right-[8%] w-[460px] h-[330px] rounded-full bg-[#00D27A]/10 blur-[90px]" />
        <div className="absolute -bottom-28 left-[12%] w-[380px] h-[260px] rounded-full bg-[#00C996]/8 blur-[90px]" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-7 sm:py-10 lg:py-12 relative z-10">
        <div className="grid lg:grid-cols-[1.15fr_.85fr] gap-7 lg:gap-10 items-center">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/80 border border-[#D6E8E0] text-[9px] sm:text-[11px] font-extrabold text-[#0B8F58] uppercase tracking-[0.14em] shadow-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-[#00D27A]" />
              TRACK IT. CATCH THE DROP. PAY LESS.
            </div>

            <h1 className="mt-4 text-[30px] min-[390px]:text-[34px] sm:text-5xl lg:text-[54px] font-black tracking-[-0.04em] text-[#102027] leading-[1.03]">
              Shop with the context to make a <span className="text-[#0B8F58]">better decision.</span>
            </h1>

            <p className="mt-4 text-[13px] sm:text-base text-[#52636B] max-w-xl leading-relaxed">
              Compare eligible retailer listings, understand available price history and check structured product details before leaving for the retailer.
            </p>

            <div className="mt-5 flex flex-col min-[390px]:flex-row gap-2.5">
              <a href={`/${country}/deals/all`} className="min-h-[46px] px-5 rounded-xl bg-[#0B8F58] hover:bg-[#08784B] text-white font-extrabold text-sm inline-flex items-center justify-center gap-2 shadow-sm">
                Explore deals <ArrowRight className="w-4 h-4" />
              </a>
              <a href={`/${country}/compare`} className="min-h-[46px] px-5 rounded-xl bg-white border border-[#CFE0DA] text-[#20343C] hover:border-[#9FCBB9] font-extrabold text-sm inline-flex items-center justify-center gap-2">
                <Scale className="w-4 h-4 text-[#0B8F58]" /> Compare products
              </a>
            </div>

            <div className="mt-5 flex flex-wrap items-center gap-2">
              {quickLinks.map(([label, href]) => (
                <a key={label} href={href} className="min-h-[34px] px-3 rounded-lg bg-white/80 border border-[#D8E6E0] text-[10px] sm:text-[11px] font-bold text-[#455A52] hover:text-[#08784B] hover:border-[#B6D7C9] inline-flex items-center">
                  {label}
                </a>
              ))}
            </div>
          </div>

          <div className="hidden lg:block relative min-h-[300px]">
            <div className="ctp-dark-panel absolute inset-0 rounded-[34px] border shadow-[0_24px_60px_rgba(20,48,38,.16)] overflow-hidden">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_20%,rgba(0,210,122,.15),transparent_32%)]" />
              <div className="relative p-6 h-full flex flex-col justify-between">
                <div>
                  <div className="text-[10px] uppercase tracking-[0.16em] font-extrabold text-[#67EFB8]">CatchThePrice shopping desk</div>
                  <div className="mt-2 text-2xl font-extrabold text-white leading-tight">Compare. Track. Decide.</div>
                  <p className="mt-2 text-xs text-[#AFC1BA] max-w-sm leading-relaxed">One place for prices, product context and retailer hand-off — without pretending unknown data is verified.</p>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  {[
                    { Icon: Smartphone, label: 'Phones', x: .45, y: .3 },
                    { Icon: Laptop, label: 'Laptops', x: -.35, y: .25 },
                    { Icon: Gamepad2, label: 'Gaming', x: .3, y: -.3 },
                    { Icon: Cpu, label: 'PC hardware', x: -.4, y: -.25 },
                  ].map(({ Icon, label, x, y }) => (
                    <div
                      key={label}
                      className="rounded-2xl bg-[#0F1C24] border border-[#223743] p-4 min-h-[92px] flex flex-col justify-between transition-transform duration-200"
                      style={{ transform: `translate3d(${pointer.x * x}px, ${pointer.y * y}px, 0)` }}
                    >
                      <Icon className="w-5 h-5 text-[#00D27A]" />
                      <div className="text-xs font-bold text-[#E7F1ED]">{label}</div>
                    </div>
                  ))}
                </div>

                <div className="flex items-center justify-between gap-3 text-[10px] text-[#8FA39B] border-t border-[#1A2B35] pt-4 mt-4">
                  <span className="flex items-center gap-1.5"><TrendingDown className="w-3.5 h-3.5 text-[#00D27A]" /> Genuine history when available</span>
                  <span className="flex items-center gap-1.5"><ShieldCheck className="w-3.5 h-3.5 text-[#00D27A]" /> Retailer checkout</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
