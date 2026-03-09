import Link from 'next/link';
import { formatTagLabel } from '@/lib/tags';

interface TagBadgeProps {
  tag: string;
  clickable?: boolean;
}

export default function TagBadge({ tag, clickable = true }: TagBadgeProps) {
  const { primary, secondary } = formatTagLabel(tag);
  const badge = (
    <span className="inline-flex items-center gap-1 rounded-full border border-primary/10 bg-surface-3 px-2.5 py-1 text-[11px] font-medium uppercase tracking-[0.08em] text-primary transition-colors hover:border-accent/25 hover:bg-accent-soft/75">
      <span className="font-semibold">#{primary}</span>
      {secondary && (
        <>
          <span className="text-muted/65">/</span>
          <span className="normal-case tracking-normal text-accent">{secondary}</span>
        </>
      )}
    </span>
  );

  if (clickable) {
    return (
      <Link href={`/tag/${tag}`} aria-label={`View posts tagged ${tag}`}>
        {badge}
      </Link>
    );
  }

  return badge;
}
