'use client';

import React, { ReactNode, useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export function ProductCarousel({ children }: { children: ReactNode }) {
  const railRef = useRef<HTMLDivElement>(null);
  const scroll = (direction: -1 | 1) => railRef.current?.scrollBy({ left: direction * Math.max(260, railRef.current.clientWidth * 0.8), behavior: 'smooth' });

  return <div className="group/carousel relative">
    <div ref={railRef} className="-mx-3 flex snap-x snap-mandatory gap-2.5 overflow-x-auto overscroll-x-contain px-3 pb-2 scrollbar-none sm:mx-0 sm:gap-3 sm:px-0">{children}</div>
    <button type="button" onClick={() => scroll(-1)} aria-label="Previous products" className="absolute left-1 top-1/2 hidden h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border border-[#dce8e2] bg-white/95 text-[#216148] shadow-[0_4px_12px_rgba(11,61,39,.12)] transition hover:bg-[#087f4e] hover:text-white md:flex md:opacity-0 md:group-hover/carousel:opacity-100"><ChevronLeft className="h-4 w-4" /></button>
    <button type="button" onClick={() => scroll(1)} aria-label="Next products" className="absolute right-1 top-1/2 hidden h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border border-[#dce8e2] bg-white/95 text-[#216148] shadow-[0_4px_12px_rgba(11,61,39,.12)] transition hover:bg-[#087f4e] hover:text-white md:flex md:opacity-0 md:group-hover/carousel:opacity-100"><ChevronRight className="h-4 w-4" /></button>
  </div>;
}
