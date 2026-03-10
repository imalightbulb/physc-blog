'use client';

import dynamic from 'next/dynamic';

const LikeButton = dynamic(() => import('./LikeButton'), { ssr: false });
const Comments   = dynamic(() => import('./Comments'),   { ssr: false });

interface Props {
  slug: string;
}

export function PostLikeButton({ slug }: Props) {
  return <LikeButton slug={slug} />;
}

export function PostComments({ slug }: Props) {
  return <Comments slug={slug} />;
}
