export const dynamic = 'force-static';

import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { deleteAdminPost, getAdminPostBySlug, updateAdminPost, validateAdminPostInput } from '@/lib/admin-posts';
import { isAdminAuthenticated, isAdminEnabled } from '@/lib/admin-auth';
import type { AdminPostInput } from '@/lib/content-schema';

function forbidden() {
  return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
}

function getIdFromRequest(req: Request): string {
  return (new URL(req.url).searchParams.get('id') || '').trim();
}

export async function GET(req: Request) {
  if (!isAdminEnabled()) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  const cookieStore = await cookies();
  if (!isAdminAuthenticated(cookieStore)) return forbidden();

  const id = getIdFromRequest(req);
  if (!id) return NextResponse.json({ error: 'Missing post id.' }, { status: 400 });

  const post = getAdminPostBySlug(id);
  if (!post) return NextResponse.json({ error: 'Post not found.' }, { status: 404 });
  return NextResponse.json({ post });
}

export async function PUT(req: Request) {
  if (!isAdminEnabled()) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  const cookieStore = await cookies();
  if (!isAdminAuthenticated(cookieStore)) return forbidden();

  const id = getIdFromRequest(req);
  if (!id) return NextResponse.json({ error: 'Missing post id.' }, { status: 400 });

  const body = (await req.json().catch(() => null)) as AdminPostInput | null;
  if (!body) return NextResponse.json({ error: 'Invalid payload.' }, { status: 400 });

  const validation = validateAdminPostInput(body, { allowMissingDate: true });
  if (!validation.valid) {
    return NextResponse.json({ error: 'Validation failed.', details: validation.errors }, { status: 400 });
  }

  try {
    const post = updateAdminPost(id, body);
    return NextResponse.json({ post });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unable to update post.';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  if (!isAdminEnabled()) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  const cookieStore = await cookies();
  if (!isAdminAuthenticated(cookieStore)) return forbidden();

  const id = getIdFromRequest(req);
  if (!id) return NextResponse.json({ error: 'Missing post id.' }, { status: 400 });

  deleteAdminPost(id);
  return NextResponse.json({ ok: true });
}
