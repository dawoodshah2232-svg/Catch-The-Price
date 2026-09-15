'use client';

import React from 'react';
import { CATEGORIES } from '@/lib/data/categories';
import { useCountry } from '@/context/CountryContext';
import { Smartphone, Laptop, Gamepad2, Tv, Headphones, Watch, Cpu, ArrowRight } from 'lucide-react';

const iconMap: Record<string, React.ElementType> = { Smartphone, Laptop, Gamepad2, Tv, Headphones, Watch, Cpu };

const imageMap: Record<string, string> = {
  phones: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=320&h=320&fit=crop&q=80',
  laptops: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=320&h=320&fit=crop&q=80',
  gaming: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=320&h=320&fit=crop&q=80',
  tvs: 'https://images.unsplash.com/photo-1593784991095-a205069470b6?w=320&h=320&fit=crop&q=80',
  headphones: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=320&h=320&fit=crop&q=80',
  smartwatches: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=320&h=320&fit=crop&q=80',
  'pc-components': 'https://images.unsplash.com/photo-1591488320449-011701bb6704?w=320&h=320&fit=crop&q=80',
};

export function CategoryGrid() {
  const { country } = useCountry();

  return (
    <section id="categories" className="py-6 sm:py-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex items-end justify-between gap-4 mb-4 sm:mb-5">
        <div>
          <span className="text-[9px] sm:text-[10px] font-extrabold uppercase tracking-[0.16em] text-[#0B8F58]">Shop by category</span>
          <h2 className="text-[19px] sm:text-2xl font-extrabold text-[#102027] mt-1">Find what you are looking for</h2>
        </div>
        <a href={`/${country}/deals/all`} className="text-[10px] sm:text-xs font-extrabold text-[#08784B] hover:text-[#0B8F58] flex items-center gap-1 shrink-0">
          All categories <ArrowRight className="w-3.5 h-3.5" />
        </a>
      </div>

      <div className="-mx-4 px-4 sm:mx-0 sm:px-0 overflow-x-auto scrollbar-none snap-x-mandatory lg:overflow-visible">
        <div className="flex lg:grid lg:grid-cols-7 gap-3.5 sm:gap-4 min-w-max lg:min-w-0">
          {CATEGORIES.map((category) => {
            const IconComponent = iconMap[category.icon] || Smartphone;
            const image = imageMap[category.slug];
            return (
              <a key={category.id} href={`/${country}/deals/${category.slug}`} className="snap-start-card group w-[92px] min-[390px]:w-[102px] sm:w-[120px] lg:w-auto flex flex-col items-center text-center shrink-0">
                <div className="w-[78px] h-[78px] min-[390px]:w-[86px] min-[390px]:h-[86px] sm:w-[100px] sm:h-[100px] lg:w-[112px] lg:h-[112px] rounded-full bg-white border border-[#DDE7E3] shadow-[0_6px_18px_rgba(24,52,43,.06)] overflow-hidden flex items-center justify-center group-hover:border-[#9FCBB9] group-hover:shadow-[0_10px_26px_rgba(24,52,43,.10)] transition-all">
                  {image ? (
                    <img src={image} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                  ) : (
                    <IconComponent className="w-8 h-8 text-[#0B8F58]" />
                  )}
                </div>
                <h3 className="mt-2.5 font-extrabold text-[10px] sm:text-[12px] text-[#20343C] group-hover:text-[#08784B] leading-tight line-clamp-2">{category.name}</h3>
              </a>
            );
          })}
        </div>
      </div>
    </section>
  );
}
