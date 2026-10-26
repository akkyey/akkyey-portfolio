import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const notes = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/notes' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    pubDate: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
    tags: z.array(z.string()).default([]),
    draft: z.boolean().default(false),
    // 同じテーマの Qiita 記事がある場合に指定する。指定すると canonical が Qiita を指し、本文末に案内リンクが付き、サイトマップから外れる
    qiitaUrl: z.string().url().optional(),
  }),
});

// 手書きのお知らせ（サイト移転、書籍公開など）。1件1ファイル、本文は使わず title と link だけを表示する
const news = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/news' }),
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
    // 詳細ページや外部ページへのリンク（任意）
    link: z.string().optional(),
    draft: z.boolean().default(false),
  }),
});

export const collections = { notes, news };
