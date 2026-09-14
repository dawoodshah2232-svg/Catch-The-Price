import React from 'react';
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

export function generateStaticParams() {
  return [
    { country: 'ae' },
    { country: 'us' },
    { country: 'uk' },
    { country: 'ca' },
    { country: 'au' },
  ];
}

export default async function CountryLayout({
  children,
  params,
}: CountryLayoutProps) {
  const { country: rawCountry } = await params;
  const country = (rawCountry?.toLowerCase() in COUNTRIES ? rawCountry.toLowerCase() : DEFAULT_COUNTRY) as CountryCode;

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
