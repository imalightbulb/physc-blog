import { notFound } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import PostContent from '@/components/PostContent';
import TagBadge from '@/components/TagBadge';
import BlogCard from '@/components/BlogCard';
import { getPostBySlug, getAdjacentPosts, getAllPosts, extractHeadings } from '@/lib/posts';
import { format } from 'date-fns';
import Image from 'next/image';
import Link from 'next/link';
import { Calendar, User, Clock, ArrowLeft, ArrowRight } from 'lucide-react';
import type { Metadata } from 'next';
import { absoluteUrl } from '@/lib/site';
import ReadingProgress from '@/components/ReadingProgress';
import TableOfContents from '@/components/TableOfContents';
import ShareButtons from '@/components/ShareButtons';
import { PostLikeButton, PostComments } from '@/components/PostInteractions';

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
  const headings = extractHeadings(post.content);

  return (
    <>
      <ReadingProgress />
      <Navbar />
      <main id="main-content" className="flex-1">
        {/* Cover */}
        {post.cover_image ? (
          <div className="relative h-[24rem] w-full md:h-[31rem]">
            <Image src={post.cover_image} alt={post.title} fill className="object-cover" priority />
            <div className="absolute inset-0 bg-gradient-to-t from-primary via-primary/72 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-6">
              <div className="mx-auto max-w-5xl">
                {post.category && (
                  <Link href={`/category/${encodeURIComponent(post.category)}`}
                    className="eyebrow mb-3 block !text-accent-soft hover:!text-white"
                  >
                    {post.category}
                  </Link>
                )}
                <h1 className="max-w-3xl text-4xl font-bold text-white font-serif leading-tight md:text-5xl">
                  {post.title}
                </h1>
                {post.excerpt && <p className="mt-4 max-w-2xl text-sm leading-relaxed text-blue-100 md:text-base">{post.excerpt}</p>}
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-gradient-to-br from-primary to-primary-deep px-4 py-20">
            <div className="mx-auto max-w-5xl">
              {post.category && (
                <Link href={`/category/${encodeURIComponent(post.category)}`}
                  className="eyebrow mb-3 block !text-accent-soft hover:!text-white"
                >
                  {post.category}
                </Link>
              )}
              <h1 className="max-w-3xl text-4xl font-bold text-white font-serif leading-tight md:text-5xl">
                {post.title}
              </h1>
              {post.excerpt && <p className="mt-4 max-w-2xl text-sm leading-relaxed text-blue-100 md:text-base">{post.excerpt}</p>}
            </div>
          </div>
        )}

        <div className="section-shell section-space animate-fade-in">
          <div className="mx-auto max-w-6xl">
          <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_18rem]">
            <div className="min-w-0">
              <div className="surface-muted mb-8 flex flex-wrap items-center gap-4 rounded-[1.5rem] p-5 text-sm text-muted">
                <span className="flex items-center gap-1.5">
                  <User size={15} className="text-border" />
                  {post.author}
                </span>
                {post.category !== 'Staff' && (
                  <span className="flex items-center gap-1.5">
                    <Calendar size={15} className="text-border" />
                    {formattedDate}
                  </span>
                )}
                <span className="flex items-center gap-1.5">
                  <Clock size={15} className="text-border" />
                  {readTime} min read
                </span>
              </div>

              <div className="surface-elevated rounded-[2rem] p-6 md:p-10">
                <PostContent content={post.content} />
              </div>

              {/* Share + Like */}
              <div className="mt-6 flex flex-wrap items-center justify-between gap-4 rounded-[1.5rem] border border-border bg-surface p-4">
                <ShareButtons url={absoluteUrl(`/blog/${post.slug}`)} title={post.title} />
                <PostLikeButton slug={post.slug} />
              </div>

              {(prev || next) && (
                <div className="mt-10 grid grid-cols-1 gap-4 md:grid-cols-2">
                  {prev && (
                    <Link href={`/blog/${prev.slug}`} className="group rounded-[1.5rem] border border-border bg-surface p-5 transition-colors hover:border-accent">
                      <div className="mb-2 inline-flex items-center gap-2 text-xs uppercase tracking-[0.16em] text-muted"><ArrowLeft size={14} /> Previous</div>
                      <div className="line-clamp-2 text-sm font-medium text-text font-serif group-hover:text-accent">{prev.title}</div>
                    </Link>
                  )}
                  {next && (
                    <Link href={`/blog/${next.slug}`} className="group ml-auto w-full rounded-[1.5rem] border border-border bg-surface p-5 transition-colors hover:border-accent md:text-right">
                      <div className="mb-2 inline-flex items-center gap-2 text-xs uppercase tracking-[0.16em] text-muted md:ml-auto">Next <ArrowRight size={14} /></div>
                      <div className="line-clamp-2 text-sm font-medium text-text font-serif group-hover:text-accent">{next.title}</div>
                    </Link>
                  )}
                </div>
              )}
            </div>

            <aside className="space-y-4">
              {headings.length > 0 && <TableOfContents headings={headings} />}
              {post.tags.length > 0 && (
                <div className="surface-muted rounded-[1.75rem] p-5">
                  <p className="eyebrow mb-3">Article Tags</p>
                  <div className="flex flex-wrap gap-1.5">
                    {post.tags.map(tag => <TagBadge key={tag} tag={tag} />)}
                  </div>
                </div>
              )}
            </aside>
          </div>

          {/* Comments — full width below the two-column grid */}
          <PostComments slug={post.slug} />
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
