import 'server-only';

import type { RawMerchantItem } from '@/lib/ingestion/types';

export type RetailerProvider = 'amazon_associates' | 'admitad' | 'noon_affiliate';
export type RetailerAdapterStatus = 'READY' | 'NOT_CONFIGURED';

export type RetailerAdapterResult = {
  status: RetailerAdapterStatus;
  items: RawMerchantItem[];
  reason?: string;
};

export interface RetailerAdapter {
  readonly provider: RetailerProvider;
  readonly market: 'ae';
  getStatus(): RetailerAdapterResult;
  fetchItems(): Promise<RetailerAdapterResult>;
}

function missingEnvironment(required: readonly string[]): string[] {
  return required.filter((name) => !process.env[name]?.trim());
}

abstract class CredentialsGatedAdapter implements RetailerAdapter {
  abstract readonly provider: RetailerProvider;
  readonly market = 'ae' as const;
  protected abstract readonly requiredEnvironment: readonly string[];

  getStatus(): RetailerAdapterResult {
    const missing = missingEnvironment(this.requiredEnvironment);
    return missing.length > 0
      ? { status: 'NOT_CONFIGURED', items: [], reason: `Missing server configuration: ${missing.join(', ')}` }
      : { status: 'READY', items: [] };
  }

  async fetchItems(): Promise<RetailerAdapterResult> {
    // Provider requests are intentionally not implemented until an approved feed/API
    // endpoint and source-rights record are configured. Never fabricate catalog data.
    return this.getStatus();
  }
}

/** Official Amazon API/feed only. This adapter never performs webpage scraping. */
export class AmazonAdapter extends CredentialsGatedAdapter {
  readonly provider = 'amazon_associates' as const;
  protected readonly requiredEnvironment = [
    'AMAZON_ASSOCIATES_ACCESS_KEY',
    'AMAZON_ASSOCIATES_SECRET_KEY',
    'AMAZON_ASSOCIATES_PARTNER_TAG',
  ] as const;
}

/** Admitad publisher product feed only. */
export class AdmitadAdapter extends CredentialsGatedAdapter {
  readonly provider = 'admitad' as const;
  protected readonly requiredEnvironment = [
    'ADMITAD_CLIENT_ID',
    'ADMITAD_CLIENT_SECRET',
    'ADMITAD_PRODUCT_FEED_URL',
  ] as const;
}

/** Noon affiliate product feed/API only; campaign links remain provider-supplied. */
export class NoonAdapter extends CredentialsGatedAdapter {
  readonly provider = 'noon_affiliate' as const;
  protected readonly requiredEnvironment = ['NOON_AFFILIATE_FEED_URL'] as const;
}

export function getRetailerIntegrationStatuses() {
  const amazon = new AmazonAdapter().getStatus();
  const admitad = new AdmitadAdapter().getStatus();
  const noon = new NoonAdapter().getStatus();

  return [
    {
      provider: 'Amazon Associates UAE',
      status: amazon.status === 'READY' ? 'Credentials configured — rights review required' : 'Awaiting API credentials/access',
      ok: false,
    },
    {
      provider: 'Admitad',
      status: admitad.status === 'READY' ? 'Feed configured — rights review required' : 'Awaiting product feed configuration',
      ok: false,
    },
    {
      provider: 'Noon Affiliate',
      status: noon.status === 'READY' ? 'Feed configured — rights review required' : 'Affiliate active / product data integration pending',
      ok: false,
    },
    { provider: 'Impact', status: 'Disabled', ok: false },
  ];
}
