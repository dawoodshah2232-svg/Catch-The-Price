CREATE TABLE "public"."ingestion_sources" (
  "id"           uuid                     NOT NULL DEFAULT gen_random_uuid(),
  "name"         text                     NOT NULL,
  "source_type"  text                     NOT NULL,
  "country_code" text,
  "base_url"     text,
  "config"       jsonb                    NOT NULL DEFAULT '{}'::jsonb,
  "is_active"    boolean                  NOT NULL DEFAULT true,
  "created_at"   timestamp with time zone NOT NULL DEFAULT now(),
  "updated_at"   timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT "ingestion_sources_country_code_check" CHECK (((country_code IS NULL) OR (char_length(country_code) = 2))),
  CONSTRAINT "ingestion_sources_name_key" UNIQUE (name),
  CONSTRAINT "ingestion_sources_pkey" PRIMARY KEY (id),
  CONSTRAINT "ingestion_sources_source_type_check" CHECK ((source_type = ANY (ARRAY['api'::text, 'feed'::text, 'affiliate_feed'::text, 'permitted_crawl'::text, 'manual'::text])))
);

ALTER TABLE "public"."ingestion_sources"
  ENABLE ROW LEVEL SECURITY;

CREATE TRIGGER ingestion_sources_touch_updated_at
  BEFORE UPDATE ON public.ingestion_sources
  FOR EACH ROW
  EXECUTE FUNCTION public.touch_updated_at();

GRANT DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE ON TABLE "public"."ingestion_sources" TO "postgres", "service_role";
