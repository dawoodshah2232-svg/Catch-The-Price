export interface NormalizedConversionRecord {
  clickId: string;
  orderId: string;
  merchantId?: string;
  offerId?: string;
  network: string;
  saleAmount: number;
  commissionAmount: number;
  currency: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  occurredAt: string;
}

export interface EpcReportSummary {
  merchantId?: string;
  merchantName?: string;
  totalClicks: number;
  totalConversions: number;
  totalCommissions: number;
  currency: string;
  conversionRate: number; // percentage, e.g. 3.2%
  earningsPerClick: number; // EPC, e.g. 0.45 AED / click
}

/**
 * Calculates Earnings Per Click (EPC)
 */
export function calculateEpc(totalCommissions: number, totalClicks: number): number {
  if (!totalClicks || totalClicks <= 0) return 0;
  return Math.round((totalCommissions / totalClicks) * 100) / 100;
}

/**
 * Calculates Conversion Rate percentage
 */
export function calculateConversionRate(totalConversions: number, totalClicks: number): number {
  if (!totalClicks || totalClicks <= 0) return 0;
  return Math.round((totalConversions / totalClicks) * 10000) / 100;
}

/**
 * Aggregates raw conversions against outbound clicks to produce revenue and EPC metrics.
 */
export function aggregateEpcReport({
  clicksCount,
  conversions,
  currency = 'AED',
  merchantName,
}: {
  clicksCount: number;
  conversions: NormalizedConversionRecord[];
  currency?: string;
  merchantName?: string;
}): EpcReportSummary {
  const approved = conversions.filter((c) => c.status !== 'REJECTED');
  const totalConversions = approved.length;
  const totalCommissions = approved.reduce((sum, c) => sum + (c.commissionAmount || 0), 0);

  return {
    merchantName,
    totalClicks: clicksCount,
    totalConversions,
    totalCommissions: Math.round(totalCommissions * 100) / 100,
    currency,
    conversionRate: calculateConversionRate(totalConversions, clicksCount),
    earningsPerClick: calculateEpc(totalCommissions, clicksCount),
  };
}

/**
 * Validates and normalizes raw CSV / JSON postback payload from affiliate networks.
 */
export function parseNetworkConversionPayload(
  rawRecords: Array<Record<string, unknown>>,
  network: string
): NormalizedConversionRecord[] {
  const normalized: NormalizedConversionRecord[] = [];

  for (const row of rawRecords) {
    const clickId = String(row.click_id || row.subid || row.subId1 || row.ascsubtag || row.sid || '').trim();
    const orderId = String(row.order_id || row.transaction_id || row.orderId || '').trim();
    const saleAmount = Number(row.sale_amount || row.amount || row.saleAmount || 0);
    const commissionAmount = Number(row.commission || row.payout || row.commissionAmount || 0);
    const currency = String(row.currency || 'AED').toUpperCase();
    const rawStatus = String(row.status || 'PENDING').toUpperCase();

    const status: 'PENDING' | 'APPROVED' | 'REJECTED' =
      rawStatus === 'APPROVED' || rawStatus === 'PAID'
        ? 'APPROVED'
        : rawStatus === 'REJECTED' || rawStatus === 'DECLINED'
        ? 'REJECTED'
        : 'PENDING';

    if (clickId && orderId) {
      normalized.push({
        clickId,
        orderId,
        merchantId: row.merchant_id ? String(row.merchant_id) : undefined,
        offerId: row.offer_id ? String(row.offer_id) : undefined,
        network,
        saleAmount: Number.isFinite(saleAmount) ? saleAmount : 0,
        commissionAmount: Number.isFinite(commissionAmount) ? commissionAmount : 0,
        currency,
        status,
        occurredAt: String(row.occurred_at || row.created_at || new Date().toISOString()),
      });
    }
  }

  return normalized;
}
