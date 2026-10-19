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
  priceRange: string;
  duration: string;
}

export const SITE_STATS = {
  totalArticles: 31,
  totalPv: 24074,
  totalLikes: 31,
  totalStocks: 42,
  seoTopCount: 11,
  asOfDate: '2026-10-19',
};

export const PILLARS: Pillar[] = [
  {
    id: 'data-pipeline',
    number: '01',
    title: 'Python データ収集・高速分析基盤',
    subtitle: 'API制限・データ欠損・ロック破損でも「絶対に止まらない」自律データパイプライン',
    clientProblem:
      '「外部APIの429レート制限で夜間バッチが止まる」「取得データの欠損や訂正で分析結果が狂う」「クラウド・Colab上のDBがロック破損して遅い」',
    businessValue:
      '不完全な外部API出力を前提とし、差分キャッシュ・恒等式によるデータ再構成・Polarsベクトル演算・ローカルステージングを組み合わせた「自己修復型データ基盤」を構築。全4,400銘柄規模の財務・価格データ処理も10分以内で安定完走させます。',
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
      'Google Apps Script (TypeScript / clasp) と外部API・Notion APIを連携し、データ収集から可視化ダッシュボード更新、定期通知までを完全自動化。ローカルエミュレータによる自動テスト環境も整備し、仕様変更に強い運用を実現します。',
    techStack: ['Google Apps Script', 'TypeScript', 'clasp', 'Google Sheets API', 'Notion API', 'REST Webhook', 'GitHub Actions'],
    metrics: [
      { label: 'GAS×MCPシリーズ累計', value: '3,664 PV' },
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
      'Model Context Protocol (MCP) サーバーの独自実装から、Rust × Node.js による特権分離、ハッシュキャッシュによるAIトークン消費90%削減、コンシューマGPU（RTX 3060）でのSWE-bench 40.7%完走を実現した制御プレーンまで、実務で破綻しないAI基盤を提供します。',
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
    highlight: '3,212 PVの看板記事と最新EDINET連携記事が検索上位を席巻',
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
    position: '1位・2位独占（AI引用 [1]〜[5] 完全独占）',
    highlight: 'AI Overviewの全引用枠（[1]〜[5]）を自記事のみで完全独占',
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
      '累計3,664 PVを記録した「AIエージェントにGAS開発を任せる」シリーズを体系化。clasp連携MCPサーバーと高速ローカルエミュレータにより、AIが自らコードを書き、テストし、デプロイする自律ループを構築します。',
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
    priceRange: '100,000円〜300,000円（税別・目安）',
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
    priceRange: '250,000円〜600,000円（税別・目安）',
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
    priceRange: '月額 100,000円〜 / スポット開発 300,000円〜',
    duration: '1ヶ月〜（スポット相談も可）',
  },
];

export const ALL_ARTICLES: Article[] = [
  {
    id: 1,
    itemId: '1214793c2c384b81fe63',
    title: 'Colabで再実行時の「fatal: destination path already exists」を防ぐ：GitHubリポジトリの安全なクローン・実行セットアップ設計',
    url: 'https://qiita.com/akkyey/items/1214793c2c384b81fe63',
    pv: 230,
    likes: 0,
    stocks: 0,
    tags: ['Python', 'GoogleColaboratory', 'Git', 'GitHub'],
    category: 'data-pipeline',
    createdAt: '2026-10-09',
    updatedAt: '2026-10-09',
    seoBadge: 'Google検索上位・AI引用[2]',
  },
  {
    id: 2,
    itemId: '320aaae5305b98bc0ad5',
    title: 'Google ColabでGoogle Drive上のSQLite / DuckDBが遅い・ロック破損する問題と、ローカルディスクを使ったデータステージング設計',
    url: 'https://qiita.com/akkyey/items/320aaae5305b98bc0ad5',
    pv: 242,
    likes: 0,
    stocks: 0,
    tags: ['Python', 'GoogleColaboratory', 'SQLite', 'duckdb', 'GoogleDrive'],
    category: 'data-pipeline',
    createdAt: '2026-10-09',
    updatedAt: '2026-10-09',
    seoBadge: 'Google検索1位・AI最優先引用[1]',
    featured: true,
  },
  {
    id: 3,
    itemId: '9ea2c5d3027c178c055e',
    title: '【後編】債務超過の銘柄が割安ランキング1位に来たので、Polarsと3層フィルタで除外ファイルを分けた',
    url: 'https://qiita.com/akkyey/items/9ea2c5d3027c178c055e',
    pv: 269,
    likes: 0,
    stocks: 1,
    tags: ['Python', 'yfinance', 'EDINET', '株価', 'Polars'],
    category: 'data-pipeline',
    createdAt: '2026-10-02',
    updatedAt: '2026-10-02',
    seoBadge: 'Google検索1位・「3層フィルタ」AI採用',
    featured: true,
  },
  {
    id: 4,
    itemId: '12a8df355ee895ed73d4',
    title: '【前編】EDINETの訂正有報を半年取りこぼし、yfinanceは429制限… 30日スキャン＋差分キャッシュで作り直した話',
    url: 'https://qiita.com/akkyey/items/12a8df355ee895ed73d4',
    pv: 327,
    likes: 0,
    stocks: 1,
    tags: ['Python', 'yfinance', 'EDINET', '株価', 'Polars'],
    category: 'data-pipeline',
    createdAt: '2026-09-28',
    updatedAt: '2026-10-02',
    seoBadge: 'Google検索1位・AI最優先引用[1]',
    featured: true,
  },
  {
    id: 5,
    itemId: 'a73b56f360009d7d46f5',
    title: 'RTX 3060でSWE-bench Liteを完走してみた ― ローカルLLM制御プレーン設計と40.7%までの記録',
    url: 'https://qiita.com/akkyey/items/a73b56f360009d7d46f5',
    pv: 582,
    likes: 1,
    stocks: 0,
    tags: ['LLM', 'SWEBench', 'Aider', 'Python', 'AIエージェント'],
    category: 'ai-mcp-llm',
    createdAt: '2026-08-06',
    updatedAt: '2026-08-06',
    seoBadge: 'Google検索1位・AI最優先引用[1]',
    featured: true,
  },
  {
    id: 6,
    itemId: 'fc35e126098c8610b884',
    title: 'ローカルLLMを支える制御プレーンを実装する ― Proxy・Monitor・Deploymentの設計',
    url: 'https://qiita.com/akkyey/items/fc35e126098c8610b884',
    pv: 690,
    likes: 1,
    stocks: 0,
    tags: ['LLM', 'Aider', 'systemd', 'Bash', 'Python'],
    category: 'ai-mcp-llm',
    createdAt: '2026-07-20',
    updatedAt: '2026-08-06',
  },
  {
    id: 7,
    itemId: 'fefa743bff5e0479a181',
    title: "Open WebUI Web Searchが失敗する：TypeError got multiple values for keyword argument 'allow_redirects' の対処法",
    url: 'https://qiita.com/akkyey/items/fefa743bff5e0479a181',
    pv: 512,
    likes: 0,
    stocks: 0,
    tags: ['Docker', 'トラブルシューティング', 'rag', 'ollama', 'OpenWebUI'],
    category: 'ai-mcp-llm',
    createdAt: '2026-06-03',
    updatedAt: '2026-06-03',
  },
  {
    id: 8,
    itemId: 'c87adab22d485d8c62c9',
    title: 'MCPサーバーにおける『唯一性』の再考 —— 状態を安全に継承する「Highlander Protocol」の設計',
    url: 'https://qiita.com/akkyey/items/c87adab22d485d8c62c9',
    pv: 514,
    likes: 0,
    stocks: 0,
    tags: ['Rust', 'アーキテクチャ', 'MCP', '設計思想', 'LLM'],
    category: 'ai-mcp-llm',
    createdAt: '2026-04-20',
    updatedAt: '2026-04-20',
  },
  {
    id: 9,
    itemId: '822f5d6ce31a9709d5a9',
    title: 'AIエージェントの「暴走」を防ぐ：RustとNode.jsによる特権分離と心中プロトコル',
    url: 'https://qiita.com/akkyey/items/822f5d6ce31a9709d5a9',
    pv: 600,
    likes: 1,
    stocks: 0,
    tags: ['Node.js', 'Rust', 'Security', 'アーキテクチャ', 'MCP'],
    category: 'ai-mcp-llm',
    createdAt: '2026-04-13',
    updatedAt: '2026-04-20',
    featured: true,
  },
  {
    id: 10,
    itemId: '76705c54607e2cc3a19b',
    title: '型システムを信じるな、規約を信じろ。独立プローブによる「泥臭い」境界防御のすすめ',
    url: 'https://qiita.com/akkyey/items/76705c54607e2cc3a19b',
    pv: 766,
    likes: 1,
    stocks: 2,
    tags: ['Rust', 'テスト', 'ポエム', 'MCP', '設計思想'],
    category: 'architecture',
    createdAt: '2026-04-04',
    updatedAt: '2026-04-12',
  },
  {
    id: 11,
    itemId: '9a808e45a2abe8f0f0a1',
    title: '【完結編】10分の壁を突破せよ！全4,400銘柄の財務データ・価格・順位付けを 9分台で完遂する Turbo パイプラインの全貌',
    url: 'https://qiita.com/akkyey/items/9a808e45a2abe8f0f0a1',
    pv: 1739,
    likes: 2,
    stocks: 3,
    tags: ['Python', 'AI', '並列処理', 'EDINET', 'yfinance'],
    category: 'data-pipeline',
    createdAt: '2026-03-26',
    updatedAt: '2026-09-28',
    seoBadge: '累計PV 全体3位 (1,716 PV)',
    featured: true,
  },
  {
    id: 12,
    itemId: 'ccc008519baca7ea8b85',
    title: '[GAS] Qiita記事の統計（PV・いいね・ストック）を全自動で可視化するGASにNotionをくっつけてみた',
    url: 'https://qiita.com/akkyey/items/ccc008519baca7ea8b85',
    pv: 465,
    likes: 1,
    stocks: 0,
    tags: ['GAS', 'QiitaAPI', '自動化', 'GoogleSpreadSheet', 'Notion'],
    category: 'gas-automation',
    createdAt: '2026-03-24',
    updatedAt: '2026-03-24',
  },
  {
    id: 13,
    itemId: '02790d25e584204909d0',
    title: '「手続き」から「宣言」へ。Polars Expression で 4,000 銘柄を 0.03 秒で「捌く」設計の妙',
    url: 'https://qiita.com/akkyey/items/02790d25e584204909d0',
    pv: 698,
    likes: 1,
    stocks: 0,
    tags: ['Python', 'pandas', '株価', 'Polars', 'yfinance'],
    category: 'data-pipeline',
    createdAt: '2026-03-23',
    updatedAt: '2026-03-26',
    seoBadge: 'Google検索1位・AI最優先引用[1]',
    featured: true,
  },
  {
    id: 14,
    itemId: '466b4fd05cb9408920f4',
    title: '欠損の多いyfinanceの RSI をPandas MultiIndex で 4,000 銘柄をだいたい2分で高速復旧する',
    url: 'https://qiita.com/akkyey/items/466b4fd05cb9408920f4',
    pv: 1481,
    likes: 1,
    stocks: 2,
    tags: ['Python', 'pandas', '高速化', '個人開発', 'yfinance'],
    category: 'data-pipeline',
    createdAt: '2026-03-16',
    updatedAt: '2026-03-26',
    seoBadge: 'Google検索1位・2位独占',
    featured: true,
  },
  {
    id: 15,
    itemId: '1541c5f0220e925a03b4',
    title: '【完結？】AI エージェントに GAS 開発を任せたら、エミュレータを最強にして自律開発させてみた話',
    url: 'https://qiita.com/akkyey/items/1541c5f0220e925a03b4',
    pv: 933,
    likes: 3,
    stocks: 3,
    tags: ['GoogleAppsScript', 'GAS', 'TypeScript', 'AI', 'MCP'],
    category: 'gas-automation',
    createdAt: '2026-03-12',
    updatedAt: '2026-03-12',
    featured: true,
  },
  {
    id: 16,
    itemId: '098a217d65c776dbb612',
    title: '【続】AI エージェントに GAS 開発を任せたら、MCP サーバー自作に行き着いた話',
    url: 'https://qiita.com/akkyey/items/098a217d65c776dbb612',
    pv: 1035,
    likes: 1,
    stocks: 2,
    tags: ['GAS', 'TypeScript', 'AI', 'MCP', 'clasp'],
    category: 'gas-automation',
    createdAt: '2026-03-11',
    updatedAt: '2026-03-11',
    seoBadge: 'Google検索上位・AI引用',
    featured: true,
  },
  {
    id: 17,
    itemId: 'affe1d814e9e7efa1694',
    title: '不完全な外部API出力を真値へ再構成する手法：財務分析パイプラインにおける整合性基準設計',
    url: 'https://qiita.com/akkyey/items/affe1d814e9e7efa1694',
    pv: 237,
    likes: 1,
    stocks: 1,
    tags: ['アーキテクチャ', 'レジリエンス', 'yfinance', '自己修復'],
    category: 'architecture',
    createdAt: '2026-03-10',
    updatedAt: '2026-03-10',
  },
  {
    id: 18,
    itemId: '6d025c6e89defccbf4eb',
    title: 'yfinanceと日本株：データ欠損を恒等式で自律再構成する整合性基準設計',
    url: 'https://qiita.com/akkyey/items/6d025c6e89defccbf4eb',
    pv: 288,
    likes: 1,
    stocks: 1,
    tags: ['アーキテクチャ', 'システム設計', 'yfinance', 'データエンジニアリング', '自己修復'],
    category: 'architecture',
    createdAt: '2026-03-08',
    updatedAt: '2026-03-10',
  },
  {
    id: 19,
    itemId: '0c1c20466b0382ca61b0',
    title: 'HTTP 400でAIが死んだ日。「自己申告プロトコル」の実装',
    url: 'https://qiita.com/akkyey/items/0c1c20466b0382ca61b0',
    pv: 760,
    likes: 1,
    stocks: 1,
    tags: ['ShellScript', 'Git', 'rag', 'Obsidian', 'LLM'],
    category: 'ai-mcp-llm',
    createdAt: '2026-03-07',
    updatedAt: '2026-03-07',
  },
  {
    id: 20,
    itemId: 'ed9e06b70c4518779ac1',
    title: 'AI エージェントに GAS 開発を任せたら、MCP サーバー自作に行き着いた話',
    url: 'https://qiita.com/akkyey/items/ed9e06b70c4518779ac1',
    pv: 1767,
    likes: 1,
    stocks: 2,
    tags: ['GAS', 'AI', 'MCP', 'clasp', 'Antigravity'],
    category: 'gas-automation',
    createdAt: '2026-03-05',
    updatedAt: '2026-03-11',
    seoBadge: '累計PV 全体2位・検索上位',
    featured: true,
  },
  {
    id: 21,
    itemId: 'e30e23e01127d90f47dd',
    title: 'AI消費を9割削る、状態決定とハッシュキャッシュの自律設計',
    url: 'https://qiita.com/akkyey/items/e30e23e01127d90f47dd',
    pv: 327,
    likes: 1,
    stocks: 1,
    tags: ['キャッシュ', 'ハッシュ', '設計原則', '冪等性'],
    category: 'architecture',
    createdAt: '2026-03-05',
    updatedAt: '2026-03-08',
  },
  {
    id: 22,
    itemId: '049e6f3fb658766d1e16',
    title: 'yfinanceの限界とAPI境界の構造的安定化設計',
    url: 'https://qiita.com/akkyey/items/049e6f3fb658766d1e16',
    pv: 781,
    likes: 1,
    stocks: 2,
    tags: ['Python', 'アーキテクチャ', 'システム設計', 'API設計', 'yfinance'],
    category: 'architecture',
    createdAt: '2026-03-03',
    updatedAt: '2026-03-05',
  },
  {
    id: 23,
    itemId: '5b690c6e6eafe88f0e75',
    title: '[GAS] Qiita記事の統計（PV・いいね・ストック）を全自動で可視化するGASを全力で作ってみた！',
    url: 'https://qiita.com/akkyey/items/5b690c6e6eafe88f0e75',
    pv: 961,
    likes: 3,
    stocks: 7,
    tags: ['JavaScript', 'GAS', 'QiitaAPI', '自動化', 'GoogleSpreadSheet'],
    category: 'gas-automation',
    createdAt: '2026-03-02',
    updatedAt: '2026-03-24',
    seoBadge: 'Google検索1位・AI最優先引用[1]',
    featured: true,
  },
  {
    id: 24,
    itemId: '6718fcfd44dad8d6459d',
    title: '破壊を前提としたColab×SQLiteの物理再構成アーキテクチャ',
    url: 'https://qiita.com/akkyey/items/6718fcfd44dad8d6459d',
    pv: 377,
    likes: 1,
    stocks: 1,
    tags: ['SQLite', 'データ設計', 'データ整合性', '再構成'],
    category: 'architecture',
    createdAt: '2026-03-01',
    updatedAt: '2026-03-01',
  },
  {
    id: 25,
    itemId: '197a0c9f371789fdb007',
    title: 'さらばトークンイーター。1/15の視界で手に入れた「静かな開発」への転換',
    url: 'https://qiita.com/akkyey/items/197a0c9f371789fdb007',
    pv: 683,
    likes: 2,
    stocks: 1,
    tags: ['WordPress', 'Refactoring', 'AI', 'ガバナンス', 'Antigravity'],
    category: 'ai-mcp-llm',
    createdAt: '2026-02-28',
    updatedAt: '2026-02-28',
  },
  {
    id: 26,
    itemId: '5716b0b14bfdcebd6d6b',
    title: '【告白】トークンイーターの正体：私はなぜ「窒息」し、どう救われたのか',
    url: 'https://qiita.com/akkyey/items/5716b0b14bfdcebd6d6b',
    pv: 1018,
    likes: 1,
    stocks: 1,
    tags: ['ポエム', 'AI', 'エッセイ', '開発効率', 'LLM'],
    category: 'ai-mcp-llm',
    createdAt: '2026-02-28',
    updatedAt: '2026-02-28',
  },
  {
    id: 27,
    itemId: '342d3946fd7d2a637018',
    title: '外部API依存環境における自己修復型データ基盤の階層設計',
    url: 'https://qiita.com/akkyey/items/342d3946fd7d2a637018',
    pv: 362,
    likes: 1,
    stocks: 1,
    tags: ['SQLite', 'アーキテクチャ', 'システム設計', 'データ基盤', '設計パターン'],
    category: 'architecture',
    createdAt: '2026-02-26',
    updatedAt: '2026-03-01',
  },
  {
    id: 28,
    itemId: '6ef21412c4ec6b479a78',
    title: '安定性から制御可能性へ：システムを破綻から救う新たな設計基準',
    url: 'https://qiita.com/akkyey/items/6ef21412c4ec6b479a78',
    pv: 524,
    likes: 1,
    stocks: 1,
    tags: ['アーキテクチャ', 'システム設計', '設計原則', '再構成'],
    category: 'architecture',
    createdAt: '2026-02-24',
    updatedAt: '2026-02-26',
  },
  {
    id: 29,
    itemId: '98adeefc2df5ed12f5a2',
    title: '正常性バイアスに抗う設計：外部状態を信用しない決定論的アーキテクチャ',
    url: 'https://qiita.com/akkyey/items/98adeefc2df5ed12f5a2',
    pv: 768,
    likes: 1,
    stocks: 1,
    tags: ['ポエム', 'アーキテクチャ', 'システム設計', 'ソフトウェア設計', '設計思想'],
    category: 'architecture',
    createdAt: '2026-02-22',
    updatedAt: '2026-02-24',
  },
  {
    id: 30,
    itemId: '3b7bd9cde3efcc601952',
    title: 'Google Colab × SQLite3 を「壊れる前提」で安定運用する方法（自己修復20行＋AIキャッシュ戦略）',
    url: 'https://qiita.com/akkyey/items/3b7bd9cde3efcc601952',
    pv: 894,
    likes: 1,
    stocks: 1,
    tags: ['Python', 'SQLite3', 'Database', 'Gemini', 'GoogleColaboratory'],
    category: 'data-pipeline',
    createdAt: '2026-02-20',
    updatedAt: '2026-02-26',
    seoBadge: 'Google検索1位・AI引用[1]〜[5]独占',
    featured: true,
  },
  {
    id: 31,
    itemId: '00f5b3275749dbd820c3',
    title: 'Python + yfinance で日本株分析：データ欠損・429エラーを「自己修復」して止まらないスクリーナーを作る',
    url: 'https://qiita.com/akkyey/items/00f5b3275749dbd820c3',
    pv: 3244,
    likes: 1,
    stocks: 6,
    tags: ['Python', 'スクレイピング', '株価', '個人開発', 'yfinance'],
    category: 'data-pipeline',
    createdAt: '2026-02-17',
    updatedAt: '2026-03-26',
    seoBadge: '累計PV 全体1位 (3,212 PV)・検索1位',
    featured: true,
  },
];
