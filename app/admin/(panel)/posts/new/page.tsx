import PostEditor from '@/components/admin/PostEditor';

export default function AdminNewPostPage() {
  return (
    <section className="space-y-4">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 font-serif">Create New Post</h1>
        <p className="text-sm text-gray-600 mt-1">Draft or publish a new article.</p>
      </div>
      <PostEditor mode="new" />
    </section>
  );
}
