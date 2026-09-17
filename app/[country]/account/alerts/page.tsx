import React, { Suspense } from 'react';
import { Metadata } from 'next';
import { PriceAlertsView } from '@/components/account/PriceAlertsView';

export const metadata: Metadata = {
  title: 'Price Drop Alerts | CatchThePrice',
  description: 'Manage active target price alerts and track price reductions on CatchThePrice.',
  robots: { index: false, follow: false },
};

export default function AlertsPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-[40vh] flex items-center justify-center p-12 text-center text-xs text-[#73858D]">
          Loading your price alerts…
        </div>
      }
    >
      <PriceAlertsView />
    </Suspense>
  );
}
