import AdminSidebar from '@/components/AdminSidebar';

export const metadata = { title: { default: 'Admin', template: '%s | Admin — XMUM Physics' } };

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-gray-100">
      <AdminSidebar />
      <main className="flex-1 ml-56 p-8">
        {children}
      </main>
    </div>
  );
}
