// Static export renders this page with empty params (no server-side search).
// Search functionality requires server deployment.
export const dynamic = 'force-static';

import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import BlogCard from '@/components/BlogCard';
import { searchPosts } from '@/lib/posts';
import { Search } from 'lucide-react';
import type { Metadata } from 'next';

interface SearchParams {
  q?: string;
}

export async function generateMetadata({ searchParams }: { searchParams: Promise<SearchParams> }): Promise<Metadata> {
  const params = await searchParams;
  return { title: params.q ? `Search: "${params.q}"` : 'Search' };
}

export default async function SearchPage({ searchParams }: { searchParams: Promise<SearchParams> }) {
  const params = await searchParams;
  const query = params.q?.trim() || '';
  const posts = query ? searchPosts(query) : [];

  return (
    <>
      <Navbar />
      <main className="flex-1">
        <div className="bg-white border-b border-gray-200 py-8">
          <div className="max-w-4xl mx-auto px-4">
            <h1 className="text-2xl font-bold text-gray-900 font-serif flex items-center gap-2">
              <Search size={22} className="text-blue-600" />
              {query ? `Results for "${query}"` : 'Search'}
            </h1>
            {query && (
              <p className="text-gray-600 mt-1 text-sm">
                {posts.length} {posts.length === 1 ? 'result' : 'results'} found
              </p>
            )}
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-4 py-8">
          {!query && (
            <div className="text-center py-16 text-gray-500">
              <Search size={48} className="mx-auto mb-4 text-gray-300" />
              <p className="text-lg">Enter a search term in the navigation bar above.</p>
            </div>
          )}

          {query && posts.length === 0 && (
            <div className="text-center py-16 text-gray-500">
              <Search size={48} className="mx-auto mb-4 text-gray-300" />
              <p className="text-lg">No posts found for &quot;{query}&quot;</p>
              <p className="text-sm mt-2">Try different keywords or browse all posts.</p>
            </div>
          )}

          {posts.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {posts.map(post => (
                <BlogCard key={post.id} post={post} />
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
