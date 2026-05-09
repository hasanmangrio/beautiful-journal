'use server';

import fs from 'fs';
import path from 'path';
import { redirect } from 'next/navigation';

function slugify(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .slice(0, 60);
}

export async function createEntry(formData: FormData) {
  const title = (formData.get('title') as string).trim();
  const category = (formData.get('category') as string).trim();
  const excerpt = (formData.get('excerpt') as string).trim();
  const content = (formData.get('content') as string).trim();
  const coverImage = (formData.get('coverImage') as string).trim();

  if (!title || !category || !content) {
    throw new Error('Title, category, and content are required.');
  }

  const date = new Date().toISOString().split('T')[0];
  const baseSlug = slugify(title);
  const slug = `${date}-${baseSlug}`;

  const frontmatter = `---
title: "${title.replace(/"/g, '\\"')}"
date: "${date}"
category: "${category}"
excerpt: "${excerpt.replace(/"/g, '\\"')}"
coverImage: "${coverImage || 'https://images.unsplash.com/photo-1495446815901-a7297e633e8d?w=1200&q=80'}"
featured: false
---

${content}`;

  const entriesDir = path.join(process.cwd(), 'content/entries');
  fs.writeFileSync(path.join(entriesDir, `${slug}.md`), frontmatter, 'utf8');

  redirect(`/entries/${slug}`);
}
