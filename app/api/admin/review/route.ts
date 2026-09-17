import { NextRequest, NextResponse } from 'next/server';
import { requireAdminUser } from '@/lib/admin/requireAdmin';
import { getServerSupabase } from '@/lib/supabase/server';
import { resolveReviewItem, logAdminAudit } from '@/lib/exceptions/queue.server';

export async function GET(request: NextRequest) {
  const auth = await requireAdminUser();
  if (!auth.ok) {
    return NextResponse.json({ error: 'Admin authorization required' }, { status: auth.status });
  }

  const supabase = getServerSupabase();
  if (!supabase) {
    return NextResponse.json({ items: [], error: 'Database unconfigured' });
  }

  const { searchParams } = new URL(request.url);
  const queueType = searchParams.get('queueType');
  const status = searchParams.get('status') || 'PENDING';

  let query = supabase.from('human_review_queue').select('*').order('created_at', { ascending: false });

  if (queueType) query = query.eq('queue_type', queueType);
  if (status && status !== 'all') query = query.eq('status', status);

  const { data, error } = await query.limit(100);

  if (error) {
    return NextResponse.json({ items: [], error: error.message });
  }

  return NextResponse.json({ items: data || [] });
}

export async function POST(request: NextRequest) {
  const auth = await requireAdminUser();
  if (!auth.ok) {
    return NextResponse.json({ error: 'Admin authorization required' }, { status: auth.status });
  }

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  const id = typeof body.id === 'string' ? body.id : '';
  const resolution = body.resolution === 'DISMISSED' ? 'DISMISSED' : 'RESOLVED';
  const notes = typeof body.notes === 'string' ? body.notes : '';

  if (!id) {
    return NextResponse.json({ error: 'Missing review item ID' }, { status: 400 });
  }

  const result = await resolveReviewItem(id, resolution, notes, auth.user.id);
  if (!result.success) {
    return NextResponse.json({ error: result.error }, { status: 500 });
  }

  await logAdminAudit(
    auth.user.email || 'admin',
    'RESOLVE_REVIEW_ITEM',
    'human_review_queue',
    id,
    { resolution, notes }
  );

  return NextResponse.json({ success: true });
}
