import 'server-only';

import { getServerSupabase } from '@/lib/supabase/server';

export type QueueType =
  | 'PRODUCT_MATCH_REVIEW'
  | 'DATA_QUALITY'
  | 'CONTENT_REVIEW'
  | 'AUTOMATION_FAILURES';

export interface EnqueueExceptionInput {
  queueType: QueueType;
  title: string;
  referenceId?: string;
  referenceType?: string;
  payload: Record<string, unknown>;
  confidence?: number;
  priority?: 'low' | 'medium' | 'high' | 'critical';
}

export async function enqueueReviewItem(input: EnqueueExceptionInput): Promise<{ id: string | null; error?: string }> {
  const supabase = getServerSupabase();
  if (!supabase) return { id: null, error: 'Database unconfigured' };

  const { data, error } = await supabase
    .from('human_review_queue')
    .insert({
      queue_type: input.queueType,
      title: input.title,
      reference_id: input.referenceId,
      reference_type: input.referenceType,
      payload: input.payload,
      confidence: input.confidence,
      priority: input.priority || 'medium',
      status: 'PENDING',
    })
    .select('id')
    .single();

  if (error) {
    console.error('Failed to enqueue review item:', error);
    return { id: null, error: error.message };
  }

  return { id: data.id };
}

export async function resolveReviewItem(
  id: string,
  resolution: 'RESOLVED' | 'DISMISSED',
  notes: string,
  adminUserId?: string
): Promise<{ success: boolean; error?: string }> {
  const supabase = getServerSupabase();
  if (!supabase) return { success: false, error: 'Database unconfigured' };

  const { error } = await supabase
    .from('human_review_queue')
    .update({
      status: resolution,
      resolution_notes: notes,
      assigned_to: adminUserId,
      resolved_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    })
    .eq('id', id);

  if (error) return { success: false, error: error.message };
  return { success: true };
}

export async function logAdminAudit(
  adminEmail: string,
  action: string,
  resourceType: string,
  resourceId?: string,
  details: Record<string, unknown> = {}
) {
  const supabase = getServerSupabase();
  if (!supabase) return;

  try {
    await supabase.from('audit_logs').insert({
      user_email: adminEmail,
      action,
      resource_type: resourceType,
      resource_id: resourceId,
      details,
      created_at: new Date().toISOString(),
    });
  } catch (err) {
    console.error('Audit log failed:', err);
  }
}
