import qiitaStats from "./qiita-stats.json";

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
  seoBadge?: string;
  featured?: boolean;
}

/** サイト側で付与する記事の独自情報（数値やタイトルは qiita-stats.json が正） */
export interface ArticleMeta {
  category: Article['category'];
  seoBadge?: string;
  featured?: boolean;
}

export interface SeoEvidence {
  domain: string;
  queries: string[];
  articleIds: string[];
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

export interface ServicePlan {
  id: string;
  badge: string;
  title: string;
  target: string;
  description: string;
  deliverables: string[];
  priceRange?: string;
  duration: string;
}

/** 合計値は記事一覧から算出するため、個別記事の合計と必ず一致する */
export const SITE_STATS = {
  totalArticles: qiitaStats.items.length,
  totalPv: qiitaStats.items.reduce((sum, i) => sum + i.pv, 0),
  totalLikes: qiitaStats.items.reduce((sum, i) => sum + i.likes, 0),
  totalStocks: qiitaStats.items.reduce((sum, i) => sum + i.stocks, 0),
  seoTopCount: 11,
  asOfDate: qiitaStats.asOfDate,
};

/** 指定した記事の最新PV合計（qiita-stats.json から算出するので数値が古くならない） */
const sumPv = (ids: string[]) =>
  qiitaStats.items.filter((i) => ids.includes(i.itemId)).reduce((sum, i) => sum + i.pv, 0);

/** 「AIエージェントにGAS開発を任せる」シリーズ */
const GAS_MCP_SERIES_IDS = ['ed9e06b70c4518779ac1', '098a217d65c776dbb612', '1541c5f0220e925a03b4'];
const gasMcpSeriesPv = sumPv(GAS_MCP_SERIES_IDS).toLocaleString('ja-JP');

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
      { label: 'Google検索 1位・AI引用', value: '7クエリ制覇' },
    ],
    representativeIds: [
      '00f5b3275749dbd820c3',
      '9a808e45a2abe8f0f0a1',
      '466b4fd05cb9408920f4',
      '02790d25e584204909d0',
      '3b7bd9cde3efcc601952',
      '12a8df355ee895ed73d4',
      '9ea2c5d3027c178c055e',
      '320aaae5305b98bc0ad5',
    ],
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
      { label: 'Qiita統計自動化記事', value: '検索1位 & 7ストック' },
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
      'Model Context Protocol (MCP) サーバーの独自実装から、Rust × Node.js による特権分離、ハッシュキャッシュによるAIトークン消費90%削減、コンシューマGPU（RTX 3060）でのSWE-bench 40.7%完走を実現した制御プレーンまで、実務で破綻しないAI基盤を実装・検証してきました。',
    techStack: ['MCP (Model Context Protocol)', 'Rust', 'Node.js', 'TypeScript', 'Python', 'Local LLM / Ollama', 'Aider', 'systemd'],
    metrics: [
      { label: 'SWE-bench Lite (RTX 3060)', value: '40.7% 完走・検索1位' },
      { label: 'AIトークン消費削減率', value: '最大 90% 削減' },
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

export const SEO_EVIDENCES: SeoEvidence[] = [
  {
    domain: 'Python / 株データ基盤',
    queries: ['yfinance 429', 'yfinance 日本株 欠損'],
    articleIds: ['00f5b3275749dbd820c3', '12a8df355ee895ed73d4'],
    position: '2記事同時上位ランクイン',
    highlight: '累計PV 1位の看板記事と最新EDINET連携記事が、ともに検索上位に表示',
  },
  {
    domain: 'Python / 高速データ処理',
    queries: ['yfinance RSI MultiIndex 高速 銘柄'],
    articleIds: ['466b4fd05cb9408920f4', '02790d25e584204909d0'],
    position: '1位・2位独占（AI引用 [1],[2],[4],[5]）',
    highlight: '4,000銘柄のテクニカル指標計算・高速復旧でGoogle AI Overviewを独占',
  },
  {
    domain: 'Python / EDINET財務分析',
    queries: ['EDINET 訂正有報 Python yfinance'],
    articleIds: ['12a8df355ee895ed73d4'],
    position: 'Google検索 1位（AI最優先引用 [1]）',
    highlight: '30日スキャン＋差分キャッシュによる訂正有報の取りこぼし防止設計',
  },
  {
    domain: 'Python / Polars高速化',
    queries: ['Polars Expression 銘柄 株価 Python'],
    articleIds: ['02790d25e584204909d0'],
    position: 'Google検索 1位（AI最優先引用 [1]）',
    highlight: '手続き型ループから宣言型Polars Expressionへの転換で0.03秒処理を実現',
  },
  {
    domain: 'Python / 財務スクリーニング',
    queries: ['yfinance Polars 債務超過 スクリーニング'],
    articleIds: ['9ea2c5d3027c178c055e'],
    position: 'Google検索 1位（AI最優先引用 [1]）',
    highlight: '独自考案の「3層フィルタ」アーキテクチャがGoogle AI回答にそのまま採用',
  },
  {
    domain: 'Colab / DB高速化・耐障害',
    queries: ['Colab Google Drive DuckDB SQLite 遅い ロック'],
    articleIds: ['320aaae5305b98bc0ad5', '3b7bd9cde3efcc601952'],
    position: 'Google検索 1位（AI最優先引用 [1],[2]）',
    highlight: '「データステージング設計」がGoogle AI回答の標準プラクティスとして採用',
  },
  {
    domain: 'Colab / SQLite自己修復',
    queries: ['Colab SQLite3 自己修復 キャッシュ'],
    articleIds: ['3b7bd9cde3efcc601952', '320aaae5305b98bc0ad5'],
    position: '1位・2位（AI引用 [1]〜[5] すべて自記事）',
    highlight: 'AI Overviewの引用枠（[1]〜[5]）がすべて自分の記事',
  },
  {
    domain: 'Colab / Git運用設計',
    queries: ['Colab "destination path already exists" git clone'],
    articleIds: ['1214793c2c384b81fe63'],
    position: '上位ランクイン（AI引用 [2]）',
    highlight: 'ノートブック再実行時の冪等性を担保するリポジトリセットアップ設計',
  },
  {
    domain: 'GAS / データ可視化自動化',
    queries: ['Qiita 統計 GAS スプレッドシート PV'],
    articleIds: ['5b690c6e6eafe88f0e75'],
    position: 'Google検索 1位（AI最優先引用 [1]）',
    highlight: 'Qiita API × スプレッドシート × Notion連携による統計全自動化',
  },
  {
    domain: 'GAS / MCP / AIエージェント',
    queries: ['GAS MCPサーバー clasp', 'GAS エミュレータ AIエージェント MCP'],
    articleIds: ['098a217d65c776dbb612', 'ed9e06b70c4518779ac1'],
    position: '2記事同時上位ランクイン',
    highlight: 'GASをAIエージェントから自律開発・テストさせるMCPサーバー＆エミュレータ設計',
  },
  {
    domain: 'ローカルLLM / SWE-bench',
    queries: ['SWE-bench Lite RTX 3060 ローカルLLM'],
    articleIds: ['a73b56f360009d7d46f5'],
    position: 'Google検索 1位（AI最優先引用 [1]）',
    highlight: 'RTX 3060（12GB VRAM）環境でのローカルLLM制御プレーン設計と40.7%完走記録',
  },
];

export const PRODUCTS_AND_BOOKS: ProductItem[] = [
  {
    id: 'book-stock-pipeline',
    type: 'book',
    badge: 'Zenn Book / 実践テンプレート',
    title: '日本株データ基盤・完全構築ガイド（EDINET × yfinance × Polars × Colab）',
    description:
      'Qiitaで検索1位を獲得した8本の株データ基盤記事を一気通貫のプロダクションコードに統合。訂正有報の30日差分スキャン、yfinance 429自己修復、Polars 3層フィルタ、Colabローカルステージングまで完全収録。',
    features: [
      '全4,400銘柄を9分台で処理するTurboパイプライン完成形コード',
      'EDINET API × yfinance のハイブリッド欠損補完・恒等式再構成モジュール',
      'Colab / ローカル両対応のSQLite・DuckDBステージング基盤',
    ],
    tech: ['Python', 'Polars', 'EDINET', 'yfinance', 'DuckDB', 'SQLite3'],
    status: 'coming-soon',
    priceOrLicense: '公開準備中（先行案内受付中）',
    linkUrl: '#contact',
    linkLabel: '先行案内・導入相談を申し込む',
  },
  {
    id: 'book-gas-mcp',
    type: 'book',
    badge: 'Zenn Book / 自律開発パッケージ',
    title: 'GAS × MCPサーバー × ローカルエミュレータによるAI自律開発環境構築パッケージ',
    description:
      `累計${gasMcpSeriesPv} PVを記録した「AIエージェントにGAS開発を任せる」シリーズを体系化。clasp連携MCPサーバーと高速ローカルエミュレータにより、AIが自らコードを書き、テストし、デプロイする自律ループを構築します。`,
    features: [
      'コピペで動くGAS専用MCPサーバー（TypeScript実装）一式',
      'Spreadsheet / PropertiesService / UrlFetchApp のローカルモック＆エミュレータ',
      'Google Workspace × Notion API 自動同期ボットの実装テンプレート',
    ],
    tech: ['GAS', 'TypeScript', 'MCP', 'clasp', 'Node.js', 'Notion API'],
    status: 'coming-soon',
    priceOrLicense: '公開準備中（先行案内受付中）',
    linkUrl: '#contact',
    linkLabel: '先行案内・導入相談を申し込む',
  },
  {
    id: 'book-local-llm-control-plane',
    type: 'book',
    badge: 'Zenn Book / アーキテクチャ設計書',
    title: 'コンシューマGPU（RTX 3060）で回すローカルLLM制御プレーン設計・実装ガイド',
    description:
      '12GB VRAMのRTX 3060でSWE-bench Lite 40.7%完走を達成した制御プレーンの全設計。Proxy・死活監視Monitor・ハッシュキャッシュ・Rust×Node.js特権分離まで、ローカルLLMを実用戦力化するノウハウを凝縮。',
    features: [
      '推論サーバーのハング・OOMを自動検知して復旧するProxy & Monitor実装',
      'AIトークン消費を9割削減する決定論的ハッシュキャッシュ機構',
      'Highlander Protocol（唯一性保証）と特権分離によるエージェント暴走防止',
    ],
    tech: ['Python', 'Rust', 'Node.js', 'systemd', 'Local LLM', 'Aider'],
    status: 'coming-soon',
    priceOrLicense: '公開準備中（先行案内受付中）',
    linkUrl: '#contact',
    linkLabel: '先行案内・導入相談を申し込む',
  },
  {
    id: 'oss-stock-analyzer-core',
    type: 'oss',
    badge: 'Architecture & Reference',
    title: 'stock-analyzer-core（整合性基準設計・財務スクリーニング基盤）',
    description:
      '外部APIの不完全な出力や通信エラーを前提に、システム全体のデータ整合性を自己修復しながら高速スクリーニングを実行するコアエンジン設計。',
    features: [
      '3層フィルタ（除外監査ファイル分離）による安全な銘柄スクリーニング',
      'Pandas MultiIndex / Polars Expression によるベクトル演算パイプライン',
      '破損を前提としたSQLite3ウォームキャッシュ＆自動再構成',
    ],
    tech: ['Python', 'Polars', 'Pandas', 'SQLite3', 'EDINET'],
    status: 'available',
    priceOrLicense: '技術記事・設計リファレンス公開中',
    linkUrl: 'https://qiita.com/akkyey/items/9a808e45a2abe8f0f0a1',
    linkLabel: 'アーキテクチャ解説記事を読む',
  },
];

export const SERVICE_PLANS: ServicePlan[] = [
  {
    id: 'spot-automation',
    badge: 'クイック導入・業務自動化',
    title: 'GAS × Google Workspace × 外部API 自動化構築',
    target: '手作業の集計・レポート作成・Notion/Slack/Sheets間の転記をなくしたい企業・個人事業主様',
    description:
      '現状の業務フローをヒアリングし、Google Apps Script（TypeScript管理）を用いてエラー通知・再試行を備えた堅牢な自動化ツールを構築します。',
    deliverables: [
      '自動化スクリプト一式（clasp / Git管理対応）',
      'エラー検知・リトライ・ログ記録機構の組み込み',
      '運用手順書および引き継ぎレクチャー',
    ],
    duration: '1〜3週間',
  },
  {
    id: 'data-pipeline-build',
    badge: '主力プラン・データ基盤開発',
    title: '止まらないPythonデータ収集・高速分析パイプライン構築',
    target: '金融・財務データ、ECデータ、公開APIデータの収集・クレンジング・高速集計基盤が必要な方',
    description:
      'APIレート制限（429）対策、差分キャッシュ、欠損データの自動補完、Polars / DuckDB による高速化まで、「壊れない・止まらない」データ基盤を設計・実装します。',
    deliverables: [
      '自己修復型データ収集・ETF/分析パイプライン一式',
      'SQLite / DuckDB / BigQuery 等のデータストア設計',
      'データ品質監査レポート出力（異常値・除外データの可視化）',
    ],
    duration: '3〜6週間',
  },
  {
    id: 'ai-agent-mcp',
    badge: 'AI駆動開発・R&D支援',
    title: 'MCPサーバー開発・ローカルLLM制御プレーン・技術顧問',
    target: '社内システムをAIエージェントに接続したい開発チーム、ローカルLLM環境の安定運用を目指す組織様',
    description:
      '独自MCPサーバーの設計・実装、エージェントの権限制御・暴走防止アーキテクチャ導入、または既存システムのリファクタリング・技術アドバイザリーを提供します。',
    deliverables: [
      'カスタムMCPサーバー実装・ローカルエミュレータ環境',
      'AIエージェント制御プレーン・キャッシュ最適化設計',
      '週次/隔週のアーキテクチャレビュー・技術相談（顧問契約可）',
    ],
    duration: '1ヶ月〜（スポット相談も可）',
  },
];

/**
 * 記事ごとの独自情報（カテゴリ・検索上位バッジ・注目フラグ）。
 * タイトル・URL・PV などの数値は scripts/update-stats.mjs が生成する qiita-stats.json を正とし、ここには書かない。
 * 新しい記事をQiitaに公開したら、ここに1行足してカテゴリを決める（未登録でもビルドは通り、警告が出る）。
 */
export const ARTICLE_META: Record<string, ArticleMeta> = {
  '1214793c2c384b81fe63': { category: 'data-pipeline', seoBadge: 'Google検索上位・AI引用[2]' },
  '320aaae5305b98bc0ad5': { category: 'data-pipeline', seoBadge: 'Google検索1位・AI最優先引用[1]', featured: true },
  '9ea2c5d3027c178c055e': { category: 'data-pipeline', seoBadge: 'Google検索1位・「3層フィルタ」AI採用', featured: true },
  '12a8df355ee895ed73d4': { category: 'data-pipeline', seoBadge: 'Google検索1位・AI最優先引用[1]', featured: true },
  'a73b56f360009d7d46f5': { category: 'ai-mcp-llm', seoBadge: 'Google検索1位・AI最優先引用[1]', featured: true },
  'fc35e126098c8610b884': { category: 'ai-mcp-llm' },
  'fefa743bff5e0479a181': { category: 'ai-mcp-llm' },
  'c87adab22d485d8c62c9': { category: 'ai-mcp-llm' },
  '822f5d6ce31a9709d5a9': { category: 'ai-mcp-llm', featured: true },
  '76705c54607e2cc3a19b': { category: 'architecture' },
  '9a808e45a2abe8f0f0a1': { category: 'data-pipeline', seoBadge: '累計PV 全体3位', featured: true },
  'ccc008519baca7ea8b85': { category: 'gas-automation' },
  '02790d25e584204909d0': { category: 'data-pipeline', seoBadge: 'Google検索1位・AI最優先引用[1]', featured: true },
  '466b4fd05cb9408920f4': { category: 'data-pipeline', seoBadge: 'Google検索1位・2位独占', featured: true },
  '1541c5f0220e925a03b4': { category: 'gas-automation', featured: true },
  '098a217d65c776dbb612': { category: 'gas-automation', seoBadge: 'Google検索上位・AI引用', featured: true },
  'affe1d814e9e7efa1694': { category: 'architecture' },
  '6d025c6e89defccbf4eb': { category: 'architecture' },
  '0c1c20466b0382ca61b0': { category: 'ai-mcp-llm' },
  'ed9e06b70c4518779ac1': { category: 'gas-automation', seoBadge: '累計PV 全体2位・検索上位', featured: true },
  'e30e23e01127d90f47dd': { category: 'architecture' },
  '049e6f3fb658766d1e16': { category: 'architecture' },
  '5b690c6e6eafe88f0e75': { category: 'gas-automation', seoBadge: 'Google検索1位・AI最優先引用[1]', featured: true },
  '6718fcfd44dad8d6459d': { category: 'architecture' },
  '197a0c9f371789fdb007': { category: 'ai-mcp-llm' },
  '5716b0b14bfdcebd6d6b': { category: 'ai-mcp-llm' },
  '342d3946fd7d2a637018': { category: 'architecture' },
  '6ef21412c4ec6b479a78': { category: 'architecture' },
  '98adeefc2df5ed12f5a2': { category: 'architecture' },
  '3b7bd9cde3efcc601952': { category: 'data-pipeline', seoBadge: 'Google検索1位・AI引用[1]〜[5]独占', featured: true },
  '00f5b3275749dbd820c3': { category: 'data-pipeline', seoBadge: '累計PV 全体1位・検索1位', featured: true },
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
