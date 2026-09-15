import { NextRequest, NextResponse } from 'next/server';
import { requireAdminUser } from '@/lib/admin/requireAdmin';
import { getServerSupabase } from '@/lib/supabase/server';

const VALID_STATUS = new Set(['DISABLED', 'PENDING', 'ACTIVE', 'REVOKED']);

function asBoolean(value: unknown): boolean {
  return value === true;
}

export async function GET() {
  const admin = await requireAdminUser();
  if (!admin.ok) return NextResponse.json({ error: 'Unauthorized' }, { status: admin.status });

  const supabase = getServerSupabase();
  if (!supabase) return NextResponse.json({ error: 'Server database is not configured.' }, { status: 503 });

  const { data, error } = await supabase
    .from('source_rights')
    .select('id,retailer,market,status,approval_reference,approved_at,pricing_right,image_right,history_right,affiliate_link_right,ai_processing_right,retention_notes,notes,updated_at')
    .order('market')
    .order('retailer');

  if (error) {
    console.error('Source-rights list failed:', error);
    return NextResponse.json({ error: 'Could not load source-rights registry.' }, { status: 500 });
  }

  return NextResponse.json({ sources: data || [] });
}

export async function PATCH(request: NextRequest) {
  const admin = await requireAdminUser();
  if (!admin.ok) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: admin.status });
  }

  const supabase = getServerSupabase();
  if (!supabase) {
    return NextResponse.json({ error: 'Server database is not configured.' }, { status: 503 });
  }

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body.' }, { status: 400 });
  }

  const id = typeof body.id === 'string' ? body.id.trim() : '';
  const status = typeof body.status === 'string' ? body.status.trim().toUpperCase() : '';
  const approvalReference = typeof body.approvalReference === 'string' ? body.approvalReference.trim() : '';
  const approvedAt = typeof body.approvedAt === 'string' ? body.approvedAt.trim() : '';
  const notes = typeof body.notes === 'string' ? body.notes.trim() : '';
  const retentionNotes = typeof body.retentionNotes === 'string' ? body.retentionNotes.trim() : '';

  if (!id || !VALID_STATUS.has(status)) {
    return NextResponse.json({ error: 'A valid source id and status are required.' }, { status: 400 });
  }

  const rights = {
    pricing_right: asBoolean(body.pricingRight),
    image_right: asBoolean(body.imageRight),
    history_right: asBoolean(body.historyRight),
    affiliate_link_right: asBoolean(body.affiliateLinkRight),
    ai_processing_right: asBoolean(body.aiProcessingRight),
  };

  if (status === 'ACTIVE') {
    if (!approvalReference || !approvedAt || !rights.pricing_right || !rights.affiliate_link_right) {
      return NextResponse.json(
        {
          error:
            'ACTIVE requires dated approval evidence plus pricing and retailer-link permission. Keep the source PENDING until those are recorded.',
        },
        { status: 400 }
      );
    }

    const parsedDate = new Date(approvedAt);
    if (Number.isNaN(parsedDate.getTime())) {
      return NextResponse.json({ error: 'approvedAt must be a valid date/time.' }, { status: 400 });
    }
  }

  const { data: existing, error: readError } = await supabase
    .from('source_rights')
    .select('id,retailer,market,status')
    .eq('id', id)
    .maybeSingle();

  if (readError) {
    console.error('Source-rights read failed:', readError);
    return NextResponse.json({ error: 'Could not read source-rights record.' }, { status: 500 });
  }

  if (!existing) {
    return NextResponse.json({ error: 'Source-rights record not found.' }, { status: 404 });
  }

  const payload = {
    status,
    approval_reference: approvalReference || null,
    approved_at: approvedAt || null,
    pricing_right: rights.pricing_right,
    image_right: rights.image_right,
    history_right: rights.history_right,
    affiliate_link_right: rights.affiliate_link_right,
    ai_processing_right: rights.ai_processing_right,
    retention_notes: retentionNotes || null,
    notes,
    updated_at: new Date().toISOString(),
  };

  const { data, error } = await supabase
    .from('source_rights')
    .update(payload)
    .eq('id', id)
    .select('id,retailer,market,status,approval_reference,approved_at,pricing_right,image_right,history_right,affiliate_link_right,ai_processing_right,retention_notes,notes,updated_at')
    .single();

  if (error) {
    console.error('Source-rights update failed:', error);
    return NextResponse.json({ error: 'Could not update source-rights record.' }, { status: 500 });
  }

  console.info('Source-rights record updated', {
    sourceId: id,
    status,
    adminUserId: admin.user.id,
  });

  return NextResponse.json({ source: data });
}
