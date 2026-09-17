CREATE TABLE "public"."products" (
  "id"          uuid                     NOT NULL DEFAULT gen_random_uuid(),
  "category_id" uuid,
  "brand"       text,
  "name"        text                     NOT NULL,
  "slug"        text                     NOT NULL,
  "model"       text,
  "gtin"        text,
  "sku"         text,
  "image_url"   text,
  "description" text,
  "ai_summary"  text,
  "specs"       jsonb                    NOT NULL DEFAULT '{}'::jsonb,
  "status"      text                     NOT NULL DEFAULT 'active'::text,
  "created_at"  timestamp with time zone NOT NULL DEFAULT now(),
  "updated_at"  timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT "products_category_id_fkey" FOREIGN KEY (category_id) REFERENCES public.categories(id) ON DELETE SET NULL,
  CONSTRAINT "products_pkey" PRIMARY KEY (id),
  CONSTRAINT "products_slug_key" UNIQUE (slug),
  CONSTRAINT "products_status_check" CHECK ((status = ANY (ARRAY['active'::text, 'hidden'::text, 'archived'::text])))
);

ALTER TABLE "public"."products"
  ENABLE ROW LEVEL SECURITY;

CREATE INDEX products_category_idx ON public.products USING btree (category_id);

CREATE TRIGGER products_touch_updated_at
  BEFORE UPDATE ON public.products
  FOR EACH ROW
  EXECUTE FUNCTION public.touch_updated_at();

CREATE POLICY "Public can view active products" ON "public"."products"
  FOR SELECT
  TO "anon", "authenticated"
  USING ((status = 'active'::text));

GRANT DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE ON TABLE "public"."products" TO "postgres", "service_role";

REVOKE ALL ON TABLE "public"."products" FROM "anon";

GRANT SELECT ON TABLE "public"."products" TO "anon";

REVOKE ALL ON TABLE "public"."products" FROM "authenticated";

GRANT SELECT ON TABLE "public"."products" TO "authenticated";
