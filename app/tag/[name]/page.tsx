import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import BlogCard from '@/components/BlogCard';
import { getAllPosts, getAllTags } from '@/lib/posts';
import type { Metadata } from 'next';

export async function generateStaticParams() {
  const tags = getAllTags();
  return tags.map(t => ({ name: t }));
}

interface Props {
  params: Promise<{ name: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { name } = await params;
  return {
    title: `Tag: #${decodeURIComponent(name)}`,
    alternates: {
      canonical: `/tag/${encodeURIComponent(name)}`,
    },
  };
}

export default async function TagPage({ params }: Props) {
  const { name } = await params;
  const tag = decodeURIComponent(name);
  const posts = getAllPosts({ published: true, tag });

  return (
    <>
      <Navbar />
      <main id="main-content" className="flex-1">
        <div className="bg-white border-b border-gray-200 py-8">
          <div className="max-w-6xl mx-auto px-4">
            <div className="text-sm text-blue-600 font-semibold uppercase tracking-wide mb-1">Tag</div>
            <h1 className="text-3xl font-bold text-gray-900 font-serif">#{tag}</h1>
            <p className="text-gray-600 mt-1 text-sm">{posts.length} {posts.length === 1 ? 'post' : 'posts'}</p>
          </div>
        </div>

        <div className="max-w-6xl mx-auto px-4 py-8">
          {posts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {posts.map(post => <BlogCard key={post.slug} post={post} />)}
            </div>
          ) : (
            <div className="text-center py-16 text-gray-500">
              <p className="text-lg">No posts with this tag yet.</p>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
