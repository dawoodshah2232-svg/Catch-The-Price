import React from 'react';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { CountryCode } from '@/lib/types';
import { COUNTRIES, DEFAULT_COUNTRY } from '@/lib/data/countries';
import { getCatalogProductBySlug } from '@/lib/data/catalog.server';
import { ProductClientPage } from '@/components/product/ProductClientPage';

interface ProductPageProps {
  params: Promise<{
    country: string;
    slug: string;
  }>;
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { country: rawCountry, slug } = await params;
  const country = (rawCountry?.toLowerCase() in COUNTRIES ? rawCountry.toLowerCase() : DEFAULT_COUNTRY) as CountryCode;
  const { product, isPreview } = await getCatalogProductBySlug(slug, country);
  const info = COUNTRIES[country];

  if (!product) {
    return {
      title: 'Product Not Found | CatchThePrice',
      robots: { index: false, follow: false },
    };
  }

  const hasReferencePrice = product.originalPrice > product.currentBestPrice;
  const dropPercent = hasReferencePrice
    ? Math.round(((product.originalPrice - product.currentBestPrice) / product.originalPrice) * 100)
    : 0;
  const historyCopy = product.priceHistory.length > 1 ? ' and available price history' : '';
  const savingsCopy = dropPercent > 0 ? ` (${dropPercent}% below the listed reference price)` : '';

  return {
    title: `${product.title} — Compare Prices in ${info.name}`,
    description: `Compare ${product.title} across ${product.offersCount} listed retailer offer${product.offersCount === 1 ? '' : 's'} in ${info.name}. Current lowest listed price: ${info.currency} ${product.currentBestPrice}${savingsCopy}${historyCopy}.`,
    robots: isPreview ? { index: false, follow: false } : undefined,
    alternates: {
      canonical: `https://catchtheprice.com/${country}/product/${product.slug}`,
      languages: {
        'en-AE': `https://catchtheprice.com/ae/product/${product.slug}`,
        'en-US': `https://catchtheprice.com/us/product/${product.slug}`,
      },
    },
    openGraph: {
      title: `${product.title} — Compare Retailer Prices`,
      description: `Compare listed retailer offers for ${product.title} in ${info.name}.`,
      images: product.imageUrl
        ? [
            {
              url: product.imageUrl,
              width: 800,
              height: 800,
              alt: product.title,
            },
          ]
        : undefined,
    },
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { country: rawCountry, slug } = await params;
  const country = (rawCountry?.toLowerCase() in COUNTRIES ? rawCountry.toLowerCase() : DEFAULT_COUNTRY) as CountryCode;
  const { product, related, isPreview } = await getCatalogProductBySlug(slug, country);

  if (!product) {
    notFound();
  }

  const jsonLd = !isPreview
    ? {
        '@context': 'https://schema.org',
        '@type': 'Product',
        name: product.title,
        image: product.imageUrl,
        description: product.description,
        brand: {
          '@type': 'Brand',
          name: product.brand,
        },
        offers: {
          '@type': 'AggregateOffer',
          priceCurrency: product.currency,
          lowPrice: product.currentBestPrice,
          highPrice: product.originalPrice,
          offerCount: product.offersCount,
          offers: product.offers.map((offer) => ({
            '@type': 'Offer',
            price: offer.price,
            priceCurrency: offer.currency,
            availability: offer.inStock ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
            url: `https://catchtheprice.com/api/outbound?offerId=${encodeURIComponent(offer.id)}&country=${country}`,
            seller: {
              '@type': 'Organization',
              name: offer.merchantName,
            },
          })),
        },
      }
    : null;

  const breadcrumbJsonLd = !isPreview
    ? {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
          {
            '@type': 'ListItem',
            position: 1,
            name: 'Home',
            item: `https://catchtheprice.com/${country}`,
          },
          {
            '@type': 'ListItem',
            position: 2,
            name: product.categoryName,
            item: `https://catchtheprice.com/${country}/deals/${product.categorySlug}`,
          },
          {
            '@type': 'ListItem',
            position: 3,
            name: product.title,
            item: `https://catchtheprice.com/${country}/product/${product.slug}`,
          },
        ],
      }
    : null;

  return (
    <>
      {jsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      )}
      {breadcrumbJsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
        />
      )}
      <ProductClientPage product={product} relatedProducts={related} isPreview={isPreview} />
    </>
  );
}
