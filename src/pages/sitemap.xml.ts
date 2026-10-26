import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';

/**
 * サイトマップ（/sitemap.xml）
 * - 下書き（draft）と、Qiita 記事を正規 URL にしているノート（qiitaUrl あり）は含めない
 */
export const GET: APIRoute = async ({ site }) => {
  const base = site ?? new URL('https://akkyey.dev');
  const notes = (await getCollection('notes')).filter((n) => !n.data.draft && !n.data.qiitaUrl);

  const urls = [
    { loc: new URL('/', base).href },
    { loc: new URL('/notes/', base).href },
    { loc: new URL('/news/', base).href },
    ...notes.map((n) => ({
      loc: new URL(`/notes/${n.id}/`, base).href,
      lastmod: (n.data.updatedDate ?? n.data.pubDate).toISOString().slice(0, 10),
    })),
  ];

  const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
  .map((u) => `  <url><loc>${u.loc}</loc>${'lastmod' in u && u.lastmod ? `<lastmod>${u.lastmod}</lastmod>` : ''}</url>`)
  .join('\n')}
</urlset>
`;

  return new Response(body, { headers: { 'Content-Type': 'application/xml; charset=utf-8' } });
};
