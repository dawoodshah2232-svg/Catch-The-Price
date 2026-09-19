import { NextRequest, NextResponse } from 'next/server';
import { searchCatalogProducts } from '@/lib/data/catalog.server';
import { CountryCode } from '@/lib/types';

const LIVE_MARKETS = new Set<CountryCode>(['ae', 'us']);

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const country = (searchParams.get('country') || 'ae').toLowerCase() as CountryCode;
  const q = searchParams.get('q') || '';
  const category = searchParams.get('category') || undefined;
  const brand = searchParams.get('brand') || undefined;
  const merchant = searchParams.get('merchant') || undefined;
  const sortByParam = searchParams.get('sortBy');

  const sortBy =
    sortByParam === 'price_asc' ||
    sortByParam === 'price_desc' ||
    sortByParam === 'biggest_drop' ||
    sortByParam === 'relevance'
      ? sortByParam
      : undefined;

  if (!LIVE_MARKETS.has(country)) {
    return NextResponse.json({ products: [], total: 0, isPreview: false }, { status: 400 });
  }

  const { products, total, isPreview } = await searchCatalogProducts(country, q, {
    category,
    brand,
    merchant,
    sortBy,
  });

  return NextResponse.json(
    { products, total, isPreview },
    {
      headers: {
        'Cache-Control': isPreview
          ? 'no-store'
          : 'public, s-maxage=120, stale-while-revalidate=600',
        'X-Robots-Tag': 'noindex, nofollow',
      },
    }
  );
}
