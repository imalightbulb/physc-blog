import { notFound } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import PostContent from '@/components/PostContent';
import TagBadge from '@/components/TagBadge';
import BlogCard from '@/components/BlogCard';
import { getPostBySlug, getAdjacentPosts, getAllPosts } from '@/lib/posts';
import { format } from 'date-fns';
import Image from 'next/image';
import Link from 'next/link';
import { Calendar, User, Clock } from 'lucide-react';
import type { Metadata } from 'next';
import { absoluteUrl } from '@/lib/site';

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) return {};
  const canonicalPath = `/blog/${post.slug}`;

  return {
    title: post.title,
    description: post.excerpt || undefined,
    alternates: {
      canonical: canonicalPath,
    },
    openGraph: {
      type: 'article',
      title: post.title,
      description: post.excerpt || undefined,
      url: absoluteUrl(canonicalPath),
      images: post.cover_image
        ? [{ url: post.cover_image, alt: post.title }]
        : [{ url: absoluteUrl('/particle-in-box.svg'), alt: post.title }],
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.excerpt || undefined,
      images: post.cover_image ? [post.cover_image] : [absoluteUrl('/particle-in-box.svg')],
    },
  };
}

export async function generateStaticParams() {
  const posts = getAllPosts({ published: true });
  return posts.map(p => ({ slug: p.slug }));
}

export default async function PostPage({ params }: Props) {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  if (!post || !post.published) notFound();

  const formattedDate = format(new Date(post.date), 'MMMM d, yyyy');
  const wordCount = post.content.split(/\s+/).length;
  const readTime = Math.max(1, Math.round(wordCount / 200));
  const { prev, next } = getAdjacentPosts(post.slug);

  return (
    <>
      <Navbar />
      <main id="main-content" className="flex-1">
        {/* Cover */}
        {post.cover_image ? (
          <div className="relative h-72 md:h-96 w-full">
            <Image src={post.cover_image} alt={post.title} fill className="object-cover" priority />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-6 max-w-4xl mx-auto">
              {post.category && (
                <Link href={`/category/${encodeURIComponent(post.category)}`}
                  className="text-blue-300 text-sm font-semibold uppercase tracking-wide mb-2 block hover:text-blue-200"
                >
                  {post.category}
                </Link>
              )}
              <h1 className="text-3xl md:text-4xl font-bold text-white font-serif leading-tight">
                {post.title}
              </h1>
            </div>
          </div>
        ) : (
          <div className="bg-gradient-to-br from-[#1a3a6b] to-[#0f2044] py-16 px-4">
            <div className="max-w-4xl mx-auto">
              {post.category && (
                <Link href={`/category/${encodeURIComponent(post.category)}`}
                  className="text-blue-300 text-sm font-semibold uppercase tracking-wide mb-3 block hover:text-blue-200"
                >
                  {post.category}
                </Link>
              )}
              <h1 className="text-3xl md:text-4xl font-bold text-white font-serif leading-tight">
                {post.title}
              </h1>
            </div>
          </div>
        )}

        <div className="max-w-4xl mx-auto px-4 py-8 animate-fade-in">
          {/* Meta */}
          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-8 pb-6 border-b border-gray-200">
            <span className="flex items-center gap-1.5">
              <User size={15} className="text-gray-400" />
              {post.author}
            </span>
            <span className="flex items-center gap-1.5">
              <Calendar size={15} className="text-gray-400" />
              {formattedDate}
            </span>
            <span className="flex items-center gap-1.5">
              <Clock size={15} className="text-gray-400" />
              {readTime} min read
            </span>
          </div>

          {/* Content */}
          <PostContent content={post.content} />

          {/* Tags */}
          {post.tags.length > 0 && (
            <div className="mt-10 pt-6 border-t border-gray-200">
              <span className="text-sm font-medium text-gray-700 mr-2">Tags:</span>
              <div className="inline-flex flex-wrap gap-1.5">
                {post.tags.map(tag => <TagBadge key={tag} tag={tag} />)}
              </div>
            </div>
          )}

          {/* Prev/Next */}
          {(prev || next) && (
            <div className="mt-10 pt-6 border-t border-gray-200 grid grid-cols-1 md:grid-cols-2 gap-4">
              {prev && (
                <Link href={`/blog/${prev.slug}`} className="group p-4 bg-white border border-gray-200 rounded-xl hover:border-blue-300 transition-colors">
                  <div className="text-xs text-gray-500 mb-1">← Previous</div>
                  <div className="text-sm font-medium text-gray-900 group-hover:text-blue-600 line-clamp-2 font-serif">{prev.title}</div>
                </Link>
              )}
              {next && (
                <Link href={`/blog/${next.slug}`} className="group p-4 bg-white border border-gray-200 rounded-xl hover:border-blue-300 transition-colors md:text-right md:ml-auto w-full">
                  <div className="text-xs text-gray-500 mb-1">Next →</div>
                  <div className="text-sm font-medium text-gray-900 group-hover:text-blue-600 line-clamp-2 font-serif">{next.title}</div>
                </Link>
              )}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
