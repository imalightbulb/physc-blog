import { NextRequest, NextResponse } from 'next/server';
import { getAllPosts, countPosts, createPost } from '@/lib/posts';
import { verifyJWT } from '@/lib/auth';
import slugify from 'slugify';

export const dynamic = 'force-static';

export async function GET(request: NextRequest) {
  let published: string | null = null;
  let category: string | undefined;
  let tag: string | undefined;
  let page = 1;
  let limit = 12;

  try {
    // request.url may not be available during static pre-rendering
    const { searchParams } = new URL(request.url);
    published = searchParams.get('published');
    category = searchParams.get('category') || undefined;
    tag = searchParams.get('tag') || undefined;
    page = parseInt(searchParams.get('page') || '1');
    limit = parseInt(searchParams.get('limit') || '12');
  } catch {
    // Static export: return all published posts with default params
  }

  const offset = (page - 1) * limit;
  const options = {
    published: published === null ? undefined : published === 'true',
    category,
    tag,
    limit,
    offset,
  };

  const posts = getAllPosts(options);
  const total = countPosts({ published: options.published, category, tag });

  return NextResponse.json({ posts, total, page, limit });
}

export async function POST(request: NextRequest) {
  const token = request.cookies.get('admin_token')?.value;
  if (!token || !(await verifyJWT(token))) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { title, excerpt, content, cover_image, author, category, tags, published } = body;

    if (!title || !content) {
      return NextResponse.json({ error: 'Title and content are required' }, { status: 400 });
    }

    const slug = slugify(title, { lower: true, strict: true });
    const post = createPost({
      title,
      slug,
      excerpt,
      content,
      cover_image,
      author,
      category,
      tags: Array.isArray(tags) ? JSON.stringify(tags) : tags || '[]',
      published: published ? 1 : 0,
    });

    return NextResponse.json(post, { status: 201 });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : 'Internal server error';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
