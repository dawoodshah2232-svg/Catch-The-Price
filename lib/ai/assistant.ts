// CatchThePrice AI Assistant Engine
// Deterministic fallback helpers must never invent retailer authorization,
// historical lows, time windows, warranty coverage or market-wide rankings.

interface SummaryResult {
  verdict: string;
  pros: string[];
  cons: string[];
  bestTimeToBuy: boolean;
}

export async function generateProductSummary(
  productTitle: string,
  currentPrice: number,
  originalPrice: number,
  currency: string
): Promise<SummaryResult> {
  const hasReferencePrice = originalPrice > 0 && currentPrice > 0 && originalPrice > currentPrice;
  const discount = hasReferencePrice
    ? Math.round(((originalPrice - currentPrice) / originalPrice) * 100)
    : 0;

  const verdict = hasReferencePrice
    ? `${productTitle} is currently listed at ${currency} ${currentPrice.toLocaleString()}, ${discount}% below the provided reference price. This comparison does not by itself prove a historical low; check current retailer offers and stored price observations before buying.`
    : `${productTitle} is currently listed at ${currency} ${currentPrice.toLocaleString()}. CatchThePrice does not have enough validated reference-price evidence in this input to claim a discount or historical low.`;

  return {
    verdict,
    pros: [
      'Current offers can be compared side by side when multiple approved retailer listings are available',
      'Stored price observations can show genuine changes over time once enough history exists',
      'Structured specifications can help confirm the exact product variant before purchase',
    ],
    cons: [
      'A reference price is not the same thing as verified historical price history',
      'Availability, delivery, warranty and returns can vary by retailer and should be checked before checkout',
    ],
    bestTimeToBuy: false,
  };
}

export function explainDealScore(score: number, discountPercent: number): string {
  const normalizedScore = Math.max(0, Math.min(100, Math.round(score)));
  const normalizedDiscount = Math.max(0, Math.round(discountPercent));

  return `Score ${normalizedScore}/100 with a ${normalizedDiscount}% reference-price difference. Treat this as a comparison aid only; it does not prove an all-time low, a 90-day ranking or retailer authorization unless those facts are separately validated from stored evidence.`;
}
