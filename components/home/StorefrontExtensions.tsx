'use client';

import React from 'react';
import { ArrowRight, BadgeCheck, BellRing, Flame, Grid2X2, Newspaper, ShieldCheck, Sparkles, Tag } from 'lucide-react';
import { Product } from '@/lib/types';
import { ProductCard } from '@/components/search/ProductCard';
import { useCountry } from '@/context/CountryContext';
import { ProductCarousel } from './ProductCarousel';

type ShelfProps = { title: string; subtitle: string; products: Product[]; icon: React.ElementType; tone: string };

function ProductShelf({ title, subtitle, products, icon: Icon, tone }: ShelfProps) {
  const { country } = useCountry();
  if (!products.length) return null;
  return <section className="max-w-[1600px] mx-auto px-3 sm:px-6 lg:px-8 py-8 sm:py-10">
    <div className="mb-4 flex items-end justify-between gap-4">
      <div><h2 className="flex items-center gap-2 text-[20px] sm:text-[22px] font-black tracking-[-.04em] text-[#142228]"><Icon className={`h-5 w-5 ${tone}`} />{title}</h2><p className="mt-0.5 text-[11px] font-medium text-[#718087]">{subtitle}</p></div>
      <a href={`/${country}/search`} className="inline-flex items-center gap-1 text-[11px] font-extrabold text-[#08784b] hover:text-[#045e3a]">View more <ArrowRight className="h-3.5 w-3.5" /></a>
    </div>
    <ProductCarousel>{products.slice(0, 6).map(product => <div key={product.id} className="w-[184px] shrink-0 snap-start sm:w-[202px]"><ProductCard product={product} /></div>)}</ProductCarousel>
  </section>;
}

const lifestyle = [
  { title: 'Gaming Setup', text: 'Level up your gaming experience', cta: 'Shop gaming', image: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=1200&q=88' },
  { title: 'Work From Home', text: 'Tools for a productive you', cta: 'Shop work essentials', image: 'https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1200&q=88' },
  { title: 'Smart Home', text: 'A smarter, safer home', cta: 'Shop smart home', image: 'https://images.unsplash.com/photo-1558002038-1055907df827?auto=format&fit=crop&w=1200&q=88' },
  { title: 'Audio & Music', text: 'Feel the difference', cta: 'Shop audio', image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=1200&q=88' },
];

const collections = [
  { title: 'Best Selling Laptops', text: 'Powerful. Portable. Priced right.', image: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=1200&q=88' },
  { title: 'Top Camera Deals', text: 'Capture more for less.', image: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=1200&q=88' },
  { title: 'Must-Have Accessories', text: 'Small things. Big difference.', image: 'https://images.unsplash.com/photo-1527814050087-3793815479db?auto=format&fit=crop&w=1200&q=88' },
  { title: 'Home Essentials', text: 'Everything for a smarter home.', image: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=1200&q=88' },
];

const guides = [
  { title: 'Best Smartphones to Buy', text: 'Our expert picks for every budget.', image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=1200&q=88' },
  { title: 'Laptop Buying Guide', text: 'Find the perfect laptop for your needs.', image: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=1200&q=88' },
  { title: 'How to Track Price Drops', text: 'Tips to never miss a deal again.', image: 'https://images.unsplash.com/photo-1559526324-593bc073d938?auto=format&fit=crop&w=1200&q=88' },
];

export function StorefrontExtensions({ products, trending, dropped }: { products: Product[]; trending: Product[]; dropped: Product[] }) {
  const { country } = useCountry();
  return <>
    <ProductShelf title="Trending This Week" subtitle="Popular products gaining attention right now." products={trending} icon={Flame} tone="text-[#ff8b16]" />

    <section className="max-w-[1600px] mx-auto px-3 sm:px-6 lg:px-8 py-10 sm:py-12">
      <div className="mb-3 flex items-end justify-between"><div><h2 className="flex items-center gap-2 text-[20px] sm:text-[22px] font-black tracking-[-.04em] text-[#142228]"><Grid2X2 className="h-5 w-5 text-[#1b536e]" />Shop by Lifestyle</h2><p className="mt-0.5 text-[11px] text-[#718087]">Find products for every part of your world.</p></div><a href={`/${country}/deals/all`} className="inline-flex items-center gap-1 text-[11px] font-extrabold text-[#08784b]">View all <ArrowRight className="h-3.5 w-3.5" /></a></div>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">{lifestyle.map(item => <a key={item.title} href={`/${country}/deals/all`} className="group relative h-[174px] overflow-hidden rounded-lg bg-[#12221e] shadow-[0_7px_18px_rgba(7,35,25,.14)]"><img src={item.image} alt="" className="absolute inset-0 h-full w-full object-cover brightness-[.72] transition-transform duration-500 group-hover:scale-105" /><div className="absolute inset-0 bg-gradient-to-t from-[#061b13]/88 via-[#061b13]/16 to-transparent" /><div className="relative flex h-full flex-col justify-end p-4 text-white"><h3 className="text-[17px] font-black tracking-[-.03em]">{item.title}</h3><p className="mt-0.5 text-[10px] text-white/75">{item.text}</p><span className="mt-3 inline-flex w-fit items-center gap-1 rounded bg-[#0c9b59] px-2.5 py-1.5 text-[9px] font-extrabold uppercase tracking-wide">{item.cta}<ArrowRight className="h-3 w-3" /></span></div></a>)}</div>
    </section>

    <section className="max-w-[1600px] mx-auto px-3 sm:px-6 lg:px-8 pb-8"><div className="grid gap-3 rounded-xl border border-[#e6ede9] bg-white p-3 shadow-[0_5px_16px_rgba(15,53,37,.05)] sm:grid-cols-2 lg:grid-cols-4">{[{ Icon: BellRing, title: 'Price Tracking', text: 'Get alerts when prices drop' }, { Icon: Grid2X2, title: 'Compare Easily', text: 'Find the best deals' }, { Icon: BadgeCheck, title: 'Trusted Retailers', text: 'Amazon, Noon, Sharaf DG & more' }, { Icon: ShieldCheck, title: 'Save Time & Money', text: 'Smarter shopping, every day' }].map(({ Icon, title, text }) => <div key={title} className="flex items-center gap-3 rounded-lg px-3 py-2.5"><span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#e2f8eb] text-[#078451]"><Icon className="h-5 w-5" /></span><span><b className="block text-[11px] text-[#1c2c30]">{title}</b><small className="block pt-0.5 text-[9px] text-[#78868a]">{text}</small></span></div>)}</div></section>

    <ProductShelf title="Recently Price Dropped" subtitle="These products just dropped in price." products={dropped} icon={Tag} tone="text-[#12a968]" />

    <section className="max-w-[1600px] mx-auto px-3 sm:px-6 lg:px-8 py-10 sm:py-12"><div className="mb-3 flex items-end justify-between"><div><h2 className="flex items-center gap-2 text-[20px] sm:text-[22px] font-black tracking-[-.04em] text-[#142228]"><Sparkles className="h-5 w-5 text-[#ff9c1a]" />Featured Collections</h2><p className="mt-0.5 text-[11px] text-[#718087]">Curated picks for what you need most.</p></div><a href={`/${country}/deals/all`} className="inline-flex items-center gap-1 text-[11px] font-extrabold text-[#08784b]">View more <ArrowRight className="h-3.5 w-3.5" /></a></div><div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">{collections.map(item => <a key={item.title} href={`/${country}/deals/all`} className="group overflow-hidden rounded-lg border border-[#e3ebe7] bg-white shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-[0_8px_16px_rgba(13,57,39,.1)]"><img src={item.image} alt="" className="h-[112px] w-full object-cover transition-transform duration-500 group-hover:scale-105" /><div className="p-3"><h3 className="text-[12px] font-black text-[#17262a]">{item.title}</h3><p className="mt-1 text-[10px] text-[#6f7e83]">{item.text}</p><span className="mt-2 inline-flex items-center gap-1 text-[10px] font-extrabold text-[#078451]">Shop collection <ArrowRight className="h-3 w-3" /></span></div></a>)}</div></section>

    <section className="max-w-[1600px] mx-auto px-3 sm:px-6 lg:px-8 py-10 sm:py-12"><div className="mb-3 flex items-end justify-between"><div><h2 className="flex items-center gap-2 text-[20px] sm:text-[22px] font-black tracking-[-.04em] text-[#142228]"><Newspaper className="h-5 w-5 text-[#253f49]" />Latest Tech News & Buying Guides</h2><p className="mt-0.5 text-[11px] text-[#718087]">Stay informed. Shop smarter.</p></div><a href={`/${country}/blog`} className="inline-flex items-center gap-1 text-[11px] font-extrabold text-[#08784b]">View all articles <ArrowRight className="h-3.5 w-3.5" /></a></div><div className="grid gap-3 md:grid-cols-3">{guides.map(item => <a key={item.title} href={`/${country}/blog`} className="group overflow-hidden rounded-lg border border-[#e3ebe7] bg-white shadow-sm transition-all hover:shadow-[0_8px_16px_rgba(13,57,39,.1)]"><img src={item.image} alt="" className="h-[150px] w-full object-cover transition-transform duration-500 group-hover:scale-105" /><div className="p-3"><h3 className="text-[13px] font-black text-[#17262a]">{item.title}</h3><p className="mt-1 text-[10px] text-[#6f7e83]">{item.text}</p><span className="mt-2 inline-flex items-center gap-1 text-[10px] font-extrabold text-[#078451]">Read more <ArrowRight className="h-3 w-3" /></span></div></a>)}</div></section>

    <ProductShelf title="More Great Deals" subtitle="Handpicked products you might like." products={products} icon={Sparkles} tone="text-[#15a76a]" />
  </>;
}
