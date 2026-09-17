CREATE TABLE "public"."outbound_clicks" (
  "id"            uuid                     NOT NULL DEFAULT gen_random_uuid(),
  "offer_id"      uuid                     NOT NULL,
  "product_id"    uuid                     NOT NULL,
  "merchant_id"   uuid                     NOT NULL,
  "country_code"  text                     NOT NULL,
  "price"         numeric                  NOT NULL,
  "currency"      text                     NOT NULL,
  "referrer_host" text,
  "device_type"   text                     NOT NULL DEFAULT 'unknown'::text,
  "created_at"    timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT "outbound_clicks_country_code_check" CHECK ((country_code = ANY (ARRAY['ae'::text, 'us'::text]))),
  CONSTRAINT "outbound_clicks_device_type_check" CHECK ((device_type = ANY (ARRAY['mobile'::text, 'tablet'::text, 'desktop'::text, 'unknown'::text]))),
  CONSTRAINT "outbound_clicks_merchant_id_fkey" FOREIGN KEY (merchant_id) REFERENCES public.merchants(id) ON DELETE CASCADE,
  CONSTRAINT "outbound_clicks_offer_id_fkey" FOREIGN KEY (offer_id) REFERENCES public.offers(id) ON DELETE CASCADE,
  CONSTRAINT "outbound_clicks_pkey" PRIMARY KEY (id),
  CONSTRAINT "outbound_clicks_product_id_fkey" FOREIGN KEY (product_id) REFERENCES public.products(id) ON DELETE CASCADE
);

ALTER TABLE "public"."outbound_clicks"
  ENABLE ROW LEVEL SECURITY;

CREATE INDEX outbound_clicks_country_code_idx ON public.outbound_clicks USING btree (country_code);

CREATE INDEX outbound_clicks_created_at_idx ON public.outbound_clicks USING btree (created_at DESC);

CREATE INDEX outbound_clicks_merchant_id_idx ON public.outbound_clicks USING btree (merchant_id);

CREATE INDEX outbound_clicks_offer_id_idx ON public.outbound_clicks USING btree (offer_id);

GRANT DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE ON TABLE "public"."outbound_clicks" TO "anon", "authenticated", "postgres", "service_role";

COMMENT ON TABLE "public"."outbound_clicks" IS 'Privacy-minimized retailer handoff analytics. No raw IP address or full user-agent is stored.';
