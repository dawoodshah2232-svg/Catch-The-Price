import React, { Suspense } from 'react';
import { Metadata } from 'next';
import { SettingsView } from '@/components/account/SettingsView';

export const metadata: Metadata = {
  title: 'Account Settings | CatchThePrice',
  description: 'Manage your profile, primary shopping market, and alert preferences.',
  robots: { index: false, follow: false },
};

export default function SettingsPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-[40vh] flex items-center justify-center p-12 text-center text-xs text-[#73858D]">
          Loading settings…
        </div>
      }
    >
      <SettingsView />
    </Suspense>
  );
}
