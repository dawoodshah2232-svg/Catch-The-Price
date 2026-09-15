import 'server-only';

/**
 * Deprecated compatibility surface.
 * Production source configuration now lives in public.ingestion_sources and
 * public.source_rights. Keeping a hard-coded retailer list here previously made
 * unapproved integrations look connected when they were not.
 */
export type IngestionSource = never;

export function getSourceConnectors(): IngestionSource[] {
  return [];
}
