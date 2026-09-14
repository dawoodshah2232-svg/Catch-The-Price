import React from 'react';
import { Metadata } from 'next';
import { BrandLogo } from '@/components/common/BrandLogo';
import { CountryProvider } from '@/context/CountryContext';
import {
  LayoutDashboard,
  Package,
  Store,
  RefreshCw,
  GitMerge,
  BarChart3,
  Globe,
  Bell,
  Sliders,
  ExternalLink,
  ShieldAlert,
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'CatchThePrice Admin Portal',
  description: 'Operations, ingestion pipelines, product matching, and pricing analytics dashboard.',
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const navItems = [
    { label: 'Overview', href: '/admin', icon: LayoutDashboard },
    { label: 'Products & Offers', href: '/admin/products', icon: Package },
    { label: 'Merchants & Feeds', href: '/admin/merchants', icon: Store },
    { label: 'Ingestion Runs', href: '/admin/ingestion', icon: RefreshCw },
    { label: 'Product Matching', href: '/admin/matching', icon: GitMerge },
    { label: 'Analytics & Clicks', href: '/admin/analytics', icon: BarChart3 },
    { label: 'SEO & Structured Data', href: '/admin/seo', icon: Globe },
  ];

  return (
    <CountryProvider initialCountry="ae">
      <div className="min-h-screen bg-ctp-base text-slate-100 flex flex-col md:flex-row">
        {/* Admin Sidebar */}
        <aside className="w-full md:w-64 bg-ctp-surface border-r border-ctp p-4 flex flex-col justify-between shrink-0">
          <div>
            <div className="flex items-center justify-between pb-4 border-b border-ctp">
              <BrandLogo size="sm" />
              <span className="px-2 py-0.5 rounded text-[10px] font-extrabold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                ADMIN
              </span>
            </div>

            <nav className="mt-6 space-y-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <a
                    key={item.label}
                    href={item.href}
                    className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-300 hover:text-white hover:bg-slate-800/70 transition-colors"
                  >
                    <Icon className="w-4 h-4 text-emerald-400" />
                    <span>{item.label}</span>
                  </a>
                );
              })}
            </nav>
          </div>

          <div className="pt-6 border-t border-ctp mt-6 space-y-2">
            <a
              href="/ae"
              className="flex items-center justify-between px-3 py-2 rounded-xl bg-slate-900 border border-ctp text-xs text-slate-300 hover:text-white transition-colors"
            >
              <span>Back to Public Store</span>
              <ExternalLink className="w-3.5 h-3.5 text-emerald-400" />
            </a>
            <div className="text-[10px] text-slate-400 px-1">
              System: Production Ready v1.0.0
            </div>
          </div>
        </aside>

        {/* Admin Main Content */}
        <main className="flex-1 p-4 sm:p-8 overflow-y-auto max-w-7xl">{children}</main>
      </div>
    </CountryProvider>
  );
}
