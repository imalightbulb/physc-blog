'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import type { AdminPostInput, AdminPostRecord } from '@/lib/content-schema';

interface PostEditorProps {
  mode: 'new' | 'edit';
  postId?: string;
}

const EMPTY_CONTENT = [
  '## Introduction',
  '',
  'Write your opening context here.',
  '',
  '## Main Content',
  '',
  '- Key point 1',
  '- Key point 2',
  '',
  '## Conclusion',
  '',
  'Summarize outcomes and next steps.',
  '',
].join('\n');

function toSlug(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

export default function PostEditor({ mode, postId }: PostEditorProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(mode === 'edit');
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string>('');

  const [title, setTitle] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [author, setAuthor] = useState('XMUM Physics Department');
  const [category, setCategory] = useState('');
  const [tagsText, setTagsText] = useState('');
  const [coverImage, setCoverImage] = useState('');
  const [slug, setSlug] = useState('');
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [content, setContent] = useState(EMPTY_CONTENT);

  const tags = useMemo(
    () => tagsText.split(',').map(tag => tag.trim()).filter(Boolean),
    [tagsText]
  );

  useEffect(() => {
    if (mode !== 'edit' || !postId) return;

    const loadPost = async () => {
      setLoading(true);
      setError('');
      try {
        const res = await fetch(`/api/posts/item?id=${encodeURIComponent(postId)}`, { cache: 'no-store' });
        if (!res.ok) {
          setError('Unable to load post.');
          return;
        }
        const data = await res.json() as { post: AdminPostRecord };
        setTitle(data.post.title);
        setExcerpt(data.post.excerpt);
        setAuthor(data.post.author);
        setCategory(data.post.category);
        setTagsText(data.post.tags.join(', '));
        setCoverImage(data.post.cover_image || '');
        setSlug(data.post.slug);
        setDate(data.post.date || new Date().toISOString().slice(0, 10));
        setContent(data.post.content || EMPTY_CONTENT);
      } catch {
        setError('Unable to load post.');
      } finally {
        setLoading(false);
      }
    };

    void loadPost();
  }, [mode, postId]);

  useEffect(() => {
    if (!slug || mode === 'new') {
      setSlug(toSlug(title));
    }
  }, [title, mode, slug]);

  const buildPayload = (published: boolean): AdminPostInput => ({
    title,
    excerpt,
    author,
    category,
    tags,
    cover_image: coverImage || null,
    published,
    date,
    slug,
    content,
  });

  const submit = async (published: boolean) => {
    setSaving(true);
    setError('');
    try {
      const payload = buildPayload(published);
      const url = mode === 'new'
        ? '/api/posts'
        : `/api/posts/item?id=${encodeURIComponent(postId || '')}`;
      const method = mode === 'new' ? 'POST' : 'PUT';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        const details = Array.isArray((data as { details?: string[] }).details)
          ? (data as { details?: string[] }).details?.join(' ')
          : '';
        setError(details || (data as { error?: string }).error || 'Unable to save post.');
        return;
      }

      const nextSlug = (data as { post?: AdminPostRecord }).post?.slug;
      if (nextSlug) {
        router.push(`/admin/posts/edit?id=${encodeURIComponent(nextSlug)}`);
      }
      router.refresh();
    } catch {
      setError('Unable to save post.');
    } finally {
      setSaving(false);
    }
  };

  const uploadImage = async (file: File) => {
    setUploading(true);
    setError('');
    try {
      const formData = new FormData();
      formData.append('file', file);
      const res = await fetch('/api/upload', { method: 'POST', body: formData });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError((data as { error?: string }).error || 'Image upload failed.');
        return;
      }
      const url = (data as { url?: string }).url;
      if (url) setCoverImage(url);
    } catch {
      setError('Image upload failed.');
    } finally {
      setUploading(false);
    }
  };

  if (loading) {
    return <p className="text-sm text-gray-600">Loading post...</p>;
  }

  return (
    <div className="space-y-5">
      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <section className="bg-white border border-gray-200 rounded-xl p-5 space-y-4">
        <h2 className="text-lg font-semibold text-gray-900">Metadata</h2>

        <div className="grid gap-4 md:grid-cols-2">
          <label className="text-sm text-gray-700">
            Title
            <input value={title} onChange={e => setTitle(e.target.value)} className="mt-1 w-full px-3 py-2 rounded-lg border border-gray-300" />
          </label>

          <label className="text-sm text-gray-700">
            Author
            <input value={author} onChange={e => setAuthor(e.target.value)} className="mt-1 w-full px-3 py-2 rounded-lg border border-gray-300" />
          </label>

          <label className="text-sm text-gray-700 md:col-span-2">
            Excerpt
            <textarea value={excerpt} onChange={e => setExcerpt(e.target.value)} rows={2} className="mt-1 w-full px-3 py-2 rounded-lg border border-gray-300" />
          </label>

          <label className="text-sm text-gray-700">
            Category
            <input value={category} onChange={e => setCategory(e.target.value)} className="mt-1 w-full px-3 py-2 rounded-lg border border-gray-300" placeholder="Research" />
          </label>

          <label className="text-sm text-gray-700">
            Date (YYYY-MM-DD)
            <input value={date} onChange={e => setDate(e.target.value)} className="mt-1 w-full px-3 py-2 rounded-lg border border-gray-300" placeholder="2026-03-04" />
          </label>

          <label className="text-sm text-gray-700 md:col-span-2">
            Tags (comma-separated)
            <input value={tagsText} onChange={e => setTagsText(e.target.value)} className="mt-1 w-full px-3 py-2 rounded-lg border border-gray-300" placeholder="quantum mechanics, education" />
          </label>

          <label className="text-sm text-gray-700 md:col-span-2">
            Slug
            <input value={slug} onChange={e => setSlug(toSlug(e.target.value))} className="mt-1 w-full px-3 py-2 rounded-lg border border-gray-300" />
            <span className="mt-1 block text-xs text-gray-500">Preview: /blog/{slug || 'your-slug'}</span>
          </label>
        </div>
      </section>

      <section className="bg-white border border-gray-200 rounded-xl p-5 space-y-4">
        <h2 className="text-lg font-semibold text-gray-900">Cover Image</h2>
        <label className="text-sm text-gray-700 block">
          Image URL (supports `/uploads/...` or `https://...`)
          <input value={coverImage} onChange={e => setCoverImage(e.target.value)} className="mt-1 w-full px-3 py-2 rounded-lg border border-gray-300" />
        </label>
        <div className="text-sm text-gray-500">or upload an image file</div>
        <input
          type="file"
          accept="image/jpeg,image/png,image/webp,image/svg+xml"
          onChange={e => {
            const file = e.target.files?.[0];
            if (file) void uploadImage(file);
          }}
          disabled={uploading}
          className="text-sm"
        />
        {uploading && <p className="text-sm text-gray-600">Uploading...</p>}
      </section>

      <section className="bg-white border border-gray-200 rounded-xl p-5 space-y-3">
        <h2 className="text-lg font-semibold text-gray-900">Content (Markdown)</h2>
        <textarea
          value={content}
          onChange={e => setContent(e.target.value)}
          rows={20}
          className="w-full px-3 py-2 rounded-lg border border-gray-300 font-mono text-sm"
        />
      </section>

      <div className="flex flex-wrap gap-3">
        <button
          type="button"
          onClick={() => void submit(false)}
          disabled={saving}
          className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-60"
        >
          Save Draft
        </button>
        <button
          type="button"
          onClick={() => void submit(true)}
          disabled={saving}
          className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-60"
        >
          Publish Now
        </button>
      </div>
    </div>
  );
}
