import React, { Suspense } from 'react';
import { Metadata } from 'next';
import { AccountDashboard } from '@/components/account/AccountDashboard';

export const metadata: Metadata = {
  title: 'My Saved & Tracked Prices | CatchThePrice',
  description: 'Manage your saved products, price drop alerts, and shopping notification preferences.',
};

export default function AccountPage() {
  return (
    <Suspense
      fallback={
        <div className="p-12 text-center text-xs text-slate-400">
          Loading your saved wishlist and price trackers...
        </div>
      }
    >
      <AccountDashboard />
    </Suspense>
  );
}
