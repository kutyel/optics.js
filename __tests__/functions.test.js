import { curry, get, set, setIndex, toUpper } from '../src/functions'

const obj = { foo: 'bar' }
const arr = [1, 2, 3]

describe('Function Operators', () => {
  test('curry -> should curry functions', () => {
    const cubed = (num, exp) => num ** exp
    const exp = curry(cubed)

    expect(exp(5)(3)).toBe(125)
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

  test(`setIndex -> should set new value if the index is in array's range`, () => {
    const index = 0
    const newValue = 2
    const newArr = [newValue, 2, 3]

    expect(setIndex(index, newValue, arr)).toEqual(newArr)
  })

  test(`setIndex -> should do nothing if the index is out of array's range`, () => {
    const index = 3
    const newValue = 2

    expect(setIndex(index, newValue, arr)).toEqual(arr)
  })
})
