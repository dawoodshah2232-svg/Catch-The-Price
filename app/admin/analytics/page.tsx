'use client';

import React from 'react';
import { BarChart3, ExternalLink, ShieldCheck, ArrowUpRight, MousePointerClick } from 'lucide-react';

export default function AdminAnalyticsPage() {
  const recentClicks = [
    {
      id: 'click-1',
      product: 'Apple iPhone 16 Pro Max 256GB',
      merchant: 'Amazon UAE',
      country: 'ae',
      price: 'AED 4,033',
      time: '6 mins ago',
      device: 'Mobile Safari (iOS 18)',
    },
    {
      id: 'click-2',
      product: 'Samsung Galaxy S24 Ultra 512GB',
      merchant: 'Noon UAE',
      country: 'ae',
      price: 'AED 4,217',
      time: '19 mins ago',
      device: 'Chrome Mobile (Android)',
    },
    {
      id: 'click-3',
      product: 'Sony PlayStation 5 Pro 2TB',
      merchant: 'Best Buy',
      country: 'us',
      price: '$679',
      time: '42 mins ago',
      device: 'Desktop Chrome (Windows)',
    },
    {
      id: 'click-4',
      product: 'Sony WH-1000XM5 Wireless Headphones',
      merchant: 'Amazon UAE',
      country: 'ae',
      price: 'AED 1,204',
      time: '1 hour ago',
      device: 'Mobile Safari (iOS 18)',
    },
    {
      id: 'click-5',
      product: 'Apple MacBook Pro 16" M3 Max',
      merchant: 'Amazon US',
      country: 'us',
      price: '$2,999',
      time: '2 hours ago',
      device: 'Desktop Safari (macOS)',
    },
  ];

  return (
    <div className="space-y-6">
      <div className="pb-6 border-b border-ctp">
        <h1 className="text-2xl font-extrabold text-slate-100">Outbound Click Analytics</h1>
        <p className="text-xs text-slate-400 mt-1">
          Detailed logs of retailer redirect events, affiliate referrals, and conversion routes
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-2xl bg-ctp-surface border border-ctp">
          <div className="text-xs text-slate-400 flex items-center justify-between mb-1">
            <span>Total Outbound Clicks</span>
            <MousePointerClick className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-extrabold text-slate-100">1,429</div>
          <span className="text-[10px] text-emerald-400 font-medium mt-1 block">+18.4% vs last week</span>
        </div>

        <div className="p-4 rounded-2xl bg-ctp-surface border border-ctp">
          <div className="text-xs text-slate-400 flex items-center justify-between mb-1">
            <span>Avg. Conversion Value</span>
            <ArrowUpRight className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-2xl font-extrabold text-slate-100">AED 2,840</div>
          <span className="text-[10px] text-slate-400 font-medium mt-1 block">Electronics &amp; Gadgets</span>
        </div>

        <div className="p-4 rounded-2xl bg-ctp-surface border border-ctp">
          <div className="text-xs text-slate-400 flex items-center justify-between mb-1">
            <span>Active Price Trackers</span>
            <BarChart3 className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-extrabold text-slate-100">384</div>
          <span className="text-[10px] text-emerald-400 font-medium mt-1 block">Live subscriber alerts</span>
        </div>
      </div>

      {/* Outbound Clicks Table */}
      <div className="rounded-2xl bg-ctp-surface border border-ctp overflow-hidden">
        <div className="p-4 border-b border-ctp flex items-center justify-between">
          <h3 className="font-bold text-sm text-slate-200">Recent Merchant Redirects</h3>
          <span className="text-xs text-slate-400">Captured via /api/outbound</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-ctp-surface-elevated text-slate-400 uppercase tracking-wider text-[10px] border-b border-ctp">
              <tr>
                <th className="p-3.5">Product</th>
                <th className="p-3.5">Target Merchant</th>
                <th className="p-3.5">Market</th>
                <th className="p-3.5">Price</th>
                <th className="p-3.5">Client User-Agent</th>
                <th className="p-3.5 text-right">Timestamp</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-ctp">
              {recentClicks.map((click) => (
                <tr key={click.id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="p-3.5 font-semibold text-slate-100">{click.product}</td>
                  <td className="p-3.5 whitespace-nowrap text-emerald-400 font-medium">{click.merchant}</td>
                  <td className="p-3.5 whitespace-nowrap uppercase">{click.country}</td>
                  <td className="p-3.5 whitespace-nowrap font-bold text-slate-200">{click.price}</td>
                  <td className="p-3.5 text-slate-400 font-mono text-[11px]">{click.device}</td>
                  <td className="p-3.5 text-right text-slate-400 whitespace-nowrap">{click.time}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
