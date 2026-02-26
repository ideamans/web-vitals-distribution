import { LogNormalDistribution } from './log-normal-distribution.js'

const WebVitals: { [metric: string]: { good: number; poor: number } } = {
  lcp: {
    good: 2500,
    poor: 4000,
  },
  inp: {
    good: 200,
    poor: 500,
  },
  cls: {
    good: 0.1,
    poor: 0.25,
  },
  ttfb: {
    good: 800,
    poor: 1800,
  },
  fcp: {
    good: 1800,
    poor: 3000,
  },
  ol: {
    good: 2500,
    poor: 6500,
  },
  fid: {
    good: 100,
    poor: 300,
  },
  rtt: {
    good: 75,
    poor: 275,
  },
}

export type WebVitalType = keyof typeof WebVitals

export function createWebVitalDistribution(type: WebVitalType, goodRatio: number, poorRatio: number) {
  const wv = WebVitals[type]
  if (!wv) throw new Error('Invalid web vital type')
  return LogNormalDistribution.fromCumulativeDistributionPair(wv.good, goodRatio, wv.poor, 1 - poorRatio)
}
