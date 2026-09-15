'use client';

import React, { useMemo, useState } from 'react';
import { PricePoint, PriceStats } from '@/lib/types';
import { useCountry } from '@/context/CountryContext';
import { History } from 'lucide-react';

interface PriceHistoryChartProps {
  history: PricePoint[];
  stats: PriceStats;
  productTitle: string;
}

type Period = '7D' | '30D' | '90D' | 'ALL';

function pointDate(value: string): number {
  const timestamp = new Date(value).getTime();
  return Number.isFinite(timestamp) ? timestamp : 0;
}

export function PriceHistoryChart({ history, stats }: PriceHistoryChartProps) {
  const { formatLocalPrice } = useCountry();
  const [period, setPeriod] = useState<Period>('90D');
  const [hoveredPoint, setHoveredPoint] = useState<PricePoint | null>(null);

  const orderedHistory = useMemo(
    () => [...(history || [])].filter((point) => point.price > 0).sort((a, b) => pointDate(a.date) - pointDate(b.date)),
    [history]
  );

  const filteredPoints = useMemo(() => {
    if (orderedHistory.length === 0 || period === 'ALL') return orderedHistory;
    const days = period === '7D' ? 7 : period === '30D' ? 30 : 90;
    const cutoff = Date.now() - days * 24 * 60 * 60 * 1000;
    const filtered = orderedHistory.filter((point) => pointDate(point.date) >= cutoff);
    return filtered.length >= 2 ? filtered : orderedHistory;
  }, [orderedHistory, period]);

  if (filteredPoints.length < 2) return null;

  const prices = filteredPoints.map((point) => point.price);
  const minPrice = Math.min(...prices);
  const maxPrice = Math.max(...prices);
  const paddingY = (maxPrice - minPrice) * 0.2 || Math.max(minPrice * 0.03, 1);
  const domainMin = Math.max(0, minPrice - paddingY);
  const domainMax = maxPrice + paddingY;

  const width = 640;
  const height = 240;
  const padX = 45;
  const padY = 25;

  const points = filteredPoints.map((point, index) => {
    const x = padX + (index / (filteredPoints.length - 1 || 1)) * (width - padX * 2);
    const y =
      height - padY - ((point.price - domainMin) / (domainMax - domainMin || 1)) * (height - padY * 2);
    return { x, y, point };
  });

  const pathD = points.reduce(
    (acc, current, index) => (index === 0 ? `M ${current.x} ${current.y}` : `${acc} L ${current.x} ${current.y}`),
    ''
  );
  const areaD = `${pathD} L ${points[points.length - 1].x} ${height - padY} L ${points[0].x} ${height - padY} Z`;

  return (
    <section className="rounded-[24px] bg-white border border-[#DDE7E3] p-4 sm:p-6 space-y-5 shadow-[0_10px_30px_rgba(25,55,45,0.05)]">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#EDF2F0]">
        <div>
          <h3 className="font-extrabold text-base sm:text-lg text-[#102027] flex items-center gap-2">
            <History className="w-4 h-4 text-[#08784B]" />
            <span>Price history</span>
          </h3>
          <p className="text-[11px] sm:text-xs text-[#73858D] mt-1">
            Based only on price observations collected by CatchThePrice for this product and market.
          </p>
        </div>

        <div className="flex items-center gap-1 p-1 rounded-xl bg-[#F4F7F6] border border-[#DDE7E3] self-start sm:self-auto">
          {(['7D', '30D', '90D', 'ALL'] as const).map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => setPeriod(item)}
              className={`min-h-[34px] px-2.5 sm:px-3 rounded-lg text-[10px] sm:text-xs font-extrabold transition-colors ${
                period === item ? 'bg-[#0B8F58] text-white' : 'text-[#65777F] hover:text-[#20343C]'
              }`}
            >
              {item}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3">
        {[
          ['Current', stats.currentPrice],
          ['Lowest observed', stats.lowestPrice],
          ['Highest observed', stats.highestPrice],
          ['Observed average', stats.average90Days],
        ].map(([label, value]) => (
          <div key={String(label)} className="p-3 sm:p-3.5 rounded-2xl bg-[#F8FAF9] border border-[#E3ECE8]">
            <span className="text-[9px] sm:text-[10px] uppercase tracking-wider font-extrabold text-[#73858D] block">
              {String(label)}
            </span>
            <span className={`text-sm sm:text-lg font-extrabold ${label === 'Current' ? 'text-[#08784B]' : 'text-[#20343C]'}`}>
              {formatLocalPrice(Number(value))}
            </span>
          </div>
        ))}
      </div>

      <div className="relative w-full pt-1">
        <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-44 sm:h-56 overflow-visible" role="img" aria-label="Observed product price history">
          <defs>
            <linearGradient id="ctpChartGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#0B8F58" stopOpacity="0.20" />
              <stop offset="100%" stopColor="#0B8F58" stopOpacity="0.01" />
            </linearGradient>
          </defs>
          <line x1={padX} y1={padY} x2={width - padX} y2={padY} stroke="#DDE7E3" strokeDasharray="4 4" />
          <line x1={padX} y1={height / 2} x2={width - padX} y2={height / 2} stroke="#DDE7E3" strokeDasharray="4 4" />
          <line x1={padX} y1={height - padY} x2={width - padX} y2={height - padY} stroke="#DDE7E3" />
          <path d={areaD} fill="url(#ctpChartGrad)" />
          <path d={pathD} fill="none" stroke="#0B8F58" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
          {points.map(({ x, y, point }, index) => {
            const isHovered = hoveredPoint?.date === point.date;
            const isLast = index === points.length - 1;
            return (
              <g key={`${point.date}-${index}`} onMouseEnter={() => setHoveredPoint(point)} onTouchStart={() => setHoveredPoint(point)} className="cursor-pointer">
                <circle cx={x} cy={y} r={isHovered ? 6 : isLast ? 5 : 3.5} fill="#0B8F58" stroke="#FFFFFF" strokeWidth="2" />
              </g>
            );
          })}
        </svg>

        <div className="mt-1 grid grid-cols-[1fr_auto_1fr] items-center gap-2 text-[9px] sm:text-[10px] text-[#829198] px-1">
          <span className="truncate">{new Date(filteredPoints[0].date).toLocaleDateString()}</span>
          <span className="text-center font-bold text-[#08784B] bg-[#EAF5F0] px-2 py-1 rounded-lg max-w-[180px] truncate">
            {hoveredPoint ? `${new Date(hoveredPoint.date).toLocaleDateString()}: ${formatLocalPrice(hoveredPoint.price)}` : `${filteredPoints.length} observations`}
          </span>
          <span className="truncate text-right">{new Date(filteredPoints[filteredPoints.length - 1].date).toLocaleDateString()}</span>
        </div>
      </div>
    </section>
  );
}
