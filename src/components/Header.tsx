'use client';

import Link from 'next/link';
import { useState } from 'react';

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header
      style={{
        backgroundColor: 'var(--cream)',
        borderBottom: '1.5px solid var(--border)',
      }}
      className="sticky top-0 z-50"
    >
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="font-display text-5xl leading-none tracking-wide" style={{ color: 'var(--ink)' }}>
          The Daily
          <span style={{ color: 'var(--mint-dark)' }}>.</span>
        </Link>

        {/* Nav right */}
        <nav className="flex items-center gap-6">
          <Link
            href="/entries/new"
            className="font-sans text-sm font-medium hidden sm:block"
            style={{ color: 'var(--ink-light)' }}
          >
            New Entry
          </Link>
          <Link
            href="/"
            className="font-sans text-sm font-medium hidden sm:block"
            style={{ color: 'var(--ink-light)' }}
          >
            Archive
          </Link>

          <Link
            href="/entries/new"
            className="category-pill text-sm font-semibold"
          >
            + Write
          </Link>

          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="flex items-center gap-2 px-4 py-2 rounded-full font-sans text-sm font-semibold"
            style={{
              backgroundColor: 'var(--ink)',
              color: 'var(--cream)',
            }}
          >
            Menu
            <span className="flex flex-col gap-1">
              <span className="block w-4 h-0.5 bg-current" />
              <span className="block w-4 h-0.5 bg-current" />
            </span>
          </button>
        </nav>
      </div>
    </header>
  );
}
