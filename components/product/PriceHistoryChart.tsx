'use client';

import React, { useState } from 'react';
import { PricePoint, PriceStats } from '@/lib/types';
import { useCountry } from '@/context/CountryContext';
import { TrendingDown, Calendar, ShieldCheck, ArrowUpRight, ArrowDownRight } from 'lucide-react';

interface PriceHistoryChartProps {
  history: PricePoint[];
  stats: PriceStats;
  productTitle: string;
}

export function PriceHistoryChart({ history, stats, productTitle }: PriceHistoryChartProps) {
  const { formatLocalPrice } = useCountry();
  const [range, setRange] = useState<'30d' | '90d' | 'all'>('90d');
  const [hoveredPoint, setHoveredPoint] = useState<PricePoint | null>(null);

  // Filter points based on selected range
  const filteredPoints = React.useMemo(() => {
    if (!history || history.length === 0) return [];
    if (range === '30d') return history.slice(-5);
    return history;
  }, [history, range]);

  if (filteredPoints.length === 0) {
    return null;
  }

  const prices = filteredPoints.map((p) => p.price);
  const minPrice = Math.min(...prices);
  const maxPrice = Math.max(...prices);
  const paddingY = (maxPrice - minPrice) * 0.15 || 50;
  const domainMin = Math.max(0, minPrice - paddingY);
  const domainMax = maxPrice + paddingY;

  // SVG dimensions
  const width = 600;
  const height = 240;
  const padX = 45;
  const padY = 25;

  const points = filteredPoints.map((p, index) => {
    const x = padX + (index / (filteredPoints.length - 1)) * (width - padX * 2);
    const y =
      height - padY - ((p.price - domainMin) / (domainMax - domainMin || 1)) * (height - padY * 2);
    return { x, y, point: p };
  });

  const pathD = points.reduce((acc, curr, idx) => {
    return idx === 0 ? `M ${curr.x} ${curr.y}` : `${acc} L ${curr.x} ${curr.y}`;
  }, '');

  const areaD = `${pathD} L ${points[points.length - 1].x} ${height - padY} L ${points[0].x} ${height - padY} Z`;

  return (
    <div className="rounded-2xl bg-ctp-surface border border-ctp p-4 sm:p-6">
      {/* Header & Range Selector */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-ctp">
        <div>
          <h3 className="font-bold text-base sm:text-lg text-slate-100 flex items-center gap-2">
            <span>Price History & Trends</span>
            <span className="text-[11px] font-normal px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              Verified Data
            </span>
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Compare against 90-day averages and lowest recorded drops
          </p>
        </div>

        {/* Range Buttons */}
        <div className="flex items-center gap-1 p-1 rounded-xl bg-slate-900 border border-ctp self-start sm:self-auto">
          {(['30d', '90d', 'all'] as const).map((r) => (
            <button
              key={r}
              onClick={() => setRange(r)}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                range === r
                  ? 'bg-emerald-500 text-slate-950 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {r === '30d' ? '30 Days' : r === '90d' ? '90 Days' : 'All Time'}
            </button>
          ))}
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 my-4">
        <div className="p-3 rounded-xl bg-ctp-surface-elevated border border-ctp">
          <span className="text-[11px] text-slate-400 block">Current Best Price</span>
          <span className="text-base sm:text-lg font-extrabold text-emerald-400">
            {formatLocalPrice(stats.currentPrice)}
          </span>
          <span className="text-[10px] text-emerald-400/80 flex items-center gap-0.5 mt-0.5">
            <ArrowDownRight className="w-3 h-3" /> Best Deal
          </span>
        </div>

        <div className="p-3 rounded-xl bg-ctp-surface-elevated border border-ctp">
          <span className="text-[11px] text-slate-400 block">Lowest Recorded</span>
          <span className="text-base sm:text-lg font-extrabold text-slate-100">
            {formatLocalPrice(stats.lowestPrice)}
          </span>
          <span className="text-[10px] text-slate-400 block mt-0.5">
            {stats.allTimeLowestDate || 'Recent'}
          </span>
        </div>

        <div className="p-3 rounded-xl bg-ctp-surface-elevated border border-ctp">
          <span className="text-[11px] text-slate-400 block">30-Day Average</span>
          <span className="text-base sm:text-lg font-extrabold text-slate-200">
            {formatLocalPrice(stats.average30Days)}
          </span>
          <span className="text-[10px] text-slate-400 block mt-0.5">Stable benchmark</span>
        </div>

        <div className="p-3 rounded-xl bg-ctp-surface-elevated border border-ctp">
          <span className="text-[11px] text-slate-400 block">90-Day Average</span>
          <span className="text-base sm:text-lg font-extrabold text-slate-200">
            {formatLocalPrice(stats.average90Days)}
          </span>
          <span className="text-[10px] text-slate-400 block mt-0.5">Long-term base</span>
        </div>
      </div>

      {/* Interactive SVG Chart */}
      <div className="relative w-full overflow-hidden pt-2">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="w-full h-48 sm:h-56 overflow-visible"
        >
          <defs>
            <linearGradient id="emeraldGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#10B981" stopOpacity="0.35" />
              <stop offset="100%" stopColor="#10B981" stopOpacity="0.0" />
            </linearGradient>
          </defs>

          {/* Grid lines */}
          <line
            x1={padX}
            y1={padY}
            x2={width - padX}
            y2={padY}
            stroke="#1a273f"
            strokeDasharray="4 4"
          />
          <line
            x1={padX}
            y1={height / 2}
            x2={width - padX}
            y2={height / 2}
            stroke="#1a273f"
            strokeDasharray="4 4"
          />
          <line
            x1={padX}
            y1={height - padY}
            x2={width - padX}
            y2={height - padY}
            stroke="#1a273f"
          />

          {/* Gradient area */}
          <path d={areaD} fill="url(#emeraldGradient)" />

          {/* Price line */}
          <path
            d={pathD}
            fill="none"
            stroke="#10B981"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Interactive Data Points */}
          {points.map(({ x, y, point }, idx) => {
            const isHovered = hoveredPoint?.date === point.date;
            const isLast = idx === points.length - 1;
            return (
              <g key={point.date} onMouseEnter={() => setHoveredPoint(point)} className="cursor-pointer">
                <circle
                  cx={x}
                  cy={y}
                  r={isHovered ? 6 : isLast ? 5 : 4}
                  fill={isLast ? '#34d399' : '#10B981'}
                  stroke="#060911"
                  strokeWidth="2"
                  className="transition-all duration-150"
                />
              </g>
            );
          })}
        </svg>

        {/* Hovered Price Tooltip Display */}
        <div className="mt-2 flex items-center justify-between text-xs text-slate-400 px-2">
          <span>{filteredPoints[0]?.date}</span>
          {hoveredPoint ? (
            <span className="font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-md border border-emerald-500/30">
              {hoveredPoint.date}: {formatLocalPrice(hoveredPoint.price)} ({hoveredPoint.merchantName || 'Amazon'})
            </span>
          ) : (
            <span className="text-[11px] text-slate-400">Hover or tap points to inspect price date</span>
          )}
          <span>{filteredPoints[filteredPoints.length - 1]?.date}</span>
        </div>
      </div>
    </div>
  );
}
