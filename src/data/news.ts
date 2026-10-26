import { getCollection } from 'astro:content';
import qiitaStats from './qiita-stats.json';

export type NewsKind = 'お知らせ' | 'Qiita' | '技術ノート';

export interface NewsItem {
  date: string; // YYYY-MM-DD
  kind: NewsKind;
  title: string;
  link?: string;
  external: boolean;
}

const toYmd = (d: Date) => d.toISOString().slice(0, 10);

/**
 * お知らせ一覧を作る（新しい順）
 * - Qiita の新着記事：qiita-stats.json から自動（npm run update-stats で増える）
 * - 技術ノートの新着：src/content/notes から自動（下書きは除外）
 * - 手書きのお知らせ：src/content/news/*.md
 */
export async function getNews(limit?: number): Promise<NewsItem[]> {
  const notes = await getCollection('notes', ({ data }) => !data.draft);
  const manual = await getCollection('news', ({ data }) => !data.draft);

  const items: NewsItem[] = [
    ...manual.map((n) => ({
      date: toYmd(n.data.date),
      kind: 'お知らせ' as const,
      title: n.data.title,
      link: n.data.link,
      external: Boolean(n.data.link?.startsWith('http')),
    })),
    ...notes.map((n) => ({
      date: toYmd(n.data.pubDate),
      kind: '技術ノート' as const,
      title: n.data.title,
      link: `/notes/${n.id}/`,
      external: false,
    })),
    ...qiitaStats.items.map((i) => ({
      date: i.createdAt,
      kind: 'Qiita' as const,
      title: i.title,
      link: i.url,
      external: true,
    })),
  ];

  // 新しい順。同じ日付なら お知らせ → 技術ノート → Qiita の順
  const order: Record<NewsKind, number> = { お知らせ: 0, 技術ノート: 1, Qiita: 2 };
  items.sort((a, b) => b.date.localeCompare(a.date) || order[a.kind] - order[b.kind]);

  return limit ? items.slice(0, limit) : items;
}
