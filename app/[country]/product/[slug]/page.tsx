import React from 'react';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { CountryCode } from '@/lib/types';
import { COUNTRIES, DEFAULT_COUNTRY } from '@/lib/data/countries';
import { getProductBySlug, getAllProducts } from '@/lib/data/products';
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
  const product = getProductBySlug(slug, country);
  const info = COUNTRIES[country];

  if (!product) {
    return {
      title: 'Product Not Found | CatchThePrice',
    };
  }

  const dropPercent = Math.round(
    ((product.originalPrice - product.currentBestPrice) / product.originalPrice) * 100
  );

  return {
    title: `${product.title} — Best Price & Drops in ${info.name}`,
    description: `Track ${product.title} best price: ${info.currency} ${product.currentBestPrice} (save ${dropPercent}%). Compare ${product.offersCount} stores with historical price charts and Deal Score.`,
    alternates: {
      canonical: `https://catchtheprice.com/${country}/product/${product.slug}`,
      languages: {
        'en-AE': `https://catchtheprice.com/ae/product/${product.slug}`,
        'en-US': `https://catchtheprice.com/us/product/${product.slug}`,
        'en-GB': `https://catchtheprice.com/uk/product/${product.slug}`,
        'en-CA': `https://catchtheprice.com/ca/product/${product.slug}`,
        'en-AU': `https://catchtheprice.com/au/product/${product.slug}`,
      },
    },
    openGraph: {
      title: `${product.title} Best Deals & Tracking`,
      description: `Catch the price drop on ${product.title}. Lowest verified price: ${info.currency} ${product.currentBestPrice}.`,
      images: [
        {
          url: product.imageUrl,
          width: 800,
          height: 800,
          alt: product.title,
        },
      ],
    },
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { country: rawCountry, slug } = await params;
  const country = (rawCountry?.toLowerCase() in COUNTRIES ? rawCountry.toLowerCase() : DEFAULT_COUNTRY) as CountryCode;
  const product = getProductBySlug(slug, country);

  if (!product) {
    notFound();
  }

  const related = getAllProducts(country)
    .filter((p) => p.categorySlug === product.categorySlug && p.id !== product.id)
    .slice(0, 4);

  // Schema.org Product & AggregateOffer JSON-LD
  const jsonLd = {
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
      offers: product.offers.map((o) => ({
        '@type': 'Offer',
        price: o.price,
        priceCurrency: o.currency,
        availability: o.inStock ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
        seller: {
          '@type': 'Organization',
          name: o.merchantName,
        },
      })),
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ProductClientPage product={product} relatedProducts={related} />
    </>
  );
}
