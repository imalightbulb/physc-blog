'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';
import type { AdminPostRecord } from '@/lib/content-schema';

interface PostListProps {
  initialPosts: AdminPostRecord[];
}

export default function PostList({ initialPosts }: PostListProps) {
  const [posts, setPosts] = useState(initialPosts);
  const [q, setQ] = useState('');
  const [status, setStatus] = useState<'all' | 'draft' | 'published'>('all');
  const [busySlug, setBusySlug] = useState<string | null>(null);

  const filtered = useMemo(() => {
    const query = q.toLowerCase().trim();
    return posts.filter(post => {
      if (status === 'draft' && post.published) return false;
      if (status === 'published' && !post.published) return false;
      if (!query) return true;
      return post.title.toLowerCase().includes(query) || post.slug.toLowerCase().includes(query);
    });
  }, [posts, q, status]);

  const togglePublish = async (slug: string, nextStatus: boolean) => {
    setBusySlug(slug);
    try {
      const res = await fetch(`/api/posts/publish?id=${encodeURIComponent(slug)}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ published: nextStatus }),
      });
      if (!res.ok) return;
      const data = await res.json() as { post: AdminPostRecord };
      setPosts(curr => curr.map(post => (post.slug === slug ? data.post : post)));
    } finally {
      setBusySlug(null);
    }
  };

  const removePost = async (slug: string) => {
    if (!window.confirm('Delete this post permanently?')) return;
    setBusySlug(slug);
    try {
      const res = await fetch(`/api/posts/item?id=${encodeURIComponent(slug)}`, { method: 'DELETE' });
      if (!res.ok) return;
      setPosts(curr => curr.filter(post => post.slug !== slug));
    } finally {
      setBusySlug(null);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row gap-3 md:items-center md:justify-between">
        <input
          type="search"
          value={q}
          onChange={e => setQ(e.target.value)}
          placeholder="Search title or slug"
          className="w-full md:w-80 px-3 py-2 rounded-lg border border-gray-300"
        />
        <div className="flex items-center gap-2">
          <label htmlFor="status-filter" className="text-sm text-gray-700">Status</label>
          <select
            id="status-filter"
            value={status}
            onChange={e => setStatus(e.target.value as 'all' | 'draft' | 'published')}
            className="px-3 py-2 rounded-lg border border-gray-300 text-sm"
          >
            <option value="all">All</option>
            <option value="draft">Draft</option>
            <option value="published">Published</option>
          </select>
        </div>
      </div>

      <div className="overflow-x-auto bg-white border border-gray-200 rounded-xl">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-left text-gray-600">
            <tr>
              <th className="px-4 py-3">Title</th>
              <th className="px-4 py-3">Slug</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Date</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(post => (
              <tr key={post.slug} className="border-t border-gray-100">
                <td className="px-4 py-3 text-gray-900">{post.title}</td>
                <td className="px-4 py-3 text-gray-500">{post.slug}</td>
                <td className="px-4 py-3">
                  <span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${post.published ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
                    {post.published ? 'Published' : 'Draft'}
                  </span>
                </td>
                <td className="px-4 py-3 text-gray-600">{post.date || '-'}</td>
                <td className="px-4 py-3">
                  <div className="flex items-center justify-end gap-2">
                    <Link href={`/admin/posts/edit?id=${encodeURIComponent(post.slug)}`} className="px-2.5 py-1.5 rounded border border-gray-300 text-gray-700 hover:bg-gray-50">
                      Edit
                    </Link>
                    <button
                      type="button"
                      disabled={busySlug === post.slug}
                      onClick={() => togglePublish(post.slug, !post.published)}
                      className="px-2.5 py-1.5 rounded border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-60"
                    >
                      {post.published ? 'Unpublish' : 'Publish'}
                    </button>
                    <button
                      type="button"
                      disabled={busySlug === post.slug}
                      onClick={() => removePost(post.slug)}
                      className="px-2.5 py-1.5 rounded border border-red-200 text-red-700 hover:bg-red-50 disabled:opacity-60"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
