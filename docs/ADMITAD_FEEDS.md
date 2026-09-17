# Admitad product feeds

The importer uses official Admitad XML export URLs only. Store each URL in the matching server-side environment variable from `.env.example`; do not add any value to source control or a `NEXT_PUBLIC_*` variable.

Each source begins disabled and its source-rights record is `PENDING`. Before enabling it in Admin → Data Ingestion, record the dated Admitad approval reference and explicitly enable pricing, image, history, and affiliate-link permissions.

The scheduled endpoint runs once daily and is protected by `CRON_SECRET`. It streams XML with bounded memory, stages up to `ADMITAD_FEED_MAX_ITEMS_PER_RUN` qualified products per source, and upserts by source + retailer product ID. Items remain in the existing matching/review workflow before public product/offer publication.

For very large AliExpress exports, use the nine segmented URLs already modeled in the migration. Do not point a serverless job at a monolithic multi-million-product export; split the provider feed further or run it through dedicated background infrastructure before raising the per-run limit.
