export interface TwoLinesResult {
  x: number
  y: number
}

export function solveTwoLines(a1: number, b1: number, a2: number, b2: number): TwoLinesResult {
  if (a1 === a2) {
    if (b1 === b2) {
      throw new Error('Infinite solutions')
    } else {
      throw new Error('No solutions')
    }
  }

  const x = (b2 - b1) / (a1 - a2)
  const y = a1 * x + b1

  return { x, y }
}
