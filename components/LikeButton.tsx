'use client';

import { useEffect, useState } from 'react';
import { doc, getDoc, runTransaction } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Heart } from 'lucide-react';

interface Props {
  slug: string;
}

export default function LikeButton({ slug }: Props) {
  const [count, setCount] = useState<number | null>(null);
  const [liked, setLiked] = useState(false);
  const [loading, setLoading] = useState(false);

  const storageKey = `liked:${slug}`;

  useEffect(() => {
    setLiked(!!localStorage.getItem(storageKey));
    getDoc(doc(db, 'likes', slug)).then(snap => {
      setCount(snap.exists() ? (snap.data().count ?? 0) : 0);
    });
  }, [slug, storageKey]);

  async function handleLike() {
    if (liked || loading) return;
    setLoading(true);
    try {
      await runTransaction(db, async tx => {
        const ref = doc(db, 'likes', slug);
        const snap = await tx.get(ref);
        tx.set(ref, { count: (snap.exists() ? (snap.data().count ?? 0) : 0) + 1 });
      });
      localStorage.setItem(storageKey, '1');
      setLiked(true);
      setCount(c => (c ?? 0) + 1);
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      onClick={handleLike}
      disabled={liked || loading}
      className={`flex items-center gap-2 rounded-full border px-4 py-1.5 text-sm font-medium transition-all ${
        liked
          ? 'border-red-200 bg-red-50 text-red-500 cursor-default'
          : 'border-border bg-surface text-muted hover:border-red-300 hover:text-red-500'
      }`}
      aria-label={liked ? 'You liked this post' : 'Like this post'}
    >
      <Heart size={15} className={liked ? 'fill-current' : ''} />
      {count !== null ? count : '—'}
    </button>
  );
}
