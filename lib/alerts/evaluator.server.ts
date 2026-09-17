import 'server-only';

import { getServerSupabase } from '@/lib/supabase/server';
import { sendPriceAlertEmail } from '@/lib/email/mailer';

type WatchlistRow = {
  id: string;
  user_id: string;
  product_id: string;
  target_price: number | string | null;
  country_code: string;
  alert_type: 'any_drop' | 'below_amount' | 'major_deal' | 'percent_drop' | 'historical_low';
  is_active: boolean;
  notify_email?: string | null;
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

function previousObservedPrice(history: HistoryRow[], offerId: string, currentPrice: number): number | null {
  const points = history
    .filter((row) => row.offer_id === offerId)
    .map((row) => ({ price: numberValue(row.price), capturedAt: row.captured_at }))
    .filter((row): row is { price: number; capturedAt: string } => row.price !== null && row.price > 0)
    .sort((a, b) => b.capturedAt.localeCompare(a.capturedAt));

  if (points.length === 0) return null;

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

  // Query active watchlists
  const { data: watchlistData, error: watchlistError } = await supabase
    .from('watchlists')
    .select('id,user_id,product_id,target_price,country_code,alert_type,is_active,notify_email')
    .eq('is_active', true)
    .in('alert_type', ['any_drop', 'below_amount', 'major_deal'])
    .limit(5000);

  if (watchlistError) throw watchlistError;
  const watchlists: WatchlistRow[] = (watchlistData || []) as WatchlistRow[];

  // Also query price_alerts table for alerts registered through account/alerts
  try {
    const { data: priceAlertsData } = await supabase
      .from('price_alerts')
      .select('id,user_id,product_id,target_price,country_code,alert_type,is_active,notify_email')
      .eq('is_active', true)
      .limit(5000);

    if (priceAlertsData && priceAlertsData.length > 0) {
      const existingKeys = new Set(watchlists.map((w) => `${w.user_id}:${w.product_id}:${w.country_code}`));
      for (const pa of priceAlertsData) {
        const key = `${pa.user_id}:${pa.product_id}:${pa.country_code}`;
        if (!existingKeys.has(key)) {
          watchlists.push({
            id: pa.id,
            user_id: pa.user_id,
            product_id: pa.product_id,
            target_price: pa.target_price,
            country_code: pa.country_code,
            alert_type: pa.alert_type as WatchlistRow['alert_type'],
            is_active: pa.is_active,
            notify_email: pa.notify_email,
          });
          existingKeys.add(key);
        }
      }
    }
  } catch {}

  if (watchlists.length === 0) return result;

  const productIds = [...new Set(watchlists.map((row) => row.product_id))];
  const [offerRes, productRes] = await Promise.all([
    supabase
      .from('offers')
      .select('id,product_id,country_code,price,currency,availability,is_active,merchant_id')
      .in('product_id', productIds)
      .eq('is_active', true)
      .eq('availability', 'in_stock'),
    supabase
      .from('products')
      .select('id,name,slug,image_url')
      .in('id', productIds),
  ]);

  if (offerRes.error) throw offerRes.error;
  const offers = (offerRes.data || []) as OfferRow[];
  const offerIds = offers.map((row) => row.id);
  const products = (productRes.data || []) as Array<{ id: string; name: string; slug: string; image_url: string | null }>;
  const productMap = new Map(products.map((p) => [p.id, p]));

  const merchantIds = [...new Set(offers.map((o) => o.merchant_id).filter(Boolean))];
  const { data: merchantsData } = merchantIds.length
    ? await supabase.from('merchants').select('id,name').in('id', merchantIds)
    : { data: [] };
  const merchantMap = new Map((merchantsData || []).map((m: any) => [m.id, m.name]));

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
    const product = productMap.get(watch.product_id);
    let shouldTrigger = false;
    let eventType: 'target_reached' | 'price_drop' = 'price_drop';
    let message = '';
    let previousObs: number | null = null;

    if (watch.alert_type === 'below_amount') {
      const target = numberValue(watch.target_price);
      if (!target || bestOffer.numericPrice > target) continue;
      shouldTrigger = true;
      eventType = 'target_reached';
      message = `Target reached: current lowest listed price is ${bestOffer.currency} ${bestOffer.numericPrice}, at or below your target of ${bestOffer.currency} ${target}.`;
    } else if (watch.alert_type === 'any_drop') {
      const previous = previousObservedPrice(history, bestOffer.id, bestOffer.numericPrice);
      if (!previous) {
        result.skippedNoBaseline += 1;
        continue;
      }
      if (bestOffer.numericPrice >= previous) continue;
      shouldTrigger = true;
      previousObs = previous;
      eventType = 'price_drop';
      message = `Price drop observed: current lowest listed price is ${bestOffer.currency} ${bestOffer.numericPrice}, below previous observation of ${bestOffer.currency} ${previous}.`;
    }

    if (!shouldTrigger) continue;

    const { data: duplicate, error: duplicateError } = await supabase
      .from('alert_events')
      .select('id')
      .eq('user_id', watch.user_id)
      .eq('product_id', watch.product_id)
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

    // 1. Insert In-App Notification (Notification Center)
    try {
      await supabase.from('notifications').insert({
        user_id: watch.user_id,
        title: eventType === 'target_reached' ? 'Target Price Reached!' : 'Price Drop Detected!',
        message,
        type: eventType === 'target_reached' ? 'target_reached' : 'price_drop',
        reference_id: watch.product_id,
        link: `/${watch.country_code}/product/${product?.slug || watch.product_id}`,
        is_read: false,
      });
    } catch {}

    // 2. Update price_alerts timestamp
    try {
      await supabase
        .from('price_alerts')
        .update({
          triggered_at: new Date().toISOString(),
          last_notified_at: new Date().toISOString(),
        })
        .eq('user_id', watch.user_id)
        .eq('product_id', watch.product_id);
    } catch {}

    // 3. Dispatch Email Notification if recipient email available
    const toEmail = watch.notify_email;
    if (toEmail) {
      try {
        const dropPct = previousObs && previousObs > bestOffer.numericPrice
          ? Math.round(((previousObs - bestOffer.numericPrice) / previousObs) * 100)
          : undefined;

        const emailRes = await sendPriceAlertEmail(toEmail, {
          productTitle: product?.name || 'Tracked Product',
          productImageUrl: product?.image_url,
          productUrl: `https://catchtheprice.com/${watch.country_code}/product/${product?.slug || watch.product_id}`,
          targetPrice: `${bestOffer.currency} ${watch.target_price || bestOffer.numericPrice}`,
          currentPrice: `${bestOffer.currency} ${bestOffer.numericPrice}`,
          merchantName: merchantMap.get(bestOffer.merchant_id),
          dropPercentage: dropPct,
          market: (watch.country_code === 'us' ? 'us' : 'ae'),
        });

        if (emailRes.success) {
          await supabase
            .from('alert_events')
            .update({ sent_at: new Date().toISOString() })
            .eq('user_id', watch.user_id)
            .eq('product_id', watch.product_id)
            .is('sent_at', null);
        }
      } catch (emailErr) {
        console.warn('Email dispatch failed for alert:', emailErr);
      }
    }

    result.triggered += 1;
  }

  return result;
}
