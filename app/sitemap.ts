import { MetadataRoute } from 'next';
import { COUNTRIES } from '@/lib/data/countries';
import { CATEGORIES } from '@/lib/data/categories';
import { getAllProducts } from '@/lib/data/products';
import { CountryCode } from '@/lib/types';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://catchtheprice.com';
  const countries = Object.keys(COUNTRIES) as CountryCode[];
  const entries: MetadataRoute.Sitemap = [];

  // Homepages
  countries.forEach((c) => {
    entries.push({
      url: `${baseUrl}/${c}`,
      lastModified: new Date(),
      changeFrequency: 'hourly',
      priority: 1.0,
    });

    // Deals all
    entries.push({
      url: `${baseUrl}/${c}/deals/all`,
      lastModified: new Date(),
      changeFrequency: 'hourly',
      priority: 0.9,
    });

    // Price drops all
    entries.push({
      url: `${baseUrl}/${c}/price-drops/all`,
      lastModified: new Date(),
      changeFrequency: 'hourly',
      priority: 0.9,
    });

    // Categories
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

    // Products
    const products = getAllProducts(c);
    products.forEach((p) => {
      entries.push({
        url: `${baseUrl}/${c}/product/${p.slug}`,
        lastModified: new Date(),
        changeFrequency: 'hourly',
        priority: 0.95,
      });
    });
  });

  return entries;
}
