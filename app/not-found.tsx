import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function NotFound() {
  return (
    <>
      <Navbar />
      <main id="main-content" className="flex-1">
        <section className="max-w-4xl mx-auto px-4 py-20 text-center">
          <p className="text-sm font-semibold tracking-wide uppercase text-blue-600 mb-3">404</p>
          <h1 className="text-4xl font-bold font-serif text-gray-900 mb-4">Page not found</h1>
          <p className="text-gray-600 mb-8">
            The page you requested does not exist or may have moved.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/"
              className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors"
            >
              Go Home
            </Link>
            <Link
              href="/blog"
              className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Browse Blog
            </Link>
            <Link
              href="/search"
              className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Search Posts
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}

