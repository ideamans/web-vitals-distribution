# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## プロジェクト概要

Web Vitalsの確率分布を扱うTypeScriptライブラリ。対数正規分布モデルを使用して、Chrome UX Reportから提供される「良い」「悪い」閾値の割合データから、Web Vitalsの完全な確率分布を復元する。

## 開発コマンド

```bash
# TypeScriptのビルド
npm run build
# または
yarn build

# テストの実行（ビルド → lint → prettier → スペルチェック → ユニットテスト）
npm test
# または
yarn test

# 個別のテスト実行
npm run test:unit    # ユニットテストのみ
npm run test:lint    # ESLintのみ
npm run test:prettier # Prettierチェックのみ
npm run test:cspell  # スペルチェックのみ

# コードの自動修正
npm run fix          # lint と prettier の自動修正を実行
npm run fix:lint     # ESLintの自動修正
npm run fix:prettier # Prettierの自動修正

# ウォッチモード（開発時のテスト自動実行）
npm run watch
# または
yarn watch
```

## アーキテクチャ

### コア機能

1. **LogNormalDistribution クラス** (`src/log-normal-distribution.ts`)
   - 対数正規分布の実装
   - `fromCumulativeDistributionPair`: 2つの累積分布値から分布パラメータ（μ, σ）を復元
   - 確率密度関数（PDF）、累積分布関数（CDF）、パーセンタイル計算
   - 統計量の計算（平均、中央値、最頻値）

2. **Web Vitals サポート** (`src/web-vitals.ts`)
   - 各Web Vitals指標（LCP, INP, CLS, TTFB, FCP, OL, FID）の閾値定義
   - `createWebVitalDistribution`: 良い/悪い割合から対数正規分布モデルを生成

3. **数学ユーティリティ** (`src/two-lines.ts`)
   - 2直線の交点計算（分布パラメータの推定に使用）

### 主要な依存関係

- `math-erf`: 誤差関数の計算
- `math-erfinv`: 逆誤差関数の計算

## コード規約

### Prettier設定
- シングルクォート使用
- セミコロンなし
- 行幅120文字

### TypeScript設定
- ESNextターゲット
- ESModules使用（`.js`拡張子でインポート）
- strictモード有効
- Node.js型定義を含む

### テスト
- AVAテストフレームワーク使用
- テストファイルは `*.spec.ts` 形式
- NYCでカバレッジ測定