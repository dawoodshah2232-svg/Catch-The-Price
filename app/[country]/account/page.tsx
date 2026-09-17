import React, { Suspense } from 'react';
import { Metadata } from 'next';
import { AccountOverview } from '@/components/account/AccountOverview';

export const metadata: Metadata = {
  title: 'My Account Dashboard | CatchThePrice',
  description: 'Manage saved products, track price drop alerts, and review price history.',
  robots: { index: false, follow: false },
};

export default function AccountPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-[40vh] flex items-center justify-center p-12 text-center text-xs text-[#73858D]">
          Loading your CatchThePrice account…
        </div>
      }
    >
      <AccountOverview />
    </Suspense>
  );
}
