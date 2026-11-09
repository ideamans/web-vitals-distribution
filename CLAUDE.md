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
   - 各Web Vitals指標（LCP, INP, CLS, TTFB, FCP, OL, FID, RTT）の閾値定義
   - RTT (Round Trip Time): ネットワーク診断指標（良い: 0-75ms、悪い: 275ms以上）
   - `createWebVitalDistribution`: 良い/悪い割合から対数正規分布モデルを生成

3. **数学ユーティリティ** (`src/two-lines.ts`)
   - 2直線の交点計算（分布パラメータの推定に使用）

### 主要な依存関係

- `@stdlib/math-base-special-erf`: 誤差関数の計算
- `@stdlib/math-base-special-erfinv`: 逆誤差関数の計算

0.3.x までは `math-erf` / `math-erfinv` を使っていたが、0.4.0 で `@stdlib/*` に替えた。
旧パッケージは実行時の依存に `update-notifier` を抱えており、**利用者の環境に
`got@5`・`dot-prop@3` などの脆弱な版が入っていた**（`overrides` は利用者に届かないので、依存ごと替えるしかない）。
`@stdlib/*` は同じ作者が移した後継で、±6 の範囲を細かく刻んで比べた差は erf で 0、erfinv で相対 3e-16。

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
### 開発用依存の resolutions

`package.json` の `resolutions` は、ava 8（`@vercel/nft`）・nyc 18（`test-exclude`）・typescript-eslint が引く
`glob` 11〜13 / `minimatch` 10 の moderate（GHSA-3g3m-2fjr-6pw4 / GHSA-g3hv-75wg-m249）を修正版へ逃がすためのもの。
開発用の依存だけで、公開パッケージの利用者には関係しない。親が修正版を要求するようになったら外す。

- ESLint は 9 に留めている。`eslint-plugin-eslint-comments` が ESLint 10 で動かない（`context.getSourceCode is not a function`）
- TypeScript は 5 系に留めている（6 は `moduleResolution: Node` を拒否する。7 は typescript-eslint が未対応）
- 開発ツールが Node 22 以上を要るため CI は 22 / 24 / 26 で回す。ライブラリ本体の `engines` は `>=18` のまま
- npm への公開は `v*` のタグの push で行う（下の「npm への公開」）。`main` への push では公開しない。`NPM_TOKEN` は使わない（2026-11 に失効して `E404 PUT` になった）

## npm への公開

`v*` のタグを push すると `.github/workflows/publish.yml` がテストとビルドのあと npm に**そのまま公開する**
（承認待ちにしない）。認証は npm の Trusted Publishing（GitHub Actions の OIDC）で、`NPM_TOKEN` などのシークレットは使わない。
provenance は自動で付く。

```bash
# package.json の version を上げてコミット・push してから
git tag vX.Y.Z && git push origin vX.Y.Z
```

- タグと package.json の version が違えば落ちる。npm に同じ版があれば何もしない
- プレリリース（`1.2.0-beta.0`）は `latest` ではなく識別子の dist-tag（`beta`）で出る
- 手元から `npm publish` しない（トークンを置かない）
- タグを打ち直さずに出し直すときは、Actions の「Publish to npm」を workflow_dispatch で起動する（選んだブランチの package.json の版を出す）
- PR で `publish.yml` を変えると、公開せずにビルドと `npm pack --dry-run` までが走る
- package.json の `repository` はこのリポジトリを指すこと。provenance の検証で照合され、違うと公開が `E422` で落ちる（ワークフローが先に検査する）
- 前提: npmjs.com の `web-vitals-distribution` の設定で、Trusted Publisher に GitHub Actions・`ideamans/web-vitals-distribution`・`publish.yml`・権限 **publish** を登録してあること。
  stage publish の権限だけだと `npm publish` は `E403 OIDC permission denied` になる
