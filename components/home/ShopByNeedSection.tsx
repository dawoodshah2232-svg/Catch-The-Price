'use client';

import React from 'react';
import { useCountry } from '@/context/CountryContext';
import { Smartphone, Gamepad2, Laptop, Cpu, Tv, Headphones, ArrowRight } from 'lucide-react';

const panels = [
  {
    key: 'mobile',
    eyebrow: 'Upgrade smarter',
    title: 'Phones & everyday tech',
    text: 'Compare phones, headphones and wearables without jumping between retailer tabs.',
    icon: Smartphone,
    secondary: Headphones,
    href: 'phones',
    chips: ['Phones', 'Headphones', 'Smartwatches'],
    className: 'bg-[linear-gradient(135deg,#F4EBF7_0%,#F8F4FB_100%)] border-[#E4D8E9]',
  },
  {
    key: 'gaming',
    eyebrow: 'Build your setup',
    title: 'Gaming & PC hardware',
    text: 'Explore consoles, GPUs, CPUs and gaming gear with clearer product context.',
    icon: Gamepad2,
    secondary: Cpu,
    href: 'gaming',
    chips: ['Gaming', 'GPUs', 'CPUs'],
    className: 'bg-[linear-gradient(135deg,#ECF3FF_0%,#F5F8FF_100%)] border-[#D7E3F6]',
  },
  {
    key: 'work',
    eyebrow: 'Work, watch, create',
    title: 'Laptops & big screens',
    text: 'Compare laptops and TVs for work, entertainment and everything in between.',
    icon: Laptop,
    secondary: Tv,
    href: 'laptops',
    chips: ['Laptops', 'TVs', 'Displays'],
    className: 'bg-[linear-gradient(135deg,#FFF0DE_0%,#FFF8EF_100%)] border-[#F0DEC8]',
  },
] as const;

export function ShopByNeedSection() {
  const { country } = useCountry();

  return (
    <section className="py-2 sm:py-4 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-2.5 sm:gap-4">
        {panels.map((panel, index) => {
          const Icon = panel.icon;
          const Secondary = panel.secondary;
          const spanClass = index === 0 ? 'col-span-2 lg:col-span-1' : '';

          return (
            <a
              key={panel.key}
              href={`/${country}/deals/${panel.href}`}
              className={`${spanClass} ${panel.className} relative overflow-hidden rounded-[22px] sm:rounded-[26px] border p-4 sm:p-5 min-h-[150px] sm:min-h-[180px] group transition-transform duration-200 hover:-translate-y-0.5`}
            >
              <div className="absolute -right-5 -bottom-8 w-28 h-28 sm:w-36 sm:h-36 rounded-full bg-white/45" />
              <div className="absolute right-3 bottom-3 flex items-end gap-1.5 opacity-90 pointer-events-none">
                <Icon className="w-10 h-10 sm:w-14 sm:h-14 text-[#173028] stroke-[1.25]" />
                <Secondary className="w-7 h-7 sm:w-9 sm:h-9 text-[#0B8F58] stroke-[1.5]" />
              </div>

              <div className="relative z-10 max-w-[75%] sm:max-w-[68%]">
                <div className="text-[9px] sm:text-[10px] font-extrabold uppercase tracking-[0.14em] text-[#0B8F58]">{panel.eyebrow}</div>
                <h3 className="mt-1.5 text-[15px] sm:text-xl font-extrabold leading-tight text-[#102027]">{panel.title}</h3>
                <p className="hidden min-[390px]:block mt-2 text-[10px] sm:text-xs text-[#52636B] leading-relaxed">{panel.text}</p>
              </div>

              <div className="absolute left-4 sm:left-5 bottom-3.5 sm:bottom-4 flex items-center gap-1.5 min-w-0 max-w-[72%]">
                <span className="text-[9px] sm:text-[10px] font-extrabold text-[#20343C] truncate">{panel.chips.join(' · ')}</span>
                <ArrowRight className="w-3.5 h-3.5 text-[#0B8F58] shrink-0 transition-transform group-hover:translate-x-0.5" />
              </div>
            </a>
          );
        })}
      </div>
    </section>
  );
}
