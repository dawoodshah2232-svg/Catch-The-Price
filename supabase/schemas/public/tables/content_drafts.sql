CREATE TABLE "public"."content_drafts" (
  "id"                    uuid                     NOT NULL DEFAULT gen_random_uuid(),
  "opportunity_id"        uuid,
  "market"                text                     NOT NULL,
  "title"                 text                     NOT NULL,
  "slug"                  text                     NOT NULL,
  "body_markdown"         text                     NOT NULL DEFAULT ''::text,
  "source_urls"           jsonb                    NOT NULL DEFAULT '[]'::jsonb,
  "quality_score"         numeric,
  "model_name"            text,
  "estimated_cost_usd"    numeric,
  "factual_review_status" text                     NOT NULL DEFAULT 'pending'::text,
  "editorial_status"      text                     NOT NULL DEFAULT 'draft'::text,
  "created_at"            timestamp with time zone NOT NULL DEFAULT now(),
  "updated_at"            timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT "content_drafts_editorial_status_check" CHECK ((editorial_status = ANY (ARRAY['draft'::text, 'review'::text, 'approved'::text, 'rejected'::text, 'published'::text]))),
  CONSTRAINT "content_drafts_estimated_cost_usd_check" CHECK (((estimated_cost_usd IS NULL) OR (estimated_cost_usd >= (0)::numeric))),
  CONSTRAINT "content_drafts_factual_review_status_check" CHECK ((factual_review_status = ANY (ARRAY['pending'::text, 'passed'::text, 'failed'::text, 'needs_review'::text]))),
  CONSTRAINT "content_drafts_market_check" CHECK ((market = ANY (ARRAY['ae'::text, 'us'::text, 'global'::text]))),
  CONSTRAINT "content_drafts_market_slug_key" UNIQUE (market, slug),
  CONSTRAINT "content_drafts_pkey" PRIMARY KEY (id),
  CONSTRAINT "content_drafts_quality_score_check" CHECK (((quality_score IS NULL) OR ((quality_score >= (0)::numeric) AND (quality_score <= (100)::numeric)))),
  CONSTRAINT "content_drafts_opportunity_id_fkey" FOREIGN KEY (opportunity_id) REFERENCES public.content_opportunities(id) ON DELETE SET NULL
);

ALTER TABLE "public"."content_drafts"
  ENABLE ROW LEVEL SECURITY;

CREATE INDEX content_drafts_status_idx ON public.content_drafts USING btree (editorial_status, created_at DESC);

GRANT DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE ON TABLE "public"."content_drafts" TO "postgres", "service_role";
