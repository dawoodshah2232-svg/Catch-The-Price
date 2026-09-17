import 'server-only';

import { getServerSupabase } from '@/lib/supabase/server';
import { PricePoint } from '@/lib/types';

export interface PriceRecordInput {
  offerId: string;
  productId: string;
  merchantId: string;
  price: number;
  currency: string;
}

export interface ComputedPriceStats {
  currentPrice: number;
  previousPrice: number | null;
  percentageDrop: number;
  historicalLow: number;
  recentAverage: number;
  isAllTimeLow: boolean;
  historyPointsCount: number;
}

export async function recordOfferPrice(input: PriceRecordInput): Promise<{ recorded: boolean; reason?: string }> {
  const supabase = getServerSupabase();
  if (!supabase) return { recorded: false, reason: 'Database not configured' };

  if (!Number.isFinite(input.price) || input.price <= 0) {
    return { recorded: false, reason: 'Invalid price amount' };
  }

  // Deduplication check: Get latest recorded price for this offer
  const { data: latestHistory } = await supabase
    .from('price_history')
    .select('id, price, captured_at')
    .eq('offer_id', input.offerId)
    .order('captured_at', { ascending: false })
    .limit(1)
    .maybeSingle();

  if (latestHistory && Number(latestHistory.price) === Number(input.price)) {
    // Avoid useless duplicate history records if price has not changed
    return { recorded: false, reason: 'Price unchanged since last observation' };
  }

  // Record price change
  const { error } = await supabase.from('price_history').insert({
    offer_id: input.offerId,
    product_id: input.productId,
    merchant_id: input.merchantId,
    price: input.price,
    currency: input.currency,
    captured_at: new Date().toISOString(),
  });

  if (error) {
    console.error('Failed to record price history:', error);
    return { recorded: false, reason: error.message };
  }

  // Also update latest price on the offer record
  try {
    await supabase
      .from('offers')
      .update({
        price: input.price,
        last_checked_at: new Date().toISOString(),
      })
      .eq('id', input.offerId);
  } catch {}

  return { recorded: true };
}

export function computePriceStats(
  currentPrice: number,
  history: PricePoint[]
): ComputedPriceStats {
  if (history.length === 0) {
    return {
      currentPrice,
      previousPrice: null,
      percentageDrop: 0,
      historicalLow: currentPrice,
      recentAverage: currentPrice,
      isAllTimeLow: true,
      historyPointsCount: 0,
    };
  }

  const sorted = [...history].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  const prices = sorted.map((p) => p.price).filter((p) => p > 0);
  const minPrice = Math.min(...prices, currentPrice);
  const sum = prices.reduce((acc, p) => acc + p, 0);
  const average = prices.length > 0 ? sum / prices.length : currentPrice;

  const previous = sorted.length > 1 ? sorted[sorted.length - 2].price : null;
  const drop =
    previous && previous > currentPrice
      ? ((previous - currentPrice) / previous) * 100
      : 0;

  return {
    currentPrice,
    previousPrice: previous,
    percentageDrop: Math.round(drop * 10) / 10,
    historicalLow: minPrice,
    recentAverage: Math.round(average),
    isAllTimeLow: currentPrice <= minPrice,
    historyPointsCount: history.length,
  };
}
