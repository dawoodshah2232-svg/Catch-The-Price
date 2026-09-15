import { NextResponse } from 'next/server';
import { requireAdminUser } from '@/lib/admin/requireAdmin';
import { evaluatePriceAlerts } from '@/lib/alerts/evaluator.server';

export async function POST() {
  const admin = await requireAdminUser();
  if (!admin.ok) return NextResponse.json({ error: 'Unauthorized' }, { status: admin.status });

  try {
    const result = await evaluatePriceAlerts();
    console.info('Price alert evaluation completed', {
      adminUserId: admin.user.id,
      ...result,
    });

    return NextResponse.json({
      ok: true,
      result,
      deliveryState: 'queued_only',
      message: 'Eligible alert events were queued. Email delivery remains disabled until a verified delivery provider is configured.',
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Alert evaluation failed';
    console.error('Price alert evaluation failed:', error);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
