export const dynamic = 'force-static';

import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { isAdminAuthenticated, isAdminEnabled } from '@/lib/admin-auth';
import { setPublishStatus } from '@/lib/admin-posts';

function forbidden() {
  return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
}

function getIdFromRequest(req: Request): string {
  return (new URL(req.url).searchParams.get('id') || '').trim();
}

export async function POST(req: Request) {
  if (!isAdminEnabled()) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  const cookieStore = await cookies();
  if (!isAdminAuthenticated(cookieStore)) return forbidden();

  const id = getIdFromRequest(req);
  if (!id) return NextResponse.json({ error: 'Missing post id.' }, { status: 400 });

  const body = await req.json().catch(() => ({})) as { published?: boolean };
  const published = body.published !== false;

  try {
    const post = setPublishStatus(id, published);
    return NextResponse.json({ post });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unable to update publish status.';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
