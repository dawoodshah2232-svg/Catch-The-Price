import React from 'react';
import { AlertTriangle, Database, FileText, Link2, ShieldCheck, Activity } from 'lucide-react';

const statusCards = [
  {
    label: 'Approved product feeds',
    value: 'Not connected',
    detail: 'No production retailer source is marked ACTIVE yet.',
    icon: Database,
  },
  {
    label: 'Matching review',
    value: 'Awaiting real feed',
    detail: 'Matching counts will appear only after persisted ingestion runs exist.',
    icon: Link2,
  },
  {
    label: 'Content queue',
    value: 'Not connected',
    detail: 'Editorial drafts will be shown after the reviewed content workflow is implemented.',
    icon: FileText,
  },
  {
    label: 'Business analytics',
    value: 'Not connected',
    detail: 'Traffic, affiliate and AdSense numbers must come from real connected reports.',
    icon: Activity,
  },
];

export default function AdminOverviewPage() {
  return (
    <div className="space-y-6">
      <div className="pb-6 border-b border-ctp">
        <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
          CatchThePrice Operations
        </span>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-100 mt-1">
          What needs attention
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-2 max-w-2xl leading-relaxed">
          This dashboard intentionally shows unavailable states until production feeds, analytics and
          content workflows are connected. No demo revenue, fake health badges or simulated ingestion
          results are shown here.
        </p>
      </div>

      <div className="rounded-2xl border border-amber-500/30 bg-amber-500/10 p-4 flex items-start gap-3">
        <AlertTriangle className="w-5 h-5 text-amber-300 shrink-0 mt-0.5" />
        <div>
          <h2 className="text-sm font-bold text-amber-100">Production operations are not ready yet</h2>
          <p className="text-xs text-amber-100/80 mt-1 leading-relaxed">
            First priorities: source permissions, canonical product data, one real ingestion adapter,
            matching review and authenticated admin access.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {statusCards.map((card) => {
          const Icon = card.icon;
          return (
            <div key={card.label} className="p-4 rounded-2xl bg-ctp-surface border border-ctp min-h-36">
              <div className="flex items-center justify-between text-slate-400 text-xs mb-3">
                <span>{card.label}</span>
                <Icon className="w-4 h-4 text-slate-500" />
              </div>
              <div className="text-lg font-extrabold text-slate-100">{card.value}</div>
              <p className="text-[11px] text-slate-400 mt-2 leading-relaxed">{card.detail}</p>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <section className="rounded-2xl bg-ctp-surface border border-ctp p-5">
          <h2 className="font-bold text-sm text-slate-100 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            P0 launch blockers
          </h2>
          <ol className="mt-4 space-y-3 text-xs text-slate-300 list-decimal pl-5">
            <li>Remove production reliance on seeded prices, history and merchant URLs.</li>
            <li>Protect admin with authenticated server-side role checks.</li>
            <li>Record retailer rights before activating any feed or affiliate parameters.</li>
            <li>Publish one permitted source end-to-end with real persisted run records.</li>
            <li>Replace simulated analytics with connected, source-labelled metrics.</li>
          </ol>
        </section>

        <section className="rounded-2xl bg-ctp-surface border border-ctp p-5">
          <h2 className="font-bold text-sm text-slate-100">Owner routine once connected</h2>
          <div className="mt-4 space-y-3 text-xs text-slate-300">
            <p>1. Resolve critical source failures.</p>
            <p>2. Review uncertain product matches.</p>
            <p>3. Approve or return editorial drafts.</p>
            <p>4. Check zero-result searches and expired offers.</p>
            <p>5. Review qualified retailer clicks and revenue import status.</p>
          </div>
        </section>
      </div>
    </div>
  );
}
