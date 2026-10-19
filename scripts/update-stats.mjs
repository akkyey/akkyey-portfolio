#!/usr/bin/env node
/**
 * scripts/update-stats.mjs
 * Qiita API v2 から公開記事の最新 PV・いいね・ストック数を取得し、
 * src/data/portfolio.ts をアトミックに同期・更新するスクリプト
 */

import { readFileSync, writeFileSync, renameSync } from 'node:fs';
import { homedir } from 'node:os';
import { join } from 'node:path';

const TOKEN_PATH = join(homedir(), '.qiita_token');
const PORTFOLIO_PATH = join(process.cwd(), 'src/data/portfolio.ts');
const TMP_PORTFOLIO_PATH = `${PORTFOLIO_PATH}.tmp`;

// JST (Asia/Tokyo) の YYYY-MM-DD を取得
function getJstDateString() {
  const formatter = new Intl.DateTimeFormat('ja-JP', {
    timeZone: 'Asia/Tokyo',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });
  return formatter.format(new Date()).replace(/\//g, '-');
}

async function fetchAllPublicQiitaItems(token) {
  let page = 1;
  const allItems = [];

  while (true) {
    const url = `https://qiita.com/api/v2/authenticated_user/items?page=${page}&per_page=100`;
    const res = await fetch(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok) {
      throw new Error(`Qiita API通信エラー: HTTP ${res.status} ${res.statusText}`);
    }

    const items = await res.json();
    if (!Array.isArray(items) || items.length === 0) {
      break;
    }

    allItems.push(...items);

    if (items.length < 100) {
      break;
    }
    page++;
  }

  // 限定共有・下書き等を除外し、全体公開（public）記事のみを対象にする
  return allItems.filter((item) => !item.private);
}

async function main() {
  console.log('🔄 Qiita API から最新統計データを取得中...');

  let token = '';
  try {
    token = readFileSync(TOKEN_PATH, 'utf-8').trim();
  } catch {
    console.error(`❌ ~/.qiita_token が見つかりません。`);
    process.exit(1);
  }

  // 1. 全公開記事をページネーションで取得（private除外）
  const publicItems = await fetchAllPublicQiitaItems(token);
  console.log(`✓ 公開記事 ${publicItems.length} 件のデータを取得しました（非公開・限定共有は除外）。`);

  // 2. 記事ごとの最新数値をマップ化
  const statsMap = new Map();
  let totalPv = 0;
  let totalLikes = 0;
  let totalStocks = 0;

  for (const item of publicItems) {
    const pv = item.page_views_count || 0;
    const likes = item.likes_count || 0;
    const stocks = item.stocks_count || 0;

    statsMap.set(item.id, {
      id: item.id,
      title: item.title,
      url: item.url,
      pv,
      likes,
      stocks,
      tags: (item.tags || []).map((t) => t.name),
      createdAt: item.created_at.split('T')[0],
      updatedAt: item.updated_at.split('T')[0],
    });

    totalPv += pv;
    totalLikes += likes;
    totalStocks += stocks;
  }

  // 3. src/data/portfolio.ts を読み込んで整合性チェック
  let content = readFileSync(PORTFOLIO_PATH, 'utf-8');

  // 既存の全 itemId を抽出
  const existingItemIds = new Set();
  const idMatches = content.matchAll(/itemId:\s*'([^']+)'/g);
  for (const match of idMatches) {
    existingItemIds.add(match[1]);
  }

  // 既存IDの最大値を取得（新規追加時の連番用）
  const idNumMatches = [...content.matchAll(/id:\s*(\d+),/g)].map((m) => parseInt(m[1], 10));
  let maxId = idNumMatches.length > 0 ? Math.max(...idNumMatches) : 0;

  // Qiita API にあるが portfolio.ts にまだ存在しない新規記事を検出
  const newItems = publicItems.filter((item) => !existingItemIds.has(item.id));
  if (newItems.length > 0) {
    console.log(`ℹ️ 新規記事を ${newItems.length} 件検出しました。ALL_ARTICLES に自動追加します。`);

    let appendedCode = '';
    for (const item of newItems) {
      maxId++;
      const tagList = JSON.stringify((item.tags || []).map((t) => t.name));
      appendedCode += `  {\n`;
      appendedCode += `    id: ${maxId},\n`;
      appendedCode += `    itemId: '${item.id}',\n`;
      appendedCode += `    title: ${JSON.stringify(item.title)},\n`;
      appendedCode += `    url: '${item.url}',\n`;
      appendedCode += `    pv: ${item.page_views_count || 0},\n`;
      appendedCode += `    likes: ${item.likes_count || 0},\n`;
      appendedCode += `    stocks: ${item.stocks_count || 0},\n`;
      appendedCode += `    tags: ${tagList},\n`;
      appendedCode += `    category: 'data-pipeline',\n`;
      appendedCode += `    createdAt: '${item.created_at.split('T')[0]}',\n`;
      appendedCode += `    updatedAt: '${item.updated_at.split('T')[0]}',\n`;
      appendedCode += `  },\n`;
    }

    // ALL_ARTICLES の配列末尾（]; の直前）に挿入
    content = content.replace(/(\n\];\s*)$/, `\n${appendedCode}];\n`);
  }

  // JST日付（YYYY-MM-DD）
  const todayJst = getJstDateString();

  // 4. SITE_STATS を更新（総数は公開記事数と100%一致）
  content = content.replace(/totalArticles:\s*\d+/, `totalArticles: ${publicItems.length}`);
  content = content.replace(/totalPv:\s*\d+/, `totalPv: ${totalPv}`);
  content = content.replace(/totalLikes:\s*\d+/, `totalLikes: ${totalLikes}`);
  content = content.replace(/totalStocks:\s*\d+/, `totalStocks: ${totalStocks}`);
  content = content.replace(/asOfDate:\s*'[^']+'/, `asOfDate: '${todayJst}'`);

  // 5. ALL_ARTICLES 内の各記事数値を更新
  let updatedCount = 0;
  for (const [itemId, stat] of statsMap.entries()) {
    const itemRegex = new RegExp(
      `(itemId:\\s*'${itemId}',[\\s\\S]*?pv:\\s*)\\d+([\\s\\S]*?likes:\\s*)\\d+([\\s\\S]*?stocks:\\s*)\\d+`,
      'g'
    );

    if (itemRegex.test(content)) {
      content = content.replace(itemRegex, `$1${stat.pv}$2${stat.likes}$3${stat.stocks}`);
      updatedCount++;
    }
  }

  // 6. アトミック書き込み（一時ファイルに書いてからリネーム置換）
  writeFileSync(TMP_PORTFOLIO_PATH, content, 'utf-8');
  renameSync(TMP_PORTFOLIO_PATH, PORTFOLIO_PATH);

  console.log(`\n🎉 更新完了！`);
  console.log(`- 累計PV: ${totalPv.toLocaleString()} PV`);
  console.log(`- 累計いいね: ${totalLikes}`);
  console.log(`- 累計ストック: ${totalStocks}`);
  console.log(`- 公開記事総数: ${publicItems.length} 本`);
  console.log(`- 更新記事数: ${updatedCount} / ${publicItems.length} 件`);
  console.log(`- 基準日（JST）: ${todayJst}`);
}

main().catch((err) => {
  console.error('❌ 予期せぬエラー:', err);
  process.exit(1);
});
