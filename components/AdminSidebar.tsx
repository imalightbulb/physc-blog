'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { LayoutDashboard, FileText, PlusCircle, LogOut, Atom } from 'lucide-react';

export default function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/admin/login');
  };

  const links = [
    { href: '/admin', label: 'Dashboard', icon: LayoutDashboard, exact: true },
    { href: '/admin/posts', label: 'All Posts', icon: FileText, exact: false },
    { href: '/admin/posts/new', label: 'New Post', icon: PlusCircle, exact: true },
  ];

  return (
    <aside className="w-56 bg-[#1a3a6b] text-white flex flex-col min-h-screen fixed top-0 left-0">
      <div className="p-5 border-b border-blue-800">
        <Link href="/admin" className="flex items-center gap-2">
          <Atom size={22} />
          <div>
            <div className="font-bold text-sm font-serif">XMUM Physics</div>
            <div className="text-xs text-blue-300">Admin Panel</div>
          </div>
        </Link>
      </div>

      <nav className="flex-1 p-4 space-y-1">
        {links.map(({ href, label, icon: Icon, exact }) => {
          const isActive = exact ? pathname === href : pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-blue-600 text-white'
                  : 'text-blue-200 hover:bg-blue-800 hover:text-white'
              }`}
            >
              <Icon size={16} />
              {label}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-blue-800">
        <Link href="/" className="flex items-center gap-2 text-xs text-blue-300 hover:text-white mb-3 transition-colors">
          ← View Site
        </Link>
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 text-sm text-blue-200 hover:text-white transition-colors w-full px-3 py-2 rounded-lg hover:bg-blue-800"
        >
          <LogOut size={16} />
          Logout
        </button>
      </div>
    </aside>
  );
}
