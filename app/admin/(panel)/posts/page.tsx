import PostList from '@/components/admin/PostList';
import { listAdminPosts } from '@/lib/admin-posts';

export default function AdminPostsPage() {
  const posts = listAdminPosts();

  return (
    <section className="space-y-4">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 font-serif">Manage Posts</h1>
        <p className="text-sm text-gray-600 mt-1">Search, publish, unpublish, edit, or delete blog posts.</p>
      </div>
      <PostList initialPosts={posts} />
    </section>
  );
}
