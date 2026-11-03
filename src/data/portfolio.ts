import qiitaStats from "./qiita-stats.json";
import seoRankings from "./seo-rankings.json";

/*
 * データの置き場所（種類ごとに分ける）
 * - qiita-stats.json   : 機械が取得するデータ（Qiita API）。scripts/update-stats.mjs が全件を上書きする
 * - seo-rankings.json  : 人が確認した記録（Google 検索順位）。観測日（observedAt）と一緒に手で更新する
 * - このファイル        : 人が決める情報（カテゴリ・説明文）。数値は書かず、上の2つから計算する
 * - src/content/       : 人が書く記事（技術ノート・お知らせ）。スキーマで検証する
 */

export interface Article {
  id: number;
  itemId: string;
  title: string;
  url: string;
  pv: number;
  likes: number;
  stocks: number;
  tags: string[];
  category: 'data-pipeline' | 'gas-automation' | 'ai-mcp-llm' | 'architecture';
  createdAt: string;
  updatedAt: string;
  featured?: boolean;
}

/** サイト側で付与する記事の独自情報（数値やタイトルは qiita-stats.json が正） */
export interface ArticleMeta {
  category: Article['category'];
  featured?: boolean;
}

export interface SeoEvidence {
  domain: string;
  queries: string[];
  articleIds: string[];
  /** 確認できた最上位の順位（「上位」としか記録がない場合は null） */
  topRank: number | null;
  position: string;
  highlight: string;
}

export interface Pillar {
  id: string;
  number: string;
  title: string;
  subtitle: string;
  clientProblem: string;
  businessValue: string;
  techStack: string[];
  metrics: { label: string; value: string }[];
  representativeIds: string[];
}

export interface ProductItem {
  id: string;
  type: 'oss' | 'book';
  badge: string;
  title: string;
  description: string;
  features: string[];
  tech: string[];
  status: 'available' | 'coming-soon';
  priceOrLicense: string;
  linkUrl: string;
  linkLabel: string;
}

/** 合計値は記事一覧から算出するため、個別記事の合計と必ず一致する */
export const SITE_STATS = {
  totalArticles: qiitaStats.items.length,
  totalPv: qiitaStats.items.reduce((sum, i) => sum + i.pv, 0),
  totalLikes: qiitaStats.items.reduce((sum, i) => sum + i.likes, 0),
  totalStocks: qiitaStats.items.reduce((sum, i) => sum + i.stocks, 0),
  /** Google 検索で1位を確認できたテーマの数（seo-rankings.json から算出） */
  seoTopCount: seoRankings.entries.filter((e) => e.topRank === 1).length,
  asOfDate: qiitaStats.asOfDate,
  /** 検索順位を確認した日（Qiita の取得日とは別） */
  seoObservedAt: seoRankings.observedAt,
};

/** 指定した記事の最新PV合計（qiita-stats.json から算出するので数値が古くならない） */
const sumPv = (ids: string[]) =>
  qiitaStats.items.filter((i) => ids.includes(i.itemId)).reduce((sum, i) => sum + i.pv, 0);

/** 「AIエージェントにGAS開発を任せる」シリーズ */
const GAS_MCP_SERIES_IDS = ['ed9e06b70c4518779ac1', '098a217d65c776dbb612', '1541c5f0220e925a03b4'];
const gasMcpSeriesPv = sumPv(GAS_MCP_SERIES_IDS).toLocaleString('ja-JP');

/** 指定した記事のストック数（qiita-stats.json から取得） */
const stocksOf = (id: string) => qiitaStats.items.find((i) => i.itemId === id)?.stocks ?? 0;

/** 指定した記事群が1位を取った検索キーワードの数（seo-rankings.json から算出） */
const topRankQueryCount = (ids: string[]) =>
  seoRankings.entries
    .filter((e) => e.topRank === 1 && e.articleIds.some((id) => ids.includes(id)))
    .reduce((sum, e) => sum + e.queries.length, 0);

/** 「Python データ収集・高速分析基盤」の代表記事 */
const DATA_PIPELINE_IDS = [
  '00f5b3275749dbd820c3',
  '9a808e45a2abe8f0f0a1',
  '466b4fd05cb9408920f4',
  '02790d25e584204909d0',
  '3b7bd9cde3efcc601952',
  '12a8df355ee895ed73d4',
  '9ea2c5d3027c178c055e',
  '320aaae5305b98bc0ad5',
];

export const PILLARS: Pillar[] = [
  {
    id: 'data-pipeline',
    number: '01',
    title: 'Python データ収集・高速分析基盤',
    subtitle: 'API制限・データ欠損・ロック破損でも「絶対に止まらない」自律データパイプライン',
    clientProblem:
      '「外部APIの429レート制限で夜間バッチが止まる」「取得データの欠損や訂正で分析結果が狂う」「クラウド・Colab上のDBがロック破損して遅い」',
    businessValue:
      '不完全な外部API出力を前提とし、差分キャッシュ・恒等式によるデータ再構成・Polarsベクトル演算・ローカルステージングを組み合わせた「自己修復型データ基盤」を構築。全4,400銘柄規模の財務・価格データ処理を10分以内で安定して完走させています。',
    techStack: ['Python', 'Polars', 'Pandas MultiIndex', 'SQLite3', 'DuckDB', 'EDINET API', 'yfinance', 'Google Colab'],
    metrics: [
      { label: '4,000銘柄集計速度', value: '0.03秒 (Polars)' },
      { label: '全4,400銘柄パイプライン完走', value: '9分台' },
      { label: 'Google検索 1位・AI引用', value: `${topRankQueryCount(DATA_PIPELINE_IDS)}クエリ制覇` },
    ],
    representativeIds: DATA_PIPELINE_IDS,
  },
  {
    id: 'gas-automation',
    number: '02',
    title: 'GAS × Google Workspace × Notion 業務完全自動化',
    subtitle: '手作業の集計・レポート・ツール間転記をゼロにする堅牢なサーバーレス自動化',
    clientProblem:
      '「毎日スプレッドシートへ手動で数値を転記している」「NotionとGoogle Workspaceのデータが二重管理になっている」「既存GASスクリプトがブラックボックス化して保守できない」',
    businessValue:
      'Google Apps Script (TypeScript / clasp) と外部API・Notion APIを連携し、データ収集から可視化ダッシュボード更新、定期通知までを完全自動化。ローカルエミュレータによる自動テスト環境も整備し、仕様変更に強い運用にしています。',
    techStack: ['Google Apps Script', 'TypeScript', 'clasp', 'Google Sheets API', 'Notion API', 'REST Webhook', 'GitHub Actions'],
    metrics: [
      { label: 'GAS×MCPシリーズ累計', value: `${gasMcpSeriesPv} PV` },
      { label: 'Qiita統計自動化記事', value: `検索1位 & ${stocksOf('5b690c6e6eafe88f0e75')}ストック` },
      { label: 'ランニングコスト', value: '0円〜 (Workspace内完結)' },
    ],
    representativeIds: [
      'ed9e06b70c4518779ac1',
      '098a217d65c776dbb612',
      '1541c5f0220e925a03b4',
      '5b690c6e6eafe88f0e75',
      'ccc008519baca7ea8b85',
    ],
  },
  {
    id: 'ai-mcp-llm',
    number: '03',
    title: 'AIエージェント・MCPサーバー・ローカルLLM基盤構築',
    subtitle: '社内ツールをAIに接続するMCP開発と、暴走・トークン浪費を防ぐ制御プレーン設計',
    clientProblem:
      '「AIエージェントに業務ツールを安全に操作させたい」「APIトークン消費量が膨大でコストが合わない」「機密データを外部に出さずローカルGPUで実用的なAI開発環境を動かしたい」',
    businessValue:
      'Model Context Protocol (MCP) サーバーの独自実装から、Rust × Node.js による特権分離、変化のないデータはAIを呼ばずにスキップするハッシュキャッシュ、コンシューマGPU（RTX 3060）でのSWE-bench 40.7%完走を確認した制御プレーンまで、実務で破綻しないAI基盤を実装・検証してきました。',
    techStack: ['MCP (Model Context Protocol)', 'Rust', 'Node.js', 'TypeScript', 'Python', 'Local LLM / Ollama', 'Aider', 'systemd'],
    metrics: [
      { label: 'SWE-bench Lite (RTX 3060)', value: '40.7% 完走・検索1位' },
      { label: '変化のないデータ', value: 'AIを呼ばずにスキップ' },
      { label: '境界防御・プロセス制御', value: 'Rust × Node.js 特権分離' },
    ],
    representativeIds: [
      'a73b56f360009d7d46f5',
      'fc35e126098c8610b884',
      '822f5d6ce31a9709d5a9',
      'c87adab22d485d8c62c9',
      '76705c54607e2cc3a19b',
      '5716b0b14bfdcebd6d6b',
    ],
  },
];

/** 検索上位の実績（人が観測した記録。seo-rankings.json を正とし、ここには書かない） */
export const SEO_EVIDENCES: SeoEvidence[] = seoRankings.entries;

/**
 * 記事ごとの独自情報（カテゴリ・注目フラグ）。検索順位は seo-rankings.json で管理する。
 * タイトル・URL・PV などの数値は scripts/update-stats.mjs が生成する qiita-stats.json を正とし、ここには書かない。
 * 新しい記事をQiitaに公開したら、ここに1行足してカテゴリを決める（未登録でもビルドは通り、警告が出る）。
 */
export const ARTICLE_META: Record<string, ArticleMeta> = {
  'fb4c70c93102924396e2': { category: 'architecture' },
  'd461b4ebf96487a434b5': { category: 'architecture' },
  '9633813c4e9582d93428': { category: 'ai-mcp-llm' },
  '1214793c2c384b81fe63': { category: 'data-pipeline' },
  '320aaae5305b98bc0ad5': { category: 'data-pipeline', featured: true },
  '9ea2c5d3027c178c055e': { category: 'data-pipeline', featured: true },
  '12a8df355ee895ed73d4': { category: 'data-pipeline', featured: true },
  'a73b56f360009d7d46f5': { category: 'ai-mcp-llm', featured: true },
  'fc35e126098c8610b884': { category: 'ai-mcp-llm' },
  'fefa743bff5e0479a181': { category: 'ai-mcp-llm' },
  'c87adab22d485d8c62c9': { category: 'ai-mcp-llm' },
  '822f5d6ce31a9709d5a9': { category: 'ai-mcp-llm', featured: true },
  '76705c54607e2cc3a19b': { category: 'architecture' },
  '9a808e45a2abe8f0f0a1': { category: 'data-pipeline', featured: true },
  'ccc008519baca7ea8b85': { category: 'gas-automation' },
  '02790d25e584204909d0': { category: 'data-pipeline', featured: true },
  '466b4fd05cb9408920f4': { category: 'data-pipeline', featured: true },
  '1541c5f0220e925a03b4': { category: 'gas-automation', featured: true },
  '098a217d65c776dbb612': { category: 'gas-automation', featured: true },
  'affe1d814e9e7efa1694': { category: 'architecture' },
  '6d025c6e89defccbf4eb': { category: 'architecture' },
  '0c1c20466b0382ca61b0': { category: 'ai-mcp-llm' },
  'ed9e06b70c4518779ac1': { category: 'gas-automation', featured: true },
  'e30e23e01127d90f47dd': { category: 'architecture' },
  '049e6f3fb658766d1e16': { category: 'architecture' },
  '5b690c6e6eafe88f0e75': { category: 'gas-automation', featured: true },
  '6718fcfd44dad8d6459d': { category: 'architecture' },
  '197a0c9f371789fdb007': { category: 'ai-mcp-llm' },
  '5716b0b14bfdcebd6d6b': { category: 'ai-mcp-llm' },
  '342d3946fd7d2a637018': { category: 'architecture' },
  '6ef21412c4ec6b479a78': { category: 'architecture' },
  '98adeefc2df5ed12f5a2': { category: 'architecture' },
  '3b7bd9cde3efcc601952': { category: 'data-pipeline', featured: true },
  '00f5b3275749dbd820c3': { category: 'data-pipeline', featured: true },
};

const DEFAULT_META: ArticleMeta = { category: 'data-pipeline' };

const missingMeta = qiitaStats.items.filter((item) => !ARTICLE_META[item.itemId]);
if (missingMeta.length > 0) {
  console.warn(
    `[portfolio] ARTICLE_META 未登録の記事が ${missingMeta.length} 件あります（仮に ${DEFAULT_META.category} として表示）: ${missingMeta.map((i) => i.itemId).join(', ')}`
  );
}

/** Qiitaの公開記事（qiita-stats.json）とサイト独自情報を合体した記事一覧。件数は常にQiitaの公開記事数と一致する */
export const ALL_ARTICLES: Article[] = qiitaStats.items.map((item, index) => ({
  id: index + 1,
  ...item,
  ...(ARTICLE_META[item.itemId] ?? DEFAULT_META),
}));
