import { getter } from '../src/Getter'
import { toArray } from '../src/operations'

const obj = {
  foo: [1, 2, 3],
  bar: 'baz',
}

describe('Getter', () => {
  test.skip('asFold', () => {
    const fold = getter('foo').asFold
    expect(toArray(fold, obj)).toEqual([1, 2, 3])
  })

  test.skip('asPartialGetter', () => {
    const partial = getter('bar').asPartialGetter
    expect(partial.preview(obj)).toBe('baz')
  })
})
