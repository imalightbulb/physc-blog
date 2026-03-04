import { getStats, getAllPosts } from '@/lib/posts';
import { format } from 'date-fns';
import Link from 'next/link';
import { FileText, Eye, BookOpen, PenLine } from 'lucide-react';

export const metadata = { title: 'Dashboard' };

export default function AdminDashboard() {
  const stats = getStats();
  const recentPosts = getAllPosts({ limit: 5 });

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 font-serif">Dashboard</h1>
        <p className="text-gray-600 text-sm mt-1">Welcome back to the admin panel.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Total Posts', value: stats.total, icon: FileText, color: 'blue' },
          { label: 'Published', value: stats.published, icon: BookOpen, color: 'green' },
          { label: 'Drafts', value: stats.drafts, icon: PenLine, color: 'amber' },
          { label: 'Total Views', value: stats.totalViews, icon: Eye, color: 'purple' },
        ].map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="bg-white rounded-xl border border-gray-200 p-5">
            <div className={`inline-flex p-2 rounded-lg mb-3 ${
              color === 'blue' ? 'bg-blue-50 text-blue-600' :
              color === 'green' ? 'bg-green-50 text-green-600' :
              color === 'amber' ? 'bg-amber-50 text-amber-600' :
              'bg-purple-50 text-purple-600'
            }`}>
              <Icon size={18} />
            </div>
            <div className="text-2xl font-bold text-gray-900">{value.toLocaleString()}</div>
            <div className="text-sm text-gray-500 mt-0.5">{label}</div>
          </div>
        ))}
      </div>

      {/* Recent Posts */}
      <div className="bg-white rounded-xl border border-gray-200">
        <div className="flex items-center justify-between p-5 border-b border-gray-200">
          <h2 className="font-semibold text-gray-900">Recent Posts</h2>
          <Link href="/admin/posts/new" className="text-sm text-blue-600 hover:text-blue-800 font-medium">
            + New Post
          </Link>
        </div>

        {recentPosts.length === 0 ? (
          <div className="p-8 text-center text-gray-500 text-sm">
            No posts yet. <Link href="/admin/posts/new" className="text-blue-600 hover:underline">Create your first post</Link>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {recentPosts.map(post => (
              <div key={post.id} className="flex items-center justify-between p-4 hover:bg-gray-50">
                <div className="flex-1 min-w-0 mr-4">
                  <Link href={`/admin/posts/${post.id}/edit`} className="text-sm font-medium text-gray-900 hover:text-blue-600 truncate block">
                    {post.title}
                  </Link>
                  <div className="text-xs text-gray-500 mt-0.5">
                    {format(new Date(post.created_at), 'MMM d, yyyy')} · {post.views} views
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                    post.published
                      ? 'bg-green-100 text-green-700'
                      : 'bg-gray-100 text-gray-600'
                  }`}>
                    {post.published ? 'Published' : 'Draft'}
                  </span>
                  <Link href={`/admin/posts/${post.id}/edit`} className="text-xs text-blue-600 hover:underline">
                    Edit
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
