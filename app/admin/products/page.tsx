'use client';

import React, { useState } from 'react';
import { getAllProducts } from '@/lib/data/products';
import { useCountry } from '@/context/CountryContext';
import { Package, ExternalLink, Search, Sparkles } from 'lucide-react';

export default function AdminProductsPage() {
  const { country, formatLocalPrice } = useCountry();
  const [searchTerm, setSearchTerm] = useState('');
  const allProducts = getAllProducts(country);

  const filtered = allProducts.filter((p) =>
    p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.brand.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-ctp">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-100">Products &amp; Offers Catalog</h1>
          <p className="text-xs text-slate-400 mt-1">
            Manage catalog records, verified price points, and merchant offer links
          </p>
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search products..."
            className="w-full bg-ctp-surface border border-ctp rounded-xl pl-9 pr-3 py-2 text-xs text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-emerald-500"
          />
        </div>
      </div>

      {/* Products Table */}
      <div className="rounded-2xl bg-ctp-surface border border-ctp overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-ctp-surface-elevated text-slate-400 uppercase tracking-wider text-[10px] border-b border-ctp">
              <tr>
                <th className="p-3.5">Product</th>
                <th className="p-3.5">Category</th>
                <th className="p-3.5">Best Price</th>
                <th className="p-3.5">Deal Score</th>
                <th className="p-3.5">Offers</th>
                <th className="p-3.5">Top Merchant</th>
                <th className="p-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-ctp">
              {filtered.map((product) => (
                <tr key={product.id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="p-3.5 flex items-center gap-3">
                    <img
                      src={product.imageUrl}
                      alt={product.title}
                      className="w-9 h-9 rounded-lg object-contain bg-slate-900 border border-ctp shrink-0"
                    />
                    <div className="min-w-0">
                      <div className="font-semibold text-slate-100 truncate max-w-xs">
                        {product.title}
                      </div>
                      <div className="text-[11px] text-slate-400">{product.brand}</div>
                    </div>
                  </td>
                  <td className="p-3.5 whitespace-nowrap">{product.categoryName}</td>
                  <td className="p-3.5 whitespace-nowrap">
                    <span className="font-bold text-emerald-400">
                      {formatLocalPrice(product.currentBestPrice)}
                    </span>
                    <span className="text-[10px] text-slate-400 block line-through">
                      {formatLocalPrice(product.originalPrice)}
                    </span>
                  </td>
                  <td className="p-3.5 whitespace-nowrap">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                      {product.dealScore} Score
                    </span>
                  </td>
                  <td className="p-3.5 whitespace-nowrap">{product.offersCount} stores</td>
                  <td className="p-3.5 whitespace-nowrap text-slate-200">
                    {product.bestMerchantName}
                  </td>
                  <td className="p-3.5 text-right whitespace-nowrap">
                    <a
                      href={`/${country}/product/${product.slug}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-emerald-400 hover:text-emerald-300 font-semibold"
                    >
                      <span>Inspect</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
