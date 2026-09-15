import 'server-only';

import { getServerSupabase } from '@/lib/supabase/server';

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
  return Boolean(
    source &&
      source.status === 'ACTIVE' &&
      source.pricingRight &&
      source.affiliateLinkRight &&
      source.approvalReference &&
      source.approvedAt
  );
}
