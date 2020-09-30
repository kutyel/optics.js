import { optic, over, reduce, toArray } from '../src/operations'
import { entries, traversalFromReduce, values } from '../src/Traversal'

const doubleArray = [
  [1, 2],
  [3, 4],
]
const exampleObject = {
  one: 1,
  two: 2,
}

const valuesReduceTraversal = traversalFromReduce(
  (f, i, obj) => obj.reduce(f, i),
  (f, obj) => obj.map(f),
)

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

  test('traversal from double reduce reduces', () => {
    expect(reduce(valuesReduceTraversal, (x, y) => x + y, 0, [1, 2])).toBe(3)
  })

  test('traversal from double reduce updates', () => {
    expect(over(valuesReduceTraversal, (x) => x + 1, [1, 2])).toStrictEqual([2, 3])
  })

  test('traversal from entries reduces', () => {
    // eslint-disable-next-line no-unused-vars
    expect(reduce(entries, (x, [_, y]) => x + y, 0, exampleObject)).toBe(3)
  })

  test('traversal from entries turns into array', () => {
    expect(toArray(entries, exampleObject)).toStrictEqual([
      ['one', 1],
      ['two', 2],
    ])
  })

  test('traversal from entries modified', () => {
    expect(over(entries, ([k, v]) => [k, v + 1], exampleObject)).toStrictEqual({
      one: 2,
      two: 3,
    })
  })
})
