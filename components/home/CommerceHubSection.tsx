'use client';

import React from 'react';
import { useCountry } from '@/context/CountryContext';
import { ArrowRight, Flame, TrendingDown, Scale, BadgePercent, ChartNoAxesCombined, SplitSquareHorizontal } from 'lucide-react';

export function CommerceHubSection() {
  const { country } = useCountry();

  const cards = [
    {
      title: "Today's Best Deals",
      text: 'See the strongest current retailer listings in one place.',
      href: `/${country}/deals/all`,
      cta: 'Explore deals',
      Icon: Flame,
      secondaryIcon: BadgePercent,
      className: 'bg-[linear-gradient(135deg,#EAF8F1_0%,#DDF4E9_100%)] border-[#CBE6D9]',
      iconClass: 'bg-white text-[#0B8F58] border-[#CBE6D9]',
      accent: 'text-[#08784B]',
    },
    {
      title: 'Biggest Price Drops',
      text: 'Spot real drops only when stored history proves the change.',
      href: `/${country}/price-drops/all`,
      cta: 'View price drops',
      Icon: TrendingDown,
      secondaryIcon: ChartNoAxesCombined,
      className: 'bg-[linear-gradient(135deg,#0C2930_0%,#0A1920_100%)] border-[#153943] text-white',
      iconClass: 'bg-white/10 text-[#67EFB8] border-white/10',
      accent: 'text-[#67EFB8]',
    },
    {
      title: 'Compare Products',
      text: 'Put exact products side by side before you choose.',
      href: `/${country}/compare`,
      cta: 'Start comparing',
      Icon: Scale,
      secondaryIcon: SplitSquareHorizontal,
      className: 'bg-[linear-gradient(135deg,#EEF3FF_0%,#E6ECFA_100%)] border-[#D3DDF2]',
      iconClass: 'bg-white text-[#465C93] border-[#D3DDF2]',
      accent: 'text-[#465C93]',
    },
  ];

  return (
    <section className="pb-3 sm:pb-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 sm:gap-4">
          {cards.map(({ title, text, href, cta, Icon, secondaryIcon: SecondaryIcon, className, iconClass, accent }) => (
            <a key={title} href={href} className={`group rounded-[22px] sm:rounded-[24px] border p-4 sm:p-5 min-h-[164px] overflow-hidden relative shadow-[0_8px_24px_rgba(22,49,41,.05)] ${className}`}>
              <div className="absolute -right-5 -bottom-7 opacity-10 group-hover:opacity-15 transition-opacity">
                <SecondaryIcon className="w-28 h-28 sm:w-32 sm:h-32" />
              </div>
              <div className="relative h-full flex flex-col justify-between">
                <div>
                  <div className={`w-10 h-10 rounded-2xl border flex items-center justify-center ${iconClass}`}><Icon className="w-5 h-5" /></div>
                  <h3 className="mt-4 text-[18px] sm:text-xl font-extrabold tracking-[-0.02em]">{title}</h3>
                  <p className="mt-1.5 text-[11px] sm:text-xs opacity-70 max-w-[90%] leading-relaxed">{text}</p>
                </div>
                <div className={`mt-4 inline-flex items-center gap-1.5 text-[11px] sm:text-xs font-extrabold ${accent}`}>{cta}<ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" /></div>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
