import { getDb } from './db';

export interface Post {
  id: number;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string;
  cover_image: string | null;
  author: string;
  category: string | null;
  tags: string; // JSON array string
  published: number;
  views: number;
  created_at: string;
  updated_at: string;
  published_at: string | null;
}

export interface PostInput {
  title: string;
  slug: string;
  excerpt?: string;
  content: string;
  cover_image?: string;
  author?: string;
  category?: string;
  tags?: string;
  published?: number;
}

export function getAllPosts(options: {
  published?: boolean;
  category?: string;
  tag?: string;
  limit?: number;
  offset?: number;
} = {}): Post[] {
  const db = getDb();
  let query = 'SELECT * FROM posts WHERE 1=1';
  const params: (string | number)[] = [];

  if (options.published !== undefined) {
    query += ' AND published = ?';
    params.push(options.published ? 1 : 0);
  }

  if (options.category) {
    query += ' AND category = ?';
    params.push(options.category);
  }

  if (options.tag) {
    query += ' AND tags LIKE ?';
    params.push(`%"${options.tag}"%`);
  }

  query += ' ORDER BY COALESCE(published_at, created_at) DESC';

  if (options.limit !== undefined) {
    query += ' LIMIT ?';
    params.push(options.limit);
    if (options.offset !== undefined) {
      query += ' OFFSET ?';
      params.push(options.offset);
    }
  }

  return db.prepare(query).all(...params) as Post[];
}

export function countPosts(options: {
  published?: boolean;
  category?: string;
  tag?: string;
} = {}): number {
  const db = getDb();
  let query = 'SELECT COUNT(*) as count FROM posts WHERE 1=1';
  const params: (string | number)[] = [];

  if (options.published !== undefined) {
    query += ' AND published = ?';
    params.push(options.published ? 1 : 0);
  }

  if (options.category) {
    query += ' AND category = ?';
    params.push(options.category);
  }

  if (options.tag) {
    query += ' AND tags LIKE ?';
    params.push(`%"${options.tag}"%`);
  }

  return ((db.prepare(query).get(...params) as { count: number }) || { count: 0 }).count;
}

export function getPostBySlug(slug: string): Post | null {
  const db = getDb();
  return (db.prepare('SELECT * FROM posts WHERE slug = ?').get(slug) as Post) || null;
}

export function getPostById(id: number): Post | null {
  const db = getDb();
  return (db.prepare('SELECT * FROM posts WHERE id = ?').get(id) as Post) || null;
}

export function createPost(input: PostInput): Post {
  const db = getDb();
  const result = db.prepare(`
    INSERT INTO posts (title, slug, excerpt, content, cover_image, author, category, tags, published, published_at)
    VALUES (@title, @slug, @excerpt, @content, @cover_image, @author, @category, @tags, @published, @published_at)
  `).run({
    title: input.title,
    slug: input.slug,
    excerpt: input.excerpt || null,
    content: input.content,
    cover_image: input.cover_image || null,
    author: input.author || 'XMUM Physics Department',
    category: input.category || null,
    tags: input.tags || '[]',
    published: input.published ?? 0,
    published_at: input.published ? new Date().toISOString() : null,
  });

  return getPostById(result.lastInsertRowid as number)!;
}

export function updatePost(id: number, input: Partial<PostInput>): Post | null {
  const db = getDb();
  const existing = getPostById(id);
  if (!existing) return null;

  const wasPublished = existing.published === 1;
  const nowPublished = input.published !== undefined ? input.published === 1 : wasPublished;

  db.prepare(`
    UPDATE posts SET
      title = @title,
      slug = @slug,
      excerpt = @excerpt,
      content = @content,
      cover_image = @cover_image,
      author = @author,
      category = @category,
      tags = @tags,
      published = @published,
      published_at = @published_at,
      updated_at = datetime('now')
    WHERE id = @id
  `).run({
    id,
    title: input.title ?? existing.title,
    slug: input.slug ?? existing.slug,
    excerpt: input.excerpt !== undefined ? input.excerpt : existing.excerpt,
    content: input.content ?? existing.content,
    cover_image: input.cover_image !== undefined ? input.cover_image : existing.cover_image,
    author: input.author ?? existing.author,
    category: input.category !== undefined ? input.category : existing.category,
    tags: input.tags ?? existing.tags,
    published: nowPublished ? 1 : 0,
    published_at: nowPublished && !wasPublished
      ? new Date().toISOString()
      : existing.published_at,
  });

  return getPostById(id);
}

export function deletePost(id: number): boolean {
  const db = getDb();
  const result = db.prepare('DELETE FROM posts WHERE id = ?').run(id);
  return result.changes > 0;
}

export function togglePublish(id: number): Post | null {
  const db = getDb();
  const post = getPostById(id);
  if (!post) return null;

  const newPublished = post.published === 1 ? 0 : 1;
  db.prepare(`
    UPDATE posts SET
      published = ?,
      published_at = CASE WHEN ? = 1 THEN datetime('now') ELSE published_at END,
      updated_at = datetime('now')
    WHERE id = ?
  `).run(newPublished, newPublished, id);

  return getPostById(id);
}

export function searchPosts(query: string): Post[] {
  const db = getDb();
  const like = `%${query}%`;
  return db.prepare(`
    SELECT * FROM posts
    WHERE published = 1
      AND (title LIKE ? OR content LIKE ? OR excerpt LIKE ? OR tags LIKE ? OR category LIKE ?)
    ORDER BY COALESCE(published_at, created_at) DESC
    LIMIT 20
  `).all(like, like, like, like, like) as Post[];
}

export function incrementViews(id: number) {
  const db = getDb();
  db.prepare('UPDATE posts SET views = views + 1 WHERE id = ?').run(id);
}

export function getAdjacentPosts(currentId: number): { prev: Post | null; next: Post | null } {
  const db = getDb();
  const prev = (db.prepare(`
    SELECT * FROM posts WHERE published = 1 AND id < ?
    ORDER BY id DESC LIMIT 1
  `).get(currentId) as Post) || null;

  const next = (db.prepare(`
    SELECT * FROM posts WHERE published = 1 AND id > ?
    ORDER BY id ASC LIMIT 1
  `).get(currentId) as Post) || null;

  return { prev, next };
}

export function getAllCategories(): string[] {
  const db = getDb();
  const rows = db.prepare(`
    SELECT DISTINCT category FROM posts WHERE published = 1 AND category IS NOT NULL
    ORDER BY category
  `).all() as { category: string }[];
  return rows.map(r => r.category);
}

export function getAllTags(): string[] {
  const db = getDb();
  const rows = db.prepare(`
    SELECT tags FROM posts WHERE published = 1
  `).all() as { tags: string }[];

  const tagSet = new Set<string>();
  for (const row of rows) {
    try {
      const tags = JSON.parse(row.tags) as string[];
      tags.forEach(t => tagSet.add(t));
    } catch {}
  }
  return Array.from(tagSet).sort();
}

export function getStats() {
  const db = getDb();
  const total = (db.prepare('SELECT COUNT(*) as count FROM posts').get() as { count: number }).count;
  const published = (db.prepare('SELECT COUNT(*) as count FROM posts WHERE published = 1').get() as { count: number }).count;
  const drafts = total - published;
  const totalViews = (db.prepare('SELECT COALESCE(SUM(views), 0) as total FROM posts').get() as { total: number }).total;

  return { total, published, drafts, totalViews };
}
