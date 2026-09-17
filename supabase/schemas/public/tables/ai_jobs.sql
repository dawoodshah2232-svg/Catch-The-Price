CREATE TABLE "public"."ai_jobs" (
  "id"                 uuid                     NOT NULL DEFAULT gen_random_uuid(),
  "job_type"           text                     NOT NULL,
  "status"             text                     NOT NULL DEFAULT 'queued'::text,
  "model_name"         text,
  "input_reference"    text,
  "output_reference"   text,
  "confidence"         numeric,
  "estimated_cost_usd" numeric,
  "actual_cost_usd"    numeric,
  "error_message"      text,
  "started_at"         timestamp with time zone,
  "finished_at"        timestamp with time zone,
  "created_at"         timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT "ai_jobs_actual_cost_usd_check" CHECK (((actual_cost_usd IS NULL) OR (actual_cost_usd >= (0)::numeric))),
  CONSTRAINT "ai_jobs_confidence_check" CHECK (((confidence IS NULL) OR ((confidence >= (0)::numeric) AND (confidence <= (100)::numeric)))),
  CONSTRAINT "ai_jobs_estimated_cost_usd_check" CHECK (((estimated_cost_usd IS NULL) OR (estimated_cost_usd >= (0)::numeric))),
  CONSTRAINT "ai_jobs_job_type_check"
    CHECK
    ((job_type = ANY (ARRAY['trend_research'::text, 'content_research'::text, 'draft_generation'::text, 'product_enrichment'::text, 'comparison_draft'::text,
    'seo_analysis'::text]))),
  CONSTRAINT "ai_jobs_pkey" PRIMARY KEY (id),
  CONSTRAINT "ai_jobs_status_check" CHECK ((status = ANY (ARRAY['queued'::text, 'running'::text, 'completed'::text, 'failed'::text, 'cancelled'::text])))
);

ALTER TABLE "public"."ai_jobs"
  ENABLE ROW LEVEL SECURITY;

CREATE INDEX ai_jobs_status_idx ON public.ai_jobs USING btree (status, created_at DESC);

GRANT DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE ON TABLE "public"."ai_jobs" TO "postgres", "service_role";
