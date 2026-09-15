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
    <section id="categories" className="py-8 sm:py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-t border-[#DDE7E3]">
      <div className="flex items-end justify-between gap-4 mb-5">
        <div>
          <span className="text-[10px] sm:text-xs font-extrabold uppercase tracking-[0.16em] text-[#0B8F58]">
            Shop by category
          </span>
          <h2 className="text-xl sm:text-2xl font-extrabold text-[#102027] mt-1">Browse popular tech</h2>
        </div>

        <a
          href={`/${country}/deals/all`}
          className="text-xs font-extrabold text-[#08784B] hover:text-[#0B8F58] flex items-center gap-1 transition-colors shrink-0"
        >
          <span className="hidden min-[390px]:inline">All deals</span>
          <span className="min-[390px]:hidden">View all</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </a>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-2.5 sm:gap-3">
        {CATEGORIES.map((category) => {
          const IconComponent = iconMap[category.icon] || Smartphone;

          return (
            <a
              key={category.id}
              href={`/${country}/deals/${category.slug}`}
              className="group min-h-[128px] p-3.5 sm:p-4 rounded-2xl bg-white border border-[#DDE7E3] hover:border-[#B7D7C9] hover:shadow-[0_8px_24px_rgba(24,52,43,0.06)] transition-all flex flex-col items-center justify-center text-center touch-target"
            >
              <div className="w-11 h-11 rounded-xl bg-[#F2F8F5] border border-[#DDE7E3] group-hover:border-[#C8E5D8] flex items-center justify-center text-[#49625A] group-hover:text-[#0B8F58] transition-colors mb-2.5">
                <IconComponent className="w-5 h-5 stroke-[1.8]" />
              </div>

              <h3 className="font-extrabold text-[11px] sm:text-xs text-[#20343C] group-hover:text-[#08784B] transition-colors leading-tight">
                {category.name}
              </h3>
            </a>
          );
        })}
      </div>
    </section>
  );
}
