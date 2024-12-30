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
