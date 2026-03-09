import { Suspense } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import CategoryClient from '@/components/CategoryClient';
import { getAllPosts, getAllCategories } from '@/lib/posts';
import type { Metadata } from 'next';

// Human-readable display names for each category
const DISPLAY_NAMES: Record<string, string> = {
  Events: 'Talks',
  News: 'News',
  Students: 'Students',
  Staff: 'Staff',
  Research: 'Research',
  Department: 'Department',
};

const HIDDEN_CATEGORIES = new Set(['Research']);

export async function generateStaticParams() {
  const categories = getAllCategories().filter(c => !HIDDEN_CATEGORIES.has(c));
  return categories.map(c => ({ name: c }));
}

interface Props {
  params: Promise<{ name: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { name } = await params;
  const category = decodeURIComponent(name);
  const display = DISPLAY_NAMES[category] ?? category;
  return {
    title: display,
    alternates: {
      canonical: `/category/${encodeURIComponent(category)}`,
    },
  };
}

export default async function CategoryPage({ params }: Props) {
  const { name } = await params;
  const category = decodeURIComponent(name);
  const posts = getAllPosts({ published: true, category });
  const displayName = DISPLAY_NAMES[category] ?? category;

  return (
    <>
      <Navbar />
      <main id="main-content" className="flex-1">
        <Suspense fallback={
          <div className="border-b border-border bg-surface py-8">
            <div className="max-w-6xl mx-auto px-4">
              <h1 className="text-3xl font-bold text-text font-serif">{displayName}</h1>
            </div>
          </div>
        }>
          <CategoryClient posts={posts} category={category} displayName={displayName} />
        </Suspense>
      </main>
      <Footer />
    </>
  );
}
