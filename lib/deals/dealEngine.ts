export interface DealInput {
  productId: string;
  offerId: string;
  currentPrice: number;
  originalPrice: number;
  historicalLow?: number;
  recentAverage?: number;
  competingOffersCount: number;
  inStock: boolean;
  currency: string;
}

export interface EvaluatedDeal {
  dealScore: number; // 0 - 100
  discountPercent: number;
  absoluteSaving: number;
  dealType: 'PRICE_DROP' | 'HISTORICAL_LOW' | 'CLEARANCE' | 'STANDARD';
  isTopDeal: boolean;
  summaryReason: string;
}

export function evaluateDeal(input: DealInput): EvaluatedDeal {
  if (!input.inStock || input.currentPrice <= 0) {
    return {
      dealScore: 0,
      discountPercent: 0,
      absoluteSaving: 0,
      dealType: 'STANDARD',
      isTopDeal: false,
      summaryReason: 'Offer is out of stock or price is invalid.',
    };
  }

  const baseline = Math.max(input.originalPrice, input.currentPrice);
  const saving = baseline > input.currentPrice ? baseline - input.currentPrice : 0;
  const discountPct = baseline > 0 ? (saving / baseline) * 100 : 0;

  // Signal 1: Percentage Discount (up to 40 points)
  const discountScore = Math.min(40, discountPct * 1.2);

  // Signal 2: Absolute Savings (up to 20 points)
  let savingsScore = 0;
  if (saving > 500) savingsScore = 20;
  else if (saving > 200) savingsScore = 15;
  else if (saving > 50) savingsScore = 10;
  else if (saving > 0) savingsScore = 5;

  // Signal 3: Historical comparison (up to 25 points)
  let historyScore = 0;
  let isHistoricalLow = false;
  if (input.historicalLow && input.currentPrice <= input.historicalLow) {
    historyScore = 25;
    isHistoricalLow = true;
  } else if (input.recentAverage && input.currentPrice < input.recentAverage * 0.9) {
    historyScore = 18;
  } else if (input.recentAverage && input.currentPrice < input.recentAverage) {
    historyScore = 10;
  }

  // Signal 4: Retailer Competition (up to 15 points)
  // More competing retailers confirms this is a genuine market discount rather than an isolated pricing glitch
  let competitionScore = 5;
  if (input.competingOffersCount >= 4) competitionScore = 15;
  else if (input.competingOffersCount >= 2) competitionScore = 10;

  const totalScore = Math.min(100, Math.round(discountScore + savingsScore + historyScore + competitionScore));

  let dealType: EvaluatedDeal['dealType'] = 'STANDARD';
  if (isHistoricalLow) {
    dealType = 'HISTORICAL_LOW';
  } else if (discountPct >= 35) {
    dealType = 'CLEARANCE';
  } else if (discountPct >= 10) {
    dealType = 'PRICE_DROP';
  }

  const isTopDeal = totalScore >= 80;

  let reason = 'Standard retail price.';
  if (isHistoricalLow) {
    reason = `Matches or beats lowest recorded price across retailers.`;
  } else if (discountPct >= 20) {
    reason = `${Math.round(discountPct)}% discount below reference price.`;
  } else if (saving > 0) {
    reason = `Save ${Math.round(saving)} ${input.currency} compared to standard price.`;
  }

  return {
    dealScore: totalScore,
    discountPercent: Math.round(discountPct * 10) / 10,
    absoluteSaving: Math.round(saving * 100) / 100,
    dealType,
    isTopDeal,
    summaryReason: reason,
  };
}
