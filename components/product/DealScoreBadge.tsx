'use client';

import React from 'react';

interface DealScoreBadgeProps {
  score: number;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
}

export function DealScoreBadge({
  score,
  size = 'md',
  showLabel = true,
}: DealScoreBadgeProps) {
  // Restrained, premium tiers
  let label = 'Fair';
  let badgeClass = 'bg-[#141E28] text-[#CBD5E1] border-[#203648]';
  let dotColor = '#94A3B8';

  if (score >= 90) {
    label = 'Excellent Deal';
    badgeClass = 'bg-[#00D27A]/10 text-[#00D27A] border-[#00D27A]/30';
    dotColor = '#00D27A';
  } else if (score >= 75) {
    label = 'Good Price';
    badgeClass = 'bg-[#00C996]/10 text-[#00C996] border-[#00C996]/30';
    dotColor = '#00C996';
  } else if (score >= 55) {
    label = 'Fair';
    badgeClass = 'bg-[#0f1c24] text-[#CBD5E1] border-[#162633]';
    dotColor = '#94A3B8';
  } else {
    label = 'Wait';
    badgeClass = 'bg-amber-500/10 text-amber-400 border-amber-500/25';
    dotColor = '#F59E0B';
  }

  if (size === 'sm') {
    return (
      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-lg text-[10px] font-extrabold border ${badgeClass}`}>
        <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: dotColor }} />
        <span>{score}</span>
        {showLabel && <span className="font-medium text-[#CBD5E1]">• {label}</span>}
      </span>
    );
  }

  if (size === 'lg') {
    return (
      <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-[#091217] border border-[#162633]">
        <div
          className={`w-12 h-12 rounded-xl flex flex-col items-center justify-center font-extrabold text-lg border ${badgeClass}`}
        >
          <span>{score}</span>
          <span className="text-[8px] uppercase tracking-wider -mt-1 opacity-75">Score</span>
        </div>
        <div>
          <div className="text-[10px] font-bold uppercase tracking-wider text-[#94A3B8]">
            CatchThePrice Intelligence
          </div>
          <div className="text-sm sm:text-base font-bold text-[#F8FAFC]">
            {score} — {label}
          </div>
          <p className="text-[11px] text-[#CBD5E1] mt-0.5">
            Calculated from 90-day price trends across verified stores
          </p>
        </div>
      </div>
    );
  }

  // Medium (default)
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-xs font-bold border ${badgeClass}`}>
      <span className="w-2 h-2 rounded-full" style={{ backgroundColor: dotColor }} />
      <span>{score}</span>
      {showLabel && <span className="font-semibold text-[#CBD5E1]">| {label}</span>}
    </span>
  );
}
