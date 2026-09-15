import 'server-only';

import { CountryCode } from '@/lib/types';
import { IngestionPipelineResult } from './types';

export interface RunPipelineOptions {
  sourceId?: string;
  country?: CountryCode;
}

/**
 * Legacy runner intentionally disabled.
 * Real ingestion now runs through /api/admin/ingestion/run using persisted
 * ingestion_sources + source_rights, official adapters, staging, and review.
 */
export async function runIngestionPipeline(
  _options: RunPipelineOptions = {}
): Promise<IngestionPipelineResult> {
  void _options;
  throw new Error(
    'Legacy ingestion runner is disabled. Use the authenticated database-backed ingestion workflow.'
  );
}
