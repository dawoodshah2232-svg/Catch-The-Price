import React from 'react';
import { Metadata } from 'next';
import { CountryCode } from '@/lib/types';
import { COUNTRIES, DEFAULT_COUNTRY } from '@/lib/data/countries';
import { getCatalogProducts } from '@/lib/data/catalog.server';
import { CompareWorkspace } from '@/components/compare/CompareWorkspace';

interface ComparePageProps {
  params: Promise<{ country: string }>;
}

export const metadata: Metadata = {
  title: 'Compare Products | CatchThePrice',
  description: 'Compare two products side by side using structured CatchThePrice catalog data.',
  robots: { index: false, follow: false },
};

export default async function ComparePage({ params }: ComparePageProps) {
  const { country: rawCountry } = await params;
  const country = (rawCountry?.toLowerCase() in COUNTRIES ? rawCountry.toLowerCase() : DEFAULT_COUNTRY) as CountryCode;
  const { products, isPreview } = await getCatalogProducts(country);

  return (
    <div className="min-h-screen bg-[#071015] px-4 sm:px-6 lg:px-8 py-5 sm:py-8">
      <div className="max-w-6xl mx-auto">
        <CompareWorkspace products={products} isPreview={isPreview} />
      </div>
    </div>
  );
}
