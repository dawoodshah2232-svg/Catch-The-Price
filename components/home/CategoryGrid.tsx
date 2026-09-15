'use client';

import React from 'react';
import { CATEGORIES } from '@/lib/data/categories';
import { useCountry } from '@/context/CountryContext';
import {
  Smartphone,
  Laptop,
  Gamepad2,
  Tv,
  Headphones,
  Watch,
  Cpu,
  ArrowRight,
} from 'lucide-react';

const iconMap: Record<string, React.ElementType> = {
  Smartphone,
  Laptop,
  Gamepad2,
  Tv,
  Headphones,
  Watch,
  Cpu,
};

export function CategoryGrid() {
  const { country } = useCountry();

  return (
    <section id="categories" className="py-5 sm:py-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex items-end justify-between gap-4 mb-3.5 sm:mb-4">
        <div>
          <span className="text-[9px] sm:text-[10px] font-extrabold uppercase tracking-[0.16em] text-[#0B8F58]">Shop by category</span>
          <h2 className="text-[18px] sm:text-xl font-extrabold text-[#102027] mt-0.5">Jump straight to what you need</h2>
        </div>

        <a
          href={`/${country}/deals/all`}
          className="text-[10px] sm:text-xs font-extrabold text-[#08784B] hover:text-[#0B8F58] flex items-center gap-1 transition-colors shrink-0"
        >
          <span>All deals</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </a>
      </div>

      <div className="-mx-4 px-4 sm:mx-0 sm:px-0 overflow-x-auto scrollbar-none snap-x-mandatory lg:overflow-visible">
        <div className="flex lg:grid lg:grid-cols-7 gap-2.5 sm:gap-3 min-w-max lg:min-w-0">
          {CATEGORIES.map((category) => {
            const IconComponent = iconMap[category.icon] || Smartphone;

            return (
              <a
                key={category.id}
                href={`/${country}/deals/${category.slug}`}
                className="snap-start-card group w-[84px] min-[390px]:w-[92px] sm:w-[106px] lg:w-auto min-h-[94px] sm:min-h-[112px] p-2.5 sm:p-3 rounded-2xl bg-white border border-[#DDE7E3] hover:border-[#B7D7C9] hover:shadow-[0_8px_24px_rgba(24,52,43,0.06)] transition-all flex flex-col items-center justify-center text-center touch-target shrink-0"
              >
                <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-[#F2F8F5] border border-[#DDE7E3] group-hover:border-[#C8E5D8] flex items-center justify-center text-[#49625A] group-hover:text-[#0B8F58] transition-colors mb-2">
                  <IconComponent className="w-4.5 h-4.5 sm:w-5 sm:h-5 stroke-[1.8]" />
                </div>

                <h3 className="font-extrabold text-[10px] sm:text-[11px] text-[#20343C] group-hover:text-[#08784B] transition-colors leading-tight line-clamp-2">
                  {category.name}
                </h3>
              </a>
            );
          })}
        </div>
      </div>
    </section>
  );
}
