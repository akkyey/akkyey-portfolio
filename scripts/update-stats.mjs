#!/usr/bin/env node
/**
 * scripts/update-stats.mjs
 * Qiita API v2 から最新の PV・いいね・ストック数を取得し、
 * src/data/portfolio.ts を自動更新して最新状態に同期するスクリプト
 */

import { readFileSync, writeFileSync } from 'node:fs';
import { homedir } from 'node:os';
import { join } from 'node:path';

const TOKEN_PATH = join(homedir(), '.qiita_token');
const PORTFOLIO_PATH = join(process.cwd(), 'src/data/portfolio.ts');

async function main() {
  console.log('🔄 Qiita API から最新統計データを取得中...');

  let token = '';
  try {
    token = readFileSync(TOKEN_PATH, 'utf-8').trim();
  } catch {
    console.error(`❌ ~/.qiita_token が見つかりません。`);
    process.exit(1);
  }

  // 1. 全記事を取得（最大100件）
  const res = await fetch('https://qiita.com/api/v2/authenticated_user/items?per_page=100', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    console.error(`❌ Qiita API エラー: HTTP ${res.status} ${res.statusText}`);
    process.exit(1);
  }

  const items = await res.json();
  console.log(`✓ ${items.length} 件の記事データを取得しました。`);

  // 2. 記事ごとの最新数値をマップ化
  const statsMap = new Map();
  let totalPv = 0;
  let totalLikes = 0;
  let totalStocks = 0;

  for (const item of items) {
    const pv = item.page_views_count || 0;
    const likes = item.likes_count || 0;
    const stocks = item.stocks_count || 0;

    statsMap.set(item.id, {
      title: item.title,
      pv,
      likes,
      stocks,
      updatedAt: item.updated_at.split('T')[0],
    });

    totalPv += pv;
    totalLikes += likes;
    totalStocks += stocks;
  }

  // 3. src/data/portfolio.ts を読み込んで置換
  let content = readFileSync(PORTFOLIO_PATH, 'utf-8');

  // 今日付を取得（JST）
  const today = new Date().toISOString().split('T')[0];

  // SITE_STATS を更新
  content = content.replace(
    /totalArticles:\s*\d+/,
    `totalArticles: ${items.length}`
  );
  content = content.replace(
    /totalPv:\s*\d+/,
    `totalPv: ${totalPv}`
  );
  content = content.replace(
    /totalLikes:\s*\d+/,
    `totalLikes: ${totalLikes}`
  );
  content = content.replace(
    /totalStocks:\s*\d+/,
    `totalStocks: ${totalStocks}`
  );
  content = content.replace(
    /asOfDate:\s*'[^']+'/,
    `asOfDate: '${today}'`
  );

  // ALL_ARTICLES 内の各記事数値を更新
  let updatedCount = 0;
  for (const [itemId, stat] of statsMap.entries()) {
    const itemRegex = new RegExp(
      `(itemId:\\s*'${itemId}',[\\s\\S]*?pv:\\s*)\\d+([\\s\\S]*?likes:\\s*)\\d+([\\s\\S]*?stocks:\\s*)\\d+`,
      'g'
    );

    if (itemRegex.test(content)) {
      content = content.replace(
        itemRegex,
        `$1${stat.pv}$2${stat.likes}$3${stat.stocks}`
      );
      updatedCount++;
    }
  }

  writeFileSync(PORTFOLIO_PATH, content, 'utf-8');

  console.log(`\n🎉 更新完了！`);
  console.log(`- 累計PV: ${totalPv.toLocaleString()} PV`);
  console.log(`- 累計いいね: ${totalLikes}`);
  console.log(`- 累計ストック: ${totalStocks}`);
  console.log(`- 更新記事数: ${updatedCount} / ${items.length} 件`);
  console.log(`- 基準日: ${today}`);
}

main().catch((err) => {
  console.error('予期せぬエラー:', err);
  process.exit(1);
});
