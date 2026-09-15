'use client';

import React from 'react';
import { useCountry } from '@/context/CountryContext';
import {
  Smartphone,
  Watch,
  Headphones,
  Laptop,
  Cpu,
  Gamepad2,
  Tv,
  Scale,
  TrendingDown,
  Bookmark,
  BookOpen,
  ArrowRight,
} from 'lucide-react';

type Tile = {
  label: string;
  href: (country: string) => string;
  Icon: React.ElementType;
};

type HubCard = {
  title: string;
  subtitle: string;
  cta: string;
  ctaHref: (country: string) => string;
  tiles: Tile[];
};

const cards: HubCard[] = [
  {
    title: 'Phones & wearables',
    subtitle: 'Start with the products people compare most.',
    cta: 'Browse phones',
    ctaHref: (country) => `/${country}/deals/phones`,
    tiles: [
      { label: 'Flagship phones', href: (country) => `/${country}/search?q=flagship%20phone`, Icon: Smartphone },
      { label: 'Gaming phones', href: (country) => `/${country}/search?q=gaming%20phone`, Icon: Gamepad2 },
      { label: 'Smartwatches', href: (country) => `/${country}/deals/smartwatches`, Icon: Watch },
      { label: 'Headphones', href: (country) => `/${country}/deals/headphones`, Icon: Headphones },
    ],
  },
  {
    title: 'Gaming & PC',
    subtitle: 'Compare complete setups without opening ten tabs.',
    cta: 'Explore gaming',
    ctaHref: (country) => `/${country}/deals/gaming`,
    tiles: [
      { label: 'Gaming laptops', href: (country) => `/${country}/search?q=gaming%20laptop`, Icon: Laptop },
      { label: 'Graphics cards', href: (country) => `/${country}/search?q=graphics%20card`, Icon: Cpu },
      { label: 'Processors', href: (country) => `/${country}/search?q=processor`, Icon: Cpu },
      { label: 'Consoles', href: (country) => `/${country}/search?q=console`, Icon: Gamepad2 },
    ],
  },
  {
    title: 'Home entertainment',
    subtitle: 'Find the right screen, sound and gaming gear.',
    cta: 'Browse TVs',
    ctaHref: (country) => `/${country}/deals/tvs`,
    tiles: [
      { label: 'OLED & 4K TVs', href: (country) => `/${country}/search?q=OLED%20TV`, Icon: Tv },
      { label: 'Headphones', href: (country) => `/${country}/deals/headphones`, Icon: Headphones },
      { label: 'Gaming', href: (country) => `/${country}/deals/gaming`, Icon: Gamepad2 },
      { label: 'Laptops', href: (country) => `/${country}/deals/laptops`, Icon: Laptop },
    ],
  },
  {
    title: 'Shop smarter',
    subtitle: 'Jump straight into the tools that help you decide.',
    cta: 'See all deals',
    ctaHref: (country) => `/${country}/deals/all`,
    tiles: [
      { label: 'Compare products', href: (country) => `/${country}/compare`, Icon: Scale },
      { label: 'Price drops', href: (country) => `/${country}/price-drops/all`, Icon: TrendingDown },
      { label: 'Saved products', href: (country) => `/${country}/account?tab=saved`, Icon: Bookmark },
      { label: 'Buying guides', href: (country) => `/${country}/blog`, Icon: BookOpen },
    ],
  },
];

export function CommerceHubSection() {
  const { country } = useCountry();

  return (
    <section className="relative z-10 -mt-3 sm:-mt-7 pb-3 sm:pb-5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3.5 sm:gap-4">
          {cards.map((card) => (
            <article
              key={card.title}
              className="rounded-[22px] bg-white border border-[#DDE7E3] shadow-[0_10px_30px_rgba(28,54,46,0.07)] p-4 sm:p-5 min-w-0"
            >
              <div className="min-h-[58px]">
                <h2 className="text-base sm:text-lg font-extrabold text-[#102027] tracking-[-0.02em]">{card.title}</h2>
                <p className="mt-1 text-[11px] sm:text-xs text-[#6B7C75] leading-relaxed">{card.subtitle}</p>
              </div>

              <div className="grid grid-cols-2 gap-2.5 mt-4">
                {card.tiles.map(({ label, href, Icon }) => (
                  <a
                    key={label}
                    href={href(country)}
                    className="group min-h-[94px] rounded-2xl bg-[#F6F9F8] border border-[#E3ECE8] hover:border-[#B9D8CB] hover:bg-[#F0F8F4] transition-colors p-3 flex flex-col justify-between"
                  >
                    <div className="w-8 h-8 rounded-xl bg-white border border-[#DDE7E3] text-[#0B8F58] flex items-center justify-center shadow-sm">
                      <Icon className="w-4 h-4" />
                    </div>
                    <span className="text-[11px] font-extrabold text-[#2B4139] group-hover:text-[#08784B] leading-tight">{label}</span>
                  </a>
                ))}
              </div>

              <a
                href={card.ctaHref(country)}
                className="mt-4 min-h-[40px] inline-flex items-center gap-1.5 text-xs font-extrabold text-[#08784B] hover:text-[#045E3A]"
              >
                {card.cta} <ArrowRight className="w-3.5 h-3.5" />
              </a>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
