export type SourceRightsStatus = 'DISABLED' | 'PENDING' | 'ACTIVE' | 'REVOKED';

export interface SourceRightsRecord {
  id: string;
  retailer: string;
  market: 'ae' | 'us';
  status: SourceRightsStatus;
  approvalReference?: string;
  approvedAt?: string;
  pricingRight: boolean;
  imageRight: boolean;
  historyRight: boolean;
  affiliateLinkRight: boolean;
  aiProcessingRight: boolean;
  retentionNotes?: string;
  notes: string;
}

/**
 * Production integrations are deny-by-default.
 * A source may only move to ACTIVE after dated evidence of permission/approval
 * is recorded and its allowed uses are reviewed for the applicable market.
 */
export const SOURCE_RIGHTS: SourceRightsRecord[] = [
  {
    id: 'amazon-ae',
    retailer: 'Amazon UAE',
    market: 'ae',
    status: 'PENDING',
    pricingRight: false,
    imageRight: false,
    historyRight: false,
    affiliateLinkRight: false,
    aiProcessingRight: false,
    notes: 'No verified CatchThePrice approval is recorded. Keep disabled until the business model and applicable program terms are accepted in writing.',
  },
  {
    id: 'noon-ae',
    retailer: 'Noon UAE',
    market: 'ae',
    status: 'PENDING',
    pricingRight: false,
    imageRight: false,
    historyRight: false,
    affiliateLinkRight: false,
    aiProcessingRight: false,
    notes: 'No verified feed/API/affiliate approval is recorded yet.',
  },
  {
    id: 'sharafdg-ae',
    retailer: 'Sharaf DG',
    market: 'ae',
    status: 'PENDING',
    pricingRight: false,
    imageRight: false,
    historyRight: false,
    affiliateLinkRight: false,
    aiProcessingRight: false,
    notes: 'No verified publication or affiliate rights are recorded yet.',
  },
  {
    id: 'jumbo-ae',
    retailer: 'Jumbo Electronics',
    market: 'ae',
    status: 'PENDING',
    pricingRight: false,
    imageRight: false,
    historyRight: false,
    affiliateLinkRight: false,
    aiProcessingRight: false,
    notes: 'No verified publication or affiliate rights are recorded yet.',
  },
  {
    id: 'carrefour-ae',
    retailer: 'Carrefour UAE',
    market: 'ae',
    status: 'PENDING',
    pricingRight: false,
    imageRight: false,
    historyRight: false,
    affiliateLinkRight: false,
    aiProcessingRight: false,
    notes: 'No verified CatchThePrice approval is recorded yet.',
  },
  {
    id: 'amazon-us',
    retailer: 'Amazon US',
    market: 'us',
    status: 'PENDING',
    pricingRight: false,
    imageRight: false,
    historyRight: false,
    affiliateLinkRight: false,
    aiProcessingRight: false,
    notes: 'Conditional integration. Do not activate until the site-level price tracking/alert use case is confirmed as permitted for CatchThePrice.',
  },
  {
    id: 'bestbuy-us',
    retailer: 'Best Buy',
    market: 'us',
    status: 'PENDING',
    pricingRight: false,
    imageRight: false,
    historyRight: false,
    affiliateLinkRight: false,
    aiProcessingRight: false,
    notes: 'No verified CatchThePrice API/feed/affiliate approval is recorded yet.',
  },
  {
    id: 'walmart-us',
    retailer: 'Walmart',
    market: 'us',
    status: 'PENDING',
    pricingRight: false,
    imageRight: false,
    historyRight: false,
    affiliateLinkRight: false,
    aiProcessingRight: false,
    notes: 'No verified CatchThePrice publication or affiliate rights are recorded yet.',
  },
  {
    id: 'newegg-us',
    retailer: 'Newegg',
    market: 'us',
    status: 'PENDING',
    pricingRight: false,
    imageRight: false,
    historyRight: false,
    affiliateLinkRight: false,
    aiProcessingRight: false,
    notes: 'No verified CatchThePrice partner/feed approval is recorded yet.',
  },
  {
    id: 'bh-us',
    retailer: 'B&H Photo Video',
    market: 'us',
    status: 'PENDING',
    pricingRight: false,
    imageRight: false,
    historyRight: false,
    affiliateLinkRight: false,
    aiProcessingRight: false,
    notes: 'No verified CatchThePrice publication or affiliate rights are recorded yet.',
  },
];

export function getSourceRights(id: string): SourceRightsRecord | undefined {
  return SOURCE_RIGHTS.find((source) => source.id === id);
}

export function canPublishSource(id: string): boolean {
  const source = getSourceRights(id);
  return Boolean(
    source &&
      source.status === 'ACTIVE' &&
      source.pricingRight &&
      source.affiliateLinkRight
  );
}
