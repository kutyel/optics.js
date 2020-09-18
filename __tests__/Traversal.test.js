import { optic, over, reduce, toArray } from '../src/operations'
import { values } from '../src/Traversal'

const doubleArray = [
  [1, 2],
  [3, 4],
]

describe('Traversal', () => {
  test('traversal from array reduces', () => {
    expect(reduce(values, (x, y) => x + y, 0, [1, 2])).toBe(3)
  })

  test('traversal from array updates', () => {
    expect(over(values, (x) => x + 1, [1, 2])).toStrictEqual([2, 3])
  })

  test('traversal from double array reduces', () => {
    const o = optic(values, values)
    expect(reduce(o, (x, y) => x + y, 0, doubleArray)).toBe(10)
  })

  test('traversal from double array reduces', () => {
    const o = optic(values, values)
    expect(toArray(o, doubleArray)).toStrictEqual(doubleArray.flat())
  })

  test('traversal from double array updates', () => {
    const o = optic(values, values)
    expect(over(o, (x) => x + 1, doubleArray)).toStrictEqual([
      [2, 3],
      [4, 5],
    ])
  })
})
