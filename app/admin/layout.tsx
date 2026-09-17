import React from 'react';
import { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { BrandLogo } from '@/components/common/BrandLogo';
import { CountryProvider } from '@/context/CountryContext';
import { AdminSignOut } from '@/components/admin/AdminSignOut';
import { createAuthServerClient, isAllowedAdminEmail } from '@/lib/supabase/auth-server';
import {
  LayoutDashboard,
  Package,
  Store,
  RefreshCw,
  GitMerge,
  BarChart3,
  Globe,
  ExternalLink,
  ShieldCheck,
  Sparkles,
  Bell,
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'CatchThePrice Admin Portal',
  description: 'Private CatchThePrice operations workspace.',
  robots: {
    index: false,
    follow: false,
    nocache: true,
  },
};

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createAuthServerClient();
  if (!supabase) redirect('/admin-access');

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user || !isAllowedAdminEmail(user.email)) {
    redirect('/admin-access');
  }

  const navItems = [
    { label: 'Overview', href: '/admin', icon: LayoutDashboard },
    { label: 'Products & Offers', href: '/admin/products', icon: Package },
    { label: 'Merchants', href: '/admin/merchants', icon: Store },
    { label: 'Source Rights', href: '/admin/source-rights', icon: ShieldCheck },
    { label: 'Data Ingestion', href: '/admin/ingestion', icon: RefreshCw },
    { label: 'Product Matching', href: '/admin/matching', icon: GitMerge },
    { label: 'Exception Review', href: '/admin/review', icon: ShieldCheck },
    { label: 'Automation & Jobs', href: '/admin/automation', icon: RefreshCw },
    { label: 'Deals & Drops', href: '/admin/deals', icon: Sparkles },
    { label: 'Price Alerts', href: '/admin/alerts', icon: Bell },
    { label: 'Content & AI', href: '/admin/content', icon: Sparkles },
    { label: 'Analytics & Clicks', href: '/admin/analytics', icon: BarChart3 },
    { label: 'SEO & Structured Data', href: '/admin/seo', icon: Globe },
    { label: 'System & Health', href: '/admin/system', icon: ShieldCheck },
  ];

  return (
    <CountryProvider initialCountry="ae">
      <div className="min-h-screen bg-ctp-base text-slate-100 flex flex-col md:flex-row">
        <aside className="w-full md:w-64 bg-ctp-surface border-r border-ctp p-4 flex flex-col justify-between shrink-0">
          <div>
            <div className="flex items-center justify-between pb-4 border-b border-ctp">
              <BrandLogo size="sm" />
              <span className="px-2 py-0.5 rounded text-[10px] font-extrabold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                PRIVATE
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
            <div className="px-1 pb-1">
              <div className="text-[9px] uppercase tracking-wider font-bold text-slate-500">Signed in</div>
              <div className="text-[10px] text-slate-300 truncate mt-0.5">{user.email}</div>
            </div>
            <a
              href="/ae"
              className="flex items-center justify-between px-3 py-2 rounded-xl bg-slate-900 border border-ctp text-xs text-slate-300 hover:text-white transition-colors"
            >
              <span>Back to Public Site</span>
              <ExternalLink className="w-3.5 h-3.5 text-emerald-400" />
            </a>
            <AdminSignOut />
          </div>
        </aside>

        <main className="flex-1 p-4 sm:p-8 overflow-y-auto max-w-7xl">{children}</main>
      </div>
    </CountryProvider>
  );
}
