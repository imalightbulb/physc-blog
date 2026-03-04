import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import HeroSection from '@/components/HeroSection';
import BlogCard from '@/components/BlogCard';
import { getAllPosts } from '@/lib/posts';
import Link from 'next/link';

export default function HomePage() {
  const posts = getAllPosts({ published: true, limit: 7 });
  const [featuredPost, ...latestPosts] = posts;

  return (
    <>
      <Navbar />
      <main className="flex-1">
        <HeroSection featuredPost={featuredPost} />

        <div className="max-w-6xl mx-auto px-4 py-12">
          {latestPosts.length > 0 && (
            <section>
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-bold text-gray-900 font-serif">Latest Posts</h2>
                <Link
                  href="/blog"
                  className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                >
                  View all →
                </Link>
              </div>
              <div className="card-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {latestPosts.map(post => (
                  <BlogCard key={post.id} post={post} />
                ))}
              </div>
            </section>
          )}

          {posts.length === 0 && (
            <div className="text-center py-20 text-gray-500">
              <div className="text-6xl mb-4">⚛️</div>
              <p className="text-xl">No posts yet. Check back soon!</p>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
