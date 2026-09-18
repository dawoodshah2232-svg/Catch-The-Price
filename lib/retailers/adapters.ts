import 'server-only';

import type { RawMerchantItem } from '@/lib/ingestion/types';

export type RetailerProvider = 'amazon_associates' | 'admitad' | 'noon_affiliate';
export type RetailerAdapterStatus = 'READY' | 'NOT_CONFIGURED';

export type RetailerAdapterResult = {
  status: RetailerAdapterStatus;
  items: RawMerchantItem[];
  reason?: string;
};

const ADMITAD_API_URL = 'https://api.admitad.com';
const ADMITAD_SCOPES = [
  'advcampaigns',
  'advcampaigns_for_website',
  'websites',
  'public_data',
  'deeplink_generator',
] as const;

type AdmitadAdSpace = {
  id: number;
  name: string;
  status: string;
  site_url?: string;
};

type AdmitadProgram = {
  id: number;
  name: string;
  connection_status?: string;
  show_products_links?: boolean;
  allow_deeplink?: boolean;
  products_csv_link?: string;
  products_xml_link?: string;
  feeds_info?: Array<{ name: string; csv_link?: string; xml_link?: string }>;
};

type AdmitadList<T> = { results?: T[]; _meta?: { count?: number } };

export type AdmitadDiscovery = {
  adSpace: AdmitadAdSpace;
  programs: AdmitadProgram[];
  productFeedPrograms: AdmitadProgram[];
  deeplinkPrograms: AdmitadProgram[];
};

export class AdmitadClient {
  private accessToken?: string;

  constructor(
    private readonly clientId: string,
    private readonly clientSecret: string,
    private readonly request: typeof fetch = fetch,
  ) {}

  private async authorize(): Promise<string> {
    if (this.accessToken) return this.accessToken;

    const credentials = Buffer.from(`${this.clientId}:${this.clientSecret}`, 'utf8').toString('base64');
    const response = await this.request(`${ADMITAD_API_URL}/token/`, {
      method: 'POST',
      headers: {
        Authorization: `Basic ${credentials}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        grant_type: 'client_credentials',
        client_id: this.clientId,
        scope: ADMITAD_SCOPES.join(' '),
      }),
      cache: 'no-store',
    });

    if (!response.ok) throw new Error(`Admitad authentication failed (${response.status})`);
    const payload = (await response.json()) as { access_token?: string };
    if (!payload.access_token) throw new Error('Admitad authentication returned no access token');
    this.accessToken = payload.access_token;
    return payload.access_token;
  }

  private async get<T>(path: string): Promise<T> {
    const token = await this.authorize();
    const response = await this.request(`${ADMITAD_API_URL}${path}`, {
      headers: { Authorization: `Bearer ${token}` },
      cache: 'no-store',
    });
    if (!response.ok) throw new Error(`Admitad API request failed (${response.status})`);
    return (await response.json()) as T;
  }

  async discover(): Promise<AdmitadDiscovery> {
    const adSpacePayload = await this.get<AdmitadAdSpace[] | AdmitadList<AdmitadAdSpace>>('/websites/v2/');
    const adSpaces = Array.isArray(adSpacePayload) ? adSpacePayload : (adSpacePayload.results ?? []);
    const configuredId = Number(process.env.ADMITAD_AD_SPACE_ID);
    const adSpace =
      adSpaces.find((space) => Number.isFinite(configuredId) && space.id === configuredId) ??
      adSpaces.find((space) => space.status === 'active' && /catch\s*the\s*price/i.test(`${space.name} ${space.site_url ?? ''}`)) ??
      adSpaces.find((space) => space.status === 'active');

    if (!adSpace) throw new Error('No active Admitad ad space is available');

    const programPayload = await this.get<AdmitadList<AdmitadProgram>>(
      `/advcampaigns/website/${adSpace.id}/?limit=500&connection_status=active`,
    );
    const programs = programPayload.results ?? [];
    return {
      adSpace,
      programs,
      productFeedPrograms: programs.filter(
        (program) =>
          program.show_products_links === true ||
          Boolean(program.products_csv_link || program.products_xml_link || program.feeds_info?.length),
      ),
      deeplinkPrograms: programs.filter((program) => program.allow_deeplink === true),
    };
  }

  async generateDeeplink(input: {
    adSpaceId: number;
    campaignId: number;
    destinationUrl: string;
    subid?: string;
  }): Promise<string> {
    const destination = new URL(input.destinationUrl);
    if (destination.protocol !== 'https:') throw new Error('Admitad deeplink destination must use HTTPS');
    const query = new URLSearchParams({ ulp: destination.toString() });
    if (input.subid) query.set('subid', input.subid.slice(0, 50));
    const payload = await this.get<Array<{ link?: string }>>(
      `/deeplink/${input.adSpaceId}/advcampaign/${input.campaignId}/?${query}`,
    );
    const link = payload[0]?.link;
    if (!link || !link.startsWith('https://')) throw new Error('Admitad returned no secure affiliate link');
    return link;
  }
}

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

/** Official Admitad publisher API/product feeds only. */
export class AdmitadAdapter extends CredentialsGatedAdapter {
  readonly provider = 'admitad' as const;
  protected readonly requiredEnvironment = ['ADMITAD_CLIENT_ID', 'ADMITAD_CLIENT_SECRET'] as const;

  async fetchItems(): Promise<RetailerAdapterResult> {
    const status = this.getStatus();
    if (status.status !== 'READY') return status;

    const client = new AdmitadClient(process.env.ADMITAD_CLIENT_ID!, process.env.ADMITAD_CLIENT_SECRET!);
    const discovery = await client.discover();
    if (discovery.productFeedPrograms.length === 0) {
      return {
        status: 'READY',
        items: [],
        reason: 'Admitad authentication is active; no approved connected program currently exposes a product feed.',
      };
    }

    return {
      status: 'READY',
      items: [],
      reason: 'Approved Admitad product feeds discovered; ingestion remains gated until a feed is selected.',
    };
  }
}

/** Noon affiliate product feed/API only; campaign links remain provider-supplied. */
export class NoonAdapter extends CredentialsGatedAdapter {
  readonly provider = 'noon_affiliate' as const;
  protected readonly requiredEnvironment = ['NOON_AFFILIATE_TRACKING_URL'] as const;
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
      status: admitad.status === 'READY' ? 'Official API credentials configured' : 'Awaiting API credentials',
      ok: admitad.status === 'READY',
    },
    {
      provider: 'Noon Affiliate',
      status: noon.status === 'READY' ? 'Affiliate tracking configured / product data integration pending' : 'Affiliate active / tracking configuration pending',
      ok: noon.status === 'READY',
    },
    { provider: 'Impact', status: 'Disabled', ok: false },
  ];
}
