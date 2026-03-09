import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import HeroSection from '@/components/HeroSection';
import BlogCard from '@/components/BlogCard';
import { getAllPosts } from '@/lib/posts';
import type { Metadata } from 'next';
import Link from 'next/link';
import ParticleFallback from '@/components/ParticleFallback';
import { ArrowRight } from 'lucide-react';

export const metadata: Metadata = {
  alternates: {
    canonical: '/',
  },
};

export default function HomePage() {
  const allPosts = getAllPosts({ published: true });
  const featuredPost = allPosts.find(p => p.featured) ?? allPosts[0];
  const latestPosts = allPosts.filter(p => p.slug !== featuredPost?.slug).slice(0, 9);
  const faculty = allPosts.filter(p => p.category === 'Staff');
  const researchAreas = new Set(
    faculty.flatMap(post => post.tags)
      .filter(tag => tag !== 'staff' && !['experimental', 'theoretical', 'computational-physics', 'biophysics', 'plasma'].includes(tag))
      .map(tag => tag.split('/')[0])
  );
  const quickStats = [
    `${faculty.length} faculty`,
    `${researchAreas.size} research areas`,
    'Est. 2016',
  ];
  const highlightPosts = latestPosts.slice(0, 5);

  return (
    <>
      <Navbar />
      <main id="main-content" className="flex-1">
        <HeroSection featuredPost={featuredPost} />

        <section className="border-b border-border bg-surface-2/70">
          <div className="section-shell flex flex-col gap-6 py-7 md:flex-row md:items-center md:justify-between">
            <div className="max-w-3xl animate-slide-up">
              <p className="eyebrow">Department Overview</p>
              <p className="mt-3 text-base leading-relaxed text-text md:text-lg">
                XMUM Physics brings together internationally trained faculty, interdisciplinary research, and industry-relevant training in fundamental and applied physics.
              </p>
            </div>
            <div className="flex flex-col gap-3 md:items-end">
              <div className="flex flex-wrap gap-2">
                {quickStats.map(stat => (
                  <span
                    key={stat}
                    className="animate-scale-in rounded-full border border-primary/10 bg-white px-3 py-1 text-sm font-medium text-primary shadow-sm"
                  >
                    {stat}
                  </span>
                ))}
              </div>
              <div className="flex flex-wrap gap-3 text-sm font-semibold">
                <Link href="/about" className="rounded-full bg-primary px-4 py-2 text-white transition-colors hover:bg-primary-deep">
                  About the Department
                </Link>
                <Link href="/faculty" className="rounded-full border border-border px-4 py-2 text-primary transition-colors hover:border-accent hover:text-accent">
                  Meet the Faculty
                </Link>
              </div>
            </div>
          </div>
        </section>


        <section className="section-space pt-0">
          <div className="section-shell">
          {latestPosts.length > 0 && (
            <section>
              <div className="mb-9 max-w-3xl">
                <p className="eyebrow">Latest</p>
                <h2 className="mt-3 text-3xl font-bold text-text font-serif">Latest posts from the department.</h2>
                <p className="section-kicker">Recent stories, research highlights, faculty news, student experiences, and invited talks from XMUM Physics.</p>
              </div>
              <div className="card-grid grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                {highlightPosts.map((post, index) => (
                  <BlogCard key={post.slug} post={post} variant={index === 0 ? 'featured' : 'default'} />
                ))}
              </div>
            </section>
          )}

          <section className="surface-muted mt-12 rounded-[2rem] p-8 md:flex md:items-center md:justify-between md:gap-8">
            <div className="max-w-2xl">
              <p className="eyebrow mb-3">Department Gateway</p>
              <h2 className="text-3xl font-bold text-text font-serif">Start with the people, then follow the work.</h2>
              <p className="mt-3 text-sm leading-relaxed text-muted">Use the faculty directory to map research strengths, then browse category and tag pages to move through talks, news, and publications.</p>
            </div>
            <div className="mt-6 flex flex-wrap gap-3 md:mt-0">
              <Link href="/faculty" className="rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-primary-deep">Faculty Directory</Link>
              <Link href="/category/News" className="rounded-full border border-border px-5 py-2.5 text-sm font-semibold text-primary transition-colors hover:border-accent hover:text-accent">Department News</Link>
            </div>
          </section>

          {allPosts.length === 0 && (
            <div className="py-20 text-center text-muted">
              <ParticleFallback className="mb-4" size={92} tone="muted" />
              <p className="text-xl text-text">No posts yet. Check back soon.</p>
            </div>
          )}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
