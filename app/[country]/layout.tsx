import React from 'react';
import { notFound } from 'next/navigation';
import { CountryProvider } from '@/context/CountryContext';
import { CountryCode } from '@/lib/types';
import { COUNTRIES, DEFAULT_COUNTRY } from '@/lib/data/countries';
import { Header } from '@/components/layout/Header';
import { MobileBottomNav } from '@/components/layout/MobileBottomNav';
import { Footer } from '@/components/layout/Footer';
import { AnalyticsTracker } from '@/components/analytics/AnalyticsTracker';
import { PrivacyPreferences } from '@/components/privacy/PrivacyPreferences';

interface CountryLayoutProps {
  children: React.ReactNode;
  params: Promise<{
    country: string;
  }>;
}

const LIVE_COUNTRIES = ['ae', 'us'] as const;

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
      <AnalyticsTracker />
      <a href="#main-content" className="sr-only focus:not-sr-only focus:fixed focus:left-3 focus:top-3 focus:z-[100] focus:rounded-xl focus:bg-white focus:px-4 focus:py-2.5 focus:text-sm focus:font-extrabold focus:text-[#08784B] focus:shadow-xl">
        Skip to main content
      </a>
      <div className="public-shell ui-page flex-1 flex flex-col min-h-screen">
        <Header />
        <main id="main-content" tabIndex={-1} className="flex-1 pb-mobile-nav md:pb-0">{children}</main>
        <MobileBottomNav />
        <Footer />
      </div>
      <PrivacyPreferences />
    </CountryProvider>
  );
}
