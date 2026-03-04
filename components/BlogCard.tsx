import Link from 'next/link';
import Image from 'next/image';
import { format } from 'date-fns';
import { Eye, Calendar, User } from 'lucide-react';
import TagBadge from './TagBadge';
import type { Post } from '@/lib/posts';

interface BlogCardProps {
  post: Post;
}

export default function BlogCard({ post }: BlogCardProps) {
  const tags = (() => {
    try { return JSON.parse(post.tags) as string[]; } catch { return []; }
  })();

  const dateStr = post.published_at || post.created_at;
  const formattedDate = format(new Date(dateStr), 'MMM d, yyyy');

  return (
    <article className="animate-slide-up bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-200 flex flex-col">
      {post.cover_image ? (
        <Link href={`/blog/${post.slug}`}>
          <div className="relative h-48 w-full overflow-hidden">
            <Image
              src={post.cover_image}
              alt={post.title}
              fill
              className="object-cover hover:scale-105 transition-transform duration-300"
            />
          </div>
        </Link>
      ) : (
        <Link href={`/blog/${post.slug}`}>
          <div className="h-48 bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
            <span className="text-5xl">⚛️</span>
          </div>
        </Link>
      )}

      <div className="p-5 flex flex-col flex-1">
        {post.category && (
          <Link
            href={`/category/${encodeURIComponent(post.category)}`}
            className="text-xs font-semibold uppercase tracking-wide text-blue-600 hover:text-blue-800 mb-2 block"
          >
            {post.category}
          </Link>
        )}

        <Link href={`/blog/${post.slug}`}>
          <h2 className="text-lg font-semibold text-gray-900 hover:text-blue-700 transition-colors line-clamp-2 mb-2 font-serif">
            {post.title}
          </h2>
        </Link>

        {post.excerpt && (
          <p className="text-sm text-gray-600 line-clamp-3 mb-4 flex-1">
            {post.excerpt}
          </p>
        )}

        <div className="mt-auto">
          {tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mb-3">
              {tags.slice(0, 3).map(tag => (
                <TagBadge key={tag} tag={tag} />
              ))}
            </div>
          )}

          <div className="flex items-center gap-3 text-xs text-gray-500 border-t border-gray-100 pt-3">
            <span className="flex items-center gap-1">
              <User size={12} />
              {post.author}
            </span>
            <span className="flex items-center gap-1">
              <Calendar size={12} />
              {formattedDate}
            </span>
            <span className="flex items-center gap-1 ml-auto">
              <Eye size={12} />
              {post.views}
            </span>
          </div>
        </div>
      </div>
    </article>
  );
}
