CREATE TABLE "public"."alert_events" (
  "id"           uuid                     NOT NULL DEFAULT gen_random_uuid(),
  "user_id"      uuid                     NOT NULL,
  "watchlist_id" uuid,
  "product_id"   uuid                     NOT NULL,
  "offer_id"     uuid,
  "alert_type"   text                     NOT NULL,
  "message"      text                     NOT NULL,
  "sent_at"      timestamp with time zone,
  "created_at"   timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT "alert_events_alert_type_check" CHECK ((alert_type = ANY (ARRAY['target_reached'::text, 'price_drop'::text, 'back_in_stock'::text]))),
  CONSTRAINT "alert_events_pkey" PRIMARY KEY (id),
  CONSTRAINT "alert_events_user_id_fkey" FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE,
  CONSTRAINT "alert_events_offer_id_fkey" FOREIGN KEY (offer_id) REFERENCES public.offers(id) ON DELETE SET NULL,
  CONSTRAINT "alert_events_product_id_fkey" FOREIGN KEY (product_id) REFERENCES public.products(id) ON DELETE CASCADE,
  CONSTRAINT "alert_events_watchlist_id_fkey" FOREIGN KEY (watchlist_id) REFERENCES public.watchlists(id) ON DELETE CASCADE
);

ALTER TABLE "public"."alert_events"
  ENABLE ROW LEVEL SECURITY;

CREATE INDEX alert_events_offer_idx ON public.alert_events USING btree (offer_id);

CREATE INDEX alert_events_product_idx ON public.alert_events USING btree (product_id);

CREATE INDEX alert_events_user_created_idx ON public.alert_events USING btree (user_id, created_at DESC);

CREATE INDEX alert_events_watchlist_idx ON public.alert_events USING btree (watchlist_id);

CREATE POLICY "Users can view own alerts" ON "public"."alert_events"
  FOR SELECT
  TO "authenticated"
  USING ((( SELECT auth.uid() AS uid) = user_id));

GRANT DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE ON TABLE "public"."alert_events" TO "postgres", "service_role";

REVOKE ALL ON TABLE "public"."alert_events" FROM "authenticated";

GRANT SELECT ON TABLE "public"."alert_events" TO "authenticated";
