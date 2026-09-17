CREATE TABLE "public"."ingestion_items" (
  "id"                 uuid                     NOT NULL DEFAULT gen_random_uuid(),
  "source_id"          uuid                     NOT NULL,
  "run_id"             uuid                     NOT NULL,
  "source_product_id"  text                     NOT NULL,
  "raw_title"          text                     NOT NULL,
  "normalized_title"   text                     NOT NULL,
  "brand"              text,
  "category_slug"      text,
  "price"              numeric                  NOT NULL,
  "currency"           text                     NOT NULL,
  "product_url"        text                     NOT NULL,
  "in_stock"           boolean                  NOT NULL DEFAULT true,
  "shipping_info"      text,
  "raw_payload"        jsonb                    NOT NULL DEFAULT '{}'::jsonb,
  "match_status"       text                     NOT NULL DEFAULT 'pending'::text,
  "product_id"         uuid,
  "confidence"         numeric,
  "created_at"         timestamp with time zone NOT NULL DEFAULT now(),
  "updated_at"         timestamp with time zone NOT NULL DEFAULT now(),
  "gtin"               text,
  "mpn"                text,
  "model"              text,
  "image_url"          text,
  "review_status"      text                     NOT NULL DEFAULT 'pending'::text,
  "review_note"        text,
  "reviewed_by"        uuid,
  "reviewed_at"        timestamp with time zone,
  "published_offer_id" uuid,
  "published_at"       timestamp with time zone,
  CONSTRAINT "ingestion_items_match_status_check"
    CHECK ((match_status = ANY (ARRAY['pending'::text, 'suggested'::text, 'review'::text, 'matched'::text, 'approved'::text, 'published'::text, 'rejected'::text]))),
  CONSTRAINT "ingestion_items_pkey" PRIMARY KEY (id),
  CONSTRAINT "ingestion_items_review_status_check" CHECK ((review_status = ANY (ARRAY['pending'::text, 'approved'::text, 'rejected'::text, 'published'::text]))),
  CONSTRAINT "ingestion_items_source_id_source_product_id_key" UNIQUE (source_id, source_product_id),
  CONSTRAINT "ingestion_items_run_id_fkey" FOREIGN KEY (run_id) REFERENCES public.ingestion_runs(id) ON DELETE CASCADE,
  CONSTRAINT "ingestion_items_source_id_fkey" FOREIGN KEY (source_id) REFERENCES public.ingestion_sources(id) ON DELETE CASCADE,
  CONSTRAINT "ingestion_items_published_offer_id_fkey" FOREIGN KEY (published_offer_id) REFERENCES public.offers(id) ON DELETE SET NULL,
  CONSTRAINT "ingestion_items_product_id_fkey" FOREIGN KEY (product_id) REFERENCES public.products(id) ON DELETE SET NULL
);

ALTER TABLE "public"."ingestion_items"
  ENABLE ROW LEVEL SECURITY;

CREATE INDEX ingestion_items_product_idx ON public.ingestion_items USING btree (product_id);

CREATE INDEX ingestion_items_run_idx ON public.ingestion_items USING btree (run_id);

CREATE UNIQUE INDEX ingestion_items_source_product_unique ON public.ingestion_items USING btree (source_id, source_product_id);

CREATE INDEX ingestion_items_source_status_idx ON public.ingestion_items USING btree (source_id, match_status);

GRANT DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE ON TABLE "public"."ingestion_items" TO "anon", "authenticated", "postgres", "service_role";
