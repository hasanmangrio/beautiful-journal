'use client';

import { useRouter, useSearchParams } from 'next/navigation';

interface CategoryFilterProps {
  categories: string[];
}

export default function CategoryFilter({ categories }: CategoryFilterProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const active = searchParams.get('category') || 'All';

  const handleClick = (cat: string) => {
    if (cat === 'All') {
      router.push('/');
    } else {
      router.push(`/?category=${encodeURIComponent(cat)}`);
    }
  };

  return (
    <div className="flex flex-wrap items-center gap-2">
      {['All', ...categories].map((cat) => (
        <button
          key={cat}
          onClick={() => handleClick(cat)}
          className={`category-pill ${active === cat ? '' : 'inactive'}`}
        >
          {cat}
        </button>
      ))}
    </div>
  );
}
