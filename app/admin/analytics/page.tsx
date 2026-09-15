import React from 'react';
import { BarChart3, MousePointerClick, Smartphone, Globe2, Search, Eye, Users, PackageSearch } from 'lucide-react';
import { getServerSupabase } from '@/lib/supabase/server';

type ClickRow = {
  id: string;
  country_code: string;
  price: number | string;
  currency: string;
  referrer_host: string | null;
  device_type: string;
  created_at: string;
  merchants: { name: string } | { name: string }[] | null;
  products: { name: string } | { name: string }[] | null;
};

type EventRow = {
  id: string;
  event_type: string;
  country_code: string | null;
  path: string;
  referrer_host: string | null;
  device_type: string;
  session_id: string | null;
  search_query: string | null;
  product_slug: string | null;
  created_at: string;
};

function relationName(value: ClickRow['merchants'] | ClickRow['products']): string {
  if (!value) return 'Unknown';
  if (Array.isArray(value)) return value[0]?.name || 'Unknown';
  return value.name || 'Unknown';
}

function formatPrice(currency: string, value: number | string) {
  const number = Number(value);
  if (!Number.isFinite(number)) return `${currency} ${value}`;
  try {
    return new Intl.NumberFormat('en', { style: 'currency', currency, maximumFractionDigits: 0 }).format(number);
  } catch {
    return `${currency} ${number.toLocaleString()}`;
  }
}

function formatTime(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat('en', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' }).format(date);
}

function topCounts(values: (string | null | undefined)[], limit = 8) {
  const counts = new Map<string, number>();
  values.filter(Boolean).forEach((value) => counts.set(String(value), (counts.get(String(value)) || 0) + 1));
  return [...counts.entries()].sort((a, b) => b[1] - a[1]).slice(0, limit);
}

export default async function AdminAnalyticsPage() {
  const supabase = getServerSupabase();
  let clicks: ClickRow[] = [];
  let events: EventRow[] = [];
  let totalClicks = 0;
  let totalPageViews = 0;
  let totalSearches = 0;
  let totalProductViews = 0;
  let readError = false;

  if (supabase) {
    const [
      clicksResult,
      clickCountResult,
      eventsResult,
      pageCountResult,
      searchCountResult,
      productCountResult,
    ] = await Promise.all([
      supabase
        .from('outbound_clicks')
        .select('id,country_code,price,currency,referrer_host,device_type,created_at,merchants(name),products(name)')
        .order('created_at', { ascending: false })
        .limit(100),
      supabase.from('outbound_clicks').select('id', { count: 'exact', head: true }),
      supabase
        .from('analytics_events')
        .select('id,event_type,country_code,path,referrer_host,device_type,session_id,search_query,product_slug,created_at')
        .order('created_at', { ascending: false })
        .limit(2000),
      supabase.from('analytics_events').select('id', { count: 'exact', head: true }).eq('event_type', 'page_view'),
      supabase.from('analytics_events').select('id', { count: 'exact', head: true }).eq('event_type', 'search'),
      supabase.from('analytics_events').select('id', { count: 'exact', head: true }).eq('event_type', 'product_view'),
    ]);

    clicks = (clicksResult.data || []) as ClickRow[];
    events = (eventsResult.data || []) as EventRow[];
    totalClicks = clickCountResult.count || 0;
    totalPageViews = pageCountResult.count || 0;
    totalSearches = searchCountResult.count || 0;
    totalProductViews = productCountResult.count || 0;
    readError = Boolean(
      clicksResult.error ||
        clickCountResult.error ||
        eventsResult.error ||
        pageCountResult.error ||
        searchCountResult.error ||
        productCountResult.error
    );
  } else {
    readError = true;
  }

  const recentPageViews = events.filter((event) => event.event_type === 'page_view');
  const recentSearches = events.filter((event) => event.event_type === 'search');
  const recentProductViews = events.filter((event) => event.event_type === 'product_view');
  const uniqueSessions = new Set(events.map((event) => event.session_id).filter(Boolean)).size;
  const mobileEvents = recentPageViews.filter((event) => event.device_type === 'mobile').length;
  const mobileShare = recentPageViews.length > 0 ? Math.round((mobileEvents / recentPageViews.length) * 100) : 0;
  const aeViews = recentPageViews.filter((event) => event.country_code === 'ae').length;
  const usViews = recentPageViews.filter((event) => event.country_code === 'us').length;

  const topPages = topCounts(recentPageViews.map((event) => event.path));
  const topSearches = topCounts(recentSearches.map((event) => event.search_query));
  const topProducts = topCounts(recentProductViews.map((event) => event.product_slug));
  const topReferrers = topCounts(recentPageViews.map((event) => event.referrer_host || 'Direct / unknown'));

  return (
    <div className="space-y-6">
      <div className="pb-6 border-b border-ctp">
        <span className="text-[10px] uppercase tracking-[0.18em] font-extrabold text-emerald-400">Real event data</span>
        <h1 className="text-2xl font-extrabold text-slate-100 mt-1">Traffic &amp; shopping analytics</h1>
        <p className="text-xs text-slate-400 mt-1 max-w-3xl">
          Real page views, searches, product views and retailer hand-offs. The event system stores market, coarse device class, path, optional shopping query and referrer host — not full IP addresses or full user-agent strings.
        </p>
      </div>

      {readError && (
        <div className="rounded-2xl border border-rose-500/30 bg-rose-500/10 p-4 text-xs text-rose-100">
          Analytics could not be read from Supabase. Check the server connection before relying on this screen.
        </div>
      )}

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <Metric title="Page views" value={totalPageViews} note="All recorded time" icon={<Eye className="w-4 h-4 text-emerald-400" />} />
        <Metric title="Recent sessions" value={uniqueSessions} note={`Unique session IDs in latest ${events.length} events`} icon={<Users className="w-4 h-4 text-cyan-300" />} />
        <Metric title="Searches" value={totalSearches} note="Real submitted searches" icon={<Search className="w-4 h-4 text-amber-300" />} />
        <Metric title="Product views" value={totalProductViews} note="Real product-page views" icon={<PackageSearch className="w-4 h-4 text-violet-300" />} />
        <Metric title="Retailer clicks" value={totalClicks} note="Validated outbound hand-offs" icon={<MousePointerClick className="w-4 h-4 text-emerald-400" />} />
        <Metric title="Mobile share" value={`${mobileShare}%`} note={`Latest ${recentPageViews.length} page views`} icon={<Smartphone className="w-4 h-4 text-emerald-400" />} />
        <Metric title="UAE page views" value={aeViews} note="Recent analytics sample" icon={<Globe2 className="w-4 h-4 text-emerald-400" />} />
        <Metric title="US page views" value={usViews} note="Recent analytics sample" icon={<BarChart3 className="w-4 h-4 text-emerald-400" />} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <RankedCard title="Top pages" items={topPages} empty="No page-view data yet." />
        <RankedCard title="Top searches" items={topSearches} empty="No search data yet." />
        <RankedCard title="Top viewed products" items={topProducts} empty="No product-view data yet." />
        <RankedCard title="Traffic sources" items={topReferrers} empty="No referrer data yet." />
      </div>

      <div className="rounded-2xl bg-ctp-surface border border-ctp overflow-hidden">
        <div className="p-4 border-b border-ctp flex items-center justify-between">
          <div>
            <h3 className="font-bold text-sm text-slate-200">Recent retailer hand-offs</h3>
            <p className="text-[10px] text-slate-500 mt-1">Latest 100 validated outbound events</p>
          </div>
          <span className="text-xs text-slate-400">{clicks.length}</span>
        </div>

        {clicks.length === 0 ? (
          <div className="p-10 text-center">
            <MousePointerClick className="w-8 h-8 text-slate-600 mx-auto" />
            <h4 className="text-sm font-bold text-slate-200 mt-3">No real outbound clicks yet</h4>
            <p className="text-xs text-slate-400 mt-1">Clicks will appear here only after a live product offer sends a visitor to a retailer.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-ctp-surface-elevated text-slate-500 uppercase tracking-wider text-[10px] border-b border-ctp">
                <tr><th className="p-3.5">Product</th><th className="p-3.5">Merchant</th><th className="p-3.5">Market</th><th className="p-3.5">Price</th><th className="p-3.5">Device</th><th className="p-3.5">Referrer</th><th className="p-3.5 text-right">Time</th></tr>
              </thead>
              <tbody className="divide-y divide-ctp">
                {clicks.map((click) => (
                  <tr key={click.id}>
                    <td className="p-3.5 font-semibold text-slate-100">{relationName(click.products)}</td>
                    <td className="p-3.5 text-emerald-400 font-medium">{relationName(click.merchants)}</td>
                    <td className="p-3.5 uppercase">{click.country_code}</td>
                    <td className="p-3.5 font-bold text-slate-200">{formatPrice(click.currency, click.price)}</td>
                    <td className="p-3.5 capitalize text-slate-400">{click.device_type}</td>
                    <td className="p-3.5 text-slate-400">{click.referrer_host || 'Direct / unknown'}</td>
                    <td className="p-3.5 text-right text-slate-400 whitespace-nowrap">{formatTime(click.created_at)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

function Metric({ title, value, note, icon }: { title: string; value: string | number; note: string; icon: React.ReactNode }) {
  return (
    <div className="p-4 rounded-2xl bg-ctp-surface border border-ctp">
      <div className="text-xs text-slate-400 flex items-center justify-between mb-1"><span>{title}</span>{icon}</div>
      <div className="text-2xl font-extrabold text-slate-100">{value}</div>
      <span className="text-[10px] text-slate-500 mt-1 block">{note}</span>
    </div>
  );
}

function RankedCard({ title, items, empty }: { title: string; items: [string, number][]; empty: string }) {
  return (
    <section className="rounded-2xl bg-ctp-surface border border-ctp overflow-hidden">
      <div className="p-4 border-b border-ctp flex items-center justify-between"><h3 className="font-bold text-sm text-slate-200">{title}</h3><span className="text-[10px] text-slate-500">Recent sample</span></div>
      {items.length === 0 ? (
        <div className="p-5 text-xs text-slate-500">{empty}</div>
      ) : (
        <div className="divide-y divide-ctp">
          {items.map(([label, count], index) => (
            <div key={label} className="px-4 py-3 flex items-center gap-3">
              <span className="w-6 h-6 rounded-lg bg-slate-900 border border-ctp text-[10px] text-slate-500 flex items-center justify-center shrink-0">{index + 1}</span>
              <span className="text-xs text-slate-200 font-medium truncate flex-1" title={label}>{label}</span>
              <span className="text-xs font-extrabold text-emerald-400">{count}</span>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
