'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  Inbox,
  Check,
  CheckCheck,
  Trash2,
  Bell,
  TrendingDown,
  Target,
  Sparkles,
  Package,
  Info,
  ExternalLink,
} from 'lucide-react';

interface NotificationItem {
  id: string;
  type: 'PRICE_TARGET_REACHED' | 'PRICE_DROP' | 'HISTORICAL_LOW' | 'BACK_IN_STOCK' | 'DEAL_DETECTED' | 'SYSTEM';
  title: string;
  message: string;
  link_url?: string;
  product_id?: string;
  is_read: boolean;
  read_at?: string;
  created_at: string;
}

function timeAgo(dateString: string) {
  const date = new Date(dateString);
  const now = new Date();
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (seconds < 60) return 'Just now';
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

function getIconForType(type: NotificationItem['type']) {
  switch (type) {
    case 'PRICE_TARGET_REACHED':
      return <Target className="h-4 w-4 text-[#00A859]" />;
    case 'PRICE_DROP':
      return <TrendingDown className="h-4 w-4 text-[#00A859]" />;
    case 'HISTORICAL_LOW':
      return <Sparkles className="h-4 w-4 text-[#e8590c]" />;
    case 'BACK_IN_STOCK':
      return <Package className="h-4 w-4 text-[#1c7ed6]" />;
    case 'DEAL_DETECTED':
      return <Bell className="h-4 w-4 text-[#7950f2]" />;
    case 'SYSTEM':
    default:
      return <Info className="h-4 w-4 text-[#71867c]" />;
  }
}

export function NotificationsView() {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'unread'>('all');

  useEffect(() => {
    let active = true;
    setLoading(true);

    fetch('/api/account/notifications', { cache: 'no-store' })
      .then((res) => (res.ok ? res.json() : { notifications: [], unreadCount: 0 }))
      .then((data) => {
        if (!active) return;
        setNotifications(Array.isArray(data.notifications) ? data.notifications : []);
        setUnreadCount(typeof data.unreadCount === 'number' ? data.unreadCount : 0);
      })
      .catch(() => {
        if (active) setNotifications([]);
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  async function handleMarkRead(id: string) {
    // Optimistic update
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, is_read: true, read_at: new Date().toISOString() } : n))
    );
    setUnreadCount((prev) => Math.max(0, prev - 1));

    try {
      await fetch('/api/account/notifications', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });
    } catch {
      // Ignored
    }
  }

  async function handleMarkAllRead() {
    // Optimistic update
    setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true, read_at: new Date().toISOString() })));
    setUnreadCount(0);

    try {
      await fetch('/api/account/notifications', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ all: true }),
      });
    } catch {
      // Ignored
    }
  }

  async function handleDelete(id: string) {
    const item = notifications.find((n) => n.id === id);
    if (!item?.is_read) {
      setUnreadCount((prev) => Math.max(0, prev - 1));
    }
    setNotifications((prev) => prev.filter((n) => n.id !== id));

    try {
      await fetch(`/api/account/notifications?id=${encodeURIComponent(id)}`, {
        method: 'DELETE',
      });
    } catch {
      // Ignored
    }
  }

  const displayedList = filter === 'unread' ? notifications.filter((n) => !n.is_read) : notifications;

  return (
    <div className="space-y-6">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-[#0c1913] flex items-center gap-2.5">
            <Inbox className="h-6 w-6 text-[#00A859]" />
            <span>Notification Center</span>
          </h1>
          <p className="mt-1 text-xs text-[#5c7268]">
            Stay updated on price target triggers, all-time lows, and platform updates.
          </p>
        </div>

        {unreadCount > 0 && (
          <button
            type="button"
            onClick={handleMarkAllRead}
            className="inline-flex items-center gap-1.5 rounded-2xl border border-[#d2e0da] bg-white px-3.5 py-2 text-xs font-bold text-[#0c1913] hover:bg-[#f2f7f4] hover:border-[#b8cfc5] transition-colors self-start sm:self-auto"
          >
            <CheckCheck className="h-4 w-4 text-[#00A859]" />
            <span>Mark all read</span>
          </button>
        )}
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-1 border-b border-[#dce6e1] pb-3">
        <button
          type="button"
          onClick={() => setFilter('all')}
          className={`rounded-xl px-3.5 py-1.5 text-xs font-bold transition-colors ${
            filter === 'all'
              ? 'bg-[#00C16A] text-white'
              : 'text-[#5c7268] hover:bg-white hover:text-[#0c1913]'
          }`}
        >
          All ({notifications.length})
        </button>
        <button
          type="button"
          onClick={() => setFilter('unread')}
          className={`rounded-xl px-3.5 py-1.5 text-xs font-bold transition-colors ${
            filter === 'unread'
              ? 'bg-[#00C16A] text-white'
              : 'text-[#5c7268] hover:bg-white hover:text-[#0c1913]'
          }`}
        >
          Unread ({unreadCount})
        </button>
      </div>

      {/* List */}
      {loading ? (
        <div className="min-h-[30vh] flex items-center justify-center text-xs text-[#73858D]">
          Loading notifications…
        </div>
      ) : displayedList.length > 0 ? (
        <div className="space-y-3">
          {displayedList.map((item) => (
            <div
              key={item.id}
              className={`rounded-2xl border p-4 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                !item.is_read
                  ? 'border-emerald-300 bg-emerald-50/40 shadow-sm'
                  : 'border-[#dce6e1] bg-white'
              }`}
            >
              <div className="flex items-start gap-3.5 min-w-0">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white border border-[#d6e3dd] shadow-xs">
                  {getIconForType(item.type)}
                </div>

                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="text-xs font-bold text-[#0c1913] truncate">
                      {item.title}
                    </h3>
                    {!item.is_read && (
                      <span className="h-2 w-2 rounded-full bg-[#00C16A] shrink-0" title="Unread" />
                    )}
                  </div>
                  <p className="mt-0.5 text-xs text-[#5c7268] leading-relaxed">
                    {item.message}
                  </p>
                  <span className="mt-1 block text-[10px] text-[#8aa095]">
                    {timeAgo(item.created_at)}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                {item.link_url && (
                  <Link
                    href={item.link_url}
                    className="flex h-8 items-center gap-1 rounded-lg bg-[#00C16A] px-2.5 text-[11px] font-bold text-white hover:bg-[#00a85c] transition-colors"
                  >
                    <span>View</span>
                    <ExternalLink className="h-3 w-3" />
                  </Link>
                )}

                {!item.is_read && (
                  <button
                    type="button"
                    onClick={() => handleMarkRead(item.id)}
                    title="Mark as read"
                    className="flex h-8 w-8 items-center justify-center rounded-lg border border-[#d2e0da] bg-white text-[#5c7268] hover:text-[#00A859] hover:bg-[#f2f7f4] transition-colors"
                  >
                    <Check className="h-3.5 w-3.5" />
                  </button>
                )}

                <button
                  type="button"
                  onClick={() => handleDelete(item.id)}
                  title="Delete notification"
                  className="flex h-8 w-8 items-center justify-center rounded-lg border border-red-200 bg-white text-red-500 hover:bg-red-50 transition-colors"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="rounded-3xl border border-dashed border-[#d2e0da] bg-white p-12 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[#e6f9f0] text-[#00A859]">
            <Inbox className="h-8 w-8" />
          </div>
          <h2 className="mt-4 text-xl font-black text-[#0c1913]">No notifications right now</h2>
          <p className="mt-2 text-xs text-[#5c7268] max-w-sm mx-auto">
            You&apos;re all caught up! When a tracked item hits your price target or drops significantly, it will appear here.
          </p>
        </div>
      )}
    </div>
  );
}
