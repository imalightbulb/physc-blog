'use client';

import ReactMarkdown, { type Components } from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import rehypeHighlight from 'rehype-highlight';
import rehypeSlug from 'rehype-slug';
import rehypeKatex from 'rehype-katex';

interface PostContentProps {
  content: string;
}

const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '';

// Custom renderers
const components: Components = {
  // Prepend basePath to absolute image paths so static-export deploys work correctly
  img(props) {
    const src = typeof props.src === 'string' ? props.src : undefined;
    const resolvedSrc = src?.startsWith('/') ? basePath + src : src;
    // eslint-disable-next-line @next/next/no-img-element
    return (
      <img
        src={resolvedSrc}
        alt={props.alt || ''}
        className="rounded-lg max-w-full my-6 mx-auto block shadow-sm border border-gray-100"
      />
    );
  },
};

export default function PostContent({ content }: PostContentProps) {
  return (
    <div className="prose prose-lg max-w-none prose-headings:font-serif prose-headings:text-gray-900 prose-a:text-blue-600 prose-code:text-blue-800 prose-code:bg-blue-50 prose-code:px-1 prose-code:py-0.5 prose-code:rounded prose-code:before:content-none prose-code:after:content-none prose-pre:bg-gray-900 prose-pre:text-gray-100">
      <ReactMarkdown
        remarkPlugins={[remarkGfm, remarkMath]}
        rehypePlugins={[rehypeHighlight, rehypeSlug, rehypeKatex]}
        components={components}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
