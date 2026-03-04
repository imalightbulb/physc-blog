import { NextRequest, NextResponse } from 'next/server';
import { searchPosts } from '@/lib/posts';

export const dynamic = 'force-static';

export async function GET(request: NextRequest) {
  let q = '';
  try {
    // request.url may not be available during static pre-rendering
    const { searchParams } = new URL(request.url);
    q = searchParams.get('q') || '';
  } catch {
    return NextResponse.json({ posts: [], query: '' });
  }

  if (!q.trim()) {
    return NextResponse.json({ posts: [], query: q });
  }

  const posts = searchPosts(q.trim());
  return NextResponse.json({ posts, query: q });
}
