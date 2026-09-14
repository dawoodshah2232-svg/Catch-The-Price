'use client';

import React from 'react';
import {
  SearchX,
  PackageX,
  AlertCircle,
  Store,
  WifiOff,
  CheckCircle2,
  Bookmark,
  Bell,
  ArrowRight,
  RefreshCw,
} from 'lucide-react';

interface StateViewProps {
  type:
    | 'no_results'
    | 'product_unavailable'
    | 'price_unavailable'
    | 'store_unavailable'
    | 'network_error'
    | 'alert_created'
    | 'no_saved'
    | 'no_tracked';
  title?: string;
  description?: string;
  actionText?: string;
  onAction?: () => void;
  actionHref?: string;
}

export function StateView({
  type,
  title,
  description,
  actionText,
  onAction,
  actionHref,
}: StateViewProps) {
  const configs = {
    no_results: {
      icon: SearchX,
      color: '#94A3B8',
      defaultTitle: 'No Matching Products Found',
      defaultDesc: 'Try adjusting your search terms, removing filters, or browsing by category.',
      defaultAction: 'Browse All Categories',
    },
    product_unavailable: {
      icon: PackageX,
      color: '#F59E0B',
      defaultTitle: 'Product Currently Unavailable',
      defaultDesc: 'This model is currently out of stock across all monitored retailers in this country.',
      defaultAction: 'View Similar Models',
    },
    price_unavailable: {
      icon: AlertCircle,
      color: '#F59E0B',
      defaultTitle: 'Price Currently Updating',
      defaultDesc: 'Our crawler is validating new price data from retailers. Please check back in a few minutes.',
      defaultAction: 'Refresh Page',
    },
    store_unavailable: {
      icon: Store,
      color: '#94A3B8',
      defaultTitle: 'Retailer Temporarily Offline',
      defaultDesc: 'The merchant feed is currently under maintenance. Other store prices remain active.',
      defaultAction: 'View Other Stores',
    },
    network_error: {
      icon: WifiOff,
      color: '#EF4444',
      defaultTitle: 'Network Connection Interrupted',
      defaultDesc: 'Unable to reach the pricing server. Please check your internet connection.',
      defaultAction: 'Retry Connection',
    },
    alert_created: {
      icon: CheckCircle2,
      color: '#00D27A',
      defaultTitle: 'Price Drop Alert Activated',
      defaultDesc: 'You will receive an instant notification as soon as the price hits your target.',
      defaultAction: 'View All Trackers',
    },
    no_saved: {
      icon: Bookmark,
      color: '#00D27A',
      defaultTitle: 'No Saved Products Yet',
      defaultDesc: 'Tap the bookmark icon on any product card to save it for quick comparison later.',
      defaultAction: 'Discover Top Deals',
    },
    no_tracked: {
      icon: Bell,
      color: '#00D27A',
      defaultTitle: 'No Active Price Trackers',
      defaultDesc: 'Track prices on your favorite electronics to get pinged the moment prices drop.',
      defaultAction: 'Explore Price Drops',
    },
  };

  const c = configs[type];
  const Icon = c.icon;

  return (
    <div className="p-8 sm:p-12 text-center rounded-3xl bg-[#091217] border border-[#162633] max-w-lg mx-auto my-6 space-y-4 shadow-xl">
      <div
        className="w-14 h-14 rounded-2xl mx-auto flex items-center justify-center border"
        style={{
          backgroundColor: `${c.color}15`,
          borderColor: `${c.color}30`,
          color: c.color,
        }}
      >
        <Icon className="w-7 h-7 stroke-[1.75]" />
      </div>

      <div className="space-y-1.5">
        <h3 className="text-base sm:text-lg font-bold text-[#F8FAFC]">
          {title || c.defaultTitle}
        </h3>
        <p className="text-xs sm:text-sm text-[#CBD5E1] leading-relaxed max-w-sm mx-auto">
          {description || c.defaultDesc}
        </p>
      </div>

      {(actionText || c.defaultAction) && (
        <div className="pt-2">
          {actionHref ? (
            <a
              href={actionHref}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#0f1c24] hover:bg-[#00D27A] text-[#F8FAFC] hover:text-[#071015] border border-[#162633] hover:border-[#00D27A] font-bold text-xs transition-all touch-target"
            >
              <span>{actionText || c.defaultAction}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </a>
          ) : (
            <button
              type="button"
              onClick={onAction}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#0f1c24] hover:bg-[#00D27A] text-[#F8FAFC] hover:text-[#071015] border border-[#162633] hover:border-[#00D27A] font-bold text-xs transition-all touch-target"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>{actionText || c.defaultAction}</span>
            </button>
          )}
        </div>
      )}
    </div>
  );
}
