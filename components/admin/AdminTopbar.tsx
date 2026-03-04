'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function AdminTopbar() {
  const [busy, setBusy] = useState(false);
  const router = useRouter();

  const handleLogout = async () => {
    setBusy(true);
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      router.push('/admin/login');
      router.refresh();
    } finally {
      setBusy(false);
    }
  };

  return (
    <header className="border-b border-gray-200 bg-white sticky top-0 z-30">
      <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
        <div className="flex items-center gap-4 text-sm">
          <Link href="/admin" className="font-semibold text-[#1a3a6b]">Admin</Link>
          <Link href="/admin/posts" className="text-gray-700 hover:text-blue-600">Posts</Link>
          <Link href="/admin/posts/new" className="text-gray-700 hover:text-blue-600">New Post</Link>
        </div>
        <button
          type="button"
          onClick={handleLogout}
          disabled={busy}
          className="text-sm px-3 py-1.5 rounded border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-60"
        >
          {busy ? 'Signing out...' : 'Sign out'}
        </button>
      </div>
    </header>
  );
}
