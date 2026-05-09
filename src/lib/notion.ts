import { Client } from '@notionhq/client';
import type {
  BlockObjectResponse,
  PageObjectResponse,
} from '@notionhq/client/build/src/api-endpoints';
import { unstable_cache } from 'next/cache';
import type { Entry } from './entries';

// Your "Journal: Private Property." database ID
const DATABASE_ID = process.env.NOTION_DATABASE_ID ?? '98c7568de9d44973b0f5d246f22dabec';

function makeClient() {
  if (!process.env.NOTION_TOKEN) return null;
  return new Client({ auth: process.env.NOTION_TOKEN });
}

function richText(rt: Array<{ plain_text: string }>): string {
  return rt.map((t) => t.plain_text).join('');
}

function blockToMarkdown(block: BlockObjectResponse): string {
  switch (block.type) {
    case 'paragraph':
      return richText(block.paragraph.rich_text);
    case 'heading_1':
      return `# ${richText(block.heading_1.rich_text)}`;
    case 'heading_2':
      return `## ${richText(block.heading_2.rich_text)}`;
    case 'heading_3':
      return `### ${richText(block.heading_3.rich_text)}`;
    case 'bulleted_list_item':
      return `- ${richText(block.bulleted_list_item.rich_text)}`;
    case 'numbered_list_item':
      return richText(block.numbered_list_item.rich_text);
    case 'quote':
      return `> ${richText(block.quote.rich_text)}`;
    case 'divider':
      return '---';
    default:
      return '';
  }
}

// Encode a Notion page ID into a URL slug (no dashes, prefixed with "notion-")
export function notionIdToSlug(pageId: string): string {
  return `notion-${pageId.replace(/-/g, '')}`;
}

// Decode a "notion-*" slug back to a dashed UUID
export function slugToNotionId(slug: string): string | null {
  if (!slug.startsWith('notion-')) return null;
  const hex = slug.replace('notion-', '');
  if (hex.length !== 32) return null;
  return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`;
}

async function _fetchNotionEntries(): Promise<Entry[]> {
  const client = makeClient();
  if (!client) return [];

  try {
    const dbResp = await client.databases.query({
      database_id: DATABASE_ID,
      sorts: [{ timestamp: 'created_time', direction: 'descending' }],
      page_size: 100,
    });

    const entries = await Promise.all(
      dbResp.results
        .filter((p): p is PageObjectResponse => p.object === 'page')
        .map(async (page): Promise<Entry | null> => {
          // Title
          const titleProp = Object.values(page.properties).find((p) => p.type === 'title');
          const title =
            titleProp?.type === 'title' ? richText(titleProp.title).trim() : '';
          if (!title) return null;

          // Date from created_time
          const date = page.created_time.split('T')[0];

          // Blocks → markdown content
          const blocksResp = await client.blocks.children.list({
            block_id: page.id,
            page_size: 100,
          });
          const lines = blocksResp.results
            .filter((b): b is BlockObjectResponse => 'type' in b)
            .map(blockToMarkdown)
            .filter(Boolean);

          const content = lines.join('\n\n');

          // First plain paragraph as excerpt
          const firstPara =
            lines.find(
              (l) =>
                !l.startsWith('#') &&
                !l.startsWith('>') &&
                !l.startsWith('-') &&
                !l.startsWith('---') &&
                l.length > 20
            ) ?? '';
          const excerpt =
            firstPara.length > 220 ? firstPara.slice(0, 220) + '…' : firstPara;

          // Cover image
          const coverImage =
            page.cover?.type === 'external'
              ? page.cover.external.url
              : page.cover?.type === 'file'
              ? page.cover.file.url
              : 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&q=80';

          return {
            slug: notionIdToSlug(page.id),
            title,
            date,
            category: 'Journal',
            excerpt,
            coverImage,
            featured: false,
            content,
          };
        })
    );

    return entries.filter((e): e is Entry => e !== null && e.content.length > 10);
  } catch (err) {
    console.error('[Notion] Failed to fetch entries:', err);
    return [];
  }
}

// Cache Notion entries for 5 minutes so every page load isn't a round-trip
export const fetchNotionEntries = unstable_cache(
  _fetchNotionEntries,
  ['notion-journal-entries'],
  { revalidate: 300 }
);

// Fetch one Notion page by its ID directly (used by the entry detail page)
export async function fetchNotionEntryByPageId(pageId: string): Promise<Entry | null> {
  const client = makeClient();
  if (!client) return null;

  try {
    const page = (await client.pages.retrieve({ page_id: pageId })) as PageObjectResponse;

    const titleProp = Object.values(page.properties).find((p) => p.type === 'title');
    const title =
      titleProp?.type === 'title' ? richText(titleProp.title).trim() : 'Untitled';

    const date = page.created_time.split('T')[0];

    const blocksResp = await client.blocks.children.list({
      block_id: pageId,
      page_size: 100,
    });
    const lines = blocksResp.results
      .filter((b): b is BlockObjectResponse => 'type' in b)
      .map(blockToMarkdown)
      .filter(Boolean);

    const content = lines.join('\n\n');
    const firstPara =
      lines.find(
        (l) =>
          !l.startsWith('#') &&
          !l.startsWith('>') &&
          !l.startsWith('-') &&
          !l.startsWith('---') &&
          l.length > 20
      ) ?? '';
    const excerpt = firstPara.length > 220 ? firstPara.slice(0, 220) + '…' : firstPara;

    const coverImage =
      page.cover?.type === 'external'
        ? page.cover.external.url
        : page.cover?.type === 'file'
        ? page.cover.file.url
        : 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&q=80';

    return {
      slug: notionIdToSlug(page.id),
      title,
      date,
      category: 'Journal',
      excerpt,
      coverImage,
      featured: false,
      content,
    };
  } catch (err) {
    console.error('[Notion] Failed to fetch page:', pageId, err);
    return null;
  }
}
