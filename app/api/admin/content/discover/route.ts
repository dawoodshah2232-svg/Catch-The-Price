import { NextResponse } from 'next/server';
import { requireAdminUser } from '@/lib/admin/requireAdmin';
import { discoverContentDemand } from '@/lib/content/demandWorker.server';

export async function POST() {
  const admin = await requireAdminUser();
  if (!admin.ok) return NextResponse.json({ error: 'Unauthorized' }, { status: admin.status });

  try {
    const result = await discoverContentDemand();
    console.info('Content demand discovery completed', {
      adminUserId: admin.user.id,
      ...result,
    });
    return NextResponse.json({ ok: true, result });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Content demand discovery failed';
    console.error('Content demand discovery failed:', error);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
