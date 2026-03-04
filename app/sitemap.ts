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
      url: absoluteUrl('/blog'),
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: absoluteUrl('/search'),
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.5,
    },
  ];

  const postRoutes: MetadataRoute.Sitemap = getAllPosts({ published: true }).map(post => ({
    url: absoluteUrl(`/blog/${post.slug}`),
    lastModified: post.date ? new Date(post.date) : now,
    changeFrequency: 'monthly',
    priority: 0.8,
  }));

  const categoryRoutes: MetadataRoute.Sitemap = getAllCategories().map(category => ({
    url: absoluteUrl(`/category/${encodeURIComponent(category)}`),
    lastModified: now,
    changeFrequency: 'weekly',
    priority: 0.6,
  }));

  const tagRoutes: MetadataRoute.Sitemap = getAllTags().map(tag => ({
    url: absoluteUrl(`/tag/${encodeURIComponent(tag)}`),
    lastModified: now,
    changeFrequency: 'weekly',
    priority: 0.5,
  }));

  return [...staticRoutes, ...postRoutes, ...categoryRoutes, ...tagRoutes];
}
