// Static export: render with page=1 (no dynamic searchParams)
export const dynamic = 'force-static';

import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import BlogCard from '@/components/BlogCard';
import { getAllPosts, countPosts, getAllCategories, getAllTags } from '@/lib/posts';
import Link from 'next/link';
import TagBadge from '@/components/TagBadge';

const PER_PAGE = 12;

export const metadata = { title: 'Blog' };

interface SearchParams {
  page?: string;
}

export default async function BlogPage({ searchParams }: { searchParams: Promise<SearchParams> }) {
  const params = await searchParams;
  const page = parseInt(params.page || '1');
  const offset = (page - 1) * PER_PAGE;

  const posts = getAllPosts({ published: true, limit: PER_PAGE, offset });
  const total = countPosts({ published: true });
  const totalPages = Math.ceil(total / PER_PAGE);
  const categories = getAllCategories();
  const tags = getAllTags();

  return (
    <>
      <Navbar />
      <main className="flex-1">
        <div className="bg-white border-b border-gray-200 py-8">
          <div className="max-w-6xl mx-auto px-4">
            <h1 className="text-3xl font-bold text-gray-900 font-serif">Physics Blog</h1>
            <p className="text-gray-600 mt-1">Research updates, educational content, and department news.</p>
          </div>
        </div>

        <div className="max-w-6xl mx-auto px-4 py-8">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Posts grid */}
            <div className="flex-1">
              {posts.length > 0 ? (
                <>
                  <div className="card-grid grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {posts.map(post => (
                      <BlogCard key={post.id} post={post} />
                    ))}
                  </div>

                  {/* Pagination */}
                  {totalPages > 1 && (
                    <div className="flex items-center justify-center gap-2 mt-10">
                      {page > 1 && (
                        <Link
                          href={`/blog?page=${page - 1}`}
                          className="px-4 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                        >
                          ← Previous
                        </Link>
                      )}
                      {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                        <Link
                          key={p}
                          href={`/blog?page=${p}`}
                          className={`px-4 py-2 text-sm rounded-lg transition-colors ${
                            p === page
                              ? 'bg-blue-600 text-white'
                              : 'border border-gray-300 hover:bg-gray-50'
                          }`}
                        >
                          {p}
                        </Link>
                      ))}
                      {page < totalPages && (
                        <Link
                          href={`/blog?page=${page + 1}`}
                          className="px-4 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                        >
                          Next →
                        </Link>
                      )}
                    </div>
                  )}
                </>
              ) : (
                <div className="text-center py-20 text-gray-500">
                  <p className="text-lg">No posts published yet.</p>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <aside className="lg:w-64 space-y-6">
              {categories.length > 0 && (
                <div className="bg-white rounded-xl border border-gray-200 p-5">
                  <h3 className="font-semibold text-gray-900 mb-3 font-serif">Categories</h3>
                  <ul className="space-y-1.5">
                    {categories.map(cat => (
                      <li key={cat}>
                        <Link
                          href={`/category/${encodeURIComponent(cat)}`}
                          className="text-sm text-gray-700 hover:text-blue-600 transition-colors block py-0.5"
                        >
                          {cat}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {tags.length > 0 && (
                <div className="bg-white rounded-xl border border-gray-200 p-5">
                  <h3 className="font-semibold text-gray-900 mb-3 font-serif">Tags</h3>
                  <div className="flex flex-wrap gap-1.5">
                    {tags.map(tag => (
                      <TagBadge key={tag} tag={tag} />
                    ))}
                  </div>
                </div>
              )}
            </aside>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
