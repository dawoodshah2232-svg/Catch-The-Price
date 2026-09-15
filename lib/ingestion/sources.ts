import { CountryCode } from '@/lib/types';

export interface IngestionSource {
  id: string;
  name: string;
  adapter: string;
  country: CountryCode;
  envKey: string;
  endpointDescription: string;
  requiresCredentials: boolean;
  status: 'configured' | 'missing_credentials' | 'disabled';
}

export const INGESTION_SOURCES: IngestionSource[] = [
  {
    id: 'amazon-uae-paapi',
    name: 'Amazon UAE Catalog API',
    adapter: 'Amazon PA-API v5 (AE)',
    country: 'ae',
    envKey: 'AMAZON_PAAPI_KEY_AE',
    endpointDescription: 'Official Product Advertising API for Amazon.ae',
    requiresCredentials: true,
    status: process.env.AMAZON_PAAPI_KEY_AE ? 'configured' : 'missing_credentials',
  },
  {
    id: 'noon-uae-feed',
    name: 'Noon UAE Merchant Feed',
    adapter: 'Noon Partner Feed XML',
    country: 'ae',
    envKey: 'NOON_PARTNER_FEED_URL',
    endpointDescription: 'Permitted partner XML feed for Noon.com UAE',
    requiresCredentials: true,
    status: process.env.NOON_PARTNER_FEED_URL ? 'configured' : 'missing_credentials',
  },
  {
    id: 'amazon-ksa-paapi',
    name: 'Amazon Saudi Arabia API',
    adapter: 'Amazon PA-API v5 (SA)',
    country: 'sa',
    envKey: 'AMAZON_PAAPI_KEY_SA',
    endpointDescription: 'Official Product Advertising API for Amazon.sa',
    requiresCredentials: true,
    status: process.env.AMAZON_PAAPI_KEY_SA ? 'configured' : 'missing_credentials',
  },
  {
    id: 'jarir-ksa-catalog',
    name: 'Jarir Bookstore B2B Feed',
    adapter: 'Jarir B2B Catalog JSON',
    country: 'sa',
    envKey: 'JARIR_B2B_API_KEY',
    endpointDescription: 'Authorized wholesale/partner catalog for Jarir.com',
    requiresCredentials: true,
    status: process.env.JARIR_B2B_API_KEY ? 'configured' : 'missing_credentials',
  },
  {
    id: 'bestbuy-us-api',
    name: 'Best Buy Developer API',
    adapter: 'Best Buy B2B Catalog',
    country: 'us',
    envKey: 'BESTBUY_API_KEY',
    endpointDescription: 'Best Buy Developer Network Product API v1',
    requiresCredentials: true,
    status: process.env.BESTBUY_API_KEY ? 'configured' : 'missing_credentials',
  },
  {
    id: 'currys-uk-awin',
    name: 'Currys UK Affiliate Feed',
    adapter: 'Awin Network CSV/XML',
    country: 'uk',
    envKey: 'AWIN_AFFILIATE_TOKEN',
    endpointDescription: 'Authorized Awin Network product catalog for Currys PC World',
    requiresCredentials: true,
    status: process.env.AWIN_AFFILIATE_TOKEN ? 'configured' : 'missing_credentials',
  },
];

/**
 * Returns current status of all ingestion source connectors
 */
export function getSourceConnectors(): IngestionSource[] {
  return INGESTION_SOURCES.map((source) => ({
    ...source,
    status: process.env[source.envKey] ? 'configured' : 'missing_credentials',
  }));
}
