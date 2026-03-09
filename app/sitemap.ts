import type { MetadataRoute } from 'next';
import { getAllCategories, getAllPosts, getAllTags } from '@/lib/posts';
import { absoluteUrl } from '@/lib/site';

export const dynamic = 'force-static';

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: absoluteUrl('/'),
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 1,
    },
    {
      url: absoluteUrl('/about'),
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: absoluteUrl('/faculty'),
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
  ];

  const postRoutes: MetadataRoute.Sitemap = getAllPosts({ published: true }).map(post => ({
    url: absoluteUrl(`/blog/${post.slug}`),
    lastModified: post.date ? new Date(post.date) : now,
    changeFrequency: 'monthly',
    priority: 0.8,
  }));

  const HIDDEN_CATEGORIES = new Set(['Research']);
  const categoryRoutes: MetadataRoute.Sitemap = getAllCategories()
    .filter(c => !HIDDEN_CATEGORIES.has(c))
    .map(category => ({
      url: absoluteUrl(`/category/${encodeURIComponent(category)}`),
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.6,
    }));

  // Tags use real URL paths (/ is a real separator, not encoded)
  const tagRoutes: MetadataRoute.Sitemap = getAllTags().map(tag => ({
    url: absoluteUrl(`/tag/${tag}`),
    lastModified: now,
    changeFrequency: 'weekly',
    priority: 0.5,
  }));

  return [...staticRoutes, ...postRoutes, ...categoryRoutes, ...tagRoutes];
}
