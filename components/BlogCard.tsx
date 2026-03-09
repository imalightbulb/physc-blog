import Link from 'next/link';
import Image from 'next/image';
import { format } from 'date-fns';
import { Calendar, User } from 'lucide-react';
import TagBadge from './TagBadge';
import ParticleFallback from './ParticleFallback';
import type { Post } from '@/lib/posts';

interface BlogCardProps {
  post: Post;
  variant?: 'default' | 'featured';
}

export default function BlogCard({ post, variant = 'default' }: BlogCardProps) {
  const formattedDate = format(new Date(post.date), 'MMM d, yyyy');
  const isFeatured = variant === 'featured';

  return (
    <article className={`animate-slide-up group flex flex-col overflow-hidden rounded-[1.75rem] border border-border bg-surface shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl hover:shadow-primary/8 ${isFeatured ? 'md:col-span-2 md:grid md:grid-cols-[1.15fr_1fr]' : ''}`}>
      {post.cover_image ? (
        <Link href={`/blog/${post.slug}`}>
          <div className={`relative w-full overflow-hidden ${isFeatured ? 'h-full min-h-[18rem]' : 'h-48'}`}>
            <Image
              src={post.cover_image}
              alt={post.title}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-primary/18 via-transparent to-transparent" />
          </div>
        </Link>
      ) : (
        <Link href={`/blog/${post.slug}`}>
          <div className={`flex items-center justify-center bg-gradient-to-br from-accent-soft via-white to-surface-2 ${isFeatured ? 'min-h-[18rem]' : 'h-48'}`}>
            <ParticleFallback size={isFeatured ? 88 : 72} imageClassName="drop-shadow-xl" tone="muted" />
          </div>
        </Link>
      )}

      <div className={`flex flex-1 flex-col ${isFeatured ? 'p-7' : 'p-5'}`}>
        {post.category && (
          <Link
            href={`/category/${encodeURIComponent(post.category)}`}
            className="eyebrow mb-3 block transition-colors hover:text-primary"
          >
            {post.category}
          </Link>
        )}

        <Link href={`/blog/${post.slug}`}>
          <h2 className={`mb-3 font-semibold text-text font-serif transition-colors group-hover:text-accent ${isFeatured ? 'text-2xl leading-tight' : 'line-clamp-2 text-lg'}`}>
            {post.title}
          </h2>
        </Link>

        {post.excerpt && (
          <p className={`mb-5 flex-1 text-muted ${isFeatured ? 'line-clamp-4 text-base leading-relaxed' : 'line-clamp-3 text-sm'}`}>
            {post.excerpt}
          </p>
        )}

        <div className="mt-auto">
          {post.tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mb-3">
              {post.tags.slice(0, 3).map(tag => (
                <TagBadge key={tag} tag={tag} />
              ))}
            </div>
          )}

          <div className="flex items-center gap-3 border-t border-border/70 pt-4 text-xs uppercase tracking-[0.08em] text-muted">
            <span className="flex items-center gap-1">
              <User size={12} />
              {post.author}
            </span>
            <span className="flex items-center gap-1">
              <Calendar size={12} />
              {formattedDate}
            </span>
          </div>
        </div>
      </div>
    </article>
  );
}
