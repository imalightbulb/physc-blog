import { notFound } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import PostContent from '@/components/PostContent';
import TableOfContents from '@/components/TableOfContents';
import { getPostBySlug, extractHeadings } from '@/lib/posts';
import Image from 'next/image';
import type { Metadata } from 'next';
import { absoluteUrl } from '@/lib/site';

export const metadata: Metadata = {
  title: 'About the Department',
  description: 'The Department of Physics at Xiamen University Malaysia offers an interdisciplinary physics education with international exposure and collaboration networks.',
  alternates: {
    canonical: '/about',
  },
  openGraph: {
    title: 'About the Department',
    description: 'Learn about the mission, facilities, programmes, and student outcomes of XMUM Physics.',
    images: [
      {
        url: absoluteUrl('/images/about-department/image1.png'),
        alt: 'XMUM Physics Department',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    images: [absoluteUrl('/images/about-department/image1.png')],
  },
};

const LAB_PHOTOS = [
  { src: '/images/lab/Labpic18.png', alt: 'Physics laboratory' },
  { src: '/images/lab/Labpic17.png', alt: 'Lab equipment and setup' },
  { src: '/images/lab/Labpic10.png', alt: 'Research laboratory' },
  { src: '/images/lab/Labpic7.png', alt: 'Experimental physics lab' },
  { src: '/images/lab/Labpic5.png', alt: 'Physics teaching lab' },
  { src: '/images/lab/1727083747708.jpg', alt: 'Department facilities' },
];

export default function AboutPage() {
  const post = getPostBySlug('about-department');
  if (!post) notFound();

  const headings = extractHeadings(post.content);

  return (
    <>
      <Navbar />
      <main id="main-content" className="flex-1">
        {post.cover_image ? (
          <div className="relative h-80 w-full md:h-[26rem]">
            <Image src={post.cover_image} alt={post.title} fill className="object-cover" priority />
            <div className="absolute inset-0 bg-gradient-to-t from-primary via-primary/72 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-6">
              <div className="mx-auto max-w-6xl">
                <p className="eyebrow !text-accent-soft">About XMUM Physics</p>
                <h1 className="mt-3 max-w-3xl text-4xl font-bold text-white font-serif leading-tight md:text-5xl">
                  {post.title}
                </h1>
                <p className="mt-4 max-w-2xl text-sm leading-relaxed text-blue-100 md:text-base">
                  An editorial overview of the department's mission, programmes, facilities, accreditation context, and student outcomes.
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-gradient-to-br from-primary to-primary-deep px-4 py-20">
            <div className="mx-auto max-w-6xl">
              <p className="eyebrow !text-accent-soft">About XMUM Physics</p>
              <h1 className="mt-3 max-w-3xl text-4xl font-bold text-white font-serif leading-tight md:text-5xl">
                {post.title}
              </h1>
              <p className="mt-4 max-w-2xl text-sm leading-relaxed text-blue-100 md:text-base">
                An editorial overview of the department's mission, programmes, facilities, accreditation context, and student outcomes.
              </p>
            </div>
          </div>
        )}

        <div className="section-shell section-space grid gap-10 lg:grid-cols-[14rem_minmax(0,1fr)]">
          <aside className="hidden lg:block">
            {headings.length > 0 ? (
              <TableOfContents headings={headings} />
            ) : (
              <div className="surface-muted sticky top-24 rounded-[1.75rem] p-5">
                <p className="eyebrow mb-3">On This Page</p>
                <ul className="space-y-2 text-sm text-muted">
                  <li>Overview</li>
                  <li>Mission</li>
                  <li>Facilities</li>
                  <li>Outcomes</li>
                  <li>Accreditation</li>
                  <li>Programmes</li>
                </ul>
              </div>
            )}
          </aside>
          <div>
            <div className="surface-elevated animate-fade-in rounded-[2rem] p-6 md:p-10">
              <PostContent content={post.content} />
            </div>

            {/* Lab photo gallery */}
            <div className="mt-10">
              <p className="eyebrow mb-4">Lab &amp; Facilities Gallery</p>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                {LAB_PHOTOS.map(photo => (
                  <div key={photo.src} className="relative aspect-[4/3] overflow-hidden rounded-[1.25rem] bg-surface-2">
                    <Image
                      src={photo.src}
                      alt={photo.alt}
                      fill
                      className="object-cover transition-transform duration-500 hover:scale-105"
                      sizes="(max-width: 640px) 50vw, 33vw"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
