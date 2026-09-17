'use client';
import React from 'react';
import { Product } from '@/lib/types';
import { useCountry } from '@/context/CountryContext';
import { ArrowRight } from 'lucide-react';
interface PopularBrandsSectionProps { products: Product[]; }
const brandMarks: Record<string, string> = {
  apple: 'text-black font-semibold tracking-[-.06em]', samsung: 'text-[#1428a0] tracking-[-.06em] italic',
  sony: 'text-black font-serif tracking-[-.08em]', lg: 'text-[#a50034] tracking-[-.07em]',
  asus: 'text-[#004a98] tracking-[-.08em] italic', lenovo: 'text-[#e2231a] tracking-[-.06em]',
  microsoft: 'text-[#595959] tracking-[-.05em]', intel: 'text-[#0071c5] tracking-[-.07em] italic',
  nvidia: 'text-[#76b900] tracking-[-.08em] italic', amd: 'text-[#ed1c24] tracking-[-.08em]',
  bose: 'text-black tracking-[-.05em]', xiaomi: 'text-[#ff6900] tracking-[-.07em]',
};
function brandMarkClass(brand: string) { return brandMarks[brand.toLowerCase()] || 'text-[#26343a] tracking-[-.04em]'; }
function topBrands(products: Product[]) { const counts=new Map<string,number>(); products.forEach(p=>{const b=p.brand?.trim(); if(b&&b.toLowerCase()!=='unknown brand') counts.set(b,(counts.get(b)||0)+1);}); return [...counts.entries()].sort((a,b)=>b[1]-a[1]||a[0].localeCompare(b[0])).slice(0,12); }
export function PopularBrandsSection({products}:PopularBrandsSectionProps){ const {country}=useCountry(); const brands=topBrands(products); if(!brands.length)return null; return <section className="py-7 bg-white border-y border-[#e1e5e3]"><div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8"><div className="flex items-center justify-between mb-4"><h2 className="text-[18px] sm:text-[21px] font-black tracking-[-.02em] text-[#17242a]">Popular brands</h2><a href={`/${country}/search`} className="text-[11px] font-extrabold text-[#08784b] inline-flex items-center gap-1">All brands<ArrowRight className="w-3.5 h-3.5"/></a></div><div className="flex gap-3 overflow-x-auto scrollbar-none pb-1">{brands.map(([brand])=><a key={brand} href={`/${country}/search?q=${encodeURIComponent(brand)}`} aria-label={`Shop ${brand}`} className="group shrink-0 w-[132px] sm:w-[148px] h-[76px] rounded-xl border border-[#e0e8e3] bg-[linear-gradient(145deg,#ffffff_0%,#f4f8f6_100%)] hover:bg-white hover:border-[#9bcdb5] hover:-translate-y-0.5 hover:shadow-[0_8px_16px_rgba(11,82,51,.1)] flex items-center justify-center px-4 transition-all"><span className={`text-[17px] sm:text-[19px] font-black text-center transition-transform group-hover:scale-105 ${brandMarkClass(brand)}`}>{brand}</span></a>)}</div></div></section>; }
