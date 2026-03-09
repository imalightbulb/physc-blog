import Link from 'next/link';
import Image from 'next/image';
import { format } from 'date-fns';
import { ArrowRight, GraduationCap, Microscope, Users2 } from 'lucide-react';
import type { Post } from '@/lib/posts';
import ParticleFallback from './ParticleFallback';

interface HeroSectionProps {
  featuredPost?: Post | null;
}

export default function HeroSection({ featuredPost }: HeroSectionProps) {
  if (featuredPost) {
    const formattedDate = format(new Date(featuredPost.date), 'MMMM d, yyyy');

    return (
      <section className="relative overflow-hidden bg-primary text-white">
        <div className="absolute inset-0">
          {featuredPost.cover_image ? (
            <Image
              src={featuredPost.cover_image}
              alt={featuredPost.title}
              fill
              className="object-cover opacity-20"
              priority
            />
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-primary to-primary-deep" />
          )}
          <div className="absolute left-[-8rem] top-10 h-56 w-56 rounded-full bg-accent/20 blur-3xl animate-drift" />
          <div className="absolute bottom-[-5rem] right-[-3rem] h-72 w-72 rounded-full bg-white/10 blur-3xl" />
          <div className="absolute inset-0 bg-gradient-to-t from-primary via-primary/85 to-transparent" />
        </div>

        <div className="relative mx-auto grid max-w-6xl gap-8 px-4 py-20 md:grid-cols-[minmax(0,1.4fr)_20rem] md:items-end md:py-24">
          <Link
            href={`/blog/${featuredPost.slug}`}
            className="group block max-w-3xl cursor-pointer rounded-[2rem] border border-white/15 bg-white/7 p-7 backdrop-blur-sm transition duration-300 hover:-translate-y-1 hover:bg-white/10 focus-visible:bg-white/10 animate-fade-in"
            aria-label={`Read featured article: ${featuredPost.title}`}
          >
            <div className="mb-4">
              <span className="eyebrow !text-accent-soft">XMUM Physics Journal</span>
            </div>
            <div className="flex items-center gap-2 mb-4">
              <span className="rounded-full bg-accent px-3 py-1 text-xs font-bold uppercase tracking-[0.2em] text-white shadow-lg shadow-accent/30">
                Featured
              </span>
              {featuredPost.category && (
                <span className="text-sm text-accent-soft">{featuredPost.category}</span>
              )}
            </div>
            <h1 className="mb-5 max-w-2xl text-4xl font-bold leading-[1.05] font-serif underline decoration-white/35 underline-offset-6 transition-colors group-hover:text-accent-soft md:text-[3.6rem]">
              {featuredPost.title}
            </h1>
            {featuredPost.excerpt && (
              <p className="mb-6 max-w-xl text-lg leading-relaxed text-blue-100">
                {featuredPost.excerpt}
              </p>
            )}
            <div className="mb-6 flex items-center gap-4 text-sm text-blue-200">
              <span>{featuredPost.author}</span>
              <span>·</span>
              <span>{formattedDate}</span>
            </div>
            <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white px-5 py-2.5 font-semibold text-primary transition-transform duration-300 group-hover:translate-x-1">
              Read Article
              <ArrowRight size={16} />
            </span>
          </Link>
          <div className="surface-muted hidden rounded-[2rem] p-5 text-primary md:block animate-slide-up">
            <p className="eyebrow mb-3">Quick Paths</p>
            <div className="space-y-3">
              <Link href="/about" className="flex items-start gap-3 rounded-2xl bg-white/85 p-3 transition hover:translate-x-1">
                <GraduationCap size={18} className="mt-0.5 text-accent" />
                <div>
                  <div className="text-sm font-semibold">Study Physics</div>
                  <div className="text-xs leading-relaxed text-muted">Programme structure, outcomes, and facilities.</div>
                </div>
              </Link>
              <Link href="/faculty" className="flex items-start gap-3 rounded-2xl bg-white/85 p-3 transition hover:translate-x-1">
                <Users2 size={18} className="mt-0.5 text-accent" />
                <div>
                  <div className="text-sm font-semibold">Meet the Faculty</div>
                  <div className="text-xs leading-relaxed text-muted">Research strengths and staff profiles.</div>
                </div>
              </Link>
              <Link href="/category/Research" className="flex items-start gap-3 rounded-2xl bg-white/85 p-3 transition hover:translate-x-1">
                <Microscope size={18} className="mt-0.5 text-accent" />
                <div>
                  <div className="text-sm font-semibold">Research and Talks</div>
                  <div className="text-xs leading-relaxed text-muted">Browse publications, seminars, and updates.</div>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="border-b-4 border-accent bg-gradient-to-br from-primary to-primary-deep text-white">
      <div className="mx-auto max-w-6xl px-4 py-20 text-center animate-fade-in">
        <ParticleFallback className="mb-4" size={96} imageClassName="drop-shadow-2xl" tone="hero" />
        <h1 className="text-4xl md:text-5xl font-bold mb-4 font-serif">
          XMUM Physics Department
        </h1>
        <p className="text-xl text-blue-200 max-w-2xl mx-auto mb-8">
          Exploring the fundamental laws of nature — from quantum mechanics to astrophysics.
          Insights from our faculty and students.
        </p>
        <Link
          href="/blog"
          className="inline-flex items-center gap-2 rounded-lg bg-white px-8 py-3 font-semibold text-primary transition-colors hover:bg-blue-50"
        >
          Browse All Posts →
        </Link>
      </div>
    </section>
  );
}
