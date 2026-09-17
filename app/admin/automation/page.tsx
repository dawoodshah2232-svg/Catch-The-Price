import React from 'react';
import { RefreshCw } from 'lucide-react';
import { getServerSupabase } from '@/lib/supabase/server';
import { AutomationTriggerButton } from './AutomationTriggerButton';

export const metadata = {
  title: 'Automation & Jobs | Admin',
};

const REGISTERED_JOBS = [
  { id: 'CHECK_PRICES', name: 'Price Check & Alert Evaluator', schedule: 'Every 30 mins', description: 'Evaluates active user price alerts against latest retailer offers.' },
  { id: 'DETECT_DEALS', name: 'Deal Scoring Engine', schedule: 'Every hour', description: 'Scores active offers on percentage drop, historical low, and competition.' },
  { id: 'MATCH_PRODUCTS', name: 'Product Matcher', schedule: 'On Ingestion', description: 'Multi-stage matcher evaluating exact GTIN/MPN identifiers and token similarity.' },
  { id: 'GENERATE_CONTENT', name: 'Demand Content Discoverer', schedule: 'Daily', description: 'Analyzes zero-result and high-volume searches to identify editorial content needs.' },
  { id: 'INGEST_FEEDS', name: 'Retailer Feed Ingestion', schedule: 'Every 6 hours', description: 'Pulls product feeds from rights-approved retailers.' },
  { id: 'CHECK_AFFILIATE_LINKS', name: 'Affiliate Link Health Check', schedule: 'Daily', description: 'Verifies outbound merchant destinations and HTTPS resolution.' },
  { id: 'REFRESH_SEO', name: 'SEO & Structured Data Refresh', schedule: 'Daily', description: 'Regenerates product breadcrumbs and AggregateOffer JSON-LD metadata.' },
  { id: 'SEND_DIGESTS', name: 'Weekly Watchlist Digest', schedule: 'Weekly', description: 'Dispatches price change summaries to opted-in users.' },
];

export default async function AutomationPage() {
  const supabase = getServerSupabase();
  let runs: any[] = [];
  const dbConnected = Boolean(supabase);

  if (supabase) {
    const { data } = await supabase
      .from('automation_runs')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(20);
    runs = data || [];
  }

  return (
    <div className="space-y-8 text-slate-100">
      <div>
        <h1 className="text-xl font-black text-white flex items-center gap-2.5">
          <RefreshCw className="w-5 h-5 text-emerald-400" />
          <span>Automation Engine & Background Jobs</span>
        </h1>
        <p className="mt-1 text-xs text-slate-400">
          Autonomous catalog processing, price intelligence, deal evaluation, and alert dispatches.
        </p>
      </div>

      {/* Jobs Registry Table */}
      <section className="rounded-2xl border border-ctp bg-ctp-surface p-5">
        <h2 className="text-xs font-black text-slate-200 uppercase tracking-wider mb-4">
          Configured Automation Tasks
        </h2>

        <div className="divide-y divide-ctp">
          {REGISTERED_JOBS.map((job) => (
            <div key={job.id} className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-extrabold text-white">{job.name}</span>
                  <span className="rounded bg-slate-800 px-2 py-0.5 text-[10px] font-mono text-emerald-400 border border-slate-700">
                    {job.schedule}
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 mt-0.5">{job.description}</p>
              </div>

              <div className="shrink-0">
                <AutomationTriggerButton jobType={job.id} jobName={job.name} />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Execution History */}
      <section className="rounded-2xl border border-ctp bg-ctp-surface p-5">
        <h2 className="text-xs font-black text-slate-200 uppercase tracking-wider mb-4">
          Recent Job Executions
        </h2>

        {runs.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-ctp text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  <th className="pb-3">Job Type</th>
                  <th className="pb-3">Status</th>
                  <th className="pb-3">Processed</th>
                  <th className="pb-3">Failed</th>
                  <th className="pb-3">Executed At</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-ctp">
                {runs.map((run) => (
                  <tr key={run.id} className="text-slate-300">
                    <td className="py-3 font-mono font-bold text-white">{run.job_type}</td>
                    <td className="py-3">
                      <span
                        className={`inline-flex items-center gap-1 rounded px-2 py-0.5 text-[10px] font-bold ${
                          run.status === 'completed'
                            ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                            : run.status === 'running'
                            ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                            : 'bg-red-500/20 text-red-400 border border-red-500/30'
                        }`}
                      >
                        {run.status}
                      </span>
                    </td>
                    <td className="py-3">{run.items_processed || 0}</td>
                    <td className="py-3 text-red-400">{run.items_failed || 0}</td>
                    <td className="py-3 text-slate-500">{new Date(run.created_at).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="rounded-xl border border-dashed border-ctp p-8 text-center text-xs text-slate-500">
            {dbConnected
              ? 'No background job runs recorded yet. Use the "Run Now" buttons above to dispatch a task.'
              : 'Database unconfigured. Job runs will appear here once Supabase connection credentials are provided.'}
          </div>
        )}
      </section>
    </div>
  );
}
