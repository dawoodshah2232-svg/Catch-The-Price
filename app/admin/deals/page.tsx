import React from 'react';
import { Sparkles } from 'lucide-react';
import { getServerSupabase } from '@/lib/supabase/server';
import { getCatalogProducts } from '@/lib/data/catalog.server';

export const metadata = {
  title: 'Deals & Drops Engine | Admin',
};

export default async function DealsAdminPage() {
  const supabase = getServerSupabase();
  let deals: any[] = [];

  if (supabase) {
    const { data } = await supabase
      .from('deals')
      .select('*, products(title, slug, image_url, brand)')
      .order('deal_score', { ascending: false })
      .limit(50);
    deals = data || [];
  }

  // Fallback to top scored products from catalog preview if deals table empty
  if (deals.length === 0) {
    const { products } = await getCatalogProducts('ae');
    deals = products
      .filter((p) => p.dealScore >= 70)
      .sort((a, b) => b.dealScore - a.dealScore)
      .slice(0, 20)
      .map((p) => ({
        id: p.id,
        deal_score: p.dealScore,
        current_price: p.currentBestPrice,
        original_price: p.originalPrice,
        currency: p.currency,
        discount_percent:
          p.originalPrice > p.currentBestPrice
            ? Math.round(((p.originalPrice - p.currentBestPrice) / p.originalPrice) * 100)
            : 0,
        deal_type: p.dealScore >= 85 ? 'HISTORICAL_LOW' : 'PRICE_DROP',
        products: {
          title: p.title,
          slug: p.slug,
          brand: p.brand,
          image_url: p.imageUrl,
        },
      }));
  }

  return (
    <div className="space-y-6 text-slate-100">
      <div>
        <h1 className="text-xl font-black text-white flex items-center gap-2.5">
          <Sparkles className="w-5 h-5 text-emerald-400" />
          <span>Deals Engine & Price Drops</span>
        </h1>
        <p className="mt-1 text-xs text-slate-400">
          Rules-based deal scoring evaluating discount depth, retailer competition, and historical pricing lows.
        </p>
      </div>

      <div className="rounded-2xl border border-ctp bg-ctp-surface p-5">
        <h2 className="text-xs font-black text-slate-200 uppercase tracking-wider mb-4">
          Highest Scored Deals ({deals.length})
        </h2>

        {deals.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-ctp text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  <th className="pb-3">Deal Score</th>
                  <th className="pb-3">Product</th>
                  <th className="pb-3">Brand</th>
                  <th className="pb-3">Current Price</th>
                  <th className="pb-3">Discount</th>
                  <th className="pb-3">Classification</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-ctp">
                {deals.map((deal) => (
                  <tr key={deal.id} className="text-slate-300">
                    <td className="py-3">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-mono font-black ${
                          deal.deal_score >= 85
                            ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                            : 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                        }`}
                      >
                        {deal.deal_score}/100
                      </span>
                    </td>
                    <td className="py-3 font-bold text-white max-w-xs truncate">
                      {deal.products?.title || 'Unknown Product'}
                    </td>
                    <td className="py-3 text-slate-400">{deal.products?.brand || '—'}</td>
                    <td className="py-3 font-black text-white">
                      {deal.current_price} {deal.currency}
                    </td>
                    <td className="py-3 text-emerald-400 font-bold">
                      {deal.discount_percent > 0 ? `-${deal.discount_percent}%` : '—'}
                    </td>
                    <td className="py-3">
                      <span className="rounded bg-slate-800 px-2 py-0.5 text-[10px] font-mono text-slate-300">
                        {deal.deal_type}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="rounded-xl border border-dashed border-ctp p-8 text-center text-xs text-slate-500">
            No active deals recorded. Scored deals will appear once price tracking runs.
          </div>
        )}
      </div>
    </div>
  );
}
