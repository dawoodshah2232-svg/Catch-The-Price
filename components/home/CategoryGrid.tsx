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
  ArrowRight,
} from 'lucide-react';

const iconMap: Record<string, React.ElementType> = {
  Smartphone,
  Laptop,
  Gamepad2,
  Tv,
  Headphones,
  Watch,
};

export function CategoryGrid() {
  const { country } = useCountry();

  return (
    <section id="categories" className="py-8 sm:py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-t border-[#E1E9E6]">
      <div className="flex items-end justify-between gap-3 mb-5">
        <div>
          <span className="text-[10px] sm:text-xs font-extrabold uppercase tracking-[0.12em] text-[#08784B]">
            Browse faster
          </span>
          <h2 className="text-xl sm:text-2xl font-extrabold text-[#102027] mt-1">Shop by category</h2>
        </div>

        <a
          href={`/${country}/deals/all`}
          className="text-[11px] sm:text-xs font-extrabold text-[#08784B] hover:text-[#045E3A] flex items-center gap-1 transition-colors"
        >
          <span>View all</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </a>
      </div>

      <div className="grid grid-cols-3 sm:grid-cols-3 lg:grid-cols-6 gap-2.5 sm:gap-4">
        {CATEGORIES.map((category) => {
          const IconComponent = iconMap[category.icon] || Smartphone;

          return (
            <a
              key={category.id}
              href={`/${country}/deals/${category.slug}`}
              className="group px-2 py-3 sm:p-5 rounded-2xl bg-white border border-[#DDE7E3] hover:border-[#BFD2CA] hover:shadow-[0_8px_24px_rgba(25,55,45,0.07)] transition-all flex flex-col items-center text-center touch-target min-w-0"
            >
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-[#F0F7F4] border border-[#DCEAE5] group-hover:bg-[#E7F5EF] flex items-center justify-center text-[#37665A] group-hover:text-[#08784B] transition-colors mb-2.5 sm:mb-3">
                <IconComponent className="w-5 h-5 stroke-[1.8]" />
              </div>

              <h3 className="font-bold text-[10px] min-[390px]:text-[11px] sm:text-sm text-[#102027] group-hover:text-[#08784B] transition-colors leading-tight line-clamp-2">
                {category.name}
              </h3>

              {category.productCount ? (
                <span className="hidden sm:block text-[10px] font-semibold text-[#7A8B92] mt-1">
                  {category.productCount} models
                </span>
              ) : null}
            </a>
          );
        })}
      </div>
    </section>
  );
}
