import { NextRequest, NextResponse } from 'next/server';
import { getCatalogProducts } from '@/lib/data/catalog.server';
import { CountryCode } from '@/lib/types';

const LIVE_MARKETS = new Set<CountryCode>(['ae', 'us']);

export async function GET(request: NextRequest) {
  const country = (request.nextUrl.searchParams.get('country') || 'ae').toLowerCase() as CountryCode;

  if (!LIVE_MARKETS.has(country)) {
    return NextResponse.json({ products: [], isPreview: false }, { status: 400 });
  }

  const q = request.nextUrl.searchParams.get('q');
  const category = request.nextUrl.searchParams.get('category') || undefined;
  const brand = request.nextUrl.searchParams.get('brand') || undefined;
  const merchant = request.nextUrl.searchParams.get('merchant') || undefined;
  const sortByParam = request.nextUrl.searchParams.get('sortBy');
  const sortBy =
    sortByParam === 'price_asc' ||
    sortByParam === 'price_desc' ||
    sortByParam === 'biggest_drop' ||
    sortByParam === 'relevance'
      ? sortByParam
      : undefined;

  let products;
  let isPreview = false;

  if (q !== null || category || brand || merchant || sortBy) {
    const searchRes = await import('@/lib/data/catalog.server').then((m) =>
      m.searchCatalogProducts(country, q || '', { category, brand, merchant, sortBy })
    );
    products = searchRes.products;
    isPreview = searchRes.isPreview;
  } else {
    const catalogRes = await getCatalogProducts(country);
    products = catalogRes.products;
    isPreview = catalogRes.isPreview;
  }

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
