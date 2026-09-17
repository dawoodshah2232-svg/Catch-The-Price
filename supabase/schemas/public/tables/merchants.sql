CREATE TABLE "public"."merchants" (
  "id"           uuid                     NOT NULL DEFAULT gen_random_uuid(),
  "name"         text                     NOT NULL,
  "slug"         text                     NOT NULL,
  "country_code" text                     NOT NULL,
  "website_url"  text                     NOT NULL,
  "logo_url"     text,
  "is_active"    boolean                  NOT NULL DEFAULT true,
  "created_at"   timestamp with time zone NOT NULL DEFAULT now(),
  "updated_at"   timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT "merchants_country_code_check" CHECK ((char_length(country_code) = 2)),
  CONSTRAINT "merchants_pkey" PRIMARY KEY (id),
  CONSTRAINT "merchants_slug_key" UNIQUE (slug)
);

ALTER TABLE "public"."merchants"
  ENABLE ROW LEVEL SECURITY;

CREATE TRIGGER merchants_touch_updated_at
  BEFORE UPDATE ON public.merchants
  FOR EACH ROW
  EXECUTE FUNCTION public.touch_updated_at();

CREATE POLICY "Public can view active merchants" ON "public"."merchants"
  FOR SELECT
  TO "anon", "authenticated"
  USING ((is_active = true));

GRANT DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE ON TABLE "public"."merchants" TO "postgres", "service_role";

REVOKE ALL ON TABLE "public"."merchants" FROM "anon";

GRANT SELECT ON TABLE "public"."merchants" TO "anon";

REVOKE ALL ON TABLE "public"."merchants" FROM "authenticated";

GRANT SELECT ON TABLE "public"."merchants" TO "authenticated";
