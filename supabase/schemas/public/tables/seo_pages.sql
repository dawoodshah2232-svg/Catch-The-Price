CREATE TABLE "public"."seo_pages" (
  "id"           uuid                     NOT NULL DEFAULT gen_random_uuid(),
  "page_type"    text                     NOT NULL,
  "entity_id"    uuid,
  "country_code" text,
  "slug"         text                     NOT NULL,
  "title"        text                     NOT NULL,
  "description"  text                     NOT NULL,
  "h1"           text,
  "content"      jsonb                    NOT NULL DEFAULT '{}'::jsonb,
  "is_indexable" boolean                  NOT NULL DEFAULT true,
  "updated_at"   timestamp with time zone NOT NULL DEFAULT now(),
  "created_at"   timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT "seo_pages_country_code_check" CHECK (((country_code IS NULL) OR (char_length(country_code) = 2))),
  CONSTRAINT "seo_pages_page_type_check" CHECK ((page_type = ANY (ARRAY['product'::text, 'category'::text, 'deals'::text, 'country'::text, 'guide'::text]))),
  CONSTRAINT "seo_pages_pkey" PRIMARY KEY (id),
  CONSTRAINT "seo_pages_slug_key" UNIQUE (slug)
);

ALTER TABLE "public"."seo_pages"
  ENABLE ROW LEVEL SECURITY;

CREATE TRIGGER seo_pages_touch_updated_at
  BEFORE UPDATE ON public.seo_pages
  FOR EACH ROW
  EXECUTE FUNCTION public.touch_updated_at();

CREATE POLICY "Public can view indexable SEO pages" ON "public"."seo_pages"
  FOR SELECT
  TO "anon", "authenticated"
  USING ((is_indexable = true));

GRANT DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE ON TABLE "public"."seo_pages" TO "postgres", "service_role";

REVOKE ALL ON TABLE "public"."seo_pages" FROM "anon";

GRANT SELECT ON TABLE "public"."seo_pages" TO "anon";

REVOKE ALL ON TABLE "public"."seo_pages" FROM "authenticated";

GRANT SELECT ON TABLE "public"."seo_pages" TO "authenticated";
