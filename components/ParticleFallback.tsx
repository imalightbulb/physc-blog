import Image from 'next/image';

interface ParticleFallbackProps {
  className?: string;
  imageClassName?: string;
  size?: number;
  tone?: 'default' | 'muted' | 'hero';
}

export default function ParticleFallback({
  className = '',
  imageClassName = '',
  size = 88,
  tone = 'default',
}: ParticleFallbackProps) {
  const toneClass =
    tone === 'hero'
      ? 'bg-white/14'
      : tone === 'muted'
        ? 'bg-primary/6'
        : 'bg-accent/12';

  return (
    <div className={`flex items-center justify-center ${className}`.trim()}>
      <div className="relative">
        <div className={`absolute inset-0 rounded-full blur-2xl ${toneClass}`} />
        <Image
          src="/particle-in-box.svg"
          alt=""
          width={size}
          height={size}
          aria-hidden="true"
          className={`relative opacity-90 ${imageClassName}`.trim()}
        />
      </div>
    </div>
  );
}
