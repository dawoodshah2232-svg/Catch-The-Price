CREATE TABLE "public"."watchlists" (
  "id"             uuid                     NOT NULL DEFAULT gen_random_uuid(),
  "user_id"        uuid                     NOT NULL,
  "product_id"     uuid                     NOT NULL,
  "target_price"   numeric(14,2),
  "country_code"   text                     NOT NULL,
  "is_active"      boolean                  NOT NULL DEFAULT true,
  "created_at"     timestamp with time zone NOT NULL DEFAULT now(),
  "alert_type"     text                     NOT NULL DEFAULT 'saved'::text,
  "notify_email"   text,
  "email_verified" boolean                  NOT NULL DEFAULT false,
  "updated_at"     timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT "watchlists_alert_type_check" CHECK ((alert_type = ANY (ARRAY['saved'::text, 'any_drop'::text, 'below_amount'::text, 'major_deal'::text]))),
  CONSTRAINT "watchlists_country_code_check" CHECK ((char_length(country_code) = 2)),
  CONSTRAINT "watchlists_pkey" PRIMARY KEY (id),
  CONSTRAINT "watchlists_product_id_fkey" FOREIGN KEY (product_id) REFERENCES public.products(id) ON DELETE CASCADE,
  CONSTRAINT "watchlists_target_price_check" CHECK (((target_price IS NULL) OR (target_price >= (0)::numeric))),
  CONSTRAINT "watchlists_user_id_fkey" FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE,
  CONSTRAINT "watchlists_user_id_product_id_country_code_key" UNIQUE (user_id, product_id, country_code)
);

ALTER TABLE "public"."watchlists"
  ENABLE ROW LEVEL SECURITY;

CREATE INDEX idx_watchlists_user_country ON public.watchlists USING btree (user_id, country_code, is_active);

CREATE INDEX watchlists_product_idx ON public.watchlists USING btree (product_id);

CREATE INDEX watchlists_user_idx ON public.watchlists USING btree (user_id, is_active);

CREATE POLICY "Users can create own watchlist" ON "public"."watchlists"
  FOR INSERT
  TO "authenticated"
  WITH CHECK ((( SELECT auth.uid() AS uid) = user_id));

CREATE POLICY "Users can delete own watchlist" ON "public"."watchlists"
  FOR DELETE
  TO "authenticated"
  USING ((( SELECT auth.uid() AS uid) = user_id));

CREATE POLICY "Users can update own watchlist" ON "public"."watchlists"
  FOR UPDATE
  TO "authenticated"
  USING ((( SELECT auth.uid() AS uid) = user_id))
  WITH CHECK ((( SELECT auth.uid() AS uid) = user_id));

CREATE POLICY "Users can view own watchlist" ON "public"."watchlists"
  FOR SELECT
  TO "authenticated"
  USING ((( SELECT auth.uid() AS uid) = user_id));

GRANT DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE ON TABLE "public"."watchlists" TO "postgres", "service_role";

REVOKE ALL ON TABLE "public"."watchlists" FROM "authenticated";

GRANT DELETE, INSERT, SELECT, UPDATE ON TABLE "public"."watchlists" TO "authenticated";
