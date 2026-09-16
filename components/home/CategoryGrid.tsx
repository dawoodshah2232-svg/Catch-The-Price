'use client';

import React from 'react';
import { CATEGORIES } from '@/lib/data/categories';
import { useCountry } from '@/context/CountryContext';
import { Smartphone, Laptop, Gamepad2, Tv, Headphones, Watch, Cpu, ArrowRight } from 'lucide-react';

const iconMap: Record<string, React.ElementType> = { Smartphone, Laptop, Gamepad2, Tv, Headphones, Watch, Cpu };
const imageMap: Record<string, string> = {
  phones: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=320&h=220&fit=crop&q=80',
  laptops: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=320&h=220&fit=crop&q=80',
  gaming: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=320&h=220&fit=crop&q=80',
  tvs: 'https://images.unsplash.com/photo-1593784991095-a205069470b6?w=320&h=220&fit=crop&q=80',
  headphones: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=320&h=220&fit=crop&q=80',
  smartwatches: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=320&h=220&fit=crop&q=80',
  'pc-components': 'https://images.unsplash.com/photo-1591488320449-011701bb6704?w=320&h=220&fit=crop&q=80',
};

export function CategoryGrid() {
  const { country } = useCountry();
  return (
    <section id="categories" className="py-5 sm:py-6 max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
      <div className="flex items-center justify-between gap-4 mb-3">
        <h2 className="text-[18px] sm:text-[21px] font-black tracking-[-.02em] text-[#17242a]">Shop by category</h2>
        <a href={`/${country}/deals/all`} className="text-[11px] font-extrabold text-[#08784b] flex items-center gap-1">View all <ArrowRight className="w-3.5 h-3.5"/></a>
      </div>
      <div className="overflow-x-auto scrollbar-none -mx-3 px-3 sm:mx-0 sm:px-0">
        <div className="flex lg:grid lg:grid-cols-7 gap-2.5 min-w-max lg:min-w-0">
          {CATEGORIES.map(category => {
            const Icon = iconMap[category.icon] || Smartphone;
            const image = imageMap[category.slug];
            return <a key={category.id} href={`/${country}/deals/${category.slug}`} className="group w-[132px] sm:w-[150px] lg:w-auto shrink-0 rounded-[8px] bg-white border border-[#dfe4e2] overflow-hidden hover:border-[#a7cdbc] hover:shadow-sm transition-all">
              <div className="h-[84px] sm:h-[96px] bg-[#f4f6f5] overflow-hidden flex items-center justify-center">
                {image ? <img src={image} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform"/> : <Icon className="w-9 h-9 text-[#08784b]"/>}
              </div>
              <div className="px-2 py-2 text-center text-[10px] sm:text-[11px] font-extrabold text-[#26363c] group-hover:text-[#08784b] line-clamp-1">{category.name}</div>
            </a>;
          })}
        </div>
      </div>
    </section>
  );
}
