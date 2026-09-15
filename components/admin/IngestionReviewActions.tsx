'use client';

import React, { useState } from 'react';
import { Check, PackagePlus, Send, X } from 'lucide-react';

type ProductOption = {
  id: string;
  name: string;
  brand: string | null;
  model: string | null;
};

export function IngestionReviewActions({
  itemId,
  reviewStatus,
  currentProductId,
  products,
}: {
  itemId: string;
  reviewStatus: string;
  currentProductId: string | null;
  products: ProductOption[];
}) {
  const [productId, setProductId] = useState(currentProductId || '');
  const [busy, setBusy] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  async function run(action: 'assign_existing' | 'create_product' | 'reject' | 'publish') {
    setBusy(action);
    setMessage(null);
    try {
      const response = await fetch('/api/admin/matching/review', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ itemId, action, productId: productId || undefined }),
      });
      const payload = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(payload.error || 'Action failed');
      setMessage(action === 'publish' ? 'Published successfully.' : 'Saved.');
      window.setTimeout(() => window.location.reload(), 450);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Action failed');
    } finally {
      setBusy(null);
    }
  }

  const approved = reviewStatus === 'approved';
  const published = reviewStatus === 'published';
  const rejected = reviewStatus === 'rejected';

  if (published) {
    return <span className="inline-flex items-center gap-1.5 rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-3 py-2 text-[11px] font-bold text-emerald-300"><Check className="w-3.5 h-3.5" /> Published</span>;
  }

  if (rejected) {
    return <span className="inline-flex items-center gap-1.5 rounded-xl border border-rose-500/30 bg-rose-500/10 px-3 py-2 text-[11px] font-bold text-rose-300"><X className="w-3.5 h-3.5" /> Rejected</span>;
  }

  return (
    <div className="space-y-2 min-w-[230px]">
      {!approved && (
        <>
          <select
            value={productId}
            onChange={(event) => setProductId(event.target.value)}
            className="w-full h-9 rounded-xl border border-[#263B45] bg-[#071015] px-2.5 text-[11px] text-slate-200 outline-none focus:border-emerald-500"
          >
            <option value="">Choose existing product…</option>
            {products.map((product) => (
              <option key={product.id} value={product.id}>
                {product.brand ? `${product.brand} · ` : ''}{product.name}{product.model ? ` · ${product.model}` : ''}
              </option>
            ))}
          </select>

          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              disabled={!productId || busy !== null}
              onClick={() => run('assign_existing')}
              className="min-h-9 rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-2 text-[10px] font-extrabold text-emerald-300 disabled:opacity-40"
            >
              {busy === 'assign_existing' ? 'Saving…' : 'Approve match'}
            </button>
            <button
              type="button"
              disabled={busy !== null}
              onClick={() => run('create_product')}
              className="min-h-9 rounded-xl border border-cyan-500/30 bg-cyan-500/10 px-2 text-[10px] font-extrabold text-cyan-200 disabled:opacity-40 flex items-center justify-center gap-1"
            >
              <PackagePlus className="w-3 h-3" /> {busy === 'create_product' ? 'Creating…' : 'New product'}
            </button>
          </div>
        </>
      )}

      {approved && (
        <button
          type="button"
          disabled={busy !== null}
          onClick={() => run('publish')}
          className="w-full min-h-10 rounded-xl bg-emerald-500 px-3 text-[11px] font-extrabold text-[#071015] hover:bg-emerald-400 disabled:opacity-40 flex items-center justify-center gap-1.5"
        >
          <Send className="w-3.5 h-3.5" /> {busy === 'publish' ? 'Publishing…' : 'Publish product + offer'}
        </button>
      )}

      {!approved && (
        <button
          type="button"
          disabled={busy !== null}
          onClick={() => run('reject')}
          className="w-full min-h-8 rounded-lg text-[10px] font-bold text-slate-500 hover:text-rose-300 disabled:opacity-40"
        >
          Reject staged item
        </button>
      )}

      {message && <div className="text-[10px] leading-4 text-amber-200">{message}</div>}
    </div>
  );
}
