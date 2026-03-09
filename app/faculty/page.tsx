import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import TagBadge from '@/components/TagBadge';
import { getAllPosts } from '@/lib/posts';
import Image from 'next/image';
import Link from 'next/link';
import FacultyEmailLink from '@/components/FacultyEmailLink';
import type { Metadata } from 'next';
import { absoluteUrl } from '@/lib/site';
import ParticleFallback from '@/components/ParticleFallback';

export const metadata: Metadata = {
  title: 'Faculty',
  description: 'Meet the faculty of the Department of Physics at Xiamen University Malaysia — their research areas, profiles, and contact information.',
  alternates: {
    canonical: '/faculty',
  },
  openGraph: {
    title: 'Faculty',
    description: 'Meet the faculty of the Department of Physics at Xiamen University Malaysia.',
    images: [
      {
        url: absoluteUrl('/images/lab/Labpic18.png'),
        alt: 'XMUM Physics laboratories',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    images: [absoluteUrl('/images/lab/Labpic18.png')],
  },
};

// Strip the "Staff Profile: " prefix to get just the person's name
function extractName(title: string): string {
  return title.replace(/^Staff Profile:\s*/i, '');
}

// Return only physics-area tags (exclude meta-tags like "staff")
const META_TAGS = new Set(['staff', 'research', 'education', 'department', 'experimental', 'theoretical', 'computational-physics', 'biophysics', 'plasma', 'astrophysics']);

function physicsAreaTags(tags: string[]): string[] {
  return tags.filter(t => !META_TAGS.has(t));
}

export default function FacultyPage() {
  const faculty = getAllPosts({ published: true, category: 'Staff' });
  const researchAreas = new Set(faculty.flatMap(member => physicsAreaTags(member.tags)).map(tag => tag.split('/')[0]));

  return (
    <>
      <Navbar />
      <main id="main-content" className="flex-1">
        <div className="page-header">
          <div className="page-header__inner">
            <p className="eyebrow">Faculty</p>
            <h1 className="section-title mt-3">Faculty and research leadership.</h1>
            <p className="section-kicker">Browse the academics shaping teaching, publications, talks, and interdisciplinary research across XMUM Physics.</p>
            <div className="mt-6 flex flex-wrap gap-3">
              <span className="rounded-full border border-primary/10 bg-white px-3 py-1 text-sm font-medium text-primary shadow-sm">{faculty.length} faculty members</span>
              <span className="rounded-full border border-primary/10 bg-white px-3 py-1 text-sm font-medium text-primary shadow-sm">{researchAreas.size} top-level research areas</span>
              <span className="rounded-full border border-primary/10 bg-white px-3 py-1 text-sm font-medium text-primary shadow-sm">Theory and experiment</span>
            </div>
          </div>
        </div>

        <div className="section-shell section-space">
          <div className="mb-8 max-w-3xl">
            <p className="text-sm leading-relaxed text-muted">Tags below indicate broad research areas associated with each profile and are meant to help first-time visitors navigate the department’s academic strengths.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {faculty.map(member => {
              const name = extractName(member.title);
              const areaTags = physicsAreaTags(member.tags);
              return (
                <Link
                  key={member.slug}
                  href={`/blog/${member.slug}`}
                  className="group flex flex-col overflow-hidden rounded-[1.8rem] border border-border bg-surface shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl hover:shadow-primary/8"
                >
                  {/* Photo */}
                  <div className="relative aspect-[4/4.6] w-full overflow-hidden bg-surface-2">
                    {member.cover_image ? (
                      <Image
                        src={member.cover_image}
                        alt={name}
                        fill
                        className={`object-cover transition-transform duration-500 group-hover:scale-105 ${
                          member.portrait_focus === 'top'
                            ? 'object-top'
                            : member.portrait_focus === 'bottom'
                              ? 'object-bottom'
                              : 'object-center'
                        }`}
                      />
                    ) : (
                      <ParticleFallback className="h-full" size={78} imageClassName="drop-shadow-xl" />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-primary/8 via-transparent to-transparent" />
                  </div>

                  {/* Info */}
                  <div className="flex flex-1 flex-col p-5">
                    <h2 className="text-lg font-semibold text-text font-serif leading-snug transition-colors group-hover:text-accent">
                      {name}
                    </h2>
                    {areaTags.length > 0 && (
                      <div className="mt-4 flex flex-wrap gap-1.5">
                        {areaTags.slice(0, 3).map(tag => (
                          <TagBadge key={tag} tag={tag} clickable={false} />
                        ))}
                      </div>
                    )}
                    {member.email && <FacultyEmailLink email={member.email} name={name} />}
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
