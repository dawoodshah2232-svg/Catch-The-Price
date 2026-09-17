'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  Bookmark,
  Bell,
  Inbox,
  Clock,
  Settings,
  LogIn,
  LogOut,
  ShieldCheck,
  ChevronRight,
  TrendingDown,
} from 'lucide-react';
import { useCountry } from '@/context/CountryContext';
import { createSupabaseBrowserClient } from '@/lib/supabase/browser';

interface AccountNavShellProps {
  children: React.ReactNode;
  country: string;
}

interface UserProfile {
  id: string;
  email: string;
  displayName: string;
  avatarUrl?: string;
}

export function AccountNavShell({ children, country }: AccountNavShellProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { savedProductIds, alerts, countryInfo } = useCountry();

  const [user, setUser] = useState<UserProfile | null>(null);
  const [loadingUser, setLoadingUser] = useState(true);
  const [unreadNotifications, setUnreadNotifications] = useState(0);

  useEffect(() => {
    let active = true;
    const supabase = createSupabaseBrowserClient();
    if (!supabase) {
      setLoadingUser(false);
      return;
    }

    supabase.auth.getUser().then(({ data: { user: authUser } }) => {
      if (!active) return;
      if (authUser) {
        setUser({
          id: authUser.id,
          email: authUser.email || '',
          displayName:
            authUser.user_metadata?.full_name ||
            authUser.user_metadata?.display_name ||
            authUser.email?.split('@')[0] ||
            'Shopper',
          avatarUrl: authUser.user_metadata?.avatar_url,
        });

        // Fetch unread notifications count
        fetch('/api/account/notifications')
          .then((res) => (res.ok ? res.json() : { unreadCount: 0 }))
          .then((data) => {
            if (active && typeof data.unreadCount === 'number') {
              setUnreadNotifications(data.unreadCount);
            }
          })
          .catch(() => undefined);
      } else {
        setUser(null);
      }
      setLoadingUser(false);
    });

    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!active) return;
      if (session?.user) {
        setUser({
          id: session.user.id,
          email: session.user.email || '',
          displayName:
            session.user.user_metadata?.full_name ||
            session.user.email?.split('@')[0] ||
            'Shopper',
          avatarUrl: session.user.user_metadata?.avatar_url,
        });
      } else {
        setUser(null);
      }
    });

    return () => {
      active = false;
      authListener?.subscription.unsubscribe();
    };
  }, []);

  async function handleSignOut() {
    const supabase = createSupabaseBrowserClient();
    if (supabase) {
      await supabase.auth.signOut();
    }
    setUser(null);
    router.push(`/${country}`);
    router.refresh();
  }

  const tabs = [
    {
      label: 'Overview',
      href: `/${country}/account`,
      icon: LayoutDashboard,
      exact: true,
    },
    {
      label: 'Saved Products',
      href: `/${country}/account/saved`,
      icon: Bookmark,
      count: savedProductIds.length,
    },
    {
      label: 'Price Alerts',
      href: `/${country}/account/alerts`,
      icon: Bell,
      count: alerts.length,
    },
    {
      label: 'Notifications',
      href: `/${country}/account/notifications`,
      icon: Inbox,
      count: unreadNotifications,
      highlightBadge: unreadNotifications > 0,
    },
    {
      label: 'History',
      href: `/${country}/account/history`,
      icon: Clock,
    },
    {
      label: 'Settings',
      href: `/${country}/account/settings`,
      icon: Settings,
    },
  ];

  function isTabActive(tabHref: string, exact?: boolean) {
    if (exact) {
      return pathname === tabHref;
    }
    return pathname === tabHref || pathname.startsWith(`${tabHref}/`);
  }

  return (
    <div className="min-h-screen bg-[#f3f7f5] pb-24 lg:pb-12 text-[#0c1913]">
      {/* Account Top Profile Banner */}
      <section className="bg-gradient-to-b from-[#081510] to-[#0d1e18] text-white border-b border-emerald-950/40">
        <div className="max-w-[1300px] mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="relative flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-[#00C16A] to-[#008f4c] text-white shadow-[0_8px_20px_rgba(0,193,106,0.3)]">
                {user?.avatarUrl ? (
                  <img
                    src={user.avatarUrl}
                    alt={user.displayName}
                    className="h-full w-full rounded-2xl object-cover"
                  />
                ) : (
                  <span className="text-xl font-black">
                    {user?.displayName ? user.displayName.charAt(0).toUpperCase() : 'C'}
                  </span>
                )}
                {user && (
                  <div
                    title="Account verified"
                    className="absolute -bottom-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-[#081510] border-2 border-[#00C16A] text-[#00C16A]"
                  >
                    <ShieldCheck className="h-3 w-3" />
                  </div>
                )}
              </div>

              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <h1 className="text-xl sm:text-2xl font-black tracking-tight text-white truncate">
                    {user ? user.displayName : 'Guest Shopper'}
                  </h1>
                  <span className="shrink-0 rounded-full bg-emerald-500/20 px-2.5 py-0.5 text-[11px] font-bold text-[#68efb8] border border-emerald-500/30">
                    {countryInfo.name} • {countryInfo.currency}
                  </span>
                </div>
                <p className="mt-0.5 text-xs text-slate-300 truncate">
                  {user ? user.email : 'Items are saved locally on this device'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2.5 self-start sm:self-auto">
              {user ? (
                <button
                  type="button"
                  onClick={handleSignOut}
                  className="ctp-dark-action inline-flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-xs font-bold"
                >
                  <LogOut className="h-3.5 w-3.5 text-emerald-400" />
                  <span>Sign Out</span>
                </button>
              ) : (
                <div className="flex items-center gap-2">
                  <Link
                    href={`/${country}/login?next=${encodeURIComponent(pathname)}`}
                    className="inline-flex items-center gap-1.5 rounded-xl bg-[#00C16A] px-4 py-2 text-xs font-black text-[#081510] shadow-[0_4px_12px_rgba(0,193,106,0.3)] hover:bg-[#00d877] transition-all"
                  >
                    <LogIn className="h-3.5 w-3.5" />
                    <span>Sign In</span>
                  </Link>
                  <Link
                    href={`/${country}/signup?next=${encodeURIComponent(pathname)}`}
                    className="ctp-dark-action inline-flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-xs font-bold"
                  >
                    <span>Create Account</span>
                  </Link>
                </div>
              )}
            </div>
          </div>

          {/* Guest Sync Callout Banner */}
          {!user && !loadingUser && (
            <div className="mt-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-2xl border border-emerald-500/40 bg-gradient-to-r from-emerald-950/80 to-[#0b1c15] p-3.5 sm:p-4 text-xs shadow-[0_4px_16px_rgba(0,0,0,0.2)]">
              <div className="flex items-center gap-2.5 min-w-0">
                <TrendingDown className="h-4 w-4 text-[#00E6A2] shrink-0" />
                <span className="text-slate-100 leading-relaxed">
                  <strong className="text-white font-bold">Sync your saved items across devices.</strong> Save products permanently and receive real-time price-drop notifications.
                </span>
              </div>
              <Link
                href={`/${country}/login`}
                className="shrink-0 inline-flex items-center gap-1 rounded-xl bg-[#00C16A] px-3.5 py-1.5 text-xs font-black text-[#081510] hover:bg-[#00e6a2] transition-colors self-start sm:self-auto"
              >
                <span>Sign in now</span>
                <ChevronRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          )}

          {/* Account Subnavigation Tabs */}
          <div className="mt-6 flex items-center gap-1.5 overflow-x-auto pb-1.5 scrollbar-none">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const active = isTabActive(tab.href, tab.exact);

              return (
                <Link
                  key={tab.label}
                  href={tab.href}
                  aria-current={active ? 'page' : undefined}
                  data-active={active}
                  className="ctp-dark-tab inline-flex shrink-0 items-center gap-2 rounded-xl px-3.5 py-2 text-xs font-bold"
                >
                  <Icon className="h-4 w-4" />
                  <span>{tab.label}</span>
                  {tab.count !== undefined && tab.count > 0 && (
                    <span
                      className={`inline-flex min-w-4 h-4 items-center justify-center rounded-full px-1 text-[10px] font-black ${
                        active
                          ? 'bg-[#081510] text-[#00C16A]'
                          : tab.highlightBadge
                          ? 'bg-[#00C16A] text-[#081510]'
                          : 'bg-white/20 text-white'
                      }`}
                    >
                      {tab.count}
                    </span>
                  )}
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Main Account Page Content */}
      <main className="max-w-[1300px] mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        {children}
      </main>

      {/* Mobile Bottom Navigation for Native App Feel */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#081117] border-t border-[#1d3540] px-2 py-1.5 shadow-[0_-4px_20px_rgba(0,0,0,0.3)]">
        <div className="grid grid-cols-5 gap-1">
          {tabs.slice(0, 5).map((tab) => {
            const Icon = tab.icon;
            const active = isTabActive(tab.href, tab.exact);

            return (
              <Link
                key={tab.label}
                href={tab.href}
                className={`relative flex flex-col items-center justify-center py-1.5 rounded-lg text-[10px] font-bold transition-colors ${
                  active ? 'text-[#00C16A]' : 'text-slate-400 hover:text-white'
                }`}
              >
                <Icon className="h-5 w-5 mb-0.5" />
                <span className="truncate max-w-[60px]">{tab.label.split(' ')[0]}</span>
                {tab.count !== undefined && tab.count > 0 && (
                  <span
                    className={`absolute top-1 right-3 flex min-w-3.5 h-3.5 items-center justify-center rounded-full px-0.5 text-[8px] font-black ${
                      tab.highlightBadge
                        ? 'bg-[#00C16A] text-[#081510]'
                        : 'bg-emerald-700 text-white'
                    }`}
                  >
                    {tab.count}
                  </span>
                )}
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
