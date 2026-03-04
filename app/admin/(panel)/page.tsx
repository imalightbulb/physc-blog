import Link from 'next/link';
import { listAdminPosts } from '@/lib/admin-posts';

export default function AdminDashboardPage() {
  const posts = listAdminPosts();
  const published = posts.filter(post => post.published).length;
  const drafts = posts.length - published;

  return (
    <section className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900 font-serif">Publishing Dashboard</h1>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white border border-gray-200 rounded-xl p-5">
          <div className="text-sm text-gray-500">Total posts</div>
          <div className="text-2xl font-bold text-gray-900">{posts.length}</div>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-5">
          <div className="text-sm text-gray-500">Published</div>
          <div className="text-2xl font-bold text-green-700">{published}</div>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-5">
          <div className="text-sm text-gray-500">Drafts</div>
          <div className="text-2xl font-bold text-amber-700">{drafts}</div>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <Link href="/admin/posts/new" className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700">
          Create New Post
        </Link>
        <Link href="/admin/posts" className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50">
          Manage Posts
        </Link>
      </div>
    </section>
  );
}
