import { NextRequest, NextResponse } from 'next/server';
import { getPostById, updatePost, deletePost, getAllPosts } from '@/lib/posts';
import { verifyJWT } from '@/lib/auth';

export const dynamic = 'force-static';

export async function generateStaticParams() {
  return getAllPosts({}).map(p => ({ id: String(p.id) }));
}

async function requireAuth(request: NextRequest) {
  const token = request.cookies.get('admin_token')?.value;
  if (!token) return null;
  return await verifyJWT(token);
}

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const post = getPostById(parseInt(id));
  if (!post) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json(post);
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await requireAuth(request))) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await params;
  try {
    const body = await request.json();
    const { title, slug, excerpt, content, cover_image, author, category, tags, published } = body;

    const post = updatePost(parseInt(id), {
      title,
      slug,
      excerpt,
      content,
      cover_image,
      author,
      category,
      tags: Array.isArray(tags) ? JSON.stringify(tags) : tags,
      published: published ? 1 : 0,
    });

    if (!post) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json(post);
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : 'Internal server error';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await requireAuth(request))) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await params;
  const deleted = deletePost(parseInt(id));
  if (!deleted) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json({ success: true });
}
