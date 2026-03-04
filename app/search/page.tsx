import { Suspense } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import SearchClient from '@/components/SearchClient';
import { getAllPosts } from '@/lib/posts';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Search',
  alternates: {
    canonical: '/search',
  },
};

export default function SearchPage() {
  const allPosts = getAllPosts({ published: true });

  return (
    <>
      <Navbar />
      <main id="main-content" className="flex-1">
        <Suspense>
          <SearchClient allPosts={allPosts} />
        </Suspense>
      </main>
      <Footer />
    </>
  );
}
