import React, { Suspense } from 'react';
import { Metadata } from 'next';
import { AccountDashboard } from '@/components/account/AccountDashboard';

export const metadata: Metadata = {
  title: 'Saved Products & Price Tracking | CatchThePrice',
  description: 'View products saved on this device and CatchThePrice price-tracking preferences.',
  robots: { index: false, follow: false },
};

export default function AccountPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-[50vh] bg-[#F4F7F6] p-12 text-center text-xs text-[#73858D]">
          Loading your shopping space…
        </div>
      }
    >
      <AccountDashboard />
    </Suspense>
  );
}
