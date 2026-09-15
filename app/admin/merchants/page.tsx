import React from 'react';
import { Store, ShieldCheck, AlertTriangle, Link2 } from 'lucide-react';
import { getServerSupabase } from '@/lib/supabase/server';
import { listSourceRights } from '@/lib/config/sourceRights';

type MerchantRow = {
  id: string;
  name: string;
  slug: string;
  country_code: string;
  website_url: string;
  logo_url: string | null;
  is_active: boolean;
  updated_at: string;
};

export default async function AdminMerchantsPage() {
  const supabase = getServerSupabase();
  let merchants: MerchantRow[] = [];
  let readError = false;

  if (supabase) {
    const { data, error } = await supabase
      .from('merchants')
      .select('id,name,slug,country_code,website_url,logo_url,is_active,updated_at')
      .order('country_code')
      .order('name');
    merchants = (data || []) as MerchantRow[];
    readError = Boolean(error);
  } else {
    readError = true;
  }

  const rights = await listSourceRights();

  return (
    <div className="space-y-6">
      <div className="pb-6 border-b border-ctp">
        <span className="text-[10px] uppercase tracking-[0.18em] font-extrabold text-emerald-400">Source governance</span>
        <h1 className="text-2xl font-extrabold text-slate-100 mt-1">Merchants &amp; source rights</h1>
        <p className="text-xs text-slate-400 mt-1 max-w-2xl">
          Merchant configuration and publication permission are separate. Prices, images and affiliate links remain deny-by-default until the persisted approval record is complete.
        </p>
      </div>

      {readError && (
        <div className="rounded-2xl border border-rose-500/30 bg-rose-500/10 p-4 text-xs text-rose-100">
          Could not read the live merchant table from Supabase.
        </div>
      )}

      <section className="rounded-2xl bg-ctp-surface border border-ctp overflow-hidden">
        <div className="p-4 border-b border-ctp flex items-center justify-between">
          <div>
            <h2 className="font-bold text-sm text-slate-200 flex items-center gap-2"><Store className="w-4 h-4 text-emerald-400" /> Live merchant records</h2>
            <p className="text-[10px] text-slate-500 mt-1">Real rows from the merchants table</p>
          </div>
          <span className="text-xs text-slate-400">{merchants.length}</span>
        </div>

        {merchants.length === 0 ? (
          <div className="p-10 text-center">
            <Store className="w-8 h-8 text-slate-600 mx-auto" />
            <h3 className="text-sm font-bold text-slate-200 mt-3">No live merchants connected yet</h3>
            <p className="text-xs text-slate-400 mt-1">This remains correct until the first approved source is onboarded.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-ctp-surface-elevated text-slate-500 uppercase tracking-wider text-[10px] border-b border-ctp">
                <tr><th className="p-3.5">Merchant</th><th className="p-3.5">Market</th><th className="p-3.5">Website</th><th className="p-3.5 text-right">Record status</th></tr>
              </thead>
              <tbody className="divide-y divide-ctp">
                {merchants.map((merchant) => (
                  <tr key={merchant.id}>
                    <td className="p-3.5 font-semibold text-slate-100">{merchant.name}</td>
                    <td className="p-3.5 uppercase">{merchant.country_code}</td>
                    <td className="p-3.5 text-slate-400 max-w-xs truncate">{merchant.website_url}</td>
                    <td className="p-3.5 text-right">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${merchant.is_active ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' : 'bg-slate-800 text-slate-400 border-slate-700'}`}>
                        {merchant.is_active ? 'Active record' : 'Disabled record'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <section className="rounded-2xl bg-ctp-surface border border-ctp overflow-hidden">
        <div className="p-4 border-b border-ctp flex items-center justify-between">
          <div>
            <h2 className="font-bold text-sm text-slate-200 flex items-center gap-2"><ShieldCheck className="w-4 h-4 text-emerald-400" /> Persisted rights register</h2>
            <p className="text-[10px] text-slate-500 mt-1">Real rows from source_rights; production ingestion reads this table directly</p>
          </div>
          <span className="text-xs text-slate-400">{rights.length}</span>
        </div>

        {rights.length === 0 ? (
          <div className="p-8 text-center text-xs text-slate-400">No source-rights records are available. Production ingestion will fail closed.</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 p-4">
            {rights.map((source) => {
              const active = source.status === 'ACTIVE';
              const publishReady = active && source.pricingRight && source.affiliateLinkRight && source.approvalReference && source.approvedAt;
              return (
                <div key={source.id} className="rounded-2xl border border-ctp bg-slate-900/55 p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h3 className="text-sm font-bold text-slate-100">{source.retailer}</h3>
                      <div className="text-[10px] uppercase tracking-wider text-slate-500 mt-0.5">Market: {source.market.toUpperCase()}</div>
                    </div>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-extrabold border ${publishReady ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' : active ? 'bg-amber-500/10 text-amber-300 border-amber-500/30' : 'bg-slate-800 text-slate-400 border-slate-700'}`}>
                      {publishReady ? 'PUBLISH READY' : source.status}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 mt-3 text-[10px]">
                    <div className="rounded-lg border border-ctp px-2.5 py-2 text-slate-400">Pricing: <strong className={source.pricingRight ? 'text-emerald-400' : 'text-slate-500'}>{source.pricingRight ? 'Allowed' : 'Not approved'}</strong></div>
                    <div className="rounded-lg border border-ctp px-2.5 py-2 text-slate-400">Images: <strong className={source.imageRight ? 'text-emerald-400' : 'text-slate-500'}>{source.imageRight ? 'Allowed' : 'Not approved'}</strong></div>
                    <div className="rounded-lg border border-ctp px-2.5 py-2 text-slate-400">Affiliate: <strong className={source.affiliateLinkRight ? 'text-emerald-400' : 'text-slate-500'}>{source.affiliateLinkRight ? 'Allowed' : 'Not approved'}</strong></div>
                    <div className="rounded-lg border border-ctp px-2.5 py-2 text-slate-400">History: <strong className={source.historyRight ? 'text-emerald-400' : 'text-slate-500'}>{source.historyRight ? 'Allowed' : 'Not approved'}</strong></div>
                  </div>

                  <div className="mt-3 rounded-lg border border-ctp bg-slate-950/60 px-3 py-2 text-[10px] text-slate-400">
                    <div><span className="text-slate-500">Approval evidence:</span> {source.approvalReference || 'Not recorded'}</div>
                    <div className="mt-1"><span className="text-slate-500">Approved:</span> {source.approvedAt ? new Date(source.approvedAt).toLocaleString('en') : 'Not recorded'}</div>
                  </div>

                  <div className="mt-3 flex items-start gap-2 text-[10px] text-slate-500 leading-relaxed">
                    {publishReady ? <Link2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" /> : <AlertTriangle className="w-3.5 h-3.5 text-amber-300 shrink-0 mt-0.5" />}
                    <span>{source.notes}</span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}
