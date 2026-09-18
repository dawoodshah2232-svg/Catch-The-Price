create table if not exists public.content_opportunities (
  id uuid primary key default gen_random_uuid(),
  topic text not null,
  market text not null check (market in ('ae','us','global')),
  category_slug text,
  search_intent text not null default 'commercial' check (search_intent in ('commercial','transactional','informational','comparison','news')),
  source_urls jsonb not null default '[]'::jsonb,
  evidence_summary text,
  confidence numeric check (confidence is null or (confidence >= 0 and confidence <= 100)),
  seo_potential numeric check (seo_potential is null or (seo_potential >= 0 and seo_potential <= 100)),
  commercial_intent numeric check (commercial_intent is null or (commercial_intent >= 0 and commercial_intent <= 100)),
  status text not null default 'new' check (status in ('new','researching','draft_ready','review','approved','rejected','published')),
  discovered_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.content_drafts (
  id uuid primary key default gen_random_uuid(),
  opportunity_id uuid references public.content_opportunities(id) on delete set null,
  market text not null check (market in ('ae','us','global')),
  title text not null,
  slug text not null,
  body_markdown text not null default '',
  source_urls jsonb not null default '[]'::jsonb,
  quality_score numeric check (quality_score is null or (quality_score >= 0 and quality_score <= 100)),
  model_name text,
  estimated_cost_usd numeric check (estimated_cost_usd is null or estimated_cost_usd >= 0),
  factual_review_status text not null default 'pending' check (factual_review_status in ('pending','passed','failed','needs_review')),
  editorial_status text not null default 'draft' check (editorial_status in ('draft','review','approved','rejected','published')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (market, slug)
);

create table if not exists public.ai_jobs (
  id uuid primary key default gen_random_uuid(),
  job_type text not null check (job_type in ('trend_research','content_research','draft_generation','product_enrichment','comparison_draft','seo_analysis')),
  status text not null default 'queued' check (status in ('queued','running','completed','failed','cancelled')),
  model_name text,
  input_reference text,
  output_reference text,
  confidence numeric check (confidence is null or (confidence >= 0 and confidence <= 100)),
  estimated_cost_usd numeric check (estimated_cost_usd is null or estimated_cost_usd >= 0),
  actual_cost_usd numeric check (actual_cost_usd is null or actual_cost_usd >= 0),
  error_message text,
  started_at timestamptz,
  finished_at timestamptz,
  created_at timestamptz not null default now()
);

create index if not exists content_opportunities_status_idx on public.content_opportunities(status, created_at desc);
create index if not exists content_drafts_status_idx on public.content_drafts(editorial_status, created_at desc);
create index if not exists ai_jobs_status_idx on public.ai_jobs(status, created_at desc);

alter table public.content_opportunities enable row level security;
alter table public.content_drafts enable row level security;
alter table public.ai_jobs enable row level security;

revoke all on public.content_opportunities from anon, authenticated;
revoke all on public.content_drafts from anon, authenticated;
revoke all on public.ai_jobs from anon, authenticated;
