import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import BlogCard from '@/components/BlogCard';
import { getAllPosts, getAllTags } from '@/lib/posts';
import type { Metadata } from 'next';

export async function generateStaticParams() {
  const tags = getAllTags();
  return tags.map(t => ({ name: t.split('/') }));
}

interface Props {
  params: Promise<{ name: string[] }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { name } = await params;
  const tag = name.join('/');
  return {
    title: `Tag: #${tag}`,
    alternates: {
      canonical: `/tag/${tag}`,
    },
  };
}

export default async function TagPage({ params }: Props) {
  const { name } = await params;
  const tag = name.join('/');
  const posts = getAllPosts({ published: true, tag });

  return (
    <>
      <Navbar />
      <main id="main-content" className="flex-1">
        <div className="page-header">
          <div className="page-header__inner">
            <div className="eyebrow">Tag</div>
            <h1 className="section-title mt-3">#{tag}</h1>
            <p className="section-kicker">{posts.length} {posts.length === 1 ? 'post' : 'posts'} connected to this topic across faculty, research, talks, and department updates.</p>
          </div>
        </div>

        <div className="section-shell section-space">
          {posts.length > 0 ? (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {posts.map((post, index) => <BlogCard key={post.slug} post={post} variant={index === 0 ? 'featured' : 'default'} />)}
            </div>
          ) : (
            <div className="py-16 text-center text-muted">
              <p className="text-lg">No posts with this tag yet.</p>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
