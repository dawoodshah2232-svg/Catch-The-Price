import { NextRequest, NextResponse } from 'next/server';
import { requireAdminUser } from '@/lib/admin/requireAdmin';
import { executeAutomationJob, JobType } from '@/lib/automation/jobRunner.server';
import { logAdminAudit } from '@/lib/exceptions/queue.server';

const VALID_JOBS: Set<JobType> = new Set([
  'DISCOVER_PRODUCTS',
  'INGEST_FEEDS',
  'UPDATE_OFFERS',
  'CHECK_PRICES',
  'MATCH_PRODUCTS',
  'DETECT_DEALS',
  'GENERATE_CONTENT',
  'REFRESH_SEO',
  'SEND_ALERTS',
  'SEND_DIGESTS',
  'CHECK_AFFILIATE_LINKS',
  'CHECK_FEED_HEALTH',
]);

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

  const jobType = body.jobType as JobType;
  if (!jobType || !VALID_JOBS.has(jobType)) {
    return NextResponse.json({ error: 'Invalid or unsupported job type' }, { status: 400 });
  }

  const result = await executeAutomationJob(jobType, (body.config as any) || {});

  await logAdminAudit(
    auth.user.email || 'admin',
    'TRIGGER_AUTOMATION_JOB',
    'automation_jobs',
    result.runId,
    { jobType, status: result.status, itemsProcessed: result.itemsProcessed }
  );

  return NextResponse.json({ success: true, result });
}
