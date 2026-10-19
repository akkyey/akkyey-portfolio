---
title: "Colab再実行時の「fatal: destination path already exists」を1行で解消する防御的クローン設計"
pubDate: 2026-10-18
description: "Google Colabのノートブックを再実行した際にGitクローンで毎回停止するのを防ぐワンライナーパターン。"
tags: ["GoogleColab", "Git", "Bash"]
draft: false
---

Google Colaboratory で GitHub のリポジトリをクローンして実行するスクリプトを共有していると、ユーザーが「すべてのセルを実行」を2回押した際に以下のエラーで止まる問題が多発します。

```text
fatal: destination path 'my-repo' already exists and is not an empty directory.
```

手動で `!rm -rf my-repo` を書かせると、編集中のコードやダウンロードしたキャッシュファイルまで吹き飛ばしてしまうリスクがあります。

## 解決策：存在チェックと pull を組み合わせる

既存ディレクトリがある場合は `git pull`、存在しない場合は `git clone` を行う防御的な1行をシェルの先頭に置きます。

```bash
[ -d "my-repo" ] && (cd my-repo && git pull) || git clone https://github.com/user/my-repo.git
```

### なぜこれにするのか？

- **再実行耐性（冪等性）**: 何度ノートブック全体を再実行しても途中でエラー停止しない。
- **最新コードへの追従**: すでにフォルダがあっても、リモートの最新コミットが反映される。
- **キャッシュの保護**: 実行途中に生成されたデータやモデルの重みファイルを不意に消去しない。

Colabを使った社内配布ツールやデモ環境では、この1行を初期化セルの定型文として埋め込んでおくのが最も事故が少ないです。
