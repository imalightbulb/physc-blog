import { NextRequest, NextResponse } from 'next/server';
import { togglePublish, getAllPosts } from '@/lib/posts';
import { verifyJWT } from '@/lib/auth';

export const dynamic = 'force-static';

export async function generateStaticParams() {
  return getAllPosts({}).map(p => ({ id: String(p.id) }));
}

// Stub GET for static export compatibility (action is PATCH only)
export function GET() {
  return NextResponse.json({ error: 'Method not allowed' }, { status: 405 });
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const token = request.cookies.get('admin_token')?.value;
  if (!token || !(await verifyJWT(token))) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await params;
  const post = togglePublish(parseInt(id));
  if (!post) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json(post);
}
