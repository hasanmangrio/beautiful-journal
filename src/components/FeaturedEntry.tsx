import Link from 'next/link';
import Image from 'next/image';
import { Entry, formatDate } from '@/lib/entries';

interface FeaturedEntryProps {
  entry: Entry;
}

export default function FeaturedEntry({ entry }: FeaturedEntryProps) {
  return (
    <article className="flex flex-col">
      {/* Category */}
      <div className="mb-3">
        <span className="category-pill text-xs">{entry.category}</span>
      </div>

      {/* Title */}
      <Link href={`/entries/${entry.slug}`}>
        <h1
          className="font-serif leading-tight mb-3 hover:opacity-75 transition-opacity"
          style={{
            fontSize: 'clamp(2rem, 3.5vw, 3rem)',
            fontWeight: 700,
            color: 'var(--ink)',
          }}
        >
          {entry.title}
        </h1>
      </Link>

      {/* Meta */}
      <p className="font-sans text-sm mb-5" style={{ color: 'var(--ink-light)' }}>
        {formatDate(entry.date)}
      </p>

      {/* Cover image */}
      <Link href={`/entries/${entry.slug}`} className="block mb-5 overflow-hidden rounded-sm">
        <div className="relative w-full" style={{ paddingBottom: '60%' }}>
          <Image
            src={entry.coverImage}
            alt={entry.title}
            fill
            className="object-cover transition-transform duration-500 hover:scale-105"
            sizes="(max-width: 768px) 100vw, 60vw"
            priority
          />
        </div>
      </Link>

      {/* Excerpt */}
      <p
        className="font-serif text-lg leading-relaxed mb-5"
        style={{ color: 'var(--ink-light)', fontStyle: 'italic' }}
      >
        {entry.excerpt}
      </p>

      <Link
        href={`/entries/${entry.slug}`}
        className="font-sans text-sm font-semibold underline underline-offset-4"
        style={{ color: 'var(--ink)' }}
      >
        Read the full entry →
      </Link>
    </article>
  );
}
