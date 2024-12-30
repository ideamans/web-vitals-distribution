import ava from 'ava'

import { solveTwoLines } from './two-lines.js'

ava('two lines', (t) => {
  t.deepEqual(solveTwoLines(1, 2, 3, 4), { x: -1, y: 1 })
  t.throws(() => solveTwoLines(1, 2, 1, 2), { instanceOf: Error, message: 'Infinite solutions' })
  t.throws(() => solveTwoLines(1, 2, 1, 3), { instanceOf: Error, message: 'No solutions' })
})
