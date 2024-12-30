import test from 'ava'

import { LogNormalDistribution } from './log-normal-distribution.js'

test('statistics', (t) => {
  const d = new LogNormalDistribution(0, 1)
  t.is(d.mu, 0, 'mu')
  t.is(d.sigma, 1, 'sigma')
  t.is(d.mean(), 1.648721270700128146849, 'mean')
  t.is(d.median(), 1, 'median')
  t.is(d.mode(), 0.3678794411714423215955, 'mode')
  t.is(d.pdf(1), 0.3989422804014327, 'pdf')
  t.is(d.cdf(1), 0.5, 'cdf1')
  t.is(d.cdf(2), 0.7558914042144173, 'cdf2')
  t.is(d.percentile(0.5), 1, 'cumulativeProbability')
})

test('create from mean and median', (t) => {
  const d = LogNormalDistribution.fromMeanAndMedian(2, 1)
  t.is(d.mu, 0, 'mu')
  t.is(d.sigma, 1.1774100225154747, 'sigma')
  t.is(d.mean(), 2, 'mean')
  t.is(d.median(), 1, 'median')
  t.is(d.mode(), 0.25, 'mode')
  t.is(d.pdf(1), 0.33883037580155256, 'pdf')
  t.is(d.cdf(1), 0.5, 'cdf1')
  t.is(d.cdf(2), 0.7219704121715109, 'cdf2')
  t.is(d.percentile(0.5), 1, 'cumulativeProbability')
})

test('create from cumulative distribution pair', (t) => {
  const d = LogNormalDistribution.fromCumulativeDistributionPair(1, 0.5, 2, 0.7558914042144173)
  t.is(d.mu, 0, 'mu')
  t.is(d.sigma, 1, 'sigma')
  t.is(d.cdf(1), 0.5, 'cdf1')
  t.is(d.cdf(2), 0.7558914042144173, 'cdf2')
})
