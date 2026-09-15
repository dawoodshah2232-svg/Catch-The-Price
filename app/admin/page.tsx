import React from 'react';
import {
  Activity,
  AlertTriangle,
  CheckCircle2,
  Database,
  GitMerge,
  MousePointerClick,
  Package,
  ShieldCheck,
  Store,
} from 'lucide-react';
import { getServerSupabase } from '@/lib/supabase/server';
import { listSourceRights } from '@/lib/config/sourceRights';

type CountResult = { count: number | null; error: unknown };

type SourceRow = {
  id: string;
  config: Record<string, unknown> | null;
  is_active: boolean;
};

function metricTone(value: number, positive = true) {
  if (value > 0 && positive) return 'text-emerald-400';
  return 'text-slate-100';
}

export default async function AdminOverviewPage() {
  const supabase = getServerSupabase();
  const rights = await listSourceRights();

  let products = 0;
  let offers = 0;
  let pendingReview = 0;
  let pageViews = 0;
  let outboundClicks = 0;
  let sources: SourceRow[] = [];
  let readError = false;

  if (supabase) {
    const [
      productsResult,
      offersResult,
      pendingResult,
      pageViewsResult,
      clicksResult,
      sourcesResult,
    ] = await Promise.all([
      supabase.from('products').select('id', { count: 'exact', head: true }).eq('status', 'active'),
      supabase.from('offers').select('id', { count: 'exact', head: true }).eq('is_active', true),
      supabase.from('ingestion_items').select('id', { count: 'exact', head: true }).eq('review_status', 'pending'),
      supabase.from('analytics_events').select('id', { count: 'exact', head: true }).eq('event_type', 'page_view'),
      supabase.from('outbound_clicks').select('id', { count: 'exact', head: true }),
      supabase.from('ingestion_sources').select('id,config,is_active'),
    ]);

    const countResults = [productsResult, offersResult, pendingResult, pageViewsResult, clicksResult] as CountResult[];
    products = productsResult.count || 0;
    offers = offersResult.count || 0;
    pendingReview = pendingResult.count || 0;
    pageViews = pageViewsResult.count || 0;
    outboundClicks = clicksResult.count || 0;
    sources = (sourcesResult.data || []) as SourceRow[];
    readError = countResults.some((result) => Boolean(result.error)) || Boolean(sourcesResult.error);
  } else {
    readError = true;
  }

  const approvedRights = rights.filter(
    (record) =>
      record.status === 'ACTIVE' &&
      record.pricingRight &&
      record.affiliateLinkRight &&
      record.approvalReference &&
      record.approvedAt
  );

  const readyConnectors = sources.filter((source) => {
    if (!source.is_active) return false;
    const config = source.config || {};
    const rightsId = typeof config.rightsId === 'string' ? config.rightsId : '';
    const apiEnvKey = typeof config.apiEnvKey === 'string' ? config.apiEnvKey : '';
    const rightsReady = approvedRights.some((record) => record.id === rightsId);
    const credentialReady = apiEnvKey ? Boolean(process.env[apiEnvKey]?.trim()) : true;
    return Boolean(rightsId && rightsReady && credentialReady);
  }).length;

  const blockers = [
    approvedRights.length === 0 ? 'Approve at least one retailer/source with documented pricing and affiliate-link rights.' : null,
    readyConnectors === 0 ? 'Connect credentials for one approved UAE or US data source.' : null,
    products === 0 ? 'Ingest, review and publish the first canonical product.' : null,
    offers === 0 ? 'Publish at least one real in-stock retailer offer.' : null,
  ].filter(Boolean) as string[];

  const launchState = blockers.length === 0 ? 'Core catalog pipeline ready' : `${blockers.length} launch blocker${blockers.length === 1 ? '' : 's'}`;

  return (
    <div className="space-y-6">
      <div className="pb-6 border-b border-ctp">
        <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">CatchThePrice Operations</span>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-100 mt-1">What needs attention</h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-2 max-w-3xl leading-relaxed">
          Live operational status from Supabase and server configuration. No demo revenue, fake health badges or simulated feed counts are included.
        </p>
      </div>

      {readError && (
        <div className="rounded-2xl border border-rose-500/30 bg-rose-500/10 p-4 text-xs text-rose-100">
          One or more operational metrics could not be read. Treat this dashboard as incomplete until the database connection is healthy.
        </div>
      )}

      <div className={`rounded-2xl border p-4 flex items-start gap-3 ${blockers.length === 0 ? 'border-emerald-500/30 bg-emerald-500/10' : 'border-amber-500/30 bg-amber-500/10'}`}>
        {blockers.length === 0 ? <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" /> : <AlertTriangle className="w-5 h-5 text-amber-300 shrink-0 mt-0.5" />}
        <div>
          <h2 className={`text-sm font-bold ${blockers.length === 0 ? 'text-emerald-100' : 'text-amber-100'}`}>{launchState}</h2>
          <p className={`text-xs mt-1 leading-relaxed ${blockers.length === 0 ? 'text-emerald-100/80' : 'text-amber-100/80'}`}>
            {blockers.length === 0
              ? 'The catalog pipeline has an approved source, a ready connector, live products and live offers. Continue QA before public promotion.'
              : blockers[0]}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 xl:grid-cols-4 gap-3">
        <Metric label="Approved sources" value={approvedRights.length} detail={`${rights.length} rights records`} icon={ShieldCheck} tone={metricTone(approvedRights.length)} />
        <Metric label="Ready connectors" value={readyConnectors} detail={`${sources.length} configured source records`} icon={Database} tone={metricTone(readyConnectors)} />
        <Metric label="Live products" value={products} detail="Active canonical products" icon={Package} tone={metricTone(products)} />
        <Metric label="Live offers" value={offers} detail="Active retailer offers" icon={Store} tone={metricTone(offers)} />
        <Metric label="Pending review" value={pendingReview} detail="Staged items awaiting a decision" icon={GitMerge} tone={pendingReview > 0 ? 'text-amber-300' : 'text-slate-100'} />
        <Metric label="Page views" value={pageViews} detail="Recorded first-party page views" icon={Activity} tone={metricTone(pageViews)} />
        <Metric label="Retailer clicks" value={outboundClicks} detail="Validated outbound hand-offs" icon={MousePointerClick} tone={metricTone(outboundClicks)} />
        <Metric label="Launch markets" value={2} detail="UAE + United States" icon={CheckCircle2} tone="text-emerald-400" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <section className="rounded-2xl bg-ctp-surface border border-ctp p-5">
          <h2 className="font-bold text-sm text-slate-100 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" /> Current launch blockers
          </h2>
          {blockers.length === 0 ? (
            <p className="mt-4 text-xs text-emerald-300">No core catalog blockers detected. Continue mobile, SEO and content QA.</p>
          ) : (
            <ol className="mt-4 space-y-3 text-xs text-slate-300 list-decimal pl-5">
              {blockers.map((blocker) => <li key={blocker}>{blocker}</li>)}
            </ol>
          )}
        </section>

        <section className="rounded-2xl bg-ctp-surface border border-ctp p-5">
          <h2 className="font-bold text-sm text-slate-100">Owner routine</h2>
          <div className="mt-4 space-y-3 text-xs text-slate-300">
            <p>1. Resolve failed or blocked source connections.</p>
            <p>2. Review uncertain product matches and staged items.</p>
            <p>3. Check zero-result searches, top viewed products and retailer clicks.</p>
            <p>4. Review stale or unavailable offers before they reach shoppers.</p>
            <p>5. Approve editorial drafts only after factual/source checks.</p>
          </div>
        </section>
      </div>
    </div>
  );
}

function Metric({
  label,
  value,
  detail,
  icon: Icon,
  tone,
}: {
  label: string;
  value: number;
  detail: string;
  icon: React.ComponentType<{ className?: string }>;
  tone: string;
}) {
  return (
    <div className="p-4 rounded-2xl bg-ctp-surface border border-ctp min-h-32">
      <div className="flex items-center justify-between text-slate-400 text-xs mb-3">
        <span>{label}</span>
        <Icon className="w-4 h-4 text-slate-500" />
      </div>
      <div className={`text-2xl font-extrabold ${tone}`}>{value.toLocaleString()}</div>
      <p className="text-[10px] text-slate-500 mt-1.5 leading-relaxed">{detail}</p>
    </div>
  );
}
