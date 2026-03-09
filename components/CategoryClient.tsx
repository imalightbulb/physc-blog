'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ChevronDown } from 'lucide-react';
import BlogCard from './BlogCard';
import type { Post } from '@/lib/posts';
import { formatTagLabel, groupTagsByArea } from '@/lib/tags';

interface CategoryClientProps {
  posts: Post[];
  category: string;
  displayName: string;
}

export default function CategoryClient({ posts, category, displayName }: CategoryClientProps) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const activeTag = searchParams.get('tag') ?? '';
  const [openAreas, setOpenAreas] = useState<Record<string, boolean>>({});

  // Collect all tags present in this category's posts, sorted alphabetically
  const tags = Array.from(
    new Set(posts.flatMap(p => p.tags))
  ).sort((a, b) => a.localeCompare(b));
  const tagGroups = groupTagsByArea(tags);

  const filtered = activeTag ? posts.filter(p => p.tags.includes(activeTag)) : posts;

  function setTag(tag: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (tag) {
      params.set('tag', tag);
    } else {
      params.delete('tag');
    }
    const query = params.toString();
    router.push(`/category/${encodeURIComponent(category)}${query ? `?${query}` : ''}`);
  }

  function toggleArea(area: string) {
    const fallbackOpen = activeTag.startsWith(`${area}/`) || activeTag === area;
    setOpenAreas(current => ({
      ...current,
      [area]: !(current[area] ?? fallbackOpen),
    }));
  }

  return (
    <>
      {/* Page header */}
      <div className="page-header">
        <div className="page-header__inner">
          <p className="eyebrow">{displayName}</p>
          <h1 className="section-title mt-3">{displayName} archive.</h1>
          <p className="section-kicker">
            {filtered.length} {filtered.length === 1 ? 'post' : 'posts'}
            {activeTag && <> tagged <span className="font-medium text-accent">#{activeTag}</span></>}
            {!activeTag && <> organised to help visitors move from broad topics into more specific research areas.</>}
          </p>
        </div>
      </div>

      {/* Mobile tag strip */}
      {tags.length > 0 && (
        <div className="overflow-x-auto border-b border-border bg-surface/80 px-4 py-3 md:hidden">
          <div className="flex gap-2 min-w-max">
            <button
              onClick={() => setTag('')}
              className={`whitespace-nowrap rounded-full border px-3 py-1 text-xs font-medium transition-colors ${
                !activeTag
                  ? 'border-accent bg-accent text-white'
                  : 'border-border bg-surface text-muted hover:border-accent hover:text-accent'
              }`}
            >
              All
            </button>
            {tags.map(tag => (
              <button
                key={tag}
                onClick={() => setTag(tag === activeTag ? '' : tag)}
                className={`whitespace-nowrap rounded-full border px-3 py-1 text-xs font-medium transition-colors ${
                  tag === activeTag
                    ? 'border-accent bg-accent text-white'
                    : 'border-border bg-surface text-muted hover:border-accent hover:text-accent'
                }`}
              >
                #{formatTagLabel(tag).secondary ?? formatTagLabel(tag).primary}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Main content: sidebar + grid */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex gap-8">
          {/* Sidebar — desktop only */}
          {tags.length > 0 && (
            <aside className="hidden w-64 flex-shrink-0 md:block">
              <div className="sticky top-24">
                <div className="surface-elevated rounded-[1.75rem] bg-surface p-4">
                  <h2 className="mb-3 text-xs font-semibold uppercase tracking-widest text-muted">Filter by tag</h2>
                  <button
                    onClick={() => setTag('')}
                    className={`mb-3 w-full rounded-xl px-3 py-2 text-left text-sm transition-colors ${
                      !activeTag
                        ? 'bg-accent-soft text-primary font-semibold'
                        : 'text-muted hover:bg-accent-soft/60 hover:text-text'
                    }`}
                  >
                    All posts
                  </button>
                  <div className="space-y-2">
                    {tagGroups.map(group => {
                      const isOpen = openAreas[group.area] ?? (
                        activeTag === group.area || activeTag.startsWith(`${group.area}/`)
                      );
                      return (
                        <div key={group.area} className="rounded-xl border border-border/80 bg-surface-2">
                          <button
                            type="button"
                            onClick={() => toggleArea(group.area)}
                            className="flex w-full items-center justify-between px-3 py-2 text-left"
                          >
                            <span className="text-sm font-semibold text-text">{group.area}</span>
                            <ChevronDown
                              size={16}
                              className={`text-muted transition-transform ${isOpen ? 'rotate-180' : ''}`}
                            />
                          </button>
                          {isOpen && (
                            <div className="space-y-1 px-2 pb-2">
                              {group.tags.map(tag => {
                                const { primary, secondary } = formatTagLabel(tag);
                                return (
                                  <button
                                    key={tag}
                                    onClick={() => setTag(tag === activeTag ? '' : tag)}
                                    className={`w-full rounded-lg px-3 py-2 text-left text-sm transition-colors ${
                                      tag === activeTag
                                        ? 'bg-surface font-semibold text-accent shadow-sm'
                                        : 'text-muted hover:bg-surface hover:text-text'
                                    }`}
                                  >
                                    {secondary ?? primary}
                                  </button>
                                );
                              })}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </aside>
          )}

          {/* Post grid */}
          <div className="flex-1 min-w-0">
            {filtered.length > 0 ? (
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {filtered.map((post, index) => <BlogCard key={post.slug} post={post} variant={index === 0 ? 'featured' : 'default'} />)}
              </div>
            ) : (
              <div className="py-16 text-center text-muted">
                <p className="text-lg">No posts found{activeTag && <> for <span className="font-medium">#{activeTag}</span></>}.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
