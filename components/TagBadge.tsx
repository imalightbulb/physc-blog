import Link from 'next/link';

interface TagBadgeProps {
  tag: string;
  clickable?: boolean;
}

export default function TagBadge({ tag, clickable = true }: TagBadgeProps) {
  const badge = (
    <span className="inline-block px-2 py-0.5 text-xs font-medium rounded-full bg-blue-50 text-blue-700 border border-blue-200 hover:bg-blue-100 transition-colors">
      #{tag}
    </span>
  );

  if (clickable) {
    return (
      <Link href={`/tag/${encodeURIComponent(tag)}`}>
        {badge}
      </Link>
    );
  }

  return badge;
}
