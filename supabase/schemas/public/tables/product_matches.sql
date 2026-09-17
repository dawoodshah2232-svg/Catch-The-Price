CREATE TABLE "public"."product_matches" (
  "id"                uuid                     NOT NULL DEFAULT gen_random_uuid(),
  "source_name"       text                     NOT NULL,
  "source_product_id" text                     NOT NULL,
  "product_id"        uuid                     NOT NULL,
  "confidence"        numeric(5,4),
  "match_method"      text                     NOT NULL,
  "raw_title"         text,
  "created_at"        timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT "product_matches_confidence_check" CHECK (((confidence IS NULL) OR ((confidence >= (0)::numeric) AND (confidence <= (100)::numeric)))),
  CONSTRAINT "product_matches_match_method_check"
    CHECK
    ((match_method = ANY (ARRAY['exact_gtin'::text, 'exact_mpn'::text, 'exact_model'::text, 'exact_sku'::text, 'rules'::text, 'ai'::text, 'manual'::text, 'manual_review'::text,
    'manual_create'::text]))),
  CONSTRAINT "product_matches_pkey" PRIMARY KEY (id),
  CONSTRAINT "product_matches_source_name_source_product_id_key" UNIQUE (source_name, source_product_id),
  CONSTRAINT "product_matches_product_id_fkey" FOREIGN KEY (product_id) REFERENCES public.products(id) ON DELETE CASCADE
);

ALTER TABLE "public"."product_matches"
  ENABLE ROW LEVEL SECURITY;

CREATE INDEX product_matches_product_idx ON public.product_matches USING btree (product_id);

GRANT DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE ON TABLE "public"."product_matches" TO "postgres", "service_role";
