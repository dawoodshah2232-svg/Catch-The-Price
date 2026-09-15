import { MetadataRoute } from 'next';
import { CATEGORIES } from '@/lib/data/categories';
import { BLOG_POSTS } from '@/lib/data/blog';
import { CountryCode } from '@/lib/types';
import { getCatalogProducts } from '@/lib/data/catalog.server';

const LIVE_COUNTRIES: CountryCode[] = ['ae', 'us'];
const TRUST_PAGES = [
  '/about',
  '/contact',
  '/how-pricing-works',
  '/data-sources',
  '/editorial-policy',
  '/affiliate-disclosure',
  '/privacy',
  '/terms',
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://catchtheprice.com';
  const entries: MetadataRoute.Sitemap = [];

  for (const path of TRUST_PAGES) {
    entries.push({
      url: `${baseUrl}${path}`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: path === '/about' || path === '/data-sources' ? 0.7 : 0.5,
    });
  }

  for (const country of LIVE_COUNTRIES) {
    entries.push({
      url: `${baseUrl}/${country}`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    });

    entries.push({
      url: `${baseUrl}/${country}/deals/all`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    });

    entries.push({
      url: `${baseUrl}/${country}/price-drops/all`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.85,
    });

    entries.push({
      url: `${baseUrl}/${country}/blog`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    });

    for (const post of BLOG_POSTS) {
      entries.push({
        url: `${baseUrl}/${country}/blog/${post.slug}`,
        lastModified: new Date(post.updatedAt),
        changeFrequency: 'weekly',
        priority: 0.75,
      });
    }

    for (const category of CATEGORIES) {
      entries.push({
        url: `${baseUrl}/${country}/deals/${category.slug}`,
        lastModified: new Date(),
        changeFrequency: 'daily',
        priority: 0.8,
      });

      entries.push({
        url: `${baseUrl}/${country}/price-drops/${category.slug}`,
        lastModified: new Date(),
        changeFrequency: 'daily',
        priority: 0.75,
      });
    }

    const { products, isPreview } = await getCatalogProducts(country);
    if (!isPreview) {
      for (const product of products) {
        entries.push({
          url: `${baseUrl}/${country}/product/${product.slug}`,
          lastModified: product.priceLastChecked ? new Date(product.priceLastChecked) : new Date(),
          changeFrequency: 'daily',
          priority: 0.9,
        });
      }
    }
  }

  return entries;
}
