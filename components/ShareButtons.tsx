'use client';

import { useState } from 'react';
import { Share2, MessageCircle, Send, Link2, Check } from 'lucide-react';

interface Props {
  url: string;
  title: string;
}

export default function ShareButtons({ url, title }: Props) {
  const [copied, setCopied] = useState(false);

  const encoded = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);

  async function copyLink() {
    await navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="flex items-center gap-1.5 text-xs text-muted uppercase tracking-[0.15em] mr-1">
        <Share2 size={13} /> Share
      </span>
      <a
        href={`https://wa.me/?text=${encodeURIComponent(title + ' — ' + url)}`}
        target="_blank" rel="noopener noreferrer"
        className="flex items-center gap-1.5 rounded-full border border-border bg-surface px-3 py-1.5 text-xs font-medium text-muted transition-colors hover:border-green-400 hover:text-green-600"
        aria-label="Share on WhatsApp"
      >
        <MessageCircle size={13} /> WhatsApp
      </a>
      <a
        href={`https://t.me/share/url?url=${encoded}&text=${encodedTitle}`}
        target="_blank" rel="noopener noreferrer"
        className="flex items-center gap-1.5 rounded-full border border-border bg-surface px-3 py-1.5 text-xs font-medium text-muted transition-colors hover:border-sky-400 hover:text-sky-600"
        aria-label="Share on Telegram"
      >
        <Send size={13} /> Telegram
      </a>
      <a
        href={`https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encoded}`}
        target="_blank" rel="noopener noreferrer"
        className="flex items-center gap-1.5 rounded-full border border-border bg-surface px-3 py-1.5 text-xs font-medium text-muted transition-colors hover:border-neutral-400 hover:text-neutral-800"
        aria-label="Share on X"
      >
        {/* X (formerly Twitter) logo */}
        <svg viewBox="0 0 24 24" className="h-3 w-3 fill-current" aria-hidden="true">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.746l7.73-8.835L1.254 2.25H8.08l4.258 5.63L18.244 2.25zm-1.161 17.52h1.833L7.084 4.126H5.117L17.083 19.77z"/>
        </svg>
        X / Twitter
      </a>
      <button
        onClick={copyLink}
        className="flex items-center gap-1.5 rounded-full border border-border bg-surface px-3 py-1.5 text-xs font-medium text-muted transition-colors hover:border-accent hover:text-accent"
        aria-label="Copy link"
      >
        {copied ? <><Check size={13} className="text-green-500" /> Copied!</> : <><Link2 size={13} /> Copy link</>}
      </button>
    </div>
  );
}
