'use client';

import { useEffect, useState } from 'react';

interface Heading {
  id: string;
  text: string;
  level: number;
}

interface TableOfContentsProps {
  headings: Heading[];
}

export default function TableOfContents({ headings }: TableOfContentsProps) {
  const [activeId, setActiveId] = useState<string>('');

  useEffect(() => {
    if (headings.length === 0) return;

    const observer = new IntersectionObserver(
      entries => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        }
      },
      { rootMargin: '-80px 0px -60% 0px', threshold: 0 }
    );

    headings.forEach(h => {
      const el = document.getElementById(h.id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [headings]);

  if (headings.length === 0) return null;

  return (
    <div className="surface-muted sticky top-24 rounded-[1.75rem] p-5">
      <p className="eyebrow mb-3">On This Page</p>
      <nav aria-label="Table of contents">
        <ul className="space-y-1 text-sm">
          {headings.map(h => (
            <li key={h.id} style={{ paddingLeft: h.level === 3 ? '0.875rem' : undefined }}>
              <a
                href={`#${h.id}`}
                className={`block rounded py-0.5 leading-snug transition-colors ${
                  activeId === h.id
                    ? 'font-medium text-accent'
                    : 'text-muted hover:text-text'
                }`}
              >
                {h.text}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
}
