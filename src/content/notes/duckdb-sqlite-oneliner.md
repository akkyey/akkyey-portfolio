---
title: "DuckDBで巨大CSVをSQLiteへ型推論付きで一撃変換するCLIワンライナー"
pubDate: 2026-10-15
description: "PandasでOOM（メモリ不足）になりがちな巨大CSVを、DuckDBのATTACH構文で瞬時にSQLiteへ流し込むためのコマンド備忘録。"
tags: ["DuckDB", "SQLite", "Python", "CLI"]
draft: false
---

金融データや企業データなどで、ギガバイト級のCSVファイルを「とりあえずSQLiteに入れてインデックスを張ってクエリしたい」という場面がよくあります。

Pythonの `pandas.read_csv()` 経由で `to_sql()` すると、全行をメモリに抱え込んでOOM（Out of Memory）でクラッシュするか、チャンク処理のコードを書く羽目になります。

DuckDBのCLIを使えば、**拡張機能のインストールからSQLiteへの直接書き込みまでワンライナー**で完了します。

## 実行コマンド

```bash
duckdb -c "
INSTALL sqlite;
LOAD sqlite;
ATTACH 'database.sqlite' AS my_db (TYPE sqlite);
CREATE TABLE my_db.records AS 
  SELECT * FROM read_csv_auto('large_dataset.csv');
"
```

### ポイントと設計意図

1. **型推論の正確さ**
   - `read_csv_auto` が最初の一定行をサンプリングし、日付型（DATE/TIMESTAMP）や数値型（INTEGER/DOUBLE）を極めて正確に推論してSQLite側のテーブル定義（DDL）を自動生成します。
2. **メモリ効率**
   - DuckDBのストリーミングパイプライン処理により、数十GBのファイルでもマシンの実メモリ上限を超えずに安定して処理が完結します。
3. **後処理（インデックス作成）**
   - 流し込み完了後、そのままDuckDB経由（または通常のSQLite CLI）でインデックスを張るだけで即座に分析基盤として使えます。

```bash
sqlite3 database.sqlite "CREATE INDEX idx_code ON records(code);"
```

夜間バッチや初期データ移行で「とにかく手早くSQLite化したい」ときの定番ワンライナーです。
