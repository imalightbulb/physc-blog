import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import AdminTopbar from '@/components/admin/AdminTopbar';
import { hasAdminConfig, isAdminAuthenticated, isAdminEnabled } from '@/lib/admin-auth';

export default async function AdminPanelLayout({ children }: { children: React.ReactNode }) {
  if (!isAdminEnabled()) {
    return (
      <main className="min-h-screen bg-gray-50 px-4 py-12">
        <div className="max-w-2xl mx-auto bg-white border border-gray-200 rounded-xl p-6">
          <h1 className="text-2xl font-bold font-serif text-gray-900 mb-2">Admin is disabled</h1>
          <p className="text-sm text-gray-600">
            Set <code>ENABLE_ADMIN=true</code> in your environment to enable in-app publishing.
          </p>
        </div>
      </main>
    );
  }

  if (!hasAdminConfig()) {
    return (
      <main className="min-h-screen bg-gray-50 px-4 py-12">
        <div className="max-w-2xl mx-auto bg-white border border-gray-200 rounded-xl p-6">
          <h1 className="text-2xl font-bold font-serif text-gray-900 mb-2">Admin config missing</h1>
          <p className="text-sm text-gray-600">
            Set <code>ADMIN_PASSWORD</code> and <code>ADMIN_SESSION_SECRET</code>.
          </p>
        </div>
      </main>
    );
  }

  const cookieStore = await cookies();
  if (!isAdminAuthenticated(cookieStore)) {
    redirect('/admin/login');
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminTopbar />
      <main className="max-w-6xl mx-auto px-4 py-6">{children}</main>
    </div>
  );
}
