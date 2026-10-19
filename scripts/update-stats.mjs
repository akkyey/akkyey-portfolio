#!/usr/bin/env node
/**
 * scripts/update-stats.mjs
 * Qiita API v2 から自分の公開記事（タイトル・URL・PV・いいね・ストック）を取得し、
 * src/data/qiita-stats.json に書き出す。
 *
 * - PV（page_views_count）は認証付きの /authenticated_user/items でしか返らないため、
 *   ブラウザではなくローカル実行（ビルド前）で取得する。
 * - TypeScript のソースは書き換えない。合計値や記事一覧は portfolio.ts がこの JSON から算出する。
 * - 取得に失敗した場合は何も書き込まず終了する。書き込みは一時ファイル経由で置き換える。
 */

import { readFileSync, writeFileSync, renameSync } from 'node:fs';
import { homedir } from 'node:os';
import { join } from 'node:path';

const TOKEN_PATH = join(homedir(), '.qiita_token');
const STATS_PATH = join(process.cwd(), 'src/data/qiita-stats.json');
const TMP_PATH = `${STATS_PATH}.tmp`;
const PER_PAGE = 100;

// 実行環境のタイムゾーンに依存せず、日本時間の YYYY-MM-DD を返す
function getJstDateString() {
  return new Intl.DateTimeFormat('sv-SE', { timeZone: 'Asia/Tokyo' }).format(new Date());
}

async function fetchAllPublicItems(token) {
  const all = [];
  for (let page = 1; ; page++) {
    const url = `https://qiita.com/api/v2/authenticated_user/items?page=${page}&per_page=${PER_PAGE}`;
    const res = await fetch(url, { headers: { Authorization: `Bearer ${token}` } });
    if (!res.ok) {
      throw new Error(`Qiita API エラー: HTTP ${res.status} ${res.statusText}`);
    }
    const items = await res.json();
    if (!Array.isArray(items)) {
      throw new Error('Qiita API の応答が配列ではありません');
    }
    all.push(...items);
    if (items.length < PER_PAGE) break;
  }
  // 限定共有記事を除外（下書きはそもそも API から返らない）
  return all.filter((item) => !item.private);
}

function loadPreviousIds() {
  try {
    return new Set(JSON.parse(readFileSync(STATS_PATH, 'utf-8')).items.map((i) => i.itemId));
  } catch {
    return new Set();
  }
}

async function main() {
  let token;
  try {
    token = readFileSync(TOKEN_PATH, 'utf-8').trim();
  } catch {
    console.error('❌ ~/.qiita_token が見つかりません。');
    process.exit(1);
  }

  console.log('🔄 Qiita API から公開記事を取得中...');
  const publicItems = await fetchAllPublicItems(token);

  const items = publicItems
    .map((item) => ({
      itemId: item.id,
      title: item.title,
      url: item.url,
      pv: item.page_views_count ?? 0,
      likes: item.likes_count ?? 0,
      stocks: item.stocks_count ?? 0,
      tags: (item.tags ?? []).map((t) => t.name),
      createdAt: item.created_at.slice(0, 10),
      updatedAt: item.updated_at.slice(0, 10),
    }))
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt));

  // 前回との差分（追加・消えた記事）を表示
  const prevIds = loadPreviousIds();
  const nowIds = new Set(items.map((i) => i.itemId));
  const added = items.filter((i) => !prevIds.has(i.itemId));
  const removed = [...prevIds].filter((id) => !nowIds.has(id));

  const asOfDate = getJstDateString();
  const json = {
    asOfDate,
    source: 'Qiita API v2 /authenticated_user/items (public only)',
    items,
  };

  writeFileSync(TMP_PATH, JSON.stringify(json, null, 2) + '\n', 'utf-8');
  renameSync(TMP_PATH, STATS_PATH);

  const sum = (key) => items.reduce((s, i) => s + i[key], 0);
  console.log(`\n🎉 更新完了（基準日 JST: ${asOfDate}）`);
  console.log(`- 公開記事: ${items.length} 本`);
  console.log(`- 累計PV: ${sum('pv').toLocaleString()} / いいね: ${sum('likes')} / ストック: ${sum('stocks')}`);
  if (prevIds.size > 0 && added.length > 0) {
    console.log(`- 新しい記事: ${added.length} 本 → portfolio.ts の ARTICLE_META にカテゴリを追加してください`);
    for (const i of added) console.log(`    ${i.itemId}  ${i.title}`);
  }
  if (removed.length > 0) {
    console.log(`- 一覧から外れた記事（削除・限定共有化）: ${removed.join(', ')}`);
  }
}

main().catch((err) => {
  console.error('❌ 更新に失敗しました（ファイルは変更していません）:', err.message);
  process.exit(1);
});
