import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: [
        '/api/',
        '/admin',
        '/ae/search',
        '/us/search',
        '/uk/',
        '/ca/',
        '/au/',
        '/sa/',
      ],
    },
    sitemap: 'https://catchtheprice.com/sitemap.xml',
  };
}
