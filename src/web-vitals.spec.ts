import test from 'ava'

import { createWebVitalDistribution } from './web-vitals.js'

test('lcpDistribution', (t) => {
  const d = createWebVitalDistribution('lcp', 0.61, 0.18)
  t.is(d.mu, 7.617644352978045, 'mu')
  t.is(d.sigma, 0.7389459092415528, 'sigma')
  t.is(d.cdf(2500), 0.61, 'good')
  t.is(d.cdf(4000), 0.8200000000000001, 'bad')
  t.is(d.mode(), 1178.0352604021325, 'mode')
})

test('rttDistribution', (t) => {
  const d = createWebVitalDistribution('rtt', 0.7, 0.15)
  t.is(Math.round(d.cdf(75) * 100) / 100, 0.7, 'good threshold')
  t.is(Math.round(d.cdf(275) * 100) / 100, 0.85, 'poor threshold')
  t.true(d.mode() > 0, 'mode is positive')
  t.true(d.median() > 0, 'median is positive')
  t.true(d.mean() > 0, 'mean is positive')
})
