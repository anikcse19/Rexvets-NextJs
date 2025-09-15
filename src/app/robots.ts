import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: [
        '/api/',
        '/dashboard/',
        '/auth/',
        '/video-call',
        '/join-video-call',
        '/_next/',
        '/admin/',
      ],
    },
    sitemap: 'https://www.rexvet.org/sitemap.xml',
  }
}
