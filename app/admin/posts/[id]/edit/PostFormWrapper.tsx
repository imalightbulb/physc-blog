'use client';

import PostForm from '@/components/PostForm';
import type { Post } from '@/lib/posts';

interface Props {
  post: Post;
}

export default function PostFormWrapper({ post }: Props) {
  const handleDelete = async () => {
    await fetch(`/api/posts/${post.id}`, { method: 'DELETE' });
  };

  return (
    <PostForm
      initialData={{
        id: post.id,
        title: post.title,
        excerpt: post.excerpt || '',
        content: post.content,
        cover_image: post.cover_image || '',
        author: post.author,
        category: post.category || '',
        tags: post.tags,
        published: post.published === 1,
      }}
      onDelete={handleDelete}
    />
  );
}
