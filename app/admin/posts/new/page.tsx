import PostForm from '@/components/PostForm';

export const metadata = { title: 'New Post' };

export default function NewPostPage() {
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 font-serif">New Post</h1>
        <p className="text-gray-600 text-sm mt-1">Write and publish a new blog post.</p>
      </div>
      <PostForm />
    </div>
  );
}
