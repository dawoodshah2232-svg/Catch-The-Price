import React, { Suspense } from 'react';
import { Metadata } from 'next';
import { SavedProductsView } from '@/components/account/SavedProductsView';

export const metadata: Metadata = {
  title: 'Saved Products & Watchlist | CatchThePrice',
  description: 'View and manage all products in your CatchThePrice shopping watchlist.',
  robots: { index: false, follow: false },
};

export default function SavedPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-[40vh] flex items-center justify-center p-12 text-center text-xs text-[#73858D]">
          Loading your saved products…
        </div>
      }
    >
      <SavedProductsView />
    </Suspense>
  );
}
