'use client';

import { useSearchParams } from 'next/navigation';
import PostEditor from '@/components/admin/PostEditor';

export default function AdminEditPostPage() {
  const searchParams = useSearchParams();
  const id = (searchParams.get('id') || '').trim();

  if (!id) {
    return (
      <section className="space-y-4">
        <h1 className="text-3xl font-bold text-gray-900 font-serif">Edit Post</h1>
        <p className="text-sm text-red-700">Missing post id.</p>
      </section>
    );
  }

  return (
    <section className="space-y-4">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 font-serif">Edit Post</h1>
        <p className="text-sm text-gray-600 mt-1">Update content and publish settings.</p>
      </div>
      <PostEditor mode="edit" postId={id} />
    </section>
  );
}
