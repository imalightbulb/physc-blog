'use client';

import { useEffect, useState } from 'react';
import {
  collection, addDoc, onSnapshot,
  orderBy, query, serverTimestamp, deleteDoc, doc,
} from 'firebase/firestore';
import { signInWithPopup, signOut, onAuthStateChanged, type User } from 'firebase/auth';
import { db, auth, googleProvider } from '@/lib/firebase';
import { LogOut, Trash2, Send, MessageSquare } from 'lucide-react';

interface Comment {
  id: string;
  userId: string;
  displayName: string;
  photoURL: string | null;
  text: string;
  createdAt: Date | null;
}

interface Props {
  slug: string;
}

export default function Comments({ slug }: Props) {
  const [user, setUser] = useState<User | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [text, setText] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, setUser);
    return unsub;
  }, []);

  useEffect(() => {
    const q = query(
      collection(db, 'comments', slug, 'entries'),
      orderBy('createdAt', 'asc'),
    );
    const unsub = onSnapshot(q, snap => {
      setComments(snap.docs.map(d => ({
        id: d.id,
        userId: d.data().userId,
        displayName: d.data().displayName,
        photoURL: d.data().photoURL ?? null,
        text: d.data().text,
        createdAt: d.data().createdAt?.toDate() ?? null,
      })));
    });
    return unsub;
  }, [slug]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!text.trim() || !user) return;
    setSubmitting(true);
    try {
      await addDoc(collection(db, 'comments', slug, 'entries'), {
        userId: user.uid,
        displayName: user.displayName ?? 'Anonymous',
        photoURL: user.photoURL ?? null,
        text: text.trim(),
        createdAt: serverTimestamp(),
      });
      setText('');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section className="mt-12 border-t border-border pt-10">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="flex items-center gap-2 text-xl font-semibold text-text font-serif">
          <MessageSquare size={20} className="text-accent" />
          Questions &amp; Comments
          {comments.length > 0 && (
            <span className="ml-1 text-base font-normal text-muted">({comments.length})</span>
          )}
        </h2>
        {user && (
          <button
            onClick={() => signOut(auth)}
            className="flex items-center gap-1.5 text-xs text-muted hover:text-text transition-colors"
          >
            <LogOut size={13} /> Sign out
          </button>
        )}
      </div>

      {/* Comment list */}
      <div className="space-y-3 mb-6">
        {comments.length === 0 && (
          <p className="py-4 text-sm text-muted">No comments yet — be the first to ask a question!</p>
        )}
        {comments.map(c => (
          <div key={c.id} className="surface-muted flex gap-3 rounded-[1.25rem] p-4">
            {c.photoURL ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={c.photoURL}
                alt={c.displayName}
                referrerPolicy="no-referrer"
                className="h-9 w-9 flex-shrink-0 rounded-full object-cover"
              />
            ) : (
              <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-accent-soft text-sm font-bold text-accent">
                {c.displayName[0]?.toUpperCase()}
              </div>
            )}
            <div className="min-w-0 flex-1">
              <div className="mb-1 flex items-start justify-between gap-2">
                <div>
                  <span className="text-sm font-semibold text-text">{c.displayName}</span>
                  {c.createdAt && (
                    <span className="ml-2 text-xs text-muted">
                      {c.createdAt.toLocaleDateString('en-MY', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </span>
                  )}
                </div>
                {user?.uid === c.userId && (
                  <button
                    onClick={() => deleteDoc(doc(db, 'comments', slug, 'entries', c.id))}
                    className="flex-shrink-0 text-muted hover:text-red-500 transition-colors"
                    aria-label="Delete comment"
                  >
                    <Trash2 size={13} />
                  </button>
                )}
              </div>
              <p className="text-sm leading-relaxed text-text whitespace-pre-wrap">{c.text}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Input */}
      {user ? (
        <form onSubmit={handleSubmit} className="surface-elevated rounded-[1.5rem] p-4">
          <div className="mb-3 flex items-center gap-2">
            {user.photoURL ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={user.photoURL} alt={user.displayName ?? ''} referrerPolicy="no-referrer" className="h-7 w-7 rounded-full" />
            ) : (
              <div className="flex h-7 w-7 items-center justify-center rounded-full bg-accent-soft text-xs font-bold text-accent">
                {user.displayName?.[0]?.toUpperCase()}
              </div>
            )}
            <span className="text-sm font-medium text-text">{user.displayName}</span>
          </div>
          <textarea
            value={text}
            onChange={e => setText(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) handleSubmit(e as unknown as React.FormEvent); }}
            placeholder="Ask a question or leave a comment… (Ctrl+Enter to send)"
            rows={3}
            className="w-full resize-none rounded-xl border border-border bg-bg p-3 text-sm text-text placeholder:text-muted focus:border-accent focus:outline-none"
          />
          <div className="mt-2 flex justify-end">
            <button
              type="submit"
              disabled={submitting || !text.trim()}
              className="flex items-center gap-2 rounded-full bg-accent px-4 py-2 text-sm font-semibold text-white transition-opacity disabled:opacity-50"
            >
              <Send size={13} /> Post
            </button>
          </div>
        </form>
      ) : (
        <div className="surface-muted rounded-[1.5rem] p-6 text-center">
          <p className="mb-4 text-sm text-muted">Sign in with Google to leave a comment or ask a question.</p>
          <button
            onClick={() => signInWithPopup(auth, googleProvider)}
            className="inline-flex items-center gap-2.5 rounded-full border border-border bg-surface px-5 py-2.5 text-sm font-semibold text-text shadow-sm transition-shadow hover:shadow-md"
          >
            {/* Google logo */}
            <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden="true">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            Continue with Google
          </button>
        </div>
      )}
    </section>
  );
}
