export interface DealScoreBreakdown {
  score: number;
  grade: 'exceptional' | 'great' | 'good' | 'average' | 'poor';
  label: string;
  color: string;
  badgeBg: string;
  rationale: string;
}

export function calculateDealScore(
  currentPrice: number,
  originalPrice: number,
  lowestPrice: number,
  average90Days: number,
  merchantRating: number = 4.8
): DealScoreBreakdown {
  const dropPercent = ((originalPrice - currentPrice) / originalPrice) * 100;
  const vsAverage = ((average90Days - currentPrice) / average90Days) * 100;
  const vsLowest = ((currentPrice - lowestPrice) / lowestPrice) * 100;

  // 1. Drop component (max 40 pts)
  const dropScore = Math.min(40, Math.max(0, dropPercent * 1.6));

  // 2. Vs 90-day avg component (max 30 pts)
  const avgScore = Math.min(30, Math.max(0, (vsAverage + 10) * 1.5));

  // 3. Proximity to all-time low (max 20 pts)
  const lowScore = Math.max(0, 20 - vsLowest * 2);

  // 4. Merchant rating component (max 10 pts)
  const merchantScore = (merchantRating / 5.0) * 10;

  const rawScore = Math.round(dropScore + avgScore + lowScore + merchantScore);
  const score = Math.min(99, Math.max(15, rawScore));

  if (score >= 90) {
    return {
      score,
      grade: 'exceptional',
      label: 'Exceptional Deal',
      color: '#10B981',
      badgeBg: 'rgba(16, 185, 129, 0.15)',
      rationale: `This price is ${Math.round(dropPercent)}% below MSRP and matches the historical lowest price ever tracked across verified stores.`,
    };
  } else if (score >= 75) {
    return {
      score,
      grade: 'great',
      label: 'Great Price',
      color: '#06B6D4',
      badgeBg: 'rgba(6, 182, 212, 0.15)',
      rationale: `High-value discount. The current price is comfortably below the 90-day average.`,
    };
  } else if (score >= 60) {
    return {
      score,
      grade: 'good',
      label: 'Good Value',
      color: '#3B82F6',
      badgeBg: 'rgba(59, 130, 246, 0.15)',
      rationale: `Standard competitive price from authorized retailers with fast shipping.`,
    };
  } else if (score >= 45) {
    return {
      score,
      grade: 'average',
      label: 'Average Price',
      color: '#F59E0B',
      badgeBg: 'rgba(245, 158, 11, 0.15)',
      rationale: `Pricing is typical. No major promotions or seasonal discounts are active right now.`,
    };
  } else {
    return {
      score,
      grade: 'poor',
      label: 'Wait for Drop',
      color: '#EF4444',
      badgeBg: 'rgba(239, 68, 68, 0.15)',
      rationale: `Currently close to peak MSRP. We recommend setting a price alert to catch the next drop.`,
    };
  }
}
