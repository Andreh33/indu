import type { MetadataRoute } from 'next';
import { getPublishedProducts } from '@/server/queries/products';
import { getPublishedWorks } from '@/server/queries/works';

const BASE = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://industrialfighters.com';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [products, works] = await Promise.all([getPublishedProducts(), getPublishedWorks()]);

  const staticUrls: MetadataRoute.Sitemap = [
    { url: `${BASE}/`, lastModified: new Date(), priority: 1, changeFrequency: 'weekly' },
    { url: `${BASE}/shop`, lastModified: new Date(), priority: 0.9, changeFrequency: 'weekly' },
    { url: `${BASE}/trabajos`, lastModified: new Date(), priority: 0.7, changeFrequency: 'monthly' },
    {
      url: `${BASE}/sobre-nosotros`,
      lastModified: new Date(),
      priority: 0.5,
      changeFrequency: 'yearly',
    },
  ];

  const categoryUrls: MetadataRoute.Sitemap = [
    'muay-thai',
    'mma',
    'boxeo',
    'camisetas',
    'bucales',
  ].map((slug) => ({
    url: `${BASE}/shop/${slug}`,
    lastModified: new Date(),
    priority: 0.8,
    changeFrequency: 'weekly',
  }));

  const productUrls: MetadataRoute.Sitemap = products.map((p) => ({
    url: `${BASE}/producto/${p.slug}`,
    lastModified: p.updatedAt,
    priority: 0.9,
    changeFrequency: 'weekly',
  }));

  const workUrls: MetadataRoute.Sitemap = works.map((w) => ({
    url: `${BASE}/trabajos/${w.slug}`,
    lastModified: w.updatedAt,
    priority: 0.6,
    changeFrequency: 'monthly',
  }));

  return [...staticUrls, ...categoryUrls, ...productUrls, ...workUrls];
}
