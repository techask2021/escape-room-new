import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: [
        '/api/',
        '/dashboard/',
        '/account/',
        '/auth/',
        '/test-*',
        '/debug-*',
        '/_next/',
        '/admin/',
      ],
    },
    sitemap: 'https://escaperoomsfinder.com/sitemap.xml',
  }
}
