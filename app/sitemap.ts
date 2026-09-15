import { MetadataRoute } from 'next';
import { CATEGORIES } from '@/lib/data/categories';
import { getCatalogProducts, isPreviewCatalogEnabled } from '@/lib/data/catalog.server';
import { BLOG_POSTS } from '@/lib/data/blog';
import { CountryCode } from '@/lib/types';

const LIVE_COUNTRIES: CountryCode[] = ['ae', 'us', 'sa', 'uk', 'ca', 'au'];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://catchtheprice.com';
  const entries: MetadataRoute.Sitemap = [];
  const preview = isPreviewCatalogEnabled();

  TRUST_PAGES.forEach((path) => {
    entries.push({
      url: `${baseUrl}${path}`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.55,
    });
  });

  for (const c of LIVE_COUNTRIES) {
    entries.push({
      url: `${baseUrl}/${c}`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1.0,
    });

    entries.push({
      url: `${baseUrl}/${c}/deals/all`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    });

    entries.push({
      url: `${baseUrl}/${c}/price-drops/all`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    });

    entries.push({
      url: `${baseUrl}/${c}/compare`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.75,
    });

    entries.push({
      url: `${baseUrl}/${c}/blog`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.85,
    });

    BLOG_POSTS.forEach((post) => {
      entries.push({
        url: `${baseUrl}/${c}/blog/${post.slug}`,
        lastModified: new Date(post.updatedAt),
        changeFrequency: 'weekly',
        priority: 0.82,
      });
    });

    CATEGORIES.forEach((cat) => {
      entries.push({
        url: `${baseUrl}/${c}/deals/${cat.slug}`,
        lastModified: new Date(),
        changeFrequency: 'daily',
        priority: 0.8,
      });

      entries.push({
        url: `${baseUrl}/${c}/price-drops/${cat.slug}`,
        lastModified: new Date(),
        changeFrequency: 'daily',
        priority: 0.8,
      });
    });

    // Never advertise fixture/demo product URLs to search engines.
    if (!preview) {
      const { products } = await getCatalogProducts(c);
      products.forEach((product) => {
        entries.push({
          url: `${baseUrl}/${c}/product/${product.slug}`,
          lastModified: new Date(),
          changeFrequency: 'daily',
          priority: 0.9,
        });
      });
    }
  }

  return entries;
}
