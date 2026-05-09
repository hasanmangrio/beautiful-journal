import Link from 'next/link';
import Image from 'next/image';
import { Entry, formatDate } from '@/lib/entries';

interface EntryCardProps {
  entry: Entry;
  size?: 'sm' | 'md';
}

export default function EntryCard({ entry, size = 'md' }: EntryCardProps) {
  return (
    <article className="flex flex-col gap-2">
      <Link href={`/entries/${entry.slug}`} className="block overflow-hidden rounded-sm">
        <div className="relative w-full" style={{ paddingBottom: size === 'sm' ? '65%' : '70%' }}>
          <Image
            src={entry.coverImage}
            alt={entry.title}
            fill
            className="object-cover transition-transform duration-500 hover:scale-105"
            sizes="(max-width: 768px) 100vw, 25vw"
          />
        </div>
      </Link>

      <div className="flex items-center gap-2 mt-1">
        <span className="category-pill" style={{ fontSize: '0.75rem', padding: '3px 10px' }}>
          {entry.category}
        </span>
      </div>

      <Link href={`/entries/${entry.slug}`}>
        <h3
          className="font-serif font-bold leading-snug hover:opacity-70 transition-opacity"
          style={{
            fontSize: size === 'sm' ? '1rem' : '1.125rem',
            color: 'var(--ink)',
          }}
        >
          {entry.title}
        </h3>
      </Link>

      <p className="font-sans text-xs" style={{ color: 'var(--ink-light)' }}>
        {formatDate(entry.date)}
      </p>
    </article>
  );
}
