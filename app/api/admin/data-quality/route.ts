import { NextResponse } from 'next/server';
import { requireAdminUser } from '@/lib/admin/requireAdmin';
import { runDataQualityAudit } from '@/lib/dataQuality/dataQualityEngine.server';

export const dynamic = 'force-dynamic';

export async function POST() {
  const auth = await requireAdminUser();
  if (!auth.ok) {
    return NextResponse.json({ error: 'Admin authorization required' }, { status: auth.status });
  }

  try {
    const report = await runDataQualityAudit();
    return NextResponse.json({ ok: true, report });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Data quality audit failed';
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}
