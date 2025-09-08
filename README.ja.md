# Web Vitals のための確率分布ユーティリティ

Web Vitalsの多くの指標は対数正規分布に基づくとされる。このユーティリティはWeb Vitalsの確率分布を扱うための各種機能を提供する。

## インストール

```bash
npm i web-vitals-distribution
```

## サポートするWeb Vitals指標

このライブラリは、以下の主要なWeb Vitals指標とその閾値をサポートする：

| 指標 | 説明 | 良い | 悪い |
|------|------|------|------|
| **LCP** | 最大視覚コンテンツの描画時間 | < 2500ms | > 4000ms |
| **INP** | 次の描画までの相互作用 | < 100ms | > 500ms |
| **CLS** | 累積レイアウトシフト | < 0.1 | > 0.25 |
| **TTFB** | 最初のバイトまでの時間 | < 500ms | > 1500ms |
| **FCP** | 最初のコンテンツ描画 | < 1500ms | > 2500ms |
| **OL** | ページ読み込み完了 | < 2500ms | > 6500ms |
| **FID** | 最初の入力遅延 | < 100ms | > 300ms |
| **RTT** | ラウンドトリップタイム（ネットワーク診断） | < 75ms | > 275ms |

## 使い方

[Chrome UX Report](https://developer.chrome.com/docs/crux)は、サイトにおけるWeb Vitalsの実績を、良い基準の割合、悪い基準の割合、75パーセンタイル値で提供している。

このライブラリは、良い基準の割合と悪い基準の割合からWeb Vitalsの対数正規分布モデルを復元する。

### 基本的な使用例

```javascript
import { createWebVitalsDistribution } from 'web-vitals-distribution'

// CrUXデータから分布を作成
// パラメータ: 指標タイプ、良い割合、悪い割合
const lcpDistribution = createWebVitalsDistribution('lcp', 0.61, 0.18)

// 統計量を取得
const mode = lcpDistribution.mode()     // 最頻値
const median = lcpDistribution.median() // 中央値（50パーセンタイル）
const mean = lcpDistribution.mean()     // 平均値

console.log(`LCP 最頻値: ${mode}ms`)
console.log(`LCP 中央値: ${median}ms`)
console.log(`LCP 平均値: ${mean}ms`)
```

### パーセンタイル値の取得

```javascript
// 特定のパーセンタイル値を取得
const p75 = lcpDistribution.percentile(0.75)  // 75パーセンタイル
const p90 = lcpDistribution.percentile(0.90)  // 90パーセンタイル
const p99 = lcpDistribution.percentile(0.99)  // 99パーセンタイル

console.log(`75パーセンタイル: ${p75}ms`)
console.log(`90パーセンタイル: ${p90}ms`)
console.log(`99パーセンタイル: ${p99}ms`)
```

### 確率計算

```javascript
// 累積分布関数（CDF）を計算
// x以下の値となる確率を返す
const probUnder3000 = lcpDistribution.cdf(3000)
console.log(`LCPが3000ms未満の確率: ${(probUnder3000 * 100).toFixed(1)}%`)

// 確率密度関数（PDF）を計算
// 特定の値の相対的な尤度を返す
const density2500 = lcpDistribution.pdf(2500)
```

### 分布グラフの描画

```javascript
// PDFグラフ用のデータポイントを生成
const p99 = lcpDistribution.percentile(0.99)
const chartData = []

for (let i = 0; i <= 100; i++) {
  const x = (p99 * i) / 100
  const probability = lcpDistribution.pdf(x)
  chartData.push({ x, probability })
}

// chartDataをお好みのグラフライブラリで使用
// （例：Chart.js、D3.js、Plotly など）
```

### RTTによるネットワーク診断

RTT（ラウンドトリップタイム）は、ネットワーク状況を理解するための診断指標：

```javascript
// CrUXのRTTデータからネットワーク状況を分析
const rttDistribution = createWebVitalsDistribution('rtt', 0.7, 0.15)

// ネットワーク統計を取得
const rttMedian = rttDistribution.median()
const rttP90 = rttDistribution.percentile(0.90)

console.log(`ネットワークRTT中央値: ${rttMedian}ms`)
console.log(`ネットワークRTT 90パーセンタイル: ${rttP90}ms`)

// 注意：RTTは診断指標であり、サイト運営者が直接改善することはできません
// ネットワーク状況によるパフォーマンスの変動を理解するために使用してください
```

### 複数指標の完全な例

```javascript
import { createWebVitalsDistribution } from 'web-vitals-distribution'

// あなたのサイトのCrUXデータ
const metrics = {
  lcp: { good: 0.61, poor: 0.18 },
  inp: { good: 0.85, poor: 0.05 },
  cls: { good: 0.75, poor: 0.15 },
  ttfb: { good: 0.90, poor: 0.03 }
}

// 各指標を分析
for (const [metric, ratios] of Object.entries(metrics)) {
  const dist = createWebVitalsDistribution(metric, ratios.good, ratios.poor)
  
  console.log(`\n${metric.toUpperCase()} 分析:`)
  console.log(`  最頻値: ${dist.mode().toFixed(2)}`)
  console.log(`  中央値: ${dist.median().toFixed(2)}`)
  console.log(`  75パーセンタイル: ${dist.percentile(0.75).toFixed(2)}`)
  console.log(`  90パーセンタイル: ${dist.percentile(0.90).toFixed(2)}`)
}
```

## APIリファレンス

### `createWebVitalsDistribution(type, goodRatio, poorRatio)`

Web Vitals指標の対数正規分布を作成する。

- `type`: `'lcp'`, `'inp'`, `'cls'`, `'ttfb'`, `'fcp'`, `'ol'`, `'fid'`, `'rtt'` のいずれか
- `goodRatio`: 「良い」体験のユーザーの割合（0-1）
- `poorRatio`: 「悪い」体験のユーザーの割合（0-1）

以下のメソッドを持つ `LogNormalDistribution` インスタンスを返す：

- `pdf(x)`: 値xにおける確率密度関数
- `cdf(x)`: 値xまでの累積分布関数
- `percentile(p)`: パーセンタイルp（0-1）における値
- `mean()`: 分布の平均値
- `median()`: 分布の中央値
- `mode()`: 分布の最頻値
