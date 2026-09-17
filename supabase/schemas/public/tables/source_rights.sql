CREATE TABLE "public"."source_rights" (
  "id"                   text                     NOT NULL,
  "retailer"             text                     NOT NULL,
  "market"               text                     NOT NULL,
  "status"               text                     NOT NULL DEFAULT 'PENDING'::text,
  "approval_reference"   text,
  "approved_at"          timestamp with time zone,
  "pricing_right"        boolean                  NOT NULL DEFAULT false,
  "image_right"          boolean                  NOT NULL DEFAULT false,
  "history_right"        boolean                  NOT NULL DEFAULT false,
  "affiliate_link_right" boolean                  NOT NULL DEFAULT false,
  "ai_processing_right"  boolean                  NOT NULL DEFAULT false,
  "retention_notes"      text,
  "notes"                text                     NOT NULL DEFAULT ''::text,
  "created_at"           timestamp with time zone NOT NULL DEFAULT now(),
  "updated_at"           timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT "source_rights_market_check" CHECK ((market = ANY (ARRAY['ae'::text, 'us'::text]))),
  CONSTRAINT "source_rights_pkey" PRIMARY KEY (id),
  CONSTRAINT "source_rights_status_check" CHECK ((status = ANY (ARRAY['DISABLED'::text, 'PENDING'::text, 'ACTIVE'::text, 'REVOKED'::text])))
);

ALTER TABLE "public"."source_rights"
  ENABLE ROW LEVEL SECURITY;

CREATE INDEX source_rights_market_status_idx ON public.source_rights USING btree (market, status);

GRANT DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE ON TABLE "public"."source_rights" TO "anon", "authenticated", "postgres", "service_role";
