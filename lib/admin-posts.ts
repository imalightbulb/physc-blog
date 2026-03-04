import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import type { AdminPostInput, AdminPostRecord, PostFrontmatter, ValidationResult } from '@/lib/content-schema';

const POSTS_DIR = path.join(process.cwd(), 'content/posts');

function ensurePostsDir(): void {
  if (!fs.existsSync(POSTS_DIR)) {
    fs.mkdirSync(POSTS_DIR, { recursive: true });
  }
}

function filePathFromSlug(slug: string): string {
  return path.join(POSTS_DIR, `${slug}.md`);
}

function normalizeWhitespace(value: string): string {
  return value.trim().replace(/\s+/g, ' ');
}

export function slugify(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

function normalizeTags(tags: string[]): string[] {
  const set = new Set<string>();
  tags
    .map(tag => normalizeWhitespace(tag))
    .filter(Boolean)
    .forEach(tag => set.add(tag));
  return Array.from(set);
}

function isValidDate(value: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const parsed = new Date(`${value}T00:00:00Z`);
  return !Number.isNaN(parsed.getTime());
}

function isValidCoverImage(value: string | null | undefined): boolean {
  if (!value) return true;
  return value.startsWith('/') || /^https?:\/\//i.test(value);
}

function formatFrontmatter(frontmatter: PostFrontmatter): PostFrontmatter {
  return {
    title: normalizeWhitespace(frontmatter.title),
    excerpt: normalizeWhitespace(frontmatter.excerpt),
    author: normalizeWhitespace(frontmatter.author),
    category: normalizeWhitespace(frontmatter.category),
    tags: normalizeTags(frontmatter.tags),
    cover_image: frontmatter.cover_image ? frontmatter.cover_image.trim() : null,
    published: frontmatter.published,
    date: frontmatter.date,
    slug: slugify(frontmatter.slug),
  };
}

function toRecord(filename: string): AdminPostRecord {
  const raw = fs.readFileSync(path.join(POSTS_DIR, filename), 'utf-8');
  const { data, content } = matter(raw);
  const stat = fs.statSync(path.join(POSTS_DIR, filename));
  return {
    title: typeof data.title === 'string' ? data.title : '',
    excerpt: typeof data.excerpt === 'string' ? data.excerpt : '',
    author: typeof data.author === 'string' ? data.author : 'XMUM Physics Department',
    category: typeof data.category === 'string' ? data.category : '',
    tags: Array.isArray(data.tags) ? data.tags.map(String) : [],
    cover_image: typeof data.cover_image === 'string' ? data.cover_image : null,
    published: data.published === true,
    date: typeof data.date === 'string' ? data.date : '',
    slug: typeof data.slug === 'string' ? data.slug : filename.replace(/\.md$/, ''),
    content,
    filename,
    updatedAt: stat.mtime.toISOString(),
  };
}

export function listAdminPosts(): AdminPostRecord[] {
  ensurePostsDir();
  return fs
    .readdirSync(POSTS_DIR)
    .filter(name => name.endsWith('.md'))
    .map(toRecord)
    .sort((a, b) => (a.date < b.date ? 1 : -1));
}

export function getAdminPostBySlug(slug: string): AdminPostRecord | null {
  const normalizedSlug = slugify(slug);
  const target = `${normalizedSlug}.md`;
  ensurePostsDir();
  if (!fs.existsSync(path.join(POSTS_DIR, target))) return null;
  return toRecord(target);
}

export function validateAdminPostInput(input: AdminPostInput, options?: { allowMissingDate?: boolean }): ValidationResult {
  const errors: string[] = [];
  const slug = slugify(input.slug || input.title || '');

  if (!normalizeWhitespace(input.title || '')) errors.push('Title is required.');
  if (!normalizeWhitespace(input.excerpt || '')) errors.push('Excerpt is required.');
  if (!normalizeWhitespace(input.author || '')) errors.push('Author is required.');
  if (!normalizeWhitespace(input.category || '')) errors.push('Category is required.');
  if (!Array.isArray(input.tags) || normalizeTags(input.tags).length === 0) errors.push('At least one tag is required.');
  if (!input.content || !input.content.trim()) errors.push('Content is required.');
  if (!slug) errors.push('Unable to generate a valid slug.');
  if (!isValidCoverImage(input.cover_image)) errors.push('Cover image must be an absolute path or http(s) URL.');

  const date = (input.date || '').trim();
  if (!options?.allowMissingDate || date) {
    if (!isValidDate(date || '')) {
      errors.push('Date must be in YYYY-MM-DD format.');
    }
  }

  return { valid: errors.length === 0, errors };
}

function ensureUniqueSlug(slug: string, currentSlug?: string): string {
  let candidate = slugify(slug);
  let index = 1;

  while (candidate) {
    const exists = fs.existsSync(filePathFromSlug(candidate));
    const isCurrent = currentSlug && candidate === slugify(currentSlug);
    if (!exists || isCurrent) return candidate;
    index += 1;
    candidate = `${slugify(slug)}-${index}`;
  }

  return '';
}

function writeMarkdownFile(slug: string, frontmatter: PostFrontmatter, content: string): void {
  ensurePostsDir();
  const target = filePathFromSlug(slug);
  const tmp = `${target}.tmp-${Date.now()}`;
  const markdown = matter.stringify(content.trim() + '\n', frontmatter as unknown as Record<string, unknown>);
  fs.writeFileSync(tmp, markdown, 'utf-8');
  fs.renameSync(tmp, target);
}

export function createAdminPost(input: AdminPostInput): AdminPostRecord {
  ensurePostsDir();
  const normalizedBaseSlug = slugify(input.slug || input.title);
  const uniqueSlug = ensureUniqueSlug(normalizedBaseSlug);
  const publishDate = (input.date || '').trim() || new Date().toISOString().slice(0, 10);

  const frontmatter = formatFrontmatter({
    title: input.title,
    excerpt: input.excerpt,
    author: input.author,
    category: input.category,
    tags: input.tags,
    cover_image: input.cover_image || null,
    published: input.published === true,
    date: publishDate,
    slug: uniqueSlug,
  });

  writeMarkdownFile(frontmatter.slug, frontmatter, input.content);
  return getAdminPostBySlug(frontmatter.slug)!;
}

export function updateAdminPost(currentSlug: string, input: AdminPostInput): AdminPostRecord {
  ensurePostsDir();
  const existing = getAdminPostBySlug(currentSlug);
  if (!existing) throw new Error('Post not found.');

  const desiredSlug = slugify(input.slug || input.title || existing.slug);
  const nextSlug = ensureUniqueSlug(desiredSlug, existing.slug);
  const date = (input.date || '').trim() || existing.date || new Date().toISOString().slice(0, 10);

  const frontmatter = formatFrontmatter({
    title: input.title,
    excerpt: input.excerpt,
    author: input.author,
    category: input.category,
    tags: input.tags,
    cover_image: input.cover_image || null,
    published: input.published === true,
    date,
    slug: nextSlug,
  });

  writeMarkdownFile(frontmatter.slug, frontmatter, input.content);

  if (frontmatter.slug !== existing.slug) {
    const oldPath = filePathFromSlug(existing.slug);
    if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
  }

  return getAdminPostBySlug(frontmatter.slug)!;
}

export function deleteAdminPost(slug: string): void {
  const target = filePathFromSlug(slugify(slug));
  if (fs.existsSync(target)) fs.unlinkSync(target);
}

export function setPublishStatus(slug: string, published: boolean): AdminPostRecord {
  const post = getAdminPostBySlug(slug);
  if (!post) throw new Error('Post not found.');

  const frontmatter = formatFrontmatter({
    title: post.title,
    excerpt: post.excerpt,
    author: post.author,
    category: post.category,
    tags: post.tags,
    cover_image: post.cover_image,
    published,
    date: post.date || new Date().toISOString().slice(0, 10),
    slug: post.slug,
  });

  writeMarkdownFile(post.slug, frontmatter, post.content);
  return getAdminPostBySlug(post.slug)!;
}

export function starterPostTemplate(): string {
  return [
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
}
