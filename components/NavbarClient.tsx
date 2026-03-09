'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Search, Menu, X, Atom } from 'lucide-react';

export interface NavbarSearchItem {
  slug: string;
  title: string;
  excerpt: string | null;
  category: string | null;
  tags: string[];
}

interface NavbarClientProps {
  searchIndex: NavbarSearchItem[];
}

interface SearchResult {
  slug: string;
  title: string;
  category: string | null;
}

export default function NavbarClient({ searchIndex }: NavbarClientProps) {
  const [query, setQuery] = useState('');
  const [menuOpen, setMenuOpen] = useState(false);
  const [results, setResults] = useState<SearchResult[]>([]);
  const router = useRouter();

  useEffect(() => {
    const trimmed = query.trim().toLowerCase();

    if (trimmed.length < 2) {
      setResults([]);
      return;
    }

    const nextResults = searchIndex
      .filter(item =>
        item.title.toLowerCase().includes(trimmed) ||
        (item.excerpt ?? '').toLowerCase().includes(trimmed) ||
        item.tags.some(tag => tag.toLowerCase().includes(trimmed)) ||
        (item.category ?? '').toLowerCase().includes(trimmed)
      )
      .slice(0, 6)
      .map(item => ({
        slug: item.slug,
        title: item.title,
        category: item.category,
      }));

    setResults(nextResults);
  }, [query, searchIndex]);

  function resetSearch() {
    setQuery('');
    setResults([]);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (results[0]) {
      router.push(`/blog/${results[0].slug}`);
      setMenuOpen(false);
      resetSearch();
    }
  }

  function handleResultClick(slug: string) {
    router.push(`/blog/${slug}`);
    setMenuOpen(false);
    resetSearch();
  }

  return (
    <header className="sticky top-0 z-50 border-b border-border/80 bg-white/92 shadow-sm backdrop-blur">
      <div className="mx-auto max-w-6xl px-4">
        <div className="flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center gap-2 transition-opacity hover:opacity-80">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-primary/10 bg-surface-3 text-accent">
              <Atom size={22} />
            </div>
            <div className="hidden sm:block">
              <div className="text-[0.7rem] font-semibold uppercase tracking-[0.2em] text-accent">Xiamen University Malaysia</div>
              <div className="text-base font-bold leading-tight text-primary font-serif">Department of Physics</div>
            </div>
          </Link>

          <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-text">
            <Link href="/about" className="transition-colors hover:text-accent">About</Link>
            <Link href="/faculty" className="transition-colors hover:text-accent">Faculty</Link>
            <Link href="/category/Events" className="transition-colors hover:text-accent">Talks</Link>
            <Link href="/category/News" className="transition-colors hover:text-accent">News</Link>
            <Link href="/category/Students" className="transition-colors hover:text-accent">Students</Link>
          </nav>

          <form onSubmit={handleSubmit} className="relative hidden sm:block">
            <label htmlFor="navbar-search" className="sr-only">
              Search posts
            </label>
            <input
              id="navbar-search"
              type="text"
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="Search posts..."
              className="w-56 rounded-full border border-border bg-surface-2 py-2 pl-4 pr-10 text-sm text-text shadow-sm focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
            />
            <button
              type="submit"
              aria-label="Search"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted transition-colors hover:text-accent"
            >
              <Search size={16} />
            </button>
            {query.trim().length >= 2 && (
              <div className="surface-elevated absolute right-0 top-[calc(100%+0.75rem)] w-80 overflow-hidden rounded-3xl bg-surface">
                {results.length > 0 ? (
                  <ul className="py-2">
                    {results.map(result => (
                      <li key={result.slug}>
                        <button
                          type="button"
                          onClick={() => handleResultClick(result.slug)}
                          className="block w-full px-4 py-3 text-left transition-colors hover:bg-surface-2"
                        >
                          {result.category && <div className="eyebrow mb-1 text-[10px]">{result.category}</div>}
                          <div className="text-sm font-medium leading-snug text-text">{result.title}</div>
                        </button>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div className="px-4 py-4 text-sm text-muted">No matching posts.</div>
                )}
              </div>
            )}
          </form>

          <button
            type="button"
            className="text-muted hover:text-text md:hidden"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          >
            {menuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {menuOpen && (
          <div id="mobile-menu" className="border-t border-border/70 py-3 md:hidden">
            <nav className="mb-3 flex flex-col gap-2 text-sm font-medium text-text">
              <Link href="/about" className="py-1 hover:text-accent" onClick={() => setMenuOpen(false)}>About</Link>
              <Link href="/faculty" className="py-1 hover:text-accent" onClick={() => setMenuOpen(false)}>Faculty</Link>
              <Link href="/category/Events" className="py-1 hover:text-accent" onClick={() => setMenuOpen(false)}>Talks</Link>
              <Link href="/category/News" className="py-1 hover:text-accent" onClick={() => setMenuOpen(false)}>News</Link>
              <Link href="/category/Students" className="py-1 hover:text-accent" onClick={() => setMenuOpen(false)}>Students</Link>
            </nav>
            <form onSubmit={handleSubmit} className="relative">
              <label htmlFor="mobile-navbar-search" className="sr-only">
                Search posts
              </label>
              <input
                id="mobile-navbar-search"
                type="text"
                value={query}
                onChange={e => setQuery(e.target.value)}
                placeholder="Search posts..."
                className="w-full rounded-full border border-border bg-surface-2 py-2.5 pl-4 pr-10 text-sm text-text focus:outline-none focus:ring-2 focus:ring-accent"
              />
              <button
                type="submit"
                aria-label="Search"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted"
              >
                <Search size={16} />
              </button>
              {query.trim().length >= 2 && (
                <div className="surface-elevated mt-2 overflow-hidden rounded-3xl bg-surface">
                  {results.length > 0 ? (
                    <ul className="py-2">
                      {results.map(result => (
                        <li key={result.slug}>
                          <button
                            type="button"
                            onClick={() => handleResultClick(result.slug)}
                            className="block w-full px-4 py-3 text-left transition-colors hover:bg-surface-2"
                          >
                            {result.category && <div className="eyebrow mb-1 text-[10px]">{result.category}</div>}
                            <div className="text-sm font-medium leading-snug text-text">{result.title}</div>
                          </button>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <div className="px-4 py-3 text-sm text-muted">No matching posts.</div>
                  )}
                </div>
              )}
            </form>
          </div>
        )}
      </div>
    </header>
  );
}
