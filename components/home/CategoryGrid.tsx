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
    <section id="categories" className="py-10 sm:py-14 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex items-end justify-between mb-6">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
            Explore Electronics
          </span>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-100 mt-1">Browse Categories</h2>
        </div>

        <a
          href={`/${country}/deals/all`}
          className="text-xs font-semibold text-emerald-400 hover:text-emerald-300 flex items-center gap-1"
        >
          <span>View All Deals</span>
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
              className="group p-4 rounded-2xl bg-ctp-surface border border-ctp hover:border-emerald-500/50 hover:bg-ctp-surface-elevated transition-all flex flex-col items-center text-center touch-target"
            >
              <div className="w-12 h-12 rounded-xl bg-slate-900/90 border border-ctp group-hover:border-emerald-500/40 flex items-center justify-center text-slate-300 group-hover:text-emerald-400 transition-colors mb-3">
                <IconComponent className="w-6 h-6" />
              </div>

              <h3 className="font-bold text-xs sm:text-sm text-slate-100 group-hover:text-emerald-300 transition-colors">
                {category.name}
              </h3>

              <span className="text-[11px] text-slate-400 mt-1">
                {category.productCount} tracked
              </span>
            </a>
          );
        })}
      </div>
    </section>
  );
}
