'use client';

import React, { useMemo, useState } from 'react';
import { PricePoint, PriceStats } from '@/lib/types';
import { useCountry } from '@/context/CountryContext';
import { History, Bell, Calendar, Info } from 'lucide-react';

interface PriceHistorySectionProps {
  history?: PricePoint[];
  stats?: PriceStats;
  productTitle: string;
  onOpenAlertModal?: () => void;
}

type Period = '30D' | '3M' | '6M' | '1Y';

function pointDate(value: string): number {
  const timestamp = new Date(value).getTime();
  return Number.isFinite(timestamp) ? timestamp : 0;
}

function formatChartDate(value: string): string {
  return new Intl.DateTimeFormat('en-GB', { day: '2-digit', month: 'short', year: 'numeric', timeZone: 'UTC' }).format(new Date(value));
}

export function PriceHistorySection({ history = [], stats, productTitle, onOpenAlertModal }: PriceHistorySectionProps) {
  const { formatLocalPrice } = useCountry();
  const [period, setPeriod] = useState<Period>('3M');
  const [hoveredPoint, setHoveredPoint] = useState<PricePoint | null>(null);

  const orderedHistory = useMemo(() => [...(history || [])].filter((point) => Number.isFinite(point.price) && point.price > 0).sort((a, b) => pointDate(a.date) - pointDate(b.date)), [history]);
  const filteredPoints = useMemo(() => {
    if (orderedHistory.length < 2) return orderedHistory;
    const days = period === '30D' ? 30 : period === '3M' ? 90 : period === '6M' ? 180 : 365;
    const lastDate = pointDate(orderedHistory[orderedHistory.length - 1].date);
    const cutoff = lastDate - days * 24 * 60 * 60 * 1000;
    const filtered = orderedHistory.filter((point) => pointDate(point.date) >= cutoff);
    return filtered.length >= 2 ? filtered : orderedHistory;
  }, [orderedHistory, period]);

  const hasGenuineHistory = filteredPoints.length >= 2;
  const prices = hasGenuineHistory ? filteredPoints.map((p) => p.price) : [];
  const currentPrice = stats?.currentPrice || (prices.length ? prices[prices.length - 1] : 0);
  const lowestPrice = stats?.lowestPrice || (prices.length ? Math.min(...prices) : 0);
  const highestPrice = stats?.highestPrice || (prices.length ? Math.max(...prices) : 0);
  const avgPrice = stats?.average90Days || (prices.length ? Math.round(prices.reduce((a, b) => a + b, 0) / prices.length) : 0);
  const width = 640, height = 180, padX = 40, padY = 20;
  const minP = lowestPrice > 0 ? lowestPrice : 1;
  const maxP = highestPrice > 0 ? highestPrice : 1;
  const paddingY = (maxP - minP) * 0.2 || Math.max(minP * 0.05, 1);
  const domainMin = Math.max(0, minP - paddingY), domainMax = maxP + paddingY;
  const points = hasGenuineHistory ? filteredPoints.map((point, index) => ({
    x: padX + (index / (filteredPoints.length - 1 || 1)) * (width - padX * 2),
    y: height - padY - ((point.price - domainMin) / (domainMax - domainMin || 1)) * (height - padY * 2),
    point,
  })) : [];
  const pathD = points.reduce((acc, current, index) => index === 0 ? `M ${current.x} ${current.y}` : `${acc} L ${current.x} ${current.y}`, '');
  const areaD = points.length ? `${pathD} L ${points[points.length - 1].x} ${height - padY} L ${points[0].x} ${height - padY} Z` : '';

  return (
    <section className="rounded-[24px] bg-white border border-[#DDE7E3] p-3 shadow-[0_8px_24px_rgba(25,55,45,0.04)] space-y-1.5">
      <div className="flex flex-wrap items-center justify-between gap-2 pb-1 border-b border-[#EDF2F0]">
        <div className="flex items-center gap-2"><History className="w-4 h-4 text-[#08784B]" /><h3 className="font-extrabold text-base sm:text-lg text-[#102027]">Price History & Trends</h3></div>
        {hasGenuineHistory && <div className="flex items-center gap-1 bg-[#F4F7F6] border border-[#DDE7E3] p-1 rounded-xl">{(['30D','3M','6M','1Y'] as Period[]).map((tab) => <button key={tab} type="button" onClick={() => setPeriod(tab)} aria-pressed={period === tab} className={`min-h-9 px-3 rounded-lg text-xs font-bold transition-colors ${period === tab ? 'bg-white text-[#08784B] shadow-2xs' : 'text-[#73858D] hover:text-[#102027]'}`}>{tab}</button>)}</div>}
      </div>

      {hasGenuineHistory ? (
        <div className="space-y-4">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            {[['Current Best', currentPrice], ['Lowest Recorded', lowestPrice], ['Highest Recorded', highestPrice], ['Period Average', avgPrice]].map(([label, value]) => <div key={String(label)} className="p-2.5 rounded-xl bg-[#F8FAF9] border border-[#E1EDE8]"><span className="text-[9px] font-bold uppercase tracking-wider text-[#73858D] block mb-0.5">{label}</span><div className="text-sm sm:text-base font-extrabold text-[#08784B]">{formatLocalPrice(Number(value))}</div></div>)}
          </div>
          <div className="relative">
            <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-36 sm:h-44 overflow-visible"><defs><linearGradient id="priceGradient" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#00D27A" stopOpacity="0.25" /><stop offset="100%" stopColor="#00D27A" stopOpacity="0" /></linearGradient></defs><line x1={padX} y1={padY} x2={width-padX} y2={padY} stroke="#EDF2F0" strokeDasharray="3 3" /><line x1={padX} y1={height/2} x2={width-padX} y2={height/2} stroke="#EDF2F0" strokeDasharray="3 3" /><line x1={padX} y1={height-padY} x2={width-padX} y2={height-padY} stroke="#EDF2F0" /><path d={areaD} fill="url(#priceGradient)" /><path d={pathD} fill="none" stroke="#0B8F58" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />{points.map(({x,y,point},i)=><circle key={i} cx={x} cy={y} r={hoveredPoint===point?5:3} fill={hoveredPoint===point?'#00D27A':'#0B8F58'} stroke="#fff" strokeWidth="1.5" onMouseEnter={()=>setHoveredPoint(point)} onMouseLeave={()=>setHoveredPoint(null)} />)}</svg>
            {hoveredPoint && <div className="mt-1 text-center text-xs text-[#102027] font-bold">{formatChartDate(hoveredPoint.date)}: <span className="text-[#08784B] font-extrabold">{formatLocalPrice(hoveredPoint.price)}</span></div>}
          </div>
          {onOpenAlertModal && <button type="button" onClick={onOpenAlertModal} className="inline-flex items-center gap-2 min-h-11 px-4 rounded-xl bg-white hover:bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold"><Bell className="w-3.5 h-3.5" />Set Price Alert</button>}
        </div>
      ) : (
        <div className="rounded-2xl border border-[#DDE7E3] bg-[#F8FAF9] p-3 flex items-center gap-3"><div className="w-10 h-10 shrink-0 rounded-xl bg-[#E5F8EF] border border-[#C7EEDC] text-[#08784B] flex items-center justify-center"><Calendar className="w-5 h-5" /></div><div className="min-w-0 flex-1 space-y-1"><h4 className="font-extrabold text-sm sm:text-base text-[#102027]">Verified price history not available yet</h4><p className="text-xs text-[#60727A] leading-relaxed">History and alerts activate only when CatchThePrice receives retailer-authorized price data. We do not scrape or invent Amazon prices.</p></div></div>
      )}
      <div className="pt-1 flex items-start gap-2 text-[11px] text-[#73858D]"><Info className="w-3.5 h-3.5 mt-0.5 text-[#08784B] shrink-0" /><span>Historical prices are shown only from verified, authorized store data. CatchThePrice never fabricates prices.</span></div>
    </section>
  );
}
