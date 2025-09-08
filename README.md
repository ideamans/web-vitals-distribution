# Probability Distribution Utility for Web Vitals

Many Web Vitals metrics are said to follow a lognormal distribution. This utility provides various features for working with the probability distributions of Web Vitals.

## Installation

```bash
npm i web-vitals-distribution
```

## Supported Web Vitals Metrics

This library supports all major Web Vitals metrics with their respective thresholds:

| Metric | Description | Good | Poor |
|--------|-------------|------|------|
| **LCP** | Largest Contentful Paint | < 2500ms | > 4000ms |
| **INP** | Interaction to Next Paint | < 100ms | > 500ms |
| **CLS** | Cumulative Layout Shift | < 0.1 | > 0.25 |
| **TTFB** | Time to First Byte | < 500ms | > 1500ms |
| **FCP** | First Contentful Paint | < 1500ms | > 2500ms |
| **OL** | Onload | < 2500ms | > 6500ms |
| **FID** | First Input Delay | < 100ms | > 300ms |
| **RTT** | Round Trip Time (Network Diagnostic) | < 75ms | > 275ms |

## Usage

[Chrome UX Report](https://developer.chrome.com/docs/crux) provides data about your site's Web Vitals performance, including the percentage of "good" thresholds, the percentage of "bad" thresholds, and the 75th percentile value.

This library reconstructs a lognormal distribution model for Web Vitals based on the percentages of the "good" threshold and the "bad" threshold.

### Basic Example

```javascript
import { createWebVitalsDistribution } from 'web-vitals-distribution'

// Create distribution from CrUX data
// Parameters: metric type, good ratio, poor ratio
const lcpDistribution = createWebVitalsDistribution('lcp', 0.61, 0.18)

// Get statistical measures
const mode = lcpDistribution.mode()     // Most frequent value
const median = lcpDistribution.median() // 50th percentile
const mean = lcpDistribution.mean()     // Average value

console.log(`LCP Mode: ${mode}ms`)
console.log(`LCP Median: ${median}ms`)
console.log(`LCP Mean: ${mean}ms`)
```

### Working with Percentiles

```javascript
// Get specific percentiles
const p75 = lcpDistribution.percentile(0.75)  // 75th percentile
const p90 = lcpDistribution.percentile(0.90)  // 90th percentile
const p99 = lcpDistribution.percentile(0.99)  // 99th percentile

console.log(`75th percentile: ${p75}ms`)
console.log(`90th percentile: ${p90}ms`)
console.log(`99th percentile: ${p99}ms`)
```

### Probability Calculations

```javascript
// Calculate cumulative distribution function (CDF)
// Returns the probability that a value is less than or equal to x
const probUnder3000 = lcpDistribution.cdf(3000)
console.log(`Probability of LCP < 3000ms: ${(probUnder3000 * 100).toFixed(1)}%`)

// Calculate probability density function (PDF)
// Returns the relative likelihood of a specific value
const density2500 = lcpDistribution.pdf(2500)
```

### Drawing Distribution Charts

```javascript
// Generate data points for charting PDF
const p99 = lcpDistribution.percentile(0.99)
const chartData = []

for (let i = 0; i <= 100; i++) {
  const x = (p99 * i) / 100
  const probability = lcpDistribution.pdf(x)
  chartData.push({ x, probability })
}

// Use chartData with your favorite charting library
// (e.g., Chart.js, D3.js, Plotly, etc.)
```

### Network Diagnostics with RTT

RTT (Round Trip Time) is a diagnostic metric that helps understand network conditions:

```javascript
// Analyze network conditions from CrUX RTT data
const rttDistribution = createWebVitalsDistribution('rtt', 0.7, 0.15)

// Get network statistics
const rttMedian = rttDistribution.median()
const rttP90 = rttDistribution.percentile(0.90)

console.log(`Network RTT median: ${rttMedian}ms`)
console.log(`Network RTT 90th percentile: ${rttP90}ms`)

// Note: RTT is a diagnostic indicator and cannot be directly improved by site owners
// Use it to understand performance variations due to network conditions
```

### Complete Example with Multiple Metrics

```javascript
import { createWebVitalsDistribution } from 'web-vitals-distribution'

// CrUX data for your site
const metrics = {
  lcp: { good: 0.61, poor: 0.18 },
  inp: { good: 0.85, poor: 0.05 },
  cls: { good: 0.75, poor: 0.15 },
  ttfb: { good: 0.90, poor: 0.03 }
}

// Analyze each metric
for (const [metric, ratios] of Object.entries(metrics)) {
  const dist = createWebVitalsDistribution(metric, ratios.good, ratios.poor)
  
  console.log(`\n${metric.toUpperCase()} Analysis:`)
  console.log(`  Mode: ${dist.mode().toFixed(2)}`)
  console.log(`  Median: ${dist.median().toFixed(2)}`)
  console.log(`  75th percentile: ${dist.percentile(0.75).toFixed(2)}`)
  console.log(`  90th percentile: ${dist.percentile(0.90).toFixed(2)}`)
}
```

## API Reference

### `createWebVitalsDistribution(type, goodRatio, poorRatio)`

Creates a log-normal distribution for a Web Vitals metric.

- `type`: One of `'lcp'`, `'inp'`, `'cls'`, `'ttfb'`, `'fcp'`, `'ol'`, `'fid'`, `'rtt'`
- `goodRatio`: Percentage of users with "good" experience (0-1)
- `poorRatio`: Percentage of users with "poor" experience (0-1)

Returns a `LogNormalDistribution` instance with the following methods:

- `pdf(x)`: Probability density function at value x
- `cdf(x)`: Cumulative distribution function up to value x
- `percentile(p)`: Value at percentile p (0-1)
- `mean()`: Mean of the distribution
- `median()`: Median of the distribution
- `mode()`: Mode of the distribution
