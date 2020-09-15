import { curry, isNil } from '../src/functions'

describe('Function Operators', () => {
  test('curry should curry functions', () => {
    const cubed = (num, exp) => num ** exp
    const curried = curry(cubed)
    expect(curried(5)(3)).toBe(125)
  })

  test('should check if a value is null or undefined', () => {
    expect(isNil(null)).toBe(true)
    expect(isNil(undefined)).toBe(true)
    expect(isNil('')).toBe(false)
    expect(isNil(0)).toBe(false)
    expect(isNil(-0)).toBe(false)
    expect(isNil(false)).toBe(false)
    expect(isNil(NaN)).toBe(false)
  })
})
