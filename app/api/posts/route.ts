export const dynamic = "force-static";

import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { createAdminPost, listAdminPosts, starterPostTemplate, validateAdminPostInput } from '@/lib/admin-posts';
import { isAdminAuthenticated, isAdminEnabled } from '@/lib/admin-auth';
import type { AdminPostInput } from '@/lib/content-schema';

function forbidden() {
  return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
}

export async function GET(req: Request) {
  if (!isAdminEnabled()) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  const cookieStore = await cookies();
  if (!isAdminAuthenticated(cookieStore)) return forbidden();

  const { searchParams } = new URL(req.url);
  const status = searchParams.get('status');
  const q = (searchParams.get('q') || '').toLowerCase().trim();

  const posts = listAdminPosts().filter(post => {
    if (status === 'draft' && post.published) return false;
    if (status === 'published' && !post.published) return false;
    if (!q) return true;
    return post.title.toLowerCase().includes(q) || post.slug.toLowerCase().includes(q);
  });

  return NextResponse.json({ posts, template: starterPostTemplate() });
}

export async function POST(req: Request) {
  if (!isAdminEnabled()) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  const cookieStore = await cookies();
  if (!isAdminAuthenticated(cookieStore)) return forbidden();

  const body = (await req.json().catch(() => null)) as AdminPostInput | null;
  if (!body) return NextResponse.json({ error: 'Invalid payload.' }, { status: 400 });

  const validation = validateAdminPostInput(body, { allowMissingDate: true });
  if (!validation.valid) {
    return NextResponse.json({ error: 'Validation failed.', details: validation.errors }, { status: 400 });
  }

  try {
    const post = createAdminPost(body);
    return NextResponse.json({ post }, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unable to create post.';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
