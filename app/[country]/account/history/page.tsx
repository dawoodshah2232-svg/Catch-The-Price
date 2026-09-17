import React, { Suspense } from 'react';
import { Metadata } from 'next';
import { HistoryView } from '@/components/account/HistoryView';

export const metadata: Metadata = {
  title: 'Browsing & Price History | CatchThePrice',
  description: 'Review recently viewed products and price changes recorded over time.',
  robots: { index: false, follow: false },
};

export default function HistoryPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-[40vh] flex items-center justify-center p-12 text-center text-xs text-[#73858D]">
          Loading history…
        </div>
      }
    >
      <HistoryView />
    </Suspense>
  );
}
