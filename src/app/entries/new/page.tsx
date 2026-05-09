import { createEntry } from './actions';
import { getAllCategories } from '@/lib/entries';
import Link from 'next/link';

export default function NewEntryPage() {
  const categories = getAllCategories();
  const suggestedCategories = Array.from(
    new Set([...categories, 'Life', 'Travel', 'Reflection', 'Food', 'Work', 'People', 'Ideas'])
  ).sort();

  return (
    <div className="max-w-3xl mx-auto px-6 py-12">
      {/* Back */}
      <Link
        href="/"
        className="font-sans text-sm inline-flex items-center gap-1 mb-10"
        style={{ color: 'var(--ink-light)' }}
      >
        ← Back to home
      </Link>

      {/* Header */}
      <div className="mb-10">
        <h1
          className="font-display mb-2"
          style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)', color: 'var(--ink)', lineHeight: 1 }}
        >
          New Entry
        </h1>
        <p className="font-sans text-base" style={{ color: 'var(--ink-light)' }}>
          What happened? What are you thinking about? What do you want to remember?
        </p>
      </div>

      <hr className="divider mb-10" />

      {/* Form */}
      <form action={createEntry} className="flex flex-col gap-7">
        {/* Title */}
        <div>
          <label
            htmlFor="title"
            className="font-sans text-xs uppercase tracking-widest block mb-2"
            style={{ color: 'var(--ink-light)' }}
          >
            Headline *
          </label>
          <input
            id="title"
            name="title"
            type="text"
            required
            placeholder="A morning that changed how I see things..."
            className="w-full font-serif text-xl bg-transparent border-0 border-b-2 pb-2 outline-none focus:border-b-2 placeholder:opacity-40"
            style={{
              borderBottomColor: 'var(--border)',
              color: 'var(--ink)',
            }}
          />
        </div>

        {/* Category */}
        <div>
          <label
            htmlFor="category"
            className="font-sans text-xs uppercase tracking-widest block mb-2"
            style={{ color: 'var(--ink-light)' }}
          >
            Category *
          </label>
          <div className="flex flex-wrap gap-2 mb-3">
            {suggestedCategories.map((cat) => (
              <label key={cat} className="cursor-pointer">
                <input type="radio" name="category" value={cat} className="sr-only peer" />
                <span className="category-pill inactive peer-checked:bg-[var(--mint)] peer-checked:border-[var(--mint-dark)] peer-checked:text-[var(--ink)] transition-all">
                  {cat}
                </span>
              </label>
            ))}
          </div>
          <input
            type="text"
            name="category"
            placeholder="Or type a new category..."
            className="font-sans text-sm bg-transparent border-0 border-b pb-1 outline-none w-full placeholder:opacity-40"
            style={{ borderBottomColor: 'var(--border)', color: 'var(--ink)' }}
          />
        </div>

        {/* Excerpt */}
        <div>
          <label
            htmlFor="excerpt"
            className="font-sans text-xs uppercase tracking-widest block mb-2"
            style={{ color: 'var(--ink-light)' }}
          >
            Opening line / excerpt
          </label>
          <textarea
            id="excerpt"
            name="excerpt"
            rows={2}
            placeholder="One or two sentences that draw someone in..."
            className="w-full font-serif text-base italic bg-transparent border-0 border-b pb-2 outline-none resize-none placeholder:opacity-40"
            style={{ borderBottomColor: 'var(--border)', color: 'var(--ink)' }}
          />
        </div>

        {/* Cover image */}
        <div>
          <label
            htmlFor="coverImage"
            className="font-sans text-xs uppercase tracking-widest block mb-2"
            style={{ color: 'var(--ink-light)' }}
          >
            Cover image URL
          </label>
          <input
            id="coverImage"
            name="coverImage"
            type="url"
            placeholder="https://images.unsplash.com/..."
            className="w-full font-sans text-sm bg-transparent border-0 border-b pb-1 outline-none placeholder:opacity-40"
            style={{ borderBottomColor: 'var(--border)', color: 'var(--ink)' }}
          />
          <p className="font-sans text-xs mt-1" style={{ color: 'var(--ink-light)' }}>
            Leave blank for a default image. Try unsplash.com for free photos.
          </p>
        </div>

        {/* Content */}
        <div>
          <label
            htmlFor="content"
            className="font-sans text-xs uppercase tracking-widest block mb-2"
            style={{ color: 'var(--ink-light)' }}
          >
            Content * — use ## for section headings, &gt; for quotes
          </label>
          <textarea
            id="content"
            name="content"
            required
            rows={18}
            placeholder={`Write your entry here...\n\nYou can use markdown:\n\n## A section heading\n\nA paragraph of text.\n\n> A blockquote that stands out.`}
            className="w-full font-serif text-base leading-relaxed bg-transparent border rounded-sm p-4 outline-none resize-y placeholder:opacity-40"
            style={{
              borderColor: 'var(--border)',
              color: 'var(--ink)',
              minHeight: '320px',
            }}
          />
        </div>

        {/* Submit */}
        <div className="flex items-center justify-between pt-2">
          <Link href="/" className="font-sans text-sm" style={{ color: 'var(--ink-light)' }}>
            Cancel
          </Link>
          <button
            type="submit"
            className="font-sans font-semibold text-sm px-8 py-3 rounded-full transition-opacity hover:opacity-80"
            style={{
              backgroundColor: 'var(--ink)',
              color: 'var(--cream)',
            }}
          >
            Publish entry →
          </button>
        </div>
      </form>
    </div>
  );
}
