import 'server-only';

import { getServerSupabase } from '@/lib/supabase/server';

type WatchlistRow = {
  id: string;
  user_id: string;
  product_id: string;
  target_price: number | string | null;
  country_code: string;
  alert_type: 'any_drop' | 'below_amount' | 'major_deal';
  is_active: boolean;
};

type OfferRow = {
  id: string;
  product_id: string;
  country_code: string;
  price: number | string;
  currency: string;
  availability: string;
  is_active: boolean;
  merchant_id: string;
};

type HistoryRow = {
  offer_id: string;
  price: number | string;
  captured_at: string;
};

function numberValue(value: number | string | null | undefined) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
}

function previousObservedPrice(history: HistoryRow[], offerIds: Set<string>, currentPrice: number): number | null {
  const points = history
    .filter((row) => offerIds.has(row.offer_id))
    .map((row) => ({ price: numberValue(row.price), capturedAt: row.captured_at }))
    .filter((row): row is { price: number; capturedAt: string } => row.price !== null && row.price > 0)
    .sort((a, b) => b.capturedAt.localeCompare(a.capturedAt));

  if (points.length === 0) return null;

  // Ignore the newest observation when it simply reflects the current price,
  // then use the most recent different/earlier observation as the comparison baseline.
  let skippedCurrent = false;
  for (const point of points) {
    if (!skippedCurrent && point.price === currentPrice) {
      skippedCurrent = true;
      continue;
    }
    return point.price;
  }

  return null;
}

export type AlertEvaluationResult = {
  evaluated: number;
  triggered: number;
  skippedMajorDeal: number;
  skippedNoOffer: number;
  skippedNoBaseline: number;
  duplicatesSuppressed: number;
  errors: string[];
};

export async function evaluatePriceAlerts(): Promise<AlertEvaluationResult> {
  const supabase = getServerSupabase();
  if (!supabase) throw new Error('Server database is not configured.');

  const result: AlertEvaluationResult = {
    evaluated: 0,
    triggered: 0,
    skippedMajorDeal: 0,
    skippedNoOffer: 0,
    skippedNoBaseline: 0,
    duplicatesSuppressed: 0,
    errors: [],
  };

  const { data: watchlistData, error: watchlistError } = await supabase
    .from('watchlists')
    .select('id,user_id,product_id,target_price,country_code,alert_type,is_active')
    .eq('is_active', true)
    .in('alert_type', ['any_drop', 'below_amount', 'major_deal'])
    .limit(5000);

  if (watchlistError) throw watchlistError;
  const watchlists = (watchlistData || []) as WatchlistRow[];
  if (watchlists.length === 0) return result;

  const productIds = [...new Set(watchlists.map((row) => row.product_id))];
  const { data: offerData, error: offerError } = await supabase
    .from('offers')
    .select('id,product_id,country_code,price,currency,availability,is_active,merchant_id')
    .in('product_id', productIds)
    .eq('is_active', true)
    .eq('availability', 'in_stock');

  if (offerError) throw offerError;
  const offers = (offerData || []) as OfferRow[];
  const offerIds = offers.map((row) => row.id);

  const { data: historyData, error: historyError } = offerIds.length
    ? await supabase
        .from('price_history')
        .select('offer_id,price,captured_at')
        .in('offer_id', offerIds)
        .order('captured_at', { ascending: false })
        .limit(20000)
    : { data: [], error: null };

  if (historyError) throw historyError;
  const history = (historyData || []) as HistoryRow[];

  for (const watch of watchlists) {
    result.evaluated += 1;

    if (watch.alert_type === 'major_deal') {
      // No arbitrary "major deal" threshold is invented. This alert type remains
      // persisted for future deterministic rules, but does not fire yet.
      result.skippedMajorDeal += 1;
      continue;
    }

    const matchingOffers = offers
      .filter((offer) => offer.product_id === watch.product_id && offer.country_code === watch.country_code)
      .map((offer) => ({ ...offer, numericPrice: numberValue(offer.price) }))
      .filter((offer): offer is OfferRow & { numericPrice: number } => offer.numericPrice !== null && offer.numericPrice > 0)
      .sort((a, b) => a.numericPrice - b.numericPrice);

    if (matchingOffers.length === 0) {
      result.skippedNoOffer += 1;
      continue;
    }

    const bestOffer = matchingOffers[0];
    let shouldTrigger = false;
    let eventType: 'target_reached' | 'price_drop' = 'price_drop';
    let message = '';

    if (watch.alert_type === 'below_amount') {
      const target = numberValue(watch.target_price);
      if (!target || bestOffer.numericPrice > target) continue;
      shouldTrigger = true;
      eventType = 'target_reached';
      message = `Target reached: current lowest listed price is ${bestOffer.currency} ${bestOffer.numericPrice}, at or below your target of ${bestOffer.currency} ${target}.`;
    } else if (watch.alert_type === 'any_drop') {
      const relevantOfferIds = new Set(matchingOffers.map((offer) => offer.id));
      const previous = previousObservedPrice(history, relevantOfferIds, bestOffer.numericPrice);
      if (!previous) {
        result.skippedNoBaseline += 1;
        continue;
      }
      if (bestOffer.numericPrice >= previous) continue;
      shouldTrigger = true;
      eventType = 'price_drop';
      message = `Price drop observed: current lowest listed price is ${bestOffer.currency} ${bestOffer.numericPrice}, below the previous stored observation of ${bestOffer.currency} ${previous}.`;
    }

    if (!shouldTrigger) continue;

    const { data: duplicate, error: duplicateError } = await supabase
      .from('alert_events')
      .select('id')
      .eq('watchlist_id', watch.id)
      .eq('alert_type', eventType)
      .is('sent_at', null)
      .limit(1)
      .maybeSingle();

    if (duplicateError) {
      result.errors.push(`Duplicate check failed for watchlist ${watch.id}`);
      continue;
    }
    if (duplicate) {
      result.duplicatesSuppressed += 1;
      continue;
    }

    const { error: insertError } = await supabase.from('alert_events').insert({
      user_id: watch.user_id,
      watchlist_id: watch.id,
      product_id: watch.product_id,
      offer_id: bestOffer.id,
      alert_type: eventType,
      message,
      sent_at: null,
    });

    if (insertError) {
      result.errors.push(`Alert event insert failed for watchlist ${watch.id}`);
      continue;
    }

    result.triggered += 1;
  }

  return result;
}
