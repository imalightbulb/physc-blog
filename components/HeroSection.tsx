import Link from 'next/link';
import Image from 'next/image';
import { format } from 'date-fns';
import type { Post } from '@/lib/posts';

interface HeroSectionProps {
  featuredPost?: Post | null;
}

export default function HeroSection({ featuredPost }: HeroSectionProps) {
  if (featuredPost) {
    const dateStr = featuredPost.published_at || featuredPost.created_at;
    const formattedDate = format(new Date(dateStr), 'MMMM d, yyyy');

    return (
      <section className="relative bg-[#1a3a6b] text-white overflow-hidden">
        <div className="absolute inset-0">
          {featuredPost.cover_image ? (
            <Image
              src={featuredPost.cover_image}
              alt={featuredPost.title}
              fill
              className="object-cover opacity-20"
              priority
            />
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-[#1a3a6b] to-[#0f2044]" />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-[#1a3a6b] via-[#1a3a6b]/80 to-transparent" />
        </div>

        <div className="relative max-w-6xl mx-auto px-4 py-20">
          <div className="max-w-2xl animate-fade-in">
            <div className="flex items-center gap-2 mb-4">
              <span className="bg-blue-500 text-white text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full">
                Featured
              </span>
              {featuredPost.category && (
                <span className="text-blue-300 text-sm">{featuredPost.category}</span>
              )}
            </div>
            <Link href={`/blog/${featuredPost.slug}`}>
              <h1 className="text-3xl md:text-4xl font-bold mb-4 font-serif hover:text-blue-200 transition-colors leading-tight">
                {featuredPost.title}
              </h1>
            </Link>
            {featuredPost.excerpt && (
              <p className="text-blue-100 text-lg mb-6 leading-relaxed">
                {featuredPost.excerpt}
              </p>
            )}
            <div className="flex items-center gap-4 text-sm text-blue-200 mb-6">
              <span>{featuredPost.author}</span>
              <span>·</span>
              <span>{formattedDate}</span>
            </div>
            <Link
              href={`/blog/${featuredPost.slug}`}
              className="inline-flex items-center gap-2 bg-white text-[#1a3a6b] px-6 py-2.5 rounded-lg font-semibold hover:bg-blue-50 transition-colors"
            >
              Read Article →
            </Link>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-gradient-to-br from-[#1a3a6b] to-[#0f2044] text-white border-b-4 border-blue-500">
      <div className="max-w-6xl mx-auto px-4 py-20 text-center animate-fade-in">
        <div className="text-6xl mb-4">⚛️</div>
        <h1 className="text-4xl md:text-5xl font-bold mb-4 font-serif">
          XMUM Physics Department
        </h1>
        <p className="text-xl text-blue-200 max-w-2xl mx-auto mb-8">
          Exploring the fundamental laws of nature — from quantum mechanics to astrophysics.
          Insights from our faculty and students.
        </p>
        <Link
          href="/blog"
          className="inline-flex items-center gap-2 bg-white text-[#1a3a6b] px-8 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors"
        >
          Browse All Posts →
        </Link>
      </div>
    </section>
  );
}
