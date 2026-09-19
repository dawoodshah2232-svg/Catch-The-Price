import 'server-only';

import { getServerSupabase } from '../supabase/server';

export type SourceRightsStatus = 'DISABLED' | 'PENDING' | 'ACTIVE' | 'REVOKED';

export interface SourceRightsRecord {
  id: string;
  retailer: string;
  market: 'ae' | 'us';
  status: SourceRightsStatus;
  approvalReference?: string | null;
  approvedAt?: string | null;
  pricingRight: boolean;
  imageRight: boolean;
  historyRight: boolean;
  affiliateLinkRight: boolean;
  aiProcessingRight: boolean;
  retentionNotes?: string | null;
  notes: string;
}

type DbSourceRights = {
  id: string;
  retailer: string;
  market: 'ae' | 'us';
  status: SourceRightsStatus;
  approval_reference: string | null;
  approved_at: string | null;
  pricing_right: boolean;
  image_right: boolean;
  history_right: boolean;
  affiliate_link_right: boolean;
  ai_processing_right: boolean;
  retention_notes: string | null;
  notes: string;
};

function mapRow(row: DbSourceRights): SourceRightsRecord {
  return {
    id: row.id,
    retailer: row.retailer,
    market: row.market,
    status: row.status,
    approvalReference: row.approval_reference,
    approvedAt: row.approved_at,
    pricingRight: row.pricing_right,
    imageRight: row.image_right,
    historyRight: row.history_right,
    affiliateLinkRight: row.affiliate_link_right,
    aiProcessingRight: row.ai_processing_right,
    retentionNotes: row.retention_notes,
    notes: row.notes,
  };
}

export async function listSourceRights(): Promise<SourceRightsRecord[]> {
  const supabase = getServerSupabase();
  if (!supabase) return [];

  const { data, error } = await supabase
    .from('source_rights')
    .select('id,retailer,market,status,approval_reference,approved_at,pricing_right,image_right,history_right,affiliate_link_right,ai_processing_right,retention_notes,notes')
    .order('market')
    .order('retailer');

  if (error) {
    console.error('Failed to read source rights registry:', error);
    return [];
  }

  return ((data || []) as DbSourceRights[]).map(mapRow);
}

export async function getSourceRights(id: string): Promise<SourceRightsRecord | null> {
  const supabase = getServerSupabase();
  if (!supabase) return null;

  const { data, error } = await supabase
    .from('source_rights')
    .select('id,retailer,market,status,approval_reference,approved_at,pricing_right,image_right,history_right,affiliate_link_right,ai_processing_right,retention_notes,notes')
    .eq('id', id)
    .maybeSingle();

  if (error || !data) {
    if (error) console.error('Failed to read source rights record:', error);
    return null;
  }

  return mapRow(data as DbSourceRights);
}

export function canPublishSource(source: SourceRightsRecord | null | undefined): boolean {
  if (!source) return false;
  if (source.status !== 'ACTIVE') return false;

  const anySource = source as unknown as Record<string, unknown>;
  const pricingRight = source.pricingRight ?? anySource.pricing_right;
  const affiliateLinkRight = source.affiliateLinkRight ?? anySource.affiliate_link_right;
  if (!pricingRight || !affiliateLinkRight) return false;

  const approvalRef = (source.approvalReference || (anySource.approval_reference as string)) ?? '';
  if (!approvalRef.trim()) return false;

  const approvedAt = source.approvedAt || (anySource.approved_at as string);
  if (!approvedAt) return false;

  const approvedDate = new Date(approvedAt);
  if (Number.isNaN(approvedDate.getTime()) || approvedDate.getTime() > Date.now()) {
    return false;
  }

  const expires = anySource.expiresAt || anySource.expires_at || anySource.validUntil;
  if (typeof expires === 'string' || typeof expires === 'number') {
    const expireDate = new Date(expires);
    if (!Number.isNaN(expireDate.getTime()) && expireDate.getTime() <= Date.now()) {
      return false; // Expired
    }
  }

  return true;
}

export function resolveMerchantSourceRights(
  merchant: { id?: string; name?: string; slug?: string; country_code?: string } | null | undefined,
  rightsList: SourceRightsRecord[],
  sourcesList?: Array<{ config?: Record<string, unknown> }>
): SourceRightsRecord | null {
  if (!merchant || !merchant.slug) return null;
  const merchantSlug = merchant.slug.toLowerCase().trim();
  const merchantName = (merchant.name || '').toLowerCase().trim();

  // 1. Check sourcesList ingestion config for explicit rightsId mapping
  if (sourcesList && sourcesList.length > 0) {
    for (const src of sourcesList) {
      const cfg = src.config || {};
      const cfgSlug = typeof cfg.merchantSlug === 'string' ? cfg.merchantSlug.toLowerCase().trim() : '';
      const cfgRightsId = typeof cfg.rightsId === 'string' ? cfg.rightsId.toLowerCase().trim() : '';
      if (cfgSlug === merchantSlug && cfgRightsId) {
        const match = rightsList.find((r) => r.id.toLowerCase() === cfgRightsId);
        if (match) return match;
      }
    }
  }

  // 2. Direct ID matches for known platforms
  const directMap: Record<string, string> = {
    'amazon-uae': 'amazon-associates-ae',
    'amazon-ae': 'amazon-associates-ae',
    'noon-ae': 'noon-affiliate-ae',
    'noon-uae': 'noon-affiliate-ae',
    'best-buy': 'bestbuy-us',
    'jumbo-ae': 'admitad-jumbo-ae',
    'canon-uae': 'admitad-canon-uae',
    'the-luxury-closet': 'admitad-luxury-closet-ae',
    'aliexpress': 'admitad-aliexpress-ww-us',
    'geekbuying': 'admitad-geekbuying-ww-us',
    'glasseslit': 'admitad-glasseslit-ww-us',
  };

  const mappedId = directMap[merchantSlug];
  if (mappedId) {
    const match = rightsList.find((r) => r.id.toLowerCase() === mappedId.toLowerCase());
    if (match) return match;
  }

  // 3. Fallback: match by slug containment in rights ID
  const cleanSlug = merchantSlug.replace(/-(ae|us)$/, '');
  const idMatch = rightsList.find(
    (r) => r.id.toLowerCase().includes(merchantSlug) || r.id.toLowerCase().includes(cleanSlug)
  );
  if (idMatch) return idMatch;

  // 4. Fallback: match by retailer name
  if (merchantName) {
    const nameMatch = rightsList.find((r) => {
      const rName = r.retailer.toLowerCase();
      return rName.includes(merchantName) || merchantName.includes(rName.replace(/ via admitad| affiliate/g, ''));
    });
    if (nameMatch) return nameMatch;
  }

  return null;
}

