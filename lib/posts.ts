import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const POSTS_DIR = path.join(process.cwd(), 'content/posts');

export interface Post {
  slug: string;
  title: string;
  excerpt: string | null;
  content: string;
  cover_image: string | null;
  author: string;
  category: string | null;
  tags: string[];
  published: boolean;
  featured: boolean;
  is_page: boolean;
  date: string;
  portrait_focus: 'top' | 'center' | 'bottom';
  email: string | null;
}

function parsePost(filename: string): Post {
  const raw = fs.readFileSync(path.join(POSTS_DIR, filename), 'utf-8');
  const { data, content } = matter(raw);
  const slug = data.slug ?? filename.replace(/\.md$/, '');
  return {
    slug,
    title: data.title ?? '',
    excerpt: data.excerpt ?? null,
    content,
    cover_image: data.cover_image ?? null,
    author: data.author ?? 'XMUM Physics Department',
    category: data.category ?? null,
    tags: Array.isArray(data.tags) ? data.tags : [],
    published: data.published === true,
    featured: data.featured === true,
    is_page: data.is_page === true,
    date: data.date ?? '',
    portrait_focus:
      data.portrait_focus === 'top' || data.portrait_focus === 'bottom' ? data.portrait_focus : 'center',
    email: (() => {
      const m = content.match(/\*\*Email:\*\*\s*([^\s\n<]+)/);
      return m ? m[1] : null;
    })(),
  };
}

function readAllPosts(): Post[] {
  if (!fs.existsSync(POSTS_DIR)) return [];
  return fs
    .readdirSync(POSTS_DIR)
    .filter(f => f.endsWith('.md'))
    .map(f => parsePost(f))
    .sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : 0));
}

export function getAllPosts(options: {
  published?: boolean;
  category?: string;
  tag?: string;
  limit?: number;
  offset?: number;
} = {}): Post[] {
  let posts = readAllPosts();

  // Exclude is_page posts from regular listings (getPostBySlug bypasses this)
  posts = posts.filter(p => !p.is_page);

  if (options.published !== undefined) {
    posts = posts.filter(p => p.published === options.published);
  }
  if (options.category) {
    posts = posts.filter(p => p.category === options.category);
  }
  if (options.tag) {
    posts = posts.filter(p => p.tags.includes(options.tag!));
  }

  const offset = options.offset ?? 0;
  posts = posts.slice(offset);

  if (options.limit !== undefined) {
    posts = posts.slice(0, options.limit);
  }

  return posts;
}

export function countPosts(options: {
  published?: boolean;
  category?: string;
  tag?: string;
} = {}): number {
  let posts = readAllPosts();

  if (options.published !== undefined) {
    posts = posts.filter(p => p.published === options.published);
  }
  if (options.category) {
    posts = posts.filter(p => p.category === options.category);
  }
  if (options.tag) {
    posts = posts.filter(p => p.tags.includes(options.tag!));
  }

  return posts.length;
}

export function getPostBySlug(slug: string): Post | null {
  const all = readAllPosts();
  return all.find(p => p.slug === slug) ?? null;
}

export function getAdjacentPosts(currentSlug: string): { prev: Post | null; next: Post | null } {
  const published = readAllPosts().filter(p => p.published);
  const i = published.findIndex(p => p.slug === currentSlug);
  if (i === -1) return { prev: null, next: null };
  // sorted desc by date: newer = lower index, older = higher index
  // "next" = newer post (lower index), "prev" = older post (higher index)
  return {
    prev: published[i + 1] ?? null,
    next: published[i - 1] ?? null,
  };
}

export interface TocHeading {
  id: string;
  text: string;
  level: number;
}

export function extractHeadings(content: string): TocHeading[] {
  const lines = content.split('\n');
  const headings: TocHeading[] = [];
  for (const line of lines) {
    const m = line.match(/^(#{2,3})\s+(.+)/);
    if (!m) continue;
    const level = m[1].length;
    const text = m[2].trim();
    // Replicate rehype-slug: lowercase, strip non-alphanumeric except spaces/hyphens, replace spaces with hyphens
    const id = text
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '');
    headings.push({ id, text, level });
  }
  return headings;
}

export function getAllCategories(): string[] {
  const cats = new Set<string>();
  readAllPosts()
    .filter(p => p.published && p.category)
    .forEach(p => cats.add(p.category!));
  return Array.from(cats).sort();
}

export function getAllTags(): string[] {
  const tags = new Set<string>();
  readAllPosts()
    .filter(p => p.published)
    .forEach(p => p.tags.forEach(t => tags.add(t)));
  return Array.from(tags).sort();
}
