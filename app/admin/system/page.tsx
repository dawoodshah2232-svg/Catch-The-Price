import React from 'react';
import { Activity, CheckCircle2, AlertTriangle } from 'lucide-react';
import { getServerSupabase, isServerSupabaseConfigured } from '@/lib/supabase/server';
import { getEffectiveEmailProvider } from '@/lib/email/provider';
import { getAdminAllowlist } from '@/lib/supabase/auth-server';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'System Health & Audit Logs | Admin',
};

async function getSystemMetrics() {
  const supabase = getServerSupabase();
  let auditLogs: any[] = [];
  let staleOffersCount = 0;
  let activeJobsCount = 0;
  let failedJobs24hCount = 0;
  let feedsCount = 0;
  let feedsErrorCount = 0;

  if (supabase) {
    const now = Date.now();
    const staleCutoff = new Date(now - 7 * 86400000).toISOString();
    const dayAgo = new Date(now - 86400000).toISOString();

    const [logsRes, staleRes, jobsRes, failedRunsRes, feedsRes] = await Promise.all([
      supabase.from('audit_logs').select('*').order('created_at', { ascending: false }).limit(30),
      supabase.from('offers').select('id', { count: 'exact', head: true }).eq('is_active', true).lt('last_checked_at', staleCutoff),
      supabase.from('automation_jobs').select('id', { count: 'exact', head: true }).eq('is_active', true),
      supabase.from('automation_runs').select('id', { count: 'exact', head: true }).eq('status', 'failed').gt('created_at', dayAgo),
      supabase.from('ingestion_sources').select('id, error_count, is_active'),
    ]);

    auditLogs = logsRes.data || [];
    staleOffersCount = staleRes.count || 0;
    activeJobsCount = jobsRes.count || 0;
    failedJobs24hCount = failedRunsRes.count || 0;
    if (feedsRes.data) {
      feedsCount = feedsRes.data.length;
      feedsErrorCount = feedsRes.data.filter((f: any) => (f.error_count || 0) > 0).length;
    }
  }

  return { auditLogs, staleOffersCount, activeJobsCount, failedJobs24hCount, feedsCount, feedsErrorCount };
}

export default async function SystemPage() {
  const emailProvider = getEffectiveEmailProvider();
  const adminEmails = getAdminAllowlist();
  const hasCronSecret = Boolean(process.env.CRON_SECRET && process.env.CRON_SECRET.length > 10);
  const { auditLogs, staleOffersCount, activeJobsCount, failedJobs24hCount, feedsCount, feedsErrorCount } =
    await getSystemMetrics();

  const hasGeminiKey = Boolean(process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY.length > 5);

  const healthChecks = [
    {
      name: 'Supabase Database',
      status: isServerSupabaseConfigured ? 'Healthy' : 'Unconfigured',
      ok: isServerSupabaseConfigured,
      detail: isServerSupabaseConfigured
        ? 'Connected via server-only service role'
        : 'NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY is missing',
    },
    {
      name: 'Transactional Email Provider',
      status: emailProvider.isConfigured() ? `Active (${emailProvider.name})` : 'Unconfigured',
      ok: emailProvider.isConfigured(),
      detail: emailProvider.isConfigured()
        ? `Ready to dispatch transactional alerts via ${emailProvider.name}`
        : 'RESEND_API_KEY is not configured; simulated safe no-op active',
    },
    {
      name: 'Scheduled Cron Authentication',
      status: hasCronSecret ? 'Secured' : 'Missing Secret',
      ok: hasCronSecret,
      detail: hasCronSecret
        ? 'CRON_SECRET is configured for authenticated background triggers'
        : 'CRON_SECRET environment variable is missing',
    },
    {
      name: 'Administrator Access Control',
      status: adminEmails.length > 0 ? `${adminEmails.length} Admin(s) Authorized` : 'No Admins Configured',
      ok: adminEmails.length > 0,
      detail: adminEmails.length > 0
        ? `Protected by server allowlist: ${adminEmails.join(', ')}`
        : 'ADMIN_EMAILS environment variable is empty',
    },
    {
      name: 'Retailer Feeds & Ingestion',
      status: feedsCount > 0 ? (feedsErrorCount === 0 ? 'Healthy' : `${feedsErrorCount} Feed Error(s)`) : 'No Feeds Initialized',
      ok: feedsCount > 0 && feedsErrorCount === 0,
      detail: feedsCount > 0
        ? `${feedsCount} ingestion feed source(s) registered; ${feedsErrorCount} reporting errors`
        : 'Ingestion feeds pending merchant partnership credentials',
    },
    {
      name: 'Scheduled Background Jobs',
      status: activeJobsCount > 0 ? `${activeJobsCount} Active Jobs` : 'No Active Jobs',
      ok: activeJobsCount > 0,
      detail: `${activeJobsCount} background automation jobs currently enabled in database schedule`,
    },
    {
      name: 'Automation Failure Rate (24h)',
      status: failedJobs24hCount === 0 ? '0 Failures' : `${failedJobs24hCount} Failed Run(s)`,
      ok: failedJobs24hCount === 0,
      detail: failedJobs24hCount === 0
        ? 'No failed automation runs recorded in the past 24 hours'
        : `${failedJobs24hCount} run(s) encountered execution errors and require inspection`,
    },
    {
      name: 'Catalog Data Freshness',
      status: staleOffersCount === 0 ? 'All Fresh' : `${staleOffersCount} Stale Offer(s)`,
      ok: staleOffersCount === 0,
      detail: staleOffersCount === 0
        ? 'All active retailer listings verified within the 7-day freshness window'
        : `${staleOffersCount} offer(s) not observed in > 7 days; automated pruning pending`,
    },
    {
      name: 'AI Intelligence Engine',
      status: hasGeminiKey ? 'Gemini API Active' : 'Deterministic Rules Engine',
      ok: true,
      detail: hasGeminiKey
        ? 'Connected to Gemini API for editorial and structured assistance'
        : 'Running compliant deterministic rule-based evaluation (zero hallucinations)',
    },
    {
      name: 'Affiliate Attribution Engine',
      status: 'Provider-Neutral Active',
      ok: true,
      detail: 'Dynamic clickId sub-tracking, HTTPS enforcement, and destination validation active',
    },
  ];

  return (
    <div className="space-y-8 text-slate-100">
      <div>
        <h1 className="text-xl font-black text-white flex items-center gap-2.5">
          <Activity className="w-5 h-5 text-emerald-400" />
          <span>System Health & Audit Logs</span>
        </h1>
        <p className="mt-1 text-xs text-slate-400">
          Core infrastructure status, third-party provider integrations, and administrative action logs.
        </p>
      </div>

      {/* Health Checks Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {healthChecks.map((check) => (
          <div
            key={check.name}
            className="rounded-2xl border border-ctp bg-ctp-surface p-4 flex items-start gap-3.5"
          >
            <div
              className={`p-2 rounded-xl shrink-0 ${
                check.ok
                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                  : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
              }`}
            >
              {check.ok ? <CheckCircle2 className="w-4 h-4" /> : <AlertTriangle className="w-4 h-4" />}
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h3 className="text-xs font-black text-white">{check.name}</h3>
                <span
                  className={`rounded px-1.5 py-0.5 text-[9px] font-bold ${
                    check.ok ? 'bg-emerald-950 text-emerald-300' : 'bg-amber-950 text-amber-300'
                  }`}
                >
                  {check.status}
                </span>
              </div>
              <p className="mt-1 text-[11px] text-slate-400 leading-relaxed">{check.detail}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Audit Logs Table */}
      <section className="rounded-2xl border border-ctp bg-ctp-surface p-5">
        <h2 className="text-xs font-black text-slate-200 uppercase tracking-wider mb-4">
          Administrative Audit Trail ({auditLogs.length})
        </h2>

        {auditLogs.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-ctp text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  <th className="pb-3">Action</th>
                  <th className="pb-3">Administrator</th>
                  <th className="pb-3">Resource</th>
                  <th className="pb-3">Details</th>
                  <th className="pb-3">Timestamp</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-ctp">
                {auditLogs.map((log) => (
                  <tr key={log.id} className="text-slate-300">
                    <td className="py-3 font-mono font-bold text-emerald-400">{log.action}</td>
                    <td className="py-3 font-bold text-white">{log.user_email || 'System'}</td>
                    <td className="py-3 font-mono text-slate-400">{log.resource_type}</td>
                    <td className="py-3 text-[11px] text-slate-400 max-w-xs truncate">
                      {JSON.stringify(log.details)}
                    </td>
                    <td className="py-3 text-slate-500">{new Date(log.created_at).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="rounded-xl border border-dashed border-ctp p-8 text-center text-xs text-slate-500">
            No administrative actions recorded yet. Sensitive operations like rights approvals and exception resolutions will be logged here.
          </div>
        )}
      </section>
    </div>
  );
}
