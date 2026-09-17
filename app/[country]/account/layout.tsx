import React from 'react';
import { Metadata } from 'next';
import { AccountNavShell } from '@/components/account/AccountNavShell';

export const metadata: Metadata = {
  title: 'My Account & Price Tracking | CatchThePrice',
  description: 'Manage your saved products, price alerts, notifications, and shopping preferences.',
  robots: {
    index: false,
    follow: false,
    nocache: true,
  },
};

export default async function AccountLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ country: string }>;
}) {
  const resolvedParams = await params;
  const country = resolvedParams.country || 'ae';

  return <AccountNavShell country={country}>{children}</AccountNavShell>;
}
