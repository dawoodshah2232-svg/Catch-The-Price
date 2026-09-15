import React from 'react';
import { ExternalLink, Package, Database } from 'lucide-react';
import { getServerSupabase } from '@/lib/supabase/server';

type ProductRow = {
  id: string;
  name: string;
  slug: string;
  brand: string | null;
  status: string;
  image_url: string | null;
  updated_at: string;
  categories: { name: string; slug: string } | { name: string; slug: string }[] | null;
};

type OfferRow = {
  product_id: string;
  country_code: string;
  currency: string;
  price: number | string;
  is_active: boolean;
  availability: string;
  merchants: { name: string } | { name: string }[] | null;
};

function relation<T>(value: T | T[] | null): T | null {
  if (!value) return null;
  return Array.isArray(value) ? value[0] || null : value;
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

export default async function AdminProductsPage() {
  const supabase = getServerSupabase();
  let products: ProductRow[] = [];
  let offers: OfferRow[] = [];
  let readError = false;

  if (supabase) {
    const [productsResult, offersResult] = await Promise.all([
      supabase
        .from('products')
        .select('id,name,slug,brand,status,image_url,updated_at,categories(name,slug)')
        .order('updated_at', { ascending: false })
        .limit(200),
      supabase
        .from('offers')
        .select('product_id,country_code,currency,price,is_active,availability,merchants(name)')
        .eq('is_active', true),
    ]);

    products = (productsResult.data || []) as ProductRow[];
    offers = (offersResult.data || []) as OfferRow[];
    readError = Boolean(productsResult.error || offersResult.error);
  } else {
    readError = true;
  }

  const offerMap = new Map<string, OfferRow[]>();
  for (const offer of offers) {
    if (!offerMap.has(offer.product_id)) offerMap.set(offer.product_id, []);
    offerMap.get(offer.product_id)!.push(offer);
  }

  const activeProducts = products.filter((product) => product.status === 'active').length;
  const productsWithOffers = products.filter((product) => (offerMap.get(product.id) || []).length > 0).length;

  return (
    <div className="space-y-6">
      <div className="pb-6 border-b border-ctp">
        <span className="text-[10px] uppercase tracking-[0.18em] font-extrabold text-emerald-400">Canonical catalog</span>
        <h1 className="text-2xl font-extrabold text-slate-100 mt-1">Products &amp; offers</h1>
        <p className="text-xs text-slate-400 mt-1 max-w-2xl">
          This screen reads the real Supabase catalog. Demo fixtures are not included in admin counts.
        </p>
      </div>

      {readError && (
        <div className="rounded-2xl border border-rose-500/30 bg-rose-500/10 p-4 text-xs text-rose-100">Could not read the live product catalog.</div>
      )}

      <div className="grid grid-cols-3 gap-3">
        <div className="rounded-2xl bg-ctp-surface border border-ctp p-4">
          <div className="text-[10px] uppercase tracking-wider font-bold text-slate-500">Catalog records</div>
          <div className="text-2xl font-extrabold text-slate-100 mt-1">{products.length}</div>
        </div>
        <div className="rounded-2xl bg-ctp-surface border border-ctp p-4">
          <div className="text-[10px] uppercase tracking-wider font-bold text-slate-500">Active products</div>
          <div className="text-2xl font-extrabold text-emerald-400 mt-1">{activeProducts}</div>
        </div>
        <div className="rounded-2xl bg-ctp-surface border border-ctp p-4">
          <div className="text-[10px] uppercase tracking-wider font-bold text-slate-500">With live offers</div>
          <div className="text-2xl font-extrabold text-slate-100 mt-1">{productsWithOffers}</div>
        </div>
      </div>

      <div className="rounded-2xl bg-ctp-surface border border-ctp overflow-hidden">
        <div className="p-4 border-b border-ctp flex items-center justify-between">
          <h2 className="font-bold text-sm text-slate-200 flex items-center gap-2"><Package className="w-4 h-4 text-emerald-400" /> Live catalog records</h2>
          <span className="text-xs text-slate-400">{products.length}</span>
        </div>

        {products.length === 0 ? (
          <div className="p-10 text-center">
            <Database className="w-8 h-8 text-slate-600 mx-auto" />
            <h3 className="text-sm font-bold text-slate-200 mt-3">No real products have been ingested yet</h3>
            <p className="text-xs text-slate-400 mt-1">The public production catalog will remain empty until approved source data is persisted here.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-ctp-surface-elevated text-slate-500 uppercase tracking-wider text-[10px] border-b border-ctp">
                <tr><th className="p-3.5">Product</th><th className="p-3.5">Category</th><th className="p-3.5">Market / best price</th><th className="p-3.5">Offers</th><th className="p-3.5">Status</th><th className="p-3.5 text-right">Inspect</th></tr>
              </thead>
              <tbody className="divide-y divide-ctp">
                {products.map((product) => {
                  const category = relation(product.categories);
                  const productOffers = (offerMap.get(product.id) || []).filter((offer) => offer.availability === 'in_stock');
                  const best = [...productOffers].sort((a, b) => Number(a.price) - Number(b.price))[0];
                  return (
                    <tr key={product.id}>
                      <td className="p-3.5">
                        <div className="flex items-center gap-3 min-w-[220px]">
                          <div className="w-9 h-9 rounded-lg bg-slate-900 border border-ctp overflow-hidden flex items-center justify-center shrink-0">
                            {product.image_url ? <img src={product.image_url} alt="" className="w-full h-full object-contain" /> : <Package className="w-4 h-4 text-slate-600" />}
                          </div>
                          <div className="min-w-0">
                            <div className="font-semibold text-slate-100 truncate max-w-xs">{product.name}</div>
                            <div className="text-[10px] text-slate-500">{product.brand || 'Brand not set'}</div>
                          </div>
                        </div>
                      </td>
                      <td className="p-3.5">{category?.name || 'Uncategorized'}</td>
                      <td className="p-3.5">
                        {best ? (
                          <div><span className="uppercase text-[10px] text-slate-500">{best.country_code}</span><div className="font-bold text-emerald-400">{formatPrice(best.currency, best.price)}</div><div className="text-[10px] text-slate-500">{relation(best.merchants)?.name || 'Unknown merchant'}</div></div>
                        ) : <span className="text-slate-500">No active offer</span>}
                      </td>
                      <td className="p-3.5">{productOffers.length}</td>
                      <td className="p-3.5"><span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${product.status === 'active' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' : 'bg-slate-800 text-slate-400 border-slate-700'}`}>{product.status}</span></td>
                      <td className="p-3.5 text-right">
                        {best && category?.slug ? <a href={`/${best.country_code}/product/${product.slug}`} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-emerald-400 hover:text-emerald-300 font-semibold">Open <ExternalLink className="w-3 h-3" /></a> : <span className="text-slate-600">—</span>}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
