import Erf from 'math-erf'
import Erfinv from 'math-erfinv'

import { solveTwoLines } from './two-lines.js'

const sqrt2 = Math.sqrt(2)
const sqrt2pi = Math.sqrt(2 * Math.PI)

export class LogNormalDistribution {
  mu: number
  sigma: number

  constructor(mu: number, sigma: number) {
    this.mu = mu
    this.sigma = sigma
  }

  static fromMeanAndMedian(mean: number, median: number) {
    const sigma = Math.sqrt(2 * Math.log(mean / median))
    const mu = Math.log(mean) - Math.pow(sigma, 2) / 2
    return new LogNormalDistribution(mu, sigma)
  }

  static fromCumulativeDistributionPair(x1: number, y1: number, x2: number, y2: number) {
    const a1 = sqrt2 * Erfinv(1 - 2 * y1)
    const b1 = Math.log(x1)

    const a2 = sqrt2 * Erfinv(1 - 2 * y2)
    const b2 = Math.log(x2)

    const { x: sigma, y: mu } = solveTwoLines(a1, b1, a2, b2)
    return new LogNormalDistribution(mu, sigma)
  }

  pdf(x: number) {
    const a = 1 / (x * this.sigma * sqrt2pi)
    const b = Math.exp(-Math.pow(Math.log(x) - this.mu, 2) / (2 * Math.pow(this.sigma, 2)))
    return a * b
  }

  cdf(x: number) {
    const logX_Mu = Math.log(x) - this.mu
    const sqrt2sigma = sqrt2 * this.sigma
    return 0.5 * (1 + Erf(logX_Mu / sqrt2sigma))
  }

  percentile(probability: number) {
    return Math.exp(sqrt2 * this.sigma * Erfinv(2 * probability - 1) + this.mu)
  }

  mean() {
    return Math.exp(this.mu + Math.pow(this.sigma, 2) / 2)
  }

  median() {
    return Math.exp(this.mu)
  }

  mode() {
    return Math.exp(this.mu - Math.pow(this.sigma, 2))
  }
}
