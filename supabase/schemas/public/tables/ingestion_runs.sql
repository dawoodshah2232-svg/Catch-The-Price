CREATE TABLE "public"."ingestion_runs" (
  "id"             uuid                     NOT NULL DEFAULT gen_random_uuid(),
  "source_id"      uuid                     NOT NULL,
  "status"         text                     NOT NULL,
  "items_seen"     integer                  NOT NULL DEFAULT 0,
  "items_created"  integer                  NOT NULL DEFAULT 0,
  "items_updated"  integer                  NOT NULL DEFAULT 0,
  "error_message"  text,
  "started_at"     timestamp with time zone,
  "finished_at"    timestamp with time zone,
  "created_at"     timestamp with time zone NOT NULL DEFAULT now(),
  "items_staged"   integer                  NOT NULL DEFAULT 0,
  "items_rejected" integer                  NOT NULL DEFAULT 0,
  CONSTRAINT "ingestion_runs_pkey" PRIMARY KEY (id),
  CONSTRAINT "ingestion_runs_status_check" CHECK ((status = ANY (ARRAY['queued'::text, 'running'::text, 'success'::text, 'partial'::text, 'failed'::text]))),
  CONSTRAINT "ingestion_runs_source_id_fkey" FOREIGN KEY (source_id) REFERENCES public.ingestion_sources(id) ON DELETE CASCADE
);

ALTER TABLE "public"."ingestion_runs"
  ENABLE ROW LEVEL SECURITY;

CREATE INDEX ingestion_runs_source_created_idx ON public.ingestion_runs USING btree (source_id, created_at DESC);

GRANT DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE ON TABLE "public"."ingestion_runs" TO "postgres", "service_role";
