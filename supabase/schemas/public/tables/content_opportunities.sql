CREATE TABLE "public"."content_opportunities" (
  "id"                uuid                     NOT NULL DEFAULT gen_random_uuid(),
  "topic"             text                     NOT NULL,
  "market"            text                     NOT NULL,
  "category_slug"     text,
  "search_intent"     text                     NOT NULL DEFAULT 'commercial'::text,
  "source_urls"       jsonb                    NOT NULL DEFAULT '[]'::jsonb,
  "evidence_summary"  text,
  "confidence"        numeric,
  "seo_potential"     numeric,
  "commercial_intent" numeric,
  "status"            text                     NOT NULL DEFAULT 'new'::text,
  "discovered_at"     timestamp with time zone NOT NULL DEFAULT now(),
  "created_at"        timestamp with time zone NOT NULL DEFAULT now(),
  "updated_at"        timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT "content_opportunities_commercial_intent_check"
    CHECK (((commercial_intent IS NULL) OR ((commercial_intent >= (0)::numeric) AND (commercial_intent <= (100)::numeric)))),
  CONSTRAINT "content_opportunities_confidence_check" CHECK (((confidence IS NULL) OR ((confidence >= (0)::numeric) AND (confidence <= (100)::numeric)))),
  CONSTRAINT "content_opportunities_market_check" CHECK ((market = ANY (ARRAY['ae'::text, 'us'::text, 'global'::text]))),
  CONSTRAINT "content_opportunities_pkey" PRIMARY KEY (id),
  CONSTRAINT "content_opportunities_search_intent_check"
    CHECK ((search_intent = ANY (ARRAY['commercial'::text, 'transactional'::text, 'informational'::text, 'comparison'::text, 'news'::text]))),
  CONSTRAINT "content_opportunities_seo_potential_check" CHECK (((seo_potential IS NULL) OR ((seo_potential >= (0)::numeric) AND (seo_potential <= (100)::numeric)))),
  CONSTRAINT "content_opportunities_status_check"
    CHECK ((status = ANY (ARRAY['new'::text, 'researching'::text, 'draft_ready'::text, 'review'::text, 'approved'::text, 'rejected'::text, 'published'::text])))
);

ALTER TABLE "public"."content_opportunities"
  ENABLE ROW LEVEL SECURITY;

CREATE INDEX content_opportunities_status_idx ON public.content_opportunities USING btree (status, created_at DESC);

GRANT DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE ON TABLE "public"."content_opportunities" TO "postgres", "service_role";
