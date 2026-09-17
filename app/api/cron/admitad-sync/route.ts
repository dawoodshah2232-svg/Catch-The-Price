import { NextRequest, NextResponse } from 'next/server';
import { syncConfiguredAdmitadFeeds } from '@/lib/ingestion/admitadFeedSync.server';

export const dynamic = 'force-dynamic';
export const maxDuration = 300;

export async function GET(request: NextRequest) {
  const secret = process.env.CRON_SECRET?.trim();
  if (!secret || request.headers.get('authorization') !== `Bearer ${secret}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const results = await syncConfiguredAdmitadFeeds();
    const failed = results.filter((result) => result.status === 'failed').length;
    return NextResponse.json({ ok: failed === 0, feeds: results.length, failed, results });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Admitad feed synchronization failed';
    console.error('Scheduled Admitad feed synchronization failed:', message);
    return NextResponse.json({ error: 'Admitad feed synchronization failed' }, { status: 500 });
  }
}
