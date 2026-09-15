import { NextRequest, NextResponse } from 'next/server';
import { evaluatePriceAlerts } from '@/lib/alerts/evaluator.server';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const secret = process.env.CRON_SECRET?.trim();
  const authorization = request.headers.get('authorization');

  if (!secret || authorization !== `Bearer ${secret}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const result = await evaluatePriceAlerts();
    console.info('Scheduled price alert evaluation completed', result);

    return NextResponse.json({
      ok: true,
      result,
      deliveryState: 'queued_only',
      message: 'Eligible alert events were queued. Notification delivery remains disabled until a verified provider is configured.',
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Scheduled alert evaluation failed';
    console.error('Scheduled price alert evaluation failed:', error);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
