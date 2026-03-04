import { notFound } from 'next/navigation';
import { getPostById, getAllPosts } from '@/lib/posts';
import PostFormWrapper from './PostFormWrapper';
import type { Metadata } from 'next';

export async function generateStaticParams() {
  const posts = getAllPosts({});
  return posts.map(p => ({ id: String(p.id) }));
}

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const post = getPostById(parseInt(id));
  return { title: post ? `Edit: ${post.title}` : 'Edit Post' };
}

export default async function EditPostPage({ params }: Props) {
  const { id } = await params;
  const post = getPostById(parseInt(id));
  if (!post) notFound();

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 font-serif">Edit Post</h1>
        <p className="text-gray-600 text-sm mt-1 truncate">{post.title}</p>
      </div>
      <PostFormWrapper post={post} />
    </div>
  );
}
