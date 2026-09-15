import { NextRequest, NextResponse } from 'next/server';
import { getCatalogProducts } from '@/lib/data/catalog.server';
import { CountryCode } from '@/lib/types';

const LIVE_MARKETS = new Set<CountryCode>(['ae', 'us']);

export async function GET(request: NextRequest) {
  const country = (request.nextUrl.searchParams.get('country') || 'ae').toLowerCase() as CountryCode;

  if (!LIVE_MARKETS.has(country)) {
    return NextResponse.json({ products: [], isPreview: false }, { status: 400 });
  }

  const { products, isPreview } = await getCatalogProducts(country);

  return NextResponse.json(
    { products, isPreview },
    {
      headers: {
        'Cache-Control': isPreview
          ? 'no-store'
          : 'public, s-maxage=300, stale-while-revalidate=900',
        'X-Robots-Tag': 'noindex, nofollow',
      },
    }
  );
}
