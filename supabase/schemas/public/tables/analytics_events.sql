CREATE TABLE "public"."analytics_events" (
  "id"            uuid                     NOT NULL DEFAULT gen_random_uuid(),
  "event_type"    text                     NOT NULL,
  "country_code"  text,
  "path"          text                     NOT NULL,
  "referrer_host" text,
  "device_type"   text                     NOT NULL DEFAULT 'unknown'::text,
  "session_id"    uuid,
  "search_query"  text,
  "product_slug"  text,
  "metadata"      jsonb                    NOT NULL DEFAULT '{}'::jsonb,
  "created_at"    timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT "analytics_events_country_code_check" CHECK ((country_code = ANY (ARRAY['ae'::text, 'us'::text]))),
  CONSTRAINT "analytics_events_event_type_check" CHECK ((event_type = ANY (ARRAY['page_view'::text, 'search'::text, 'product_view'::text, 'save'::text, 'alert_intent'::text]))),
  CONSTRAINT "analytics_events_pkey" PRIMARY KEY (id)
);

ALTER TABLE "public"."analytics_events"
  ENABLE ROW LEVEL SECURITY;

CREATE INDEX analytics_events_created_idx ON public.analytics_events USING btree (created_at DESC);

CREATE INDEX analytics_events_path_created_idx ON public.analytics_events USING btree (path, created_at DESC);

CREATE INDEX analytics_events_session_idx ON public.analytics_events USING btree (session_id, created_at DESC);

CREATE INDEX analytics_events_type_created_idx ON public.analytics_events USING btree (event_type, created_at DESC);

GRANT DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE ON TABLE "public"."analytics_events" TO "anon", "authenticated", "postgres", "service_role";
