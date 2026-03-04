import Link from 'next/link';
import { Atom } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-[#1a3a6b] text-white mt-16">
      <div className="max-w-6xl mx-auto px-4 py-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Atom size={22} />
              <span className="font-bold font-serif text-lg">XMUM Physics</span>
            </div>
            <p className="text-blue-200 text-sm leading-relaxed">
              The Department of Physics at Xiamen University Malaysia, dedicated to excellence in teaching and research.
            </p>
          </div>

          <div>
            <h3 className="font-semibold mb-3 text-blue-100">Quick Links</h3>
            <ul className="space-y-1.5 text-sm text-blue-200">
              <li><Link href="/" className="hover:text-white transition-colors">Home</Link></li>
              <li><Link href="/blog" className="hover:text-white transition-colors">Blog</Link></li>
              <li><Link href="/category/Research" className="hover:text-white transition-colors">Research</Link></li>
              <li><Link href="/category/Education" className="hover:text-white transition-colors">Education</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-3 text-blue-100">Contact</h3>
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

        <div className="border-t border-blue-800 mt-8 pt-6 text-center text-sm text-blue-300">
          <p>© {new Date().getFullYear()} XMUM Physics Department. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
