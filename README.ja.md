# Web Vitals のための確率分布ユーティリティ

Web Vitalsの多くの指標は対数正規分布に基づくとされる。このユーティリティはWeb Vitalsの確率分布を扱うための各種機能を提供する。

## インストール

```bash
npm i web-vitals-distribution
```

## 使い方

[Chrome UX Report](https://developer.chrome.com/docs/crux)は、サイトにおけるWeb Vitalsの実績を、良い基準の割合、悪い基準の割合、75パーセンタイル値で提供している。

このライブラリは、良い基準の割合と悪い基準の割合からWeb Vitalsの対数正規分布モデルを復元する。

その対数正規分布モデルを最頻値などの統計量の推測や、PDF(確率密度関数)の描画に活用できる。

例えばLCPの良い基準が61%、悪い基準が18%の場合、以下のようにして対数正規分布モデルを復元できる。

```javascript
import { createWebVitalsDistribution } from 'web-vitals-distribution'

const logNormalDistribution = createWebVitalsDistribution('lcp', 0.61, 0.18)

// Draw PDF up to 99 percentile
const p99 = logNormalDistribution.percentile(0.99)
for (let i = 0; i < 100; i++) {
  const x = (p99 * i) / 100
  const probability = logNormalDistribution.pdf(x)
}

// Get mode, median, mean
const mode = logNormalDistribution.mode()
const median = logNormalDistribution.median()
const mean = logNormalDistribution.mean()
```
