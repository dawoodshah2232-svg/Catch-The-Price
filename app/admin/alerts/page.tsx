import React from 'react';
import { Bell, CheckCircle2, Clock3, MailWarning, Target } from 'lucide-react';
import { getServerSupabase } from '@/lib/supabase/server';
import { AlertEvaluationButton } from '@/components/admin/AlertEvaluationButton';

type AlertEventRow = {
  id: string;
  alert_type: string;
  message: string;
  sent_at: string | null;
  created_at: string;
  products: { name: string } | { name: string }[] | null;
};

function relationName(value: AlertEventRow['products']) {
  if (!value) return 'Unknown product';
  if (Array.isArray(value)) return value[0]?.name || 'Unknown product';
  return value.name || 'Unknown product';
}

function formatTime(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat('en', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' }).format(date);
}

export default async function AdminAlertsPage() {
  const supabase = getServerSupabase();
  let activeAlerts = 0;
  let pendingEvents = 0;
  let sentEvents = 0;
  let targetAlerts = 0;
  let events: AlertEventRow[] = [];
  let readError = false;

  if (supabase) {
    const [activeResult, targetResult, pendingResult, sentResult, eventsResult] = await Promise.all([
      supabase.from('watchlists').select('id', { count: 'exact', head: true }).eq('is_active', true).neq('alert_type', 'saved'),
      supabase.from('watchlists').select('id', { count: 'exact', head: true }).eq('is_active', true).eq('alert_type', 'below_amount'),
      supabase.from('alert_events').select('id', { count: 'exact', head: true }).is('sent_at', null),
      supabase.from('alert_events').select('id', { count: 'exact', head: true }).not('sent_at', 'is', null),
      supabase
        .from('alert_events')
        .select('id,alert_type,message,sent_at,created_at,products(name)')
        .order('created_at', { ascending: false })
        .limit(50),
    ]);

    activeAlerts = activeResult.count || 0;
    targetAlerts = targetResult.count || 0;
    pendingEvents = pendingResult.count || 0;
    sentEvents = sentResult.count || 0;
    events = (eventsResult.data || []) as AlertEventRow[];
    readError = Boolean(activeResult.error || targetResult.error || pendingResult.error || sentResult.error || eventsResult.error);
  } else {
    readError = true;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-6 border-b border-ctp">
        <div>
          <span className="text-[10px] uppercase tracking-[0.18em] font-extrabold text-emerald-400">Account-backed tracking</span>
          <h1 className="text-2xl font-extrabold text-slate-100 mt-1">Price alert operations</h1>
          <p className="text-xs text-slate-400 mt-1 max-w-3xl leading-relaxed">
            Deterministic alert evaluation against live offers and stored price observations. Triggered events are queued only; email delivery stays disabled until a verified provider and email-verification flow are configured.
          </p>
        </div>
        <AlertEvaluationButton />
      </div>

      {readError && (
        <div className="rounded-2xl border border-rose-500/30 bg-rose-500/10 p-4 text-xs text-rose-100">
          Alert operations could not be read from Supabase.
        </div>
      )}

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <Metric label="Active price alerts" value={activeAlerts} icon={Bell} />
        <Metric label="Target-price alerts" value={targetAlerts} icon={Target} />
        <Metric label="Queued events" value={pendingEvents} icon={Clock3} warning={pendingEvents > 0} />
        <Metric label="Delivered events" value={sentEvents} icon={CheckCircle2} />
      </div>

      <section className="rounded-2xl border border-amber-500/25 bg-amber-500/10 p-4 flex items-start gap-3">
        <MailWarning className="w-5 h-5 text-amber-300 shrink-0 mt-0.5" />
        <div>
          <h2 className="text-sm font-bold text-amber-100">Delivery is intentionally not claimed yet</h2>
          <p className="text-xs text-amber-100/80 mt-1 leading-relaxed">
            The evaluator can create a factual alert event for target-price and observed-drop rules. A separate verified email-delivery worker must send it and then set <code>sent_at</code>. “Major deal” alerts remain inactive until a transparent deterministic rule is approved.
          </p>
        </div>
      </section>

      <section className="rounded-2xl bg-ctp-surface border border-ctp overflow-hidden">
        <div className="p-4 border-b border-ctp flex items-center justify-between">
          <div>
            <h2 className="text-sm font-bold text-slate-100">Recent alert events</h2>
            <p className="text-[10px] text-slate-500 mt-1">Newest 50 persisted events</p>
          </div>
          <span className="text-xs text-slate-500">{events.length}</span>
        </div>

        {events.length === 0 ? (
          <div className="p-10 text-center">
            <Bell className="w-8 h-8 text-slate-600 mx-auto" />
            <h3 className="text-sm font-bold text-slate-200 mt-3">No alert event has triggered yet</h3>
            <p className="text-xs text-slate-500 mt-1">This stays empty until a real account alert meets its deterministic trigger condition.</p>
          </div>
        ) : (
          <div className="divide-y divide-ctp">
            {events.map((event) => (
              <div key={event.id} className="p-4 flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="text-xs font-bold text-slate-100">{relationName(event.products)}</h3>
                    <span className="px-2 py-0.5 rounded-md bg-slate-900 border border-ctp text-[9px] uppercase font-bold text-slate-400">{event.alert_type.replaceAll('_', ' ')}</span>
                  </div>
                  <p className="text-xs text-slate-400 mt-2 leading-relaxed">{event.message}</p>
                </div>
                <div className="shrink-0 text-left sm:text-right">
                  <span className={`inline-flex px-2 py-1 rounded-lg border text-[9px] font-extrabold ${event.sent_at ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300' : 'bg-amber-500/10 border-amber-500/30 text-amber-200'}`}>
                    {event.sent_at ? 'DELIVERED' : 'QUEUED'}
                  </span>
                  <div className="text-[10px] text-slate-600 mt-1.5">{formatTime(event.created_at)}</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

function Metric({ label, value, icon: Icon, warning = false }: { label: string; value: number; icon: React.ComponentType<{ className?: string }>; warning?: boolean }) {
  return (
    <div className="rounded-2xl bg-ctp-surface border border-ctp p-4">
      <div className="flex items-center justify-between text-[10px] uppercase tracking-wider font-bold text-slate-500"><span>{label}</span><Icon className="w-4 h-4 text-slate-500" /></div>
      <div className={`text-2xl font-extrabold mt-2 ${warning ? 'text-amber-300' : 'text-slate-100'}`}>{value.toLocaleString()}</div>
    </div>
  );
}
