import React, { Suspense } from 'react';
import { Metadata } from 'next';
import { NotificationsView } from '@/components/account/NotificationsView';

export const metadata: Metadata = {
  title: 'Notification Center | CatchThePrice',
  description: 'View price target alerts, price drops, and account notifications.',
  robots: { index: false, follow: false },
};

export default function NotificationsPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-[40vh] flex items-center justify-center p-12 text-center text-xs text-[#73858D]">
          Loading notifications…
        </div>
      }
    >
      <NotificationsView />
    </Suspense>
  );
}
