import { Suspense } from 'react';
import { getAllEntries, getAllCategories, getFeaturedEntry } from '@/lib/entries';
import FeaturedEntry from '@/components/FeaturedEntry';
import EntryCard from '@/components/EntryCard';
import CategoryFilter from '@/components/CategoryFilter';

interface HomeProps {
  searchParams: Promise<{ category?: string }>;
}

export default async function Home({ searchParams }: HomeProps) {
  const params = await searchParams;
  const activeCategory = params.category || 'All';

  const allEntries = getAllEntries();
  const categories = getAllCategories();
  const featured = getFeaturedEntry();

  const latestEntries = allEntries
    .filter((e) => !e.featured)
    .filter((e) => activeCategory === 'All' || e.category === activeCategory);

  return (
    <div className="max-w-7xl mx-auto px-6 py-10">
      {/* Category nav */}
      <div className="mb-10 flex items-center justify-between gap-4 flex-wrap">
        <Suspense fallback={<div />}>
          <CategoryFilter categories={categories} />
        </Suspense>
        <p className="font-sans text-sm" style={{ color: 'var(--ink-light)' }}>
          {allEntries.length} entries published
        </p>
      </div>

      {/* Divider */}
      <hr className="divider mb-10" />

      {/* Main layout: featured left, latest right */}
      <div className="grid grid-cols-1 lg:grid-cols-[3fr_2fr] gap-12 lg:gap-16">
        {/* Featured */}
        <div>
          {featured && (activeCategory === 'All' || featured.category === activeCategory) ? (
            <FeaturedEntry entry={featured} />
          ) : (
            latestEntries[0] && <FeaturedEntry entry={latestEntries[0]} />
          )}
        </div>

        {/* The Latest */}
        <div>
          <div
            className="mb-6 pb-3 flex items-center justify-between"
            style={{ borderBottom: '1.5px solid var(--border)' }}
          >
            <h2 className="font-sans text-xs font-semibold uppercase tracking-widest" style={{ color: 'var(--ink-light)' }}>
              The Latest
            </h2>
          </div>

          <div className="grid grid-cols-2 gap-6">
            {latestEntries.slice(0, 4).map((entry) => (
              <EntryCard key={entry.slug} entry={entry} size="sm" />
            ))}
          </div>

          {latestEntries.length === 0 && (
            <p className="font-sans text-sm" style={{ color: 'var(--ink-light)' }}>
              No entries in this category yet.
            </p>
          )}
        </div>
      </div>

      {/* All entries below */}
      {latestEntries.length > 4 && (
        <>
          <hr className="divider my-12" />
          <div>
            <h2
              className="font-sans text-xs font-semibold uppercase tracking-widest mb-8"
              style={{ color: 'var(--ink-light)' }}
            >
              More from the Archive
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {latestEntries.slice(4).map((entry) => (
                <EntryCard key={entry.slug} entry={entry} size="md" />
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
