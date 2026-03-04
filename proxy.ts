import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifyJWT } from '@/lib/auth';

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Forward the pathname to layouts/pages via a custom header.
  // This lets the admin layout know which page is being rendered without
  // needing a client-side hook.
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set('x-pathname', pathname);

  // Protect all /admin routes except /admin/login (handles trailing slash too)
  if (pathname.startsWith('/admin') && !pathname.startsWith('/admin/login')) {
    const token = request.cookies.get('admin_token')?.value;

    if (!token) {
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }

    const payload = await verifyJWT(token);
    if (!payload) {
      const response = NextResponse.redirect(new URL('/admin/login', request.url));
      response.cookies.delete('admin_token');
      return response;
    }
  }

  return NextResponse.next({ request: { headers: requestHeaders } });
}

export const config = {
  // /admin(.*) catches /admin, /admin/, /admin/posts, /admin/login, etc.
  matcher: ['/admin(.*)'],
};
