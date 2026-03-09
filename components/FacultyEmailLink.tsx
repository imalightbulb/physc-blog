'use client';

import { Mail } from 'lucide-react';

interface Props {
  email: string;
  name: string;
}

export default function FacultyEmailLink({ email, name }: Props) {
  return (
    <a
      href={`mailto:${email}`}
      onClick={e => e.stopPropagation()}
      className="mt-auto pt-4 flex items-center gap-1.5 text-xs text-muted hover:text-accent transition-colors"
      aria-label={`Email ${name}`}
    >
      <Mail size={13} />
      {email}
    </a>
  );
}
