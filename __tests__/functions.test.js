import { compose, curry, get, isNil, set, toUpper } from '../src/functions'

const cubed = (num, exp) => num ** exp
const exp = curry(cubed)
const obj = { foo: 'bar' }

describe('Function Operators', () => {
  test('curry -> should curry functions', () => {
    expect(exp(5)(3)).toBe(125)
  })

  test('isNil -> should check if a value is null or undefined', () => {
    expect(isNil(null)).toBe(true)
    expect(isNil(undefined)).toBe(true)
    expect(isNil('')).toBe(false)
    expect(isNil(0)).toBe(false)
    expect(isNil(-0)).toBe(false)
    expect(isNil(false)).toBe(false)
    expect(isNil(NaN)).toBe(false)
  })

  test('compose -> should compose N functions correctly', () => {
    const inc = (x) => x + 1

    expect(compose(inc, exp(5))(1)).toBe(inc(exp(5, 1)))
  })

  test('toUpper -> should do what is expected ehem', () => {
    expect(toUpper('yeah!')).toBe('YEAH!')
  })

  test('get -> should retrieve the value of the property if it exists', () => {
    expect(get('foo')(obj)).toBe(obj.foo)
  })

  test('get -> should return undefined if the property does not exists', () => {
    expect(get('baz')(obj)).toBeUndefined()
  })

  test('set -> should do nothing if the property does not exist', () => {
    expect(set('baz', 1, obj)).toEqual(obj)
  })

  test('set -> should set the new value if the property does exist', () => {
    const newObj = { foo: 'baz' }

    expect(set('foo', 'baz', obj)).toEqual(newObj)
  })
})
