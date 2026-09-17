CREATE TABLE "public"."price_history" (
  "id"             bigint                   GENERATED ALWAYS AS IDENTITY NOT NULL,
  "offer_id"       uuid                     NOT NULL,
  "price"          numeric(14,2)            NOT NULL,
  "original_price" numeric(14,2),
  "availability"   text                     NOT NULL DEFAULT 'unknown'::text,
  "captured_at"    timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT "price_history_offer_id_fkey" FOREIGN KEY (offer_id) REFERENCES public.offers(id) ON DELETE CASCADE,
  CONSTRAINT "price_history_pkey" PRIMARY KEY (id),
  CONSTRAINT "price_history_price_check" CHECK ((price >= (0)::numeric))
);

ALTER TABLE "public"."price_history"
  ENABLE ROW LEVEL SECURITY;

CREATE INDEX price_history_offer_captured_idx ON public.price_history USING btree (offer_id, captured_at DESC);

CREATE POLICY "Public can view price history" ON "public"."price_history"
  FOR SELECT
  TO "anon", "authenticated"
  USING (true);

GRANT DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE ON TABLE "public"."price_history" TO "postgres", "service_role";

REVOKE ALL ON TABLE "public"."price_history" FROM "anon";

GRANT SELECT ON TABLE "public"."price_history" TO "anon";

REVOKE ALL ON TABLE "public"."price_history" FROM "authenticated";

GRANT SELECT ON TABLE "public"."price_history" TO "authenticated";
