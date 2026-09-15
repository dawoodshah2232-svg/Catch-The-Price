# CatchThePrice Supabase

The production database is migration-driven.

## Source of truth

Use the files in `supabase/migrations/` plus the verified live Supabase project state.

`schema.sql` is a historical bootstrap snapshot from an earlier project stage. It is **not** the production authority and must not be run blindly against the live CatchThePrice database.

## Rules

- Apply new DDL through a named migration.
- Keep RLS enabled on user/operational tables.
- Browser clients must never receive the service-role key.
- Operational/admin-only tables should fail closed for `anon` and ordinary `authenticated` users unless a specific user-facing policy is intentionally added.
- Never seed production with fabricated prices, merchants, analytics, ingestion runs, content activity or revenue.
- Source rights must be recorded before retailer data can publish.
- The live launch markets are UAE (`ae`) and United States (`us`) only.

## Current operational migrations

- source-rights registry
- ingestion staging/review
- outbound click analytics
- first-party analytics events
- controlled content/AI queues

When the database changes, update the migration history in the same work unit so GitHub and Supabase do not drift.
