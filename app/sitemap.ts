import { MetadataRoute } from 'next';
import { CATEGORIES } from '@/lib/data/categories';
import { getAllProducts } from '@/lib/data/products';
import { CountryCode } from '@/lib/types';

const LIVE_COUNTRIES: CountryCode[] = ['ae', 'us'];

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://catchtheprice.com';
  const entries: MetadataRoute.Sitemap = [];

  LIVE_COUNTRIES.forEach((c) => {
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

    const products = getAllProducts(c);
    products.forEach((p) => {
      entries.push({
        url: `${baseUrl}/${c}/product/${p.slug}`,
        lastModified: new Date(),
        changeFrequency: 'daily',
        priority: 0.9,
      });
    });
  });

  return entries;
}
