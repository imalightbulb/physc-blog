'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Search, Menu, X, Atom } from 'lucide-react';

export default function Navbar() {
  const [query, setQuery] = useState('');
  const [menuOpen, setMenuOpen] = useState(false);
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query.trim())}`);
    }
  };

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 text-navy hover:opacity-80 transition-opacity">
            <Atom className="text-blue-600" size={28} />
            <div className="hidden sm:block">
              <div className="text-base font-bold text-[#1a3a6b] leading-tight font-serif">XMUM Physics</div>
              <div className="text-xs text-gray-500">Department Blog</div>
            </div>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-gray-700">
            <Link href="/" className="hover:text-blue-600 transition-colors">Home</Link>
            <Link href="/blog" className="hover:text-blue-600 transition-colors">Blog</Link>
            <Link href="/category/Research" className="hover:text-blue-600 transition-colors">Research</Link>
            <Link href="/category/Education" className="hover:text-blue-600 transition-colors">Education</Link>
          </nav>

          {/* Search */}
          <form onSubmit={handleSearch} className="hidden sm:flex items-center">
            <div className="relative">
              <label htmlFor="navbar-search" className="sr-only">
                Search posts
              </label>
              <input
                id="navbar-search"
                type="text"
                value={query}
                onChange={e => setQuery(e.target.value)}
                placeholder="Search posts..."
                className="w-48 pl-3 pr-8 py-1.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <button
                type="submit"
                aria-label="Search"
                className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-blue-600"
              >
                <Search size={16} />
              </button>
            </div>
          </form>

          {/* Mobile menu button */}
          <button
            type="button"
            className="md:hidden text-gray-600 hover:text-gray-900"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          >
            {menuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div id="mobile-menu" className="md:hidden py-3 border-t border-gray-100">
            <nav className="flex flex-col gap-2 text-sm font-medium text-gray-700 mb-3">
              <Link href="/" className="hover:text-blue-600 py-1" onClick={() => setMenuOpen(false)}>Home</Link>
              <Link href="/blog" className="hover:text-blue-600 py-1" onClick={() => setMenuOpen(false)}>Blog</Link>
              <Link href="/category/Research" className="hover:text-blue-600 py-1" onClick={() => setMenuOpen(false)}>Research</Link>
              <Link href="/category/Education" className="hover:text-blue-600 py-1" onClick={() => setMenuOpen(false)}>Education</Link>
            </nav>
            <form onSubmit={handleSearch} className="flex items-center">
              <div className="relative flex-1">
                <label htmlFor="mobile-navbar-search" className="sr-only">
                  Search posts
                </label>
                <input
                  id="mobile-navbar-search"
                  type="text"
                  value={query}
                  onChange={e => setQuery(e.target.value)}
                  placeholder="Search posts..."
                  className="w-full pl-3 pr-8 py-1.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  type="submit"
                  aria-label="Search"
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400"
                >
                  <Search size={16} />
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </header>
  );
}
