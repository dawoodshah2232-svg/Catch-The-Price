import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/api/outbound', '/admin'],
    },
    sitemap: 'https://catchtheprice.com/sitemap.xml',
  };
}
