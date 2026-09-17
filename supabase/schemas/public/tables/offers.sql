CREATE TABLE "public"."offers" (
  "id"                uuid                     NOT NULL DEFAULT gen_random_uuid(),
  "product_id"        uuid                     NOT NULL,
  "merchant_id"       uuid                     NOT NULL,
  "country_code"      text                     NOT NULL,
  "currency"          text                     NOT NULL,
  "price"             numeric(14,2)            NOT NULL,
  "original_price"    numeric(14,2),
  "availability"      text                     NOT NULL DEFAULT 'unknown'::text,
  "product_url"       text                     NOT NULL,
  "affiliate_url"     text,
  "source_product_id" text,
  "last_checked_at"   timestamp with time zone NOT NULL DEFAULT now(),
  "is_active"         boolean                  NOT NULL DEFAULT true,
  "created_at"        timestamp with time zone NOT NULL DEFAULT now(),
  "updated_at"        timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT "offers_availability_check" CHECK ((availability = ANY (ARRAY['in_stock'::text, 'out_of_stock'::text, 'preorder'::text, 'unknown'::text]))),
  CONSTRAINT "offers_check" CHECK (((original_price IS NULL) OR (original_price >= price))),
  CONSTRAINT "offers_country_code_check" CHECK ((char_length(country_code) = 2)),
  CONSTRAINT "offers_currency_check" CHECK ((char_length(currency) = 3)),
  CONSTRAINT "offers_merchant_id_country_code_source_product_id_key" UNIQUE (merchant_id, country_code, source_product_id),
  CONSTRAINT "offers_merchant_id_fkey" FOREIGN KEY (merchant_id) REFERENCES public.merchants(id) ON DELETE CASCADE,
  CONSTRAINT "offers_pkey" PRIMARY KEY (id),
  CONSTRAINT "offers_price_check" CHECK ((price >= (0)::numeric)),
  CONSTRAINT "offers_product_id_fkey" FOREIGN KEY (product_id) REFERENCES public.products(id) ON DELETE CASCADE
);

ALTER TABLE "public"."offers"
  ENABLE ROW LEVEL SECURITY;

CREATE UNIQUE INDEX offers_merchant_source_product_unique ON public.offers USING btree (merchant_id, source_product_id)
  WHERE (source_product_id IS NOT NULL);

CREATE INDEX offers_product_country_price_idx ON public.offers USING btree (product_id, country_code, price)
  WHERE (is_active = true);

CREATE TRIGGER offers_touch_updated_at
  BEFORE UPDATE ON public.offers
  FOR EACH ROW
  EXECUTE FUNCTION public.touch_updated_at();

CREATE POLICY "Public can view active offers" ON "public"."offers"
  FOR SELECT
  TO "anon", "authenticated"
  USING ((is_active = true));

GRANT DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE ON TABLE "public"."offers" TO "postgres", "service_role";

REVOKE ALL ON TABLE "public"."offers" FROM "anon";

GRANT SELECT ON TABLE "public"."offers" TO "anon";

REVOKE ALL ON TABLE "public"."offers" FROM "authenticated";

GRANT SELECT ON TABLE "public"."offers" TO "authenticated";
