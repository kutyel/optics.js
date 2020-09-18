import { foldFromToArray } from '../src/Fold'
import { optic, reduce, toArray } from '../src/operations'

const doubleArray = [
  [1, 2],
  [3, 4],
]

const valuesFold = foldFromToArray((obj) => [...obj])

describe('Traversal', () => {
  test('traversal from array reduces', () => {
    expect(reduce(valuesFold, (x, y) => x + y, 0, [1, 2])).toBe(3)
  })

  test('traversal from double array reduces', () => {
    const o = optic(valuesFold, valuesFold)
    expect(reduce(o, (x, y) => x + y, 0, doubleArray)).toBe(10)
  })

  test('traversal from double array reduces', () => {
    const o = optic(valuesFold, valuesFold)
    expect(toArray(o, doubleArray)).toStrictEqual(doubleArray.flat())
  })
})
