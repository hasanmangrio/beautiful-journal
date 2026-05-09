import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import {
  getAllEntries,
  getEntryBySlugWithNotion,
  formatDate,
} from '@/lib/entries';
import { fetchNotionEntries } from '@/lib/notion';
import EntryCard from '@/components/EntryCard';

interface EntryPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  // Only pre-render local markdown entries at build time;
  // Notion entries are rendered on-demand (ISR via unstable_cache)
  const entries = getAllEntries();
  return entries.map((e) => ({ slug: e.slug }));
}

export async function generateMetadata({ params }: EntryPageProps) {
  const { slug } = await params;
  const entry = await getEntryBySlugWithNotion(slug);
  if (!entry) return {};
  return { title: `${entry.title} — The Daily`, description: entry.excerpt };
}

export default async function EntryPage({ params }: EntryPageProps) {
  const { slug } = await params;
  const entry = await getEntryBySlugWithNotion(slug);
  if (!entry) notFound();

  // Related entries from same category (try Notion + local)
  const [notionEntries, localEntries] = await Promise.all([
    fetchNotionEntries(),
    Promise.resolve(getAllEntries()),
  ]);
  const allEntries = [...notionEntries, ...localEntries];
  const related = allEntries
    .filter((e) => e.slug !== slug && e.category === entry.category)
    .slice(0, 2);

  const paragraphs = entry.content
    .split('\n\n')
    .map((p) => p.trim())
    .filter(Boolean);

  return (
    <article className="max-w-7xl mx-auto px-6 py-10">
      <Link
        href="/"
        className="font-sans text-sm inline-flex items-center gap-1 mb-8"
        style={{ color: 'var(--ink-light)' }}
      >
        ← Back to home
      </Link>

      {/* Article header */}
      <div className="max-w-3xl mb-8">
        <div className="mb-4">
          <span className="category-pill">{entry.category}</span>
        </div>

        <h1
          className="font-serif font-bold leading-tight mb-4"
          style={{ fontSize: 'clamp(2rem, 4vw, 3.25rem)', color: 'var(--ink)' }}
        >
          {entry.title}
        </h1>

        {entry.excerpt && (
          <p
            className="font-serif text-xl leading-relaxed mb-4"
            style={{ color: 'var(--ink-light)', fontStyle: 'italic' }}
          >
            {entry.excerpt}
          </p>
        )}

        <p className="font-sans text-sm" style={{ color: 'var(--ink-light)' }}>
          {formatDate(entry.date)}
        </p>
      </div>

      {/* Hero image */}
      <div
        className="relative w-full mb-10 overflow-hidden rounded-sm"
        style={{ paddingBottom: '42%' }}
      >
        <Image
          src={entry.coverImage}
          alt={entry.title}
          fill
          className="object-cover"
          sizes="100vw"
          priority
          unoptimized={entry.coverImage.includes('notion')}
        />
      </div>

      {/* Two-column: content + sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-12 lg:gap-16">
        <div className="prose-journal max-w-none">
          {paragraphs.map((para, i) => {
            if (para.startsWith('## ')) {
              return (
                <h2
                  key={i}
                  className="font-serif font-bold"
                  style={{
                    fontSize: '1.5rem',
                    marginTop: '2.5rem',
                    marginBottom: '1rem',
                    color: 'var(--ink)',
                  }}
                >
                  {para.replace('## ', '')}
                </h2>
              );
            }
            if (para.startsWith('# ')) {
              return (
                <h2
                  key={i}
                  className="font-serif font-bold"
                  style={{
                    fontSize: '1.75rem',
                    marginTop: '2.5rem',
                    marginBottom: '1rem',
                    color: 'var(--ink)',
                  }}
                >
                  {para.replace('# ', '')}
                </h2>
              );
            }
            if (para.startsWith('### ')) {
              return (
                <h3
                  key={i}
                  className="font-serif font-bold"
                  style={{
                    fontSize: '1.25rem',
                    marginTop: '2rem',
                    marginBottom: '0.75rem',
                    color: 'var(--ink)',
                  }}
                >
                  {para.replace('### ', '')}
                </h3>
              );
            }
            if (para.startsWith('> ')) {
              return (
                <blockquote
                  key={i}
                  className="font-serif"
                  style={{
                    borderLeft: '3px solid var(--mint-dark)',
                    paddingLeft: '1.25rem',
                    margin: '2rem 0',
                    fontStyle: 'italic',
                    color: 'var(--ink-light)',
                  }}
                >
                  {para.replace('> ', '')}
                </blockquote>
              );
            }
            if (para.startsWith('- ')) {
              const items = para.split('\n').filter((l) => l.startsWith('- '));
              return (
                <ul key={i} style={{ marginBottom: '1.75rem', paddingLeft: '1.5rem' }}>
                  {items.map((item, j) => (
                    <li key={j} style={{ marginBottom: '0.5rem' }}>
                      {item.replace('- ', '')}
                    </li>
                  ))}
                </ul>
              );
            }
            if (para === '---') {
              return (
                <hr
                  key={i}
                  style={{ border: 'none', borderTop: '1.5px solid var(--border)', margin: '2rem 0' }}
                />
              );
            }
            if (para.startsWith('**') && para.includes('**')) {
              const lines = para.split('\n');
              return (
                <div key={i} style={{ marginBottom: '1.75rem' }}>
                  {lines.map((line, j) => {
                    const m = line.match(/^\*\*(.+?)\*\*(.*)$/);
                    if (m)
                      return (
                        <p key={j}>
                          <strong style={{ fontWeight: 700 }}>{m[1]}</strong>
                          {m[2]}
                        </p>
                      );
                    return <p key={j}>{line}</p>;
                  })}
                </div>
              );
            }
            return (
              <p key={i} style={{ marginBottom: '1.75rem' }}>
                {para}
              </p>
            );
          })}
        </div>

        {/* Sidebar */}
        <aside>
          <div className="sticky top-24">
            <div
              className="p-5 rounded-sm mb-8"
              style={{
                backgroundColor: 'rgba(142, 207, 176, 0.15)',
                border: '1px solid var(--border)',
              }}
            >
              <p
                className="font-sans text-xs uppercase tracking-widest mb-3"
                style={{ color: 'var(--ink-light)' }}
              >
                Filed under
              </p>
              <span className="category-pill">{entry.category}</span>
              <p
                className="font-sans text-xs mt-4"
                style={{ color: 'var(--ink-light)' }}
              >
                Published {formatDate(entry.date)}
              </p>
            </div>

            {related.length > 0 && (
              <div>
                <p
                  className="font-sans text-xs uppercase tracking-widest mb-4"
                  style={{
                    color: 'var(--ink-light)',
                    borderBottom: '1px solid var(--border)',
                    paddingBottom: '0.5rem',
                  }}
                >
                  More like this
                </p>
                <div className="flex flex-col gap-5">
                  {related.map((e) => (
                    <EntryCard key={e.slug} entry={e} size="sm" />
                  ))}
                </div>
              </div>
            )}
          </div>
        </aside>
      </div>
    </article>
  );
}
