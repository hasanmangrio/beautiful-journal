import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { getAllEntries, getEntryBySlug, formatDate } from '@/lib/entries';
import EntryCard from '@/components/EntryCard';

interface EntryPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const entries = getAllEntries();
  return entries.map((e) => ({ slug: e.slug }));
}

export async function generateMetadata({ params }: EntryPageProps) {
  const { slug } = await params;
  const entry = getEntryBySlug(slug);
  if (!entry) return {};
  return { title: `${entry.title} — The Daily`, description: entry.excerpt };
}

function renderMarkdown(content: string): string {
  return content
    .replace(/^## (.+)$/gm, '<h2>$1</h2>')
    .replace(/^### (.+)$/gm, '<h3>$1</h3>')
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    .replace(/^> (.+)$/gm, '<blockquote>$1</blockquote>')
    .replace(/\n\n/g, '</p><p>')
    .replace(/^(?!<h[23]|<blockquote)/, '<p>')
    .replace(/$(?!<\/h[23]>|<\/blockquote>)/, '</p>');
}

export default async function EntryPage({ params }: EntryPageProps) {
  const { slug } = await params;
  const entry = getEntryBySlug(slug);
  if (!entry) notFound();

  const allEntries = getAllEntries();
  const related = allEntries
    .filter((e) => e.slug !== slug && e.category === entry.category)
    .slice(0, 2);

  const paragraphs = entry.content
    .split('\n\n')
    .map((p) => p.trim())
    .filter(Boolean);

  return (
    <article className="max-w-7xl mx-auto px-6 py-10">
      {/* Back */}
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

        <p
          className="font-serif text-xl leading-relaxed mb-4"
          style={{ color: 'var(--ink-light)', fontStyle: 'italic' }}
        >
          {entry.excerpt}
        </p>

        <p className="font-sans text-sm" style={{ color: 'var(--ink-light)' }}>
          {formatDate(entry.date)}
        </p>
      </div>

      {/* Hero image */}
      <div className="relative w-full mb-10 overflow-hidden rounded-sm" style={{ paddingBottom: '42%' }}>
        <Image
          src={entry.coverImage}
          alt={entry.title}
          fill
          className="object-cover"
          sizes="100vw"
          priority
        />
      </div>

      {/* Two-column layout: content + sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-12 lg:gap-16">
        {/* Content */}
        <div className="prose-journal max-w-none">
          {paragraphs.map((para, i) => {
            if (para.startsWith('## ')) {
              return (
                <h2 key={i} className="font-serif font-bold" style={{ fontSize: '1.5rem', marginTop: '2.5rem', marginBottom: '1rem', color: 'var(--ink)' }}>
                  {para.replace('## ', '')}
                </h2>
              );
            }
            if (para.startsWith('### ')) {
              return (
                <h3 key={i} className="font-serif font-bold" style={{ fontSize: '1.25rem', marginTop: '2rem', marginBottom: '0.75rem', color: 'var(--ink)' }}>
                  {para.replace('### ', '')}
                </h3>
              );
            }
            if (para.startsWith('> ')) {
              return (
                <blockquote key={i} className="font-serif" style={{ borderLeft: '3px solid var(--mint-dark)', paddingLeft: '1.25rem', margin: '2rem 0', fontStyle: 'italic', color: 'var(--ink-light)' }}>
                  {para.replace('> ', '')}
                </blockquote>
              );
            }
            if (para.startsWith('**') && para.includes('**')) {
              const lines = para.split('\n');
              return (
                <div key={i} className="mb-6">
                  {lines.map((line, j) => {
                    const boldMatch = line.match(/^\*\*(.+?)\*\*(.*)$/);
                    if (boldMatch) {
                      return (
                        <p key={j}>
                          <strong style={{ fontWeight: 700 }}>{boldMatch[1]}</strong>
                          {boldMatch[2]}
                        </p>
                      );
                    }
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
            {/* Entry info */}
            <div
              className="p-5 rounded-sm mb-8"
              style={{ backgroundColor: 'rgba(142, 207, 176, 0.15)', border: '1px solid var(--border)' }}
            >
              <p className="font-sans text-xs uppercase tracking-widest mb-3" style={{ color: 'var(--ink-light)' }}>
                Filed under
              </p>
              <span className="category-pill">{entry.category}</span>
              <p className="font-sans text-xs mt-4" style={{ color: 'var(--ink-light)' }}>
                Published {formatDate(entry.date)}
              </p>
            </div>

            {/* Related */}
            {related.length > 0 && (
              <div>
                <p
                  className="font-sans text-xs uppercase tracking-widest mb-4"
                  style={{ color: 'var(--ink-light)', borderBottom: '1px solid var(--border)', paddingBottom: '0.5rem' }}
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
