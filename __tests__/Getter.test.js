import { get } from '../src/functions'
import { getter } from '../src/Getter'
import { preview, toArray } from '../src/operations'

const obj = {
  foo: [1, 2, 3],
  bar: 'baz',
}

describe('Getter', () => {
  test('asFold', () => {
    const fold = getter(get('foo')).asFold

    expect(fold.toArray(obj)).toEqual([[1, 2, 3]])
    expect(toArray(fold, obj)).toEqual([[1, 2, 3]])
  })

  test('asPartialGetter', () => {
    const partial = getter(get('bar')).asPartialGetter

    expect(partial.preview(obj)).toBe('baz')
    expect(preview(partial, obj)).toBe('baz')
    expect(toArray(partial, obj)).toEqual(['baz'])
    expect(partial.toArray(obj)).toEqual(['baz'])
  })
})
