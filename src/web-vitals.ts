import { LogNormalDistribution } from './log-normal-distribution.js'

const WebVitals: { [metric: string]: { good: number; poor: number } } = {
  lcp: {
    good: 2500,
    poor: 4000,
  },
  inp: {
    good: 100,
    poor: 500,
  },
  cls: {
    good: 0.1,
    poor: 0.25,
  },
  ttfb: {
    good: 500,
    poor: 1500,
  },
  fcp: {
    good: 1500,
    poor: 2500,
  },
  ol: {
    good: 2500,
    poor: 6500,
  },
  fid: {
    good: 100,
    poor: 300,
  },
}

export type WebVitalType = keyof typeof WebVitals

export function createWebVitalDistribution(type: WebVitalType, goodRatio: number, poorRatio: number) {
  const wv = WebVitals[type]
  if (!wv) throw new Error('Invalid web vital type')
  return LogNormalDistribution.fromCumulativeDistributionPair(wv.good, goodRatio, wv.poor, 1 - poorRatio)
}
