import { Atom } from 'lucide-react';

// Update these to the department's actual social media profile URLs
const INSTAGRAM_URL = process.env.NEXT_PUBLIC_INSTAGRAM_URL ?? 'https://www.instagram.com/xmumphysics';
const XIAOHONGSHU_URL = process.env.NEXT_PUBLIC_XIAOHONGSHU_URL ?? 'https://www.xiaohongshu.com/user/profile/xmumphysics';

export default function Footer() {
  return (
    <footer className="mt-20 bg-primary text-white">
      <div className="mx-auto max-w-6xl px-4 py-12">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-[1.3fr_0.9fr] md:items-start">
          <div className="max-w-xl">
            <div className="mb-4 flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-white/8">
                <Atom size={22} />
              </div>
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-blue-200">Xiamen University Malaysia</p>
                <span className="font-bold font-serif text-xl">Department of Physics</span>
              </div>
            </div>
            <p className="text-sm leading-relaxed text-blue-100">
              XMUM Physics advances rigorous teaching, interdisciplinary research, and globally connected scientific training for the next generation of physicists.
            </p>

            {/* Social links */}
            <div className="mt-5 flex items-center gap-3">
              <a
                href={INSTAGRAM_URL}
                target="_blank" rel="noopener noreferrer"
                aria-label="Instagram"
                className="flex items-center gap-2 rounded-full border border-white/15 bg-white/8 px-3.5 py-2 text-xs font-medium text-blue-100 transition-colors hover:bg-white/15 hover:text-white"
              >
                {/* Instagram icon */}
                <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current" aria-hidden="true">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
                </svg>
                Instagram
              </a>
              <a
                href={XIAOHONGSHU_URL}
                target="_blank" rel="noopener noreferrer"
                aria-label="小红书 (Xiaohongshu)"
                className="flex items-center gap-2 rounded-full border border-white/15 bg-white/8 px-3.5 py-2 text-xs font-medium text-blue-100 transition-colors hover:bg-white/15 hover:text-white"
              >
                {/* Xiaohongshu "RED" mark icon */}
                <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current" aria-hidden="true">
                  <path d="M19.59 7.28C19.35 5.2 17.8 3.65 15.72 3.41 14.5 3.27 13.25 3.2 12 3.2s-2.5.07-3.72.21C6.2 3.65 4.65 5.2 4.41 7.28 4.27 8.5 4.2 9.75 4.2 12s.07 3.5.21 4.72c.24 2.08 1.79 3.63 3.87 3.87 1.22.14 2.47.21 3.72.21s2.5-.07 3.72-.21c2.08-.24 3.63-1.79 3.87-3.87.14-1.22.21-2.47.21-4.72s-.07-3.5-.21-4.72zM12 16.5a4.5 4.5 0 110-9 4.5 4.5 0 010 9zm4.65-8.1a1.05 1.05 0 110-2.1 1.05 1.05 0 010 2.1zM12 9a3 3 0 100 6 3 3 0 000-6z"/>
                </svg>
                小红书
              </a>
            </div>
          </div>

          <div className="rounded-[1.75rem] border border-white/10 bg-white/7 p-6 backdrop-blur-sm">
            <h3 className="mb-3 text-sm font-semibold uppercase tracking-[0.18em] text-blue-100">Contact</h3>
            <ul className="space-y-1.5 text-sm text-blue-200">
              <li>Xiamen University Malaysia</li>
              <li>Jalan Sunsuria, Bandar Sunsuria</li>
              <li>43900 Sepang, Selangor</li>
              <li className="mt-2">
                <a href="https://www.xmu.edu.my" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">
                  www.xmu.edu.my
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 border-t border-white/10 pt-6 text-center text-sm text-blue-300">
          <p>© {new Date().getFullYear()} XMUM Physics Department. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
