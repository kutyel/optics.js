import { curry } from '../src/functions'

describe('Function Operators', () => {
  test('curry should curry functions', () => {
    const cubed = (num, exp) => num ** exp
    const curried = curry(cubed)
    expect(curried(5)(3)).toBe(125)
  })
})
