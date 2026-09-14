'use client';

import React from 'react';
import { calculateDealScore, DealScoreBreakdown } from '@/lib/engine/deal-score';
import { Sparkles, Info } from 'lucide-react';

interface DealScoreBadgeProps {
  score?: number;
  currentPrice?: number;
  originalPrice?: number;
  lowestPrice?: number;
  average90Days?: number;
  size?: 'sm' | 'md' | 'lg';
  showDetails?: boolean;
}

export function DealScoreBadge({
  score: explicitScore,
  currentPrice = 1000,
  originalPrice = 1200,
  lowestPrice = 980,
  average90Days = 1150,
  size = 'md',
  showDetails = false,
}: DealScoreBadgeProps) {
  let breakdown: DealScoreBreakdown;

  if (explicitScore !== undefined) {
    if (explicitScore >= 90) {
      breakdown = {
        score: explicitScore,
        grade: 'exceptional',
        label: 'Exceptional Deal',
        color: '#10B981',
        badgeBg: 'rgba(16, 185, 129, 0.15)',
        rationale: 'Lowest recorded price in 90 days across verified retailers.',
      };
    } else if (explicitScore >= 75) {
      breakdown = {
        score: explicitScore,
        grade: 'great',
        label: 'Great Price',
        color: '#06B6D4',
        badgeBg: 'rgba(6, 182, 212, 0.15)',
        rationale: 'Solid discount, comfortably below 90-day average.',
      };
    } else if (explicitScore >= 60) {
      breakdown = {
        score: explicitScore,
        grade: 'good',
        label: 'Good Value',
        color: '#3B82F6',
        badgeBg: 'rgba(59, 130, 246, 0.15)',
        rationale: 'Standard competitive market price from authorized sellers.',
      };
    } else if (explicitScore >= 45) {
      breakdown = {
        score: explicitScore,
        grade: 'average',
        label: 'Average Price',
        color: '#F59E0B',
        badgeBg: 'rgba(245, 158, 11, 0.15)',
        rationale: 'Pricing is typical. No major seasonal promotion active.',
      };
    } else {
      breakdown = {
        score: explicitScore,
        grade: 'poor',
        label: 'Wait for Drop',
        color: '#EF4444',
        badgeBg: 'rgba(239, 68, 68, 0.15)',
        rationale: 'Near recent peak price. We recommend setting a price alert.',
      };
    }
  } else {
    breakdown = calculateDealScore(currentPrice, originalPrice, lowestPrice, average90Days);
  }

  const { score, label, color, badgeBg, rationale } = breakdown;

  if (size === 'sm') {
    return (
      <div
        className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold border"
        style={{
          backgroundColor: badgeBg,
          color: color,
          borderColor: `${color}40`,
        }}
        title={`Deal Score ${score}/100: ${rationale}`}
      >
        <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: color }} />
        <span>{score}</span>
        <span className="font-normal opacity-80 hidden xs:inline">• {label}</span>
      </div>
    );
  }

  if (size === 'lg') {
    return (
      <div
        className="rounded-2xl p-4 border relative overflow-hidden backdrop-blur-sm"
        style={{
          backgroundColor: '#0c1424',
          borderColor: `${color}40`,
        }}
      >
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div
              className="w-14 h-14 rounded-2xl flex flex-col items-center justify-center font-extrabold shadow-lg shrink-0 border"
              style={{
                backgroundColor: badgeBg,
                color: color,
                borderColor: `${color}60`,
              }}
            >
              <span className="text-2xl leading-none">{score}</span>
              <span className="text-[9px] uppercase tracking-wider opacity-75">Score</span>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xs uppercase tracking-wider font-semibold text-slate-400">
                  CatchThePrice Rating
                </span>
                <Sparkles className="w-3.5 h-3.5" style={{ color }} />
              </div>
              <h4 className="text-base sm:text-lg font-bold text-slate-100">{label}</h4>
            </div>
          </div>

          <div className="hidden sm:block text-right">
            <span className="text-xs text-slate-400">Algorithm verified</span>
            <div className="text-[11px] text-emerald-400 font-medium">90-Day Historic Match</div>
          </div>
        </div>

        {showDetails && (
          <p className="mt-3 text-xs text-slate-300 leading-relaxed border-t border-ctp pt-2.5">
            {rationale}
          </p>
        )}
      </div>
    );
  }

  // Medium (default)
  return (
    <div
      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold border"
      style={{
        backgroundColor: badgeBg,
        color: color,
        borderColor: `${color}40`,
      }}
      title={`Deal Score ${score}/100: ${rationale}`}
    >
      <span className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: color }} />
      <span className="font-extrabold">{score}</span>
      <span className="font-medium text-slate-200">| {label}</span>
    </div>
  );
}
