import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { fetchNotionEntries, fetchNotionEntryByPageId, slugToNotionId } from './notion';

const entriesDir = path.join(process.cwd(), 'content/entries');

export interface Entry {
  slug: string;
  title: string;
  date: string;
  category: string;
  excerpt: string;
  coverImage: string;
  featured: boolean;
  content: string;
}

export function getAllEntries(): Entry[] {
  const fileNames = fs.readdirSync(entriesDir);
  const entries = fileNames
    .filter((f) => f.endsWith('.md'))
    .map((fileName) => {
      const slug = fileName.replace(/\.md$/, '');
      const fullPath = path.join(entriesDir, fileName);
      const fileContents = fs.readFileSync(fullPath, 'utf8');
      const { data, content } = matter(fileContents);
      return {
        slug,
        title: data.title as string,
        date: data.date as string,
        category: data.category as string,
        excerpt: data.excerpt as string,
        coverImage: data.coverImage as string,
        featured: (data.featured as boolean) ?? false,
        content,
      };
    });

  return entries.sort((a, b) => (a.date < b.date ? 1 : -1));
}

export function getFeaturedEntry(): Entry | undefined {
  return getAllEntries().find((e) => e.featured);
}

export function getEntryBySlug(slug: string): Entry | undefined {
  const fullPath = path.join(entriesDir, `${slug}.md`);
  if (!fs.existsSync(fullPath)) return undefined;
  const fileContents = fs.readFileSync(fullPath, 'utf8');
  const { data, content } = matter(fileContents);
  return {
    slug,
    title: data.title as string,
    date: data.date as string,
    category: data.category as string,
    excerpt: data.excerpt as string,
    coverImage: data.coverImage as string,
    featured: (data.featured as boolean) ?? false,
    content,
  };
}

export function getAllCategories(): string[] {
  const entries = getAllEntries();
  const cats = Array.from(new Set(entries.map((e) => e.category)));
  return cats.sort();
}

// Merged async versions — used by pages that need Notion + local entries together

export async function getAllEntriesWithNotion(): Promise<Entry[]> {
  const [local, notion] = await Promise.all([
    Promise.resolve(getAllEntries()),
    fetchNotionEntries(),
  ]);
  const merged = [...notion, ...local];
  return merged.sort((a, b) => (a.date < b.date ? 1 : -1));
}

export async function getFeaturedEntryWithNotion(): Promise<Entry | undefined> {
  const local = getAllEntries().find((e) => e.featured);
  if (local) return local;
  const notion = await fetchNotionEntries();
  return notion[0]; // most recent Notion entry as fallback featured
}

export async function getAllCategoriesWithNotion(): Promise<string[]> {
  const entries = await getAllEntriesWithNotion();
  const cats = Array.from(new Set(entries.map((e) => e.category)));
  return cats.sort();
}

export async function getEntryBySlugWithNotion(slug: string): Promise<Entry | undefined> {
  // Try local markdown first
  const local = getEntryBySlug(slug);
  if (local) return local;

  // Try Notion — decode the slug to a Notion page ID
  const notionId = slugToNotionId(slug);
  if (!notionId) return undefined;
  return (await fetchNotionEntryByPageId(notionId)) ?? undefined;
}

export function formatDate(dateStr: string): string {
  const date = new Date(dateStr + 'T12:00:00');
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}
