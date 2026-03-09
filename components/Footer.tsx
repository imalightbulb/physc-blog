import { Atom } from 'lucide-react';

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
