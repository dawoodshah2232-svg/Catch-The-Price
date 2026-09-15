import 'server-only';

import { canPublishSource, getSourceRights } from '@/lib/config/sourceRights';
import { normalizeMerchantItem } from '@/lib/ingestion/normalizer';
import { NormalizedItem, RawMerchantItem } from '@/lib/ingestion/types';

export type LaunchMarket = 'ae' | 'us';

export interface MerchantSourceAdapter {
  /** Must match an entry in SOURCE_RIGHTS. */
  sourceRightsId: string;
  market: LaunchMarket;
  adapterName: string;
  fetchItems(): Promise<RawMerchantItem[]>;
}

export interface PreparedSourceBatch {
  sourceRightsId: string;
  adapterName: string;
  market: LaunchMarket;
  fetched: number;
  accepted: NormalizedItem[];
  rejected: { sku?: string; reason: string }[];
}

function validateRawItem(item: RawMerchantItem, market: LaunchMarket): string | null {
  if (!item.rawSku?.trim()) return 'Missing source SKU/product identifier';
  if (!item.rawTitle?.trim()) return 'Missing product title';
  if (!Number.isFinite(Number(item.rawPrice)) || Number(item.rawPrice) <= 0) return 'Invalid price';
  if (!item.rawCurrency?.trim()) return 'Missing currency';
  if (!item.rawUrl?.trim()) return 'Missing retailer URL';

  let url: URL;
  try {
    url = new URL(item.rawUrl);
  } catch {
    return 'Invalid retailer URL';
  }

  if (url.protocol !== 'https:') return 'Retailer URL must use HTTPS';

  const expectedCurrency = market === 'ae' ? 'AED' : 'USD';
  if (item.rawCurrency.toUpperCase() !== expectedCurrency) {
    return `Currency ${item.rawCurrency} does not match ${market.toUpperCase()} market`;
  }

  return null;
}

/**
 * Fetch and normalize a source batch only after commercial/source rights are ACTIVE.
 * This function intentionally does not persist anything. Persistence should happen in
 * a separate transaction after exact-variant matching and source provenance checks.
 */
export async function prepareApprovedSourceBatch(adapter: MerchantSourceAdapter): Promise<PreparedSourceBatch> {
  const rights = getSourceRights(adapter.sourceRightsId);

  if (!rights) {
    throw new Error(`Unknown source rights record: ${adapter.sourceRightsId}`);
  }

  if (rights.market !== adapter.market) {
    throw new Error(`Source market mismatch for ${adapter.sourceRightsId}`);
  }

  if (!canPublishSource(adapter.sourceRightsId)) {
    throw new Error(`Source ${adapter.sourceRightsId} is not approved for production publishing`);
  }

  const rawItems = await adapter.fetchItems();
  const accepted: NormalizedItem[] = [];
  const rejected: { sku?: string; reason: string }[] = [];

  for (const item of rawItems) {
    const reason = validateRawItem(item, adapter.market);
    if (reason) {
      rejected.push({ sku: item.rawSku, reason });
      continue;
    }

    accepted.push(normalizeMerchantItem(item));
  }

  return {
    sourceRightsId: adapter.sourceRightsId,
    adapterName: adapter.adapterName,
    market: adapter.market,
    fetched: rawItems.length,
    accepted,
    rejected,
  };
}
