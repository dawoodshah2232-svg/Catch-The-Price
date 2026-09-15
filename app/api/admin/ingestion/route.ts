import { NextResponse } from 'next/server';
import { getSourceConnectors } from '@/lib/ingestion/sources';
import { runIngestionPipeline } from '@/lib/ingestion/pipeline';

export async function GET() {
  const sources = getSourceConnectors();
  return NextResponse.json({
    success: true,
    sources,
  });
}

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const result = await runIngestionPipeline({
      sourceId: body.sourceId,
      country: body.country,
    });

    return NextResponse.json({
      success: true,
      result,
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        error: error?.message || 'Ingestion pipeline execution failed',
      },
      { status: 500 }
    );
  }
}
