import React from 'react';
import { AlertTriangle, FileText, Lightbulb, Sparkles, Workflow } from 'lucide-react';
import { getServerSupabase } from '@/lib/supabase/server';
import { ContentDemandButton } from '@/components/admin/ContentDemandButton';

type Opportunity = {
  id: string;
  topic: string;
  market: string;
  category_slug: string | null;
  search_intent: string;
  confidence: number | string | null;
  seo_potential: number | string | null;
  commercial_intent: number | string | null;
  status: string;
  created_at: string;
};

type Draft = {
  id: string;
  title: string;
  market: string;
  slug: string;
  quality_score: number | string | null;
  model_name: string | null;
  estimated_cost_usd: number | string | null;
  factual_review_status: string;
  editorial_status: string;
  created_at: string;
};

type Job = {
  id: string;
  job_type: string;
  status: string;
  model_name: string | null;
  confidence: number | string | null;
  actual_cost_usd: number | string | null;
  error_message: string | null;
  created_at: string;
};

function score(value: number | string | null) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? Math.round(parsed) : null;
}

function statusClass(status: string) {
  if (['approved', 'published', 'completed'].includes(status)) return 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300';
  if (['failed', 'rejected'].includes(status)) return 'bg-rose-500/10 border-rose-500/30 text-rose-300';
  if (['review', 'needs_review', 'running', 'researching'].includes(status)) return 'bg-amber-500/10 border-amber-500/30 text-amber-200';
  return 'bg-slate-800 border-slate-700 text-slate-300';
}

export default async function AdminContentPage() {
  const supabase = getServerSupabase();
  let opportunities: Opportunity[] = [];
  let drafts: Draft[] = [];
  let jobs: Job[] = [];
  let readError = false;

  if (supabase) {
    const [opportunityResult, draftResult, jobsResult] = await Promise.all([
      supabase
        .from('content_opportunities')
        .select('id,topic,market,category_slug,search_intent,confidence,seo_potential,commercial_intent,status,created_at')
        .order('created_at', { ascending: false })
        .limit(100),
      supabase
        .from('content_drafts')
        .select('id,title,market,slug,quality_score,model_name,estimated_cost_usd,factual_review_status,editorial_status,created_at')
        .order('created_at', { ascending: false })
        .limit(100),
      supabase
        .from('ai_jobs')
        .select('id,job_type,status,model_name,confidence,actual_cost_usd,error_message,created_at')
        .order('created_at', { ascending: false })
        .limit(100),
    ]);

    opportunities = (opportunityResult.data || []) as Opportunity[];
    drafts = (draftResult.data || []) as Draft[];
    jobs = (jobsResult.data || []) as Job[];
    readError = Boolean(opportunityResult.error || draftResult.error || jobsResult.error);
  } else {
    readError = true;
  }

  const pendingDrafts = drafts.filter((draft) => ['draft', 'review'].includes(draft.editorial_status)).length;
  const approvedDrafts = drafts.filter((draft) => ['approved', 'published'].includes(draft.editorial_status)).length;
  const failedJobs = jobs.filter((job) => job.status === 'failed').length;
  const runningJobs = jobs.filter((job) => ['queued', 'running'].includes(job.status)).length;
  const totalCost = jobs.reduce((sum, job) => sum + (Number(job.actual_cost_usd) || 0), 0);

  return (
    <div className="space-y-6">
      <div className="pb-6 border-b border-ctp flex flex-col sm:flex-row sm:items-start justify-between gap-4">
        <div>
          <span className="text-[10px] uppercase tracking-[0.18em] font-extrabold text-emerald-400">Controlled automation</span>
          <h1 className="text-2xl font-extrabold text-slate-100 mt-1">Content &amp; AI operations</h1>
          <p className="text-xs text-slate-400 mt-1 max-w-3xl">
            Research and drafting can be automated, but publication is deliberately human-gated. This dashboard only shows persisted opportunities, drafts and AI jobs — never simulated activity.
          </p>
        </div>
        <ContentDemandButton />
      </div>

      {readError && (
        <div className="rounded-2xl border border-rose-500/30 bg-rose-500/10 p-4 text-xs text-rose-100">
          The content/AI queue could not be read from Supabase.
        </div>
      )}

      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
        <Metric label="Opportunities" value={opportunities.length} />
        <Metric label="Drafts to review" value={pendingDrafts} warning={pendingDrafts > 0} />
        <Metric label="Approved / published" value={approvedDrafts} />
        <Metric label="Queued / running jobs" value={runningJobs} warning={runningJobs > 0} />
        <Metric label="Recorded AI cost" value={`$${totalCost.toFixed(2)}`} warning={failedJobs > 0} />
      </div>

      <section className="rounded-2xl bg-ctp-surface border border-ctp overflow-hidden">
        <div className="p-4 border-b border-ctp flex items-center justify-between gap-3">
          <div>
            <h2 className="text-sm font-bold text-slate-100 flex items-center gap-2"><Lightbulb className="w-4 h-4 text-amber-300" /> Content opportunity queue</h2>
            <p className="text-[10px] text-slate-500 mt-1">First-party search demand and future research discoveries waiting for evidence-based drafting.</p>
          </div>
          <span className="text-xs text-slate-400">{opportunities.length}</span>
        </div>

        {opportunities.length === 0 ? (
          <EmptyState icon={Lightbulb} title="No opportunities queued yet" body="Run search-demand discovery after visitors begin searching. It uses zero-result demand and never auto-publishes content." />
        ) : (
          <div className="divide-y divide-ctp">
            {opportunities.map((item) => (
              <div key={item.id} className="p-4 flex flex-col md:flex-row md:items-center justify-between gap-3">
                <div className="min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="text-sm font-bold text-slate-100">{item.topic}</h3>
                    <Badge value={item.status} />
                  </div>
                  <div className="text-[10px] text-slate-500 mt-1 uppercase tracking-wide">{item.market} · {item.category_slug || 'general'} · {item.search_intent}</div>
                </div>
                <div className="grid grid-cols-3 gap-2 text-center shrink-0">
                  <Score label="Confidence" value={score(item.confidence)} />
                  <Score label="SEO" value={score(item.seo_potential)} />
                  <Score label="Commercial" value={score(item.commercial_intent)} />
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        <section className="rounded-2xl bg-ctp-surface border border-ctp overflow-hidden">
          <div className="p-4 border-b border-ctp flex items-center justify-between">
            <h2 className="text-sm font-bold text-slate-100 flex items-center gap-2"><FileText className="w-4 h-4 text-cyan-300" /> Draft review queue</h2>
            <span className="text-xs text-slate-400">{drafts.length}</span>
          </div>
          {drafts.length === 0 ? (
            <EmptyState icon={FileText} title="No AI/editorial drafts yet" body="Drafts will remain private until factual review and editorial approval are complete." />
          ) : (
            <div className="divide-y divide-ctp">
              {drafts.map((draft) => (
                <div key={draft.id} className="p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0"><h3 className="text-xs font-bold text-slate-100 truncate">{draft.title}</h3><div className="text-[10px] text-slate-500 mt-1">{draft.market.toUpperCase()} · /{draft.slug}</div></div>
                    <Badge value={draft.editorial_status} />
                  </div>
                  <div className="mt-3 flex flex-wrap gap-2 text-[10px] text-slate-400">
                    <span className="rounded-lg border border-ctp px-2 py-1">Facts: {draft.factual_review_status}</span>
                    <span className="rounded-lg border border-ctp px-2 py-1">Quality: {score(draft.quality_score) ?? '—'}</span>
                    <span className="rounded-lg border border-ctp px-2 py-1">Model: {draft.model_name || '—'}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        <section className="rounded-2xl bg-ctp-surface border border-ctp overflow-hidden">
          <div className="p-4 border-b border-ctp flex items-center justify-between">
            <h2 className="text-sm font-bold text-slate-100 flex items-center gap-2"><Workflow className="w-4 h-4 text-emerald-400" /> AI job log</h2>
            <span className="text-xs text-slate-400">{jobs.length}</span>
          </div>
          {jobs.length === 0 ? (
            <EmptyState icon={Sparkles} title="No AI jobs have run yet" body="Search-demand discovery and future controlled research/drafting jobs will be recorded here." />
          ) : (
            <div className="divide-y divide-ctp">
              {jobs.map((job) => (
                <div key={job.id} className="p-4">
                  <div className="flex items-center justify-between gap-3">
                    <div><div className="text-xs font-bold text-slate-100">{job.job_type.replaceAll('_', ' ')}</div><div className="text-[10px] text-slate-500 mt-1">{job.model_name || 'Model not recorded'}</div></div>
                    <Badge value={job.status} />
                  </div>
                  {job.error_message && <div className="mt-2 text-[10px] text-rose-300 flex items-start gap-1.5"><AlertTriangle className="w-3.5 h-3.5 shrink-0" />{job.error_message}</div>}
                </div>
              ))}
            </div>
          )}
        </section>
      </div>

      <div className="rounded-2xl border border-ctp bg-slate-900/50 p-4 text-[11px] text-slate-400 flex items-start gap-2">
        <Sparkles className="w-4 h-4 text-emerald-400 shrink-0" />
        AI may research, organize evidence and prepare drafts. It does not receive direct publication authority; factual review and editorial approval remain separate gates.
      </div>
    </div>
  );
}

function Metric({ label, value, warning = false }: { label: string; value: string | number; warning?: boolean }) {
  return <div className="rounded-2xl bg-ctp-surface border border-ctp p-4"><div className="text-[10px] uppercase tracking-wider font-bold text-slate-500">{label}</div><div className={`text-xl font-extrabold mt-1 ${warning ? 'text-amber-300' : 'text-slate-100'}`}>{value}</div></div>;
}

function Badge({ value }: { value: string }) {
  return <span className={`shrink-0 px-2 py-1 rounded-lg border text-[9px] font-extrabold uppercase ${statusClass(value)}`}>{value.replaceAll('_', ' ')}</span>;
}

function Score({ label, value }: { label: string; value: number | null }) {
  return <div className="rounded-lg bg-slate-950/60 border border-ctp px-2 py-1.5 min-w-16"><div className="text-[8px] uppercase text-slate-600 font-bold">{label}</div><div className="text-xs font-extrabold text-slate-200 mt-0.5">{value ?? '—'}</div></div>;
}

function EmptyState({ icon: Icon, title, body }: { icon: React.ComponentType<{ className?: string }>; title: string; body: string }) {
  return <div className="p-8 text-center"><Icon className="w-7 h-7 text-slate-600 mx-auto" /><h3 className="text-sm font-bold text-slate-200 mt-3">{title}</h3><p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">{body}</p></div>;
}
