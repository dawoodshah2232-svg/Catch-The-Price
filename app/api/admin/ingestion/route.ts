import { NextRequest, NextResponse } from 'next/server';
import { requireAdminUser } from '@/lib/admin/requireAdmin';
import { getServerSupabase } from '@/lib/supabase/server';
import { getSourceRights, listSourceRights } from '@/lib/config/sourceRights';

export async function GET() {
  const admin = await requireAdminUser();
  if (!admin.ok) return NextResponse.json({ error: 'Unauthorized' }, { status: admin.status });

  const supabase = getServerSupabase();
  if (!supabase) return NextResponse.json({ error: 'Server database is not configured.' }, { status: 503 });

  const [{ data: sourceRows, error: sourceError }, { data: runRows, error: runError }, rights] = await Promise.all([
    supabase
      .from('ingestion_sources')
      .select('id,name,source_type,country_code,base_url,config,is_active,created_at,updated_at')
      .order('country_code')
      .order('name'),
    supabase
      .from('ingestion_runs')
      .select('id,source_id,status,items_seen,items_created,items_updated,items_staged,items_rejected,error_message,started_at,finished_at,created_at,ingestion_sources(name,country_code)')
      .order('created_at', { ascending: false })
      .limit(50),
    listSourceRights(),
  ]);

  if (sourceError) {
    console.error('Failed to load ingestion sources:', sourceError);
    return NextResponse.json({ error: 'Could not load ingestion sources.' }, { status: 500 });
  }
  if (runError) console.error('Failed to load ingestion runs:', runError);

  const rightsById = new Map(rights.map((record) => [record.id, record]));

  const sources = (sourceRows || []).map((source) => {
    const config = (source.config || {}) as Record<string, unknown>;
    const rightsId = typeof config.rightsId === 'string' ? config.rightsId : '';
    const adapter = typeof config.adapter === 'string' ? config.adapter : 'unset';
    const apiEnvKey = typeof config.apiEnvKey === 'string' ? config.apiEnvKey : null;
    const rightsRecord = rightsId ? rightsById.get(rightsId) : undefined;
    const credentialReady = apiEnvKey ? Boolean(process.env[apiEnvKey]?.trim()) : true;
    const rightsReady = Boolean(
      rightsRecord &&
        rightsRecord.status === 'ACTIVE' &&
        rightsRecord.pricingRight &&
        rightsRecord.affiliateLinkRight &&
        rightsRecord.approvalReference &&
        rightsRecord.approvedAt
    );

    let readiness: 'disabled' | 'pending_rights' | 'missing_credentials' | 'ready' | 'invalid_config' = 'ready';
    if (!rightsId || adapter === 'unset') readiness = 'invalid_config';
    else if (!source.is_active) readiness = 'disabled';
    else if (!rightsReady) readiness = 'pending_rights';
    else if (!credentialReady) readiness = 'missing_credentials';

    return {
      id: source.id,
      name: source.name,
      sourceType: source.source_type,
      country: String(source.country_code || '').toLowerCase(),
      baseUrl: source.base_url,
      adapter,
      rightsId,
      rightsStatus: rightsRecord?.status || 'MISSING',
      rightsReady,
      credentialReady,
      credentialEnvKey: apiEnvKey,
      isActive: Boolean(source.is_active),
      readiness,
      updatedAt: source.updated_at,
    };
  });

  const runs = (runRows || []).map((run) => {
    const joined = Array.isArray(run.ingestion_sources) ? run.ingestion_sources[0] : run.ingestion_sources;
    return {
      id: run.id,
      sourceId: run.source_id,
      sourceName: joined?.name || 'Unknown source',
      country: String(joined?.country_code || '').toLowerCase(),
      status: run.status,
      itemsSeen: run.items_seen || 0,
      itemsStaged: run.items_staged || 0,
      itemsRejected: run.items_rejected || 0,
      itemsCreated: run.items_created || 0,
      itemsUpdated: run.items_updated || 0,
      error: run.error_message || null,
      startedAt: run.started_at,
      finishedAt: run.finished_at,
      createdAt: run.created_at,
    };
  });

  return NextResponse.json({ sources, runs });
}

export async function PATCH(request: NextRequest) {
  const admin = await requireAdminUser();
  if (!admin.ok) return NextResponse.json({ error: 'Unauthorized' }, { status: admin.status });

  const supabase = getServerSupabase();
  if (!supabase) return NextResponse.json({ error: 'Server database is not configured.' }, { status: 503 });

  let body: { sourceId?: string; isActive?: boolean };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body.' }, { status: 400 });
  }

  const sourceId = typeof body.sourceId === 'string' ? body.sourceId.trim() : '';
  if (!sourceId || typeof body.isActive !== 'boolean') {
    return NextResponse.json({ error: 'sourceId and isActive are required.' }, { status: 400 });
  }

  const { data: source, error: sourceError } = await supabase
    .from('ingestion_sources')
    .select('id,name,config,is_active')
    .eq('id', sourceId)
    .maybeSingle();

  if (sourceError || !source) return NextResponse.json({ error: 'Ingestion source not found.' }, { status: 404 });

  if (body.isActive) {
    const config = (source.config || {}) as Record<string, unknown>;
    const rightsId = typeof config.rightsId === 'string' ? config.rightsId : '';
    const apiEnvKey = typeof config.apiEnvKey === 'string' ? config.apiEnvKey : null;
    const adapter = typeof config.adapter === 'string' ? config.adapter : '';

    if (!rightsId || !adapter) {
      return NextResponse.json({ error: 'Source configuration is incomplete.' }, { status: 409 });
    }

    const rights = await getSourceRights(rightsId);
    const rightsReady = Boolean(
      rights &&
        rights.status === 'ACTIVE' &&
        rights.pricingRight &&
        rights.affiliateLinkRight &&
        rights.approvalReference &&
        rights.approvedAt
    );

    if (!rightsReady) {
      return NextResponse.json({ error: 'Source rights must be ACTIVE with dated evidence before enabling this connector.' }, { status: 409 });
    }

    if (apiEnvKey && !process.env[apiEnvKey]?.trim()) {
      return NextResponse.json({ error: `Private credential ${apiEnvKey} is not configured.` }, { status: 409 });
    }
  }

  const { error: updateError } = await supabase
    .from('ingestion_sources')
    .update({ is_active: body.isActive, updated_at: new Date().toISOString() })
    .eq('id', sourceId);

  if (updateError) return NextResponse.json({ error: 'Could not update source state.' }, { status: 500 });

  console.info('Ingestion source state changed', {
    sourceId,
    isActive: body.isActive,
    adminUserId: admin.user.id,
  });

  return NextResponse.json({ ok: true, isActive: body.isActive });
}

export async function POST() {
  return NextResponse.json(
    { error: 'Use /api/admin/ingestion/run with a specific approved source.' },
    { status: 405, headers: { Allow: 'GET, PATCH' } }
  );
}
