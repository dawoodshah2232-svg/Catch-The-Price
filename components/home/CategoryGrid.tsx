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
    <section id="categories" className="py-8 sm:py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-t border-[#162633]">
      <div className="flex items-end justify-between mb-5">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-[#00D27A]">
            Core Catalogs
          </span>
          <h2 className="text-xl sm:text-2xl font-bold text-[#F8FAFC] mt-1">Browse Categories</h2>
        </div>

        <a
          href={`/${country}/deals/all`}
          className="text-xs font-bold text-[#00D27A] hover:text-[#00E6A2] flex items-center gap-1 transition-colors"
        >
          <span>All Categories</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </a>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
        {CATEGORIES.map((category) => {
          const IconComponent = iconMap[category.icon] || Smartphone;

          return (
            <a
              key={category.id}
              href={`/${country}/deals/${category.slug}`}
              className="group p-4 sm:p-5 rounded-2xl bg-[#091217] border border-[#162633] hover:border-[#00D27A]/50 hover:bg-[#0f1c24] transition-all flex flex-col items-center text-center touch-target"
            >
              <div className="w-12 h-12 rounded-xl bg-[#071015] border border-[#162633] group-hover:border-[#00D27A]/40 flex items-center justify-center text-[#CBD5E1] group-hover:text-[#00D27A] transition-colors mb-3">
                <IconComponent className="w-5 h-5 stroke-[1.75]" />
              </div>

              <h3 className="font-bold text-xs sm:text-sm text-[#F8FAFC] group-hover:text-[#00E6A2] transition-colors">
                {category.name}
              </h3>

              <span className="text-[10px] font-semibold text-[#94A3B8] mt-1">
                {category.productCount} models
              </span>
            </a>
          );
        })}
      </div>
    </section>
  );
}
