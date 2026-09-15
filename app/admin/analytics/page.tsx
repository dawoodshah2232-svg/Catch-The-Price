import React from 'react';
import { BarChart3, MousePointerClick, Smartphone, Globe2 } from 'lucide-react';
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

export default async function AdminAnalyticsPage() {
  const supabase = getServerSupabase();
  let clicks: ClickRow[] = [];
  let totalClicks = 0;
  let readError = false;

  if (supabase) {
    const [{ data, error }, { count, error: countError }] = await Promise.all([
      supabase
        .from('outbound_clicks')
        .select('id,country_code,price,currency,referrer_host,device_type,created_at,merchants(name),products(name)')
        .order('created_at', { ascending: false })
        .limit(100),
      supabase.from('outbound_clicks').select('id', { count: 'exact', head: true }),
    ]);

    clicks = (data || []) as ClickRow[];
    totalClicks = count || 0;
    readError = Boolean(error || countError);
  } else {
    readError = true;
  }

  const mobileClicks = clicks.filter((click) => click.device_type === 'mobile').length;
  const aeClicks = clicks.filter((click) => click.country_code === 'ae').length;
  const usClicks = clicks.filter((click) => click.country_code === 'us').length;
  const sampleSize = clicks.length;
  const mobileShare = sampleSize > 0 ? Math.round((mobileClicks / sampleSize) * 100) : 0;

  return (
    <div className="space-y-6">
      <div className="pb-6 border-b border-ctp">
        <span className="text-[10px] uppercase tracking-[0.18em] font-extrabold text-emerald-400">Real event data</span>
        <h1 className="text-2xl font-extrabold text-slate-100 mt-1">Outbound click analytics</h1>
        <p className="text-xs text-slate-400 mt-1 max-w-2xl">
          Retailer hand-offs recorded by /api/outbound. CatchThePrice stores market, device class and referrer host only — not full IP addresses or full user-agent strings.
        </p>
      </div>

      {readError && (
        <div className="rounded-2xl border border-rose-500/30 bg-rose-500/10 p-4 text-xs text-rose-100">
          Analytics could not be read from Supabase. Check the server connection before relying on this screen.
        </div>
      )}

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-ctp-surface border border-ctp">
          <div className="text-xs text-slate-400 flex items-center justify-between mb-1"><span>Total retailer clicks</span><MousePointerClick className="w-4 h-4 text-emerald-400" /></div>
          <div className="text-2xl font-extrabold text-slate-100">{totalClicks}</div>
          <span className="text-[10px] text-slate-500 mt-1 block">All recorded time</span>
        </div>

        <div className="p-4 rounded-2xl bg-ctp-surface border border-ctp">
          <div className="text-xs text-slate-400 flex items-center justify-between mb-1"><span>Mobile share</span><Smartphone className="w-4 h-4 text-emerald-400" /></div>
          <div className="text-2xl font-extrabold text-slate-100">{mobileShare}%</div>
          <span className="text-[10px] text-slate-500 mt-1 block">Based on latest {sampleSize} clicks</span>
        </div>

        <div className="p-4 rounded-2xl bg-ctp-surface border border-ctp">
          <div className="text-xs text-slate-400 flex items-center justify-between mb-1"><span>UAE sample</span><Globe2 className="w-4 h-4 text-emerald-400" /></div>
          <div className="text-2xl font-extrabold text-slate-100">{aeClicks}</div>
          <span className="text-[10px] text-slate-500 mt-1 block">Latest {sampleSize} events</span>
        </div>

        <div className="p-4 rounded-2xl bg-ctp-surface border border-ctp">
          <div className="text-xs text-slate-400 flex items-center justify-between mb-1"><span>US sample</span><BarChart3 className="w-4 h-4 text-emerald-400" /></div>
          <div className="text-2xl font-extrabold text-slate-100">{usClicks}</div>
          <span className="text-[10px] text-slate-500 mt-1 block">Latest {sampleSize} events</span>
        </div>
      </div>

      <div className="rounded-2xl bg-ctp-surface border border-ctp overflow-hidden">
        <div className="p-4 border-b border-ctp flex items-center justify-between">
          <div>
            <h3 className="font-bold text-sm text-slate-200">Recent retailer hand-offs</h3>
            <p className="text-[10px] text-slate-500 mt-1">Latest 100 events</p>
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
