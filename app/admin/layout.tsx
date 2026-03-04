import { notFound, redirect } from 'next/navigation';
import { cookies, headers } from 'next/headers';
import { verifyJWT } from '@/lib/auth';
import AdminSidebar from '@/components/AdminSidebar';

export const metadata = {
  title: { default: 'Admin', template: '%s | Admin — XMUM Physics' },
};

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // ── Static export guard ──────────────────────────────────────────────────
  // The admin panel requires a live server (SQLite, JWT cookies, API routes).
  // In a static export (GitHub Pages) there is no server, so all /admin routes
  // return 404 — nothing is leaked, no broken UI is shown.
  if (process.env.STATIC_EXPORT === 'true') {
    notFound();
  }

  // ── Server-side auth guard (secondary — proxy.ts is the primary) ─────────
  // proxy.ts already redirects unauthenticated requests, but this provides a
  // defence-in-depth layer in case middleware is skipped (e.g. direct page
  // navigation during dev hot-reload edge cases).
  //
  // proxy.ts sets x-pathname so we know whether this is the login page itself
  // (login must not check auth — that would cause an infinite redirect loop).
  const headersList = await headers();
  const pathname = headersList.get('x-pathname') ?? '';
  const isLoginPage = pathname.startsWith('/admin/login');

  if (!isLoginPage) {
    const cookieStore = await cookies();
    const token = cookieStore.get('admin_token')?.value;
    if (!token || !(await verifyJWT(token))) {
      redirect('/admin/login');
    }
  }

  // ── Layout shell ─────────────────────────────────────────────────────────
  // Login page gets a bare wrapper (no sidebar — the login page has its own
  // full-screen layout defined in app/admin/login/page.tsx).
  if (isLoginPage) {
    return <>{children}</>;
  }

  return (
    <div className="flex min-h-screen bg-gray-100">
      <AdminSidebar />
      <main className="flex-1 ml-56 p-8">{children}</main>
    </div>
  );
}
