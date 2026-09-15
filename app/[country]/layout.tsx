import React from 'react';
import { notFound } from 'next/navigation';
import { CountryProvider } from '@/context/CountryContext';
import { CountryCode } from '@/lib/types';
import { COUNTRIES, DEFAULT_COUNTRY } from '@/lib/data/countries';
import { Header } from '@/components/layout/Header';
import { MobileBottomNav } from '@/components/layout/MobileBottomNav';
import { Footer } from '@/components/layout/Footer';

interface CountryLayoutProps {
  children: React.ReactNode;
  params: Promise<{
    country: string;
  }>;
}

const LIVE_COUNTRIES = ['ae', 'us', 'sa', 'uk', 'ca', 'au'] as const;

export function generateStaticParams() {
  return LIVE_COUNTRIES.map((country) => ({ country }));
}

export default async function CountryLayout({
  children,
  params,
}: CountryLayoutProps) {
  const { country: rawCountry } = await params;
  const normalizedCountry = rawCountry?.toLowerCase();

  if (!LIVE_COUNTRIES.includes(normalizedCountry as (typeof LIVE_COUNTRIES)[number])) {
    notFound();
  }

  const country = (normalizedCountry in COUNTRIES ? normalizedCountry : DEFAULT_COUNTRY) as CountryCode;

  return (
    <CountryProvider initialCountry={country}>
      <div className="flex-1 flex flex-col min-h-screen">
        <Header />
        <main className="flex-1 pb-mobile-nav md:pb-0">{children}</main>
        <MobileBottomNav />
        <Footer />
      </div>
    </CountryProvider>
  );
}
