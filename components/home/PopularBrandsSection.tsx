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
const brandLogos: Record<string, string> = {
  apple: 'apple/000000', samsung: 'samsung/1428A0', sony: 'sony/000000', lg: 'lg/A50034',
  asus: 'asus/000000', lenovo: 'lenovo/E2231A', microsoft: 'microsoft/737373', intel: 'intel/0071C5',
  nvidia: 'nvidia/76B900', amd: 'amd/ED1C24', bose: 'bose/000000', xiaomi: 'xiaomi/FF6900',
};
function brandMarkClass(brand: string) { return brandMarks[brand.toLowerCase()] || 'text-[#26343a] tracking-[-.04em]'; }
function topBrands(products: Product[]) { const counts=new Map<string,number>(); products.forEach(p=>{const b=p.brand?.trim(); if(b&&b.toLowerCase()!=='unknown brand') counts.set(b,(counts.get(b)||0)+1);}); return [...counts.entries()].sort((a,b)=>b[1]-a[1]||a[0].localeCompare(b[0])).slice(0,12); }
export function PopularBrandsSection({products}:PopularBrandsSectionProps){ const {country}=useCountry(); const brands=topBrands(products); if(!brands.length)return null; return <section className="py-5 bg-white border-y border-[#e9edeb]"><div className="max-w-[1600px] mx-auto px-3 sm:px-6 lg:px-8"><div className="flex items-center justify-between mb-3"><h2 className="text-[18px] sm:text-[20px] font-black tracking-[-.025em] text-[#17242a]">Popular brands</h2><a href={`/${country}/search`} className="text-[11px] font-extrabold text-[#08784b] inline-flex items-center gap-1">View all brands<ArrowRight className="w-3.5 h-3.5"/></a></div><div className="flex gap-2 overflow-x-auto scrollbar-none pb-1">{brands.map(([brand])=>{const logo=brandLogos[brand.toLowerCase()]; return <a key={brand} href={`/${country}/search?q=${encodeURIComponent(brand)}`} aria-label={`Shop ${brand}`} className="group shrink-0 w-[108px] sm:w-[116px] h-[60px] rounded-md border border-[#e5e9e7] bg-[#fbfcfc] hover:border-[#c4d8ce] hover:bg-white hover:shadow-sm flex items-center justify-center px-3 transition-all">{logo ? <img src={`https://cdn.simpleicons.org/${logo}`} alt={brand} className="max-h-7 max-w-[76px] object-contain transition-transform duration-200 group-hover:scale-105" /> : <span className={`text-[15px] sm:text-[16px] font-black text-center transition-transform group-hover:scale-105 ${brandMarkClass(brand)}`}>{brand}</span>}</a>})}</div></div></section>; }
