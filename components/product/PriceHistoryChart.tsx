'use client';

import React, { useState } from 'react';
import { PricePoint, PriceStats } from '@/lib/types';
import { useCountry } from '@/context/CountryContext';
import { ArrowDownRight, History } from 'lucide-react';

interface PriceHistoryChartProps {
  history: PricePoint[];
  stats: PriceStats;
  productTitle: string;
}

export function PriceHistoryChart({ history, stats, productTitle }: PriceHistoryChartProps) {
  const { formatLocalPrice } = useCountry();
  const [period, setPeriod] = useState<'7D' | '30D' | '90D' | '6M' | '1Y'>('90D');
  const [hoveredPoint, setHoveredPoint] = useState<PricePoint | null>(null);

  const filteredPoints = React.useMemo(() => {
    if (!history || history.length === 0) return [];
    if (period === '7D') return history.slice(-3);
    if (period === '30D') return history.slice(-6);
    return history;
  }, [history, period]);

  if (filteredPoints.length === 0) return null;

  const prices = filteredPoints.map((p) => p.price);
  const minPrice = Math.min(...prices);
  const maxPrice = Math.max(...prices);
  const paddingY = (maxPrice - minPrice) * 0.2 || 50;
  const domainMin = Math.max(0, minPrice - paddingY);
  const domainMax = maxPrice + paddingY;

  const width = 640;
  const height = 240;
  const padX = 45;
  const padY = 25;

  const points = filteredPoints.map((p, index) => {
    const x = padX + (index / (filteredPoints.length - 1 || 1)) * (width - padX * 2);
    const y =
      height - padY - ((p.price - domainMin) / (domainMax - domainMin || 1)) * (height - padY * 2);
    return { x, y, point: p };
  });

  const pathD = points.reduce((acc, curr, idx) => {
    return idx === 0 ? `M ${curr.x} ${curr.y}` : `${acc} L ${curr.x} ${curr.y}`;
  }, '');

  const areaD = `${pathD} L ${points[points.length - 1].x} ${height - padY} L ${points[0].x} ${height - padY} Z`;

  return (
    <div className="rounded-3xl bg-[#091217] border border-[#162633] p-4 sm:p-6 space-y-5">
      {/* Header with Periods (7D, 30D, 90D, 6M, 1Y) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#162633]">
        <div>
          <h3 className="font-bold text-base sm:text-lg text-[#F8FAFC] flex items-center gap-2">
            <span>Price History</span>
            <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-[#00D27A]/10 text-[#00D27A] border border-[#00D27A]/25">
              Interactive
            </span>
          </h3>
          <p className="text-xs text-[#8E9DAE] mt-0.5">
            Verified historical price changes across official retailers
          </p>
        </div>

        {/* Period Selector Tabs */}
        <div className="flex items-center gap-1 p-1 rounded-xl bg-[#071015] border border-[#162633] self-start sm:self-auto">
          {(['7D', '30D', '90D', '6M', '1Y'] as const).map((p) => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                period === p
                  ? 'bg-[#00D27A] text-[#071015] shadow-sm'
                  : 'text-[#8E9DAE] hover:text-[#F8FAFC]'
              }`}
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      {/* Metrics Row: Current, Lowest, Highest, Average */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-3.5 rounded-2xl bg-[#071015] border border-[#162633]">
          <span className="text-[10px] uppercase tracking-wider font-bold text-[#5B6B7C] block">
            Current
          </span>
          <span className="text-base sm:text-lg font-extrabold text-[#00D27A]">
            {formatLocalPrice(stats.currentPrice)}
          </span>
          <span className="text-[10px] text-[#00C996] flex items-center gap-0.5 mt-0.5">
            <ArrowDownRight className="w-3 h-3" /> Best Available
          </span>
        </div>

        <div className="p-3.5 rounded-2xl bg-[#071015] border border-[#162633]">
          <span className="text-[10px] uppercase tracking-wider font-bold text-[#5B6B7C] block">
            Lowest
          </span>
          <span className="text-base sm:text-lg font-extrabold text-[#F8FAFC]">
            {formatLocalPrice(stats.lowestPrice)}
          </span>
          <span className="text-[10px] text-[#8E9DAE] block mt-0.5">All-time record</span>
        </div>

        <div className="p-3.5 rounded-2xl bg-[#071015] border border-[#162633]">
          <span className="text-[10px] uppercase tracking-wider font-bold text-[#5B6B7C] block">
            Highest
          </span>
          <span className="text-base sm:text-lg font-extrabold text-[#8E9DAE]">
            {formatLocalPrice(stats.highestPrice)}
          </span>
          <span className="text-[10px] text-[#5B6B7C] block mt-0.5">Launch peak</span>
        </div>

        <div className="p-3.5 rounded-2xl bg-[#071015] border border-[#162633]">
          <span className="text-[10px] uppercase tracking-wider font-bold text-[#5B6B7C] block">
            90-Day Average
          </span>
          <span className="text-base sm:text-lg font-extrabold text-[#F8FAFC]">
            {formatLocalPrice(stats.average90Days)}
          </span>
          <span className="text-[10px] text-[#8E9DAE] block mt-0.5">Base trend line</span>
        </div>
      </div>

      {/* SVG Chart */}
      <div className="relative w-full pt-2">
        <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-48 sm:h-56 overflow-visible">
          <defs>
            <linearGradient id="ctpChartGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#00D27A" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#00D27A" stopOpacity="0.0" />
            </linearGradient>
          </defs>

          {/* Grid lines */}
          <line x1={padX} y1={padY} x2={width - padX} y2={padY} stroke="#162633" strokeDasharray="4 4" />
          <line x1={padX} y1={height / 2} x2={width - padX} y2={height / 2} stroke="#162633" strokeDasharray="4 4" />
          <line x1={padX} y1={height - padY} x2={width - padX} y2={height - padY} stroke="#162633" />

          {/* Gradient Area Fill */}
          <path d={areaD} fill="url(#ctpChartGrad)" />

          {/* Price Stroke */}
          <path
            d={pathD}
            fill="none"
            stroke="#00D27A"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Points */}
          {points.map(({ x, y, point }, idx) => {
            const isHovered = hoveredPoint?.date === point.date;
            const isLast = idx === points.length - 1;
            return (
              <g key={point.date} onMouseEnter={() => setHoveredPoint(point)} className="cursor-pointer">
                <circle
                  cx={x}
                  cy={y}
                  r={isHovered ? 6 : isLast ? 5 : 3.5}
                  fill={isLast ? '#00E6A2' : '#00D27A'}
                  stroke="#071015"
                  strokeWidth="2"
                />
              </g>
            );
          })}
        </svg>

        {/* Tooltip Bar */}
        <div className="mt-2 flex items-center justify-between text-[11px] text-[#5B6B7C] px-1">
          <span>{filteredPoints[0]?.date}</span>
          {hoveredPoint ? (
            <span className="font-bold text-[#00D27A] bg-[#00D27A]/10 px-3 py-1 rounded-lg border border-[#00D27A]/30">
              {hoveredPoint.date}: {formatLocalPrice(hoveredPoint.price)}
            </span>
          ) : (
            <span>Tap any point on the curve to view date</span>
          )}
          <span>{filteredPoints[filteredPoints.length - 1]?.date}</span>
        </div>
      </div>
    </div>
  );
}
