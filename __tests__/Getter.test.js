import { OpticComposeError } from '../src/errors'
import { get } from '../src/functions'
import { always, getter } from '../src/Getter'
import { collect, optic, preview, toArray, view } from '../src/operations'
import { reviewer } from '../src/Reviewer'

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

  test('always works as expected', () => {
    expect(view(always('foo'), obj)).toBe('foo')
  })

  test('collect works fine with lenses', () => {
    const o = collect({ arraycito: optic('foo'), stringcita: optic('bar') })
    expect(view(o, obj)).toStrictEqual({ arraycito: [1, 2, 3], stringcita: 'baz' })
  })

  test('collect works fine over optionals and traversals', () => {
    const o = collect({
      arraycito: optic('foo').asPartialGetter,
      stringcita: optic('bar').asTraversal,
    })
    expect(view(o, obj)).toStrictEqual({ arraycito: [1, 2, 3], stringcita: ['baz'] })
  })

  test('collect does not work with reviewers', () => {
    const o = collect({ coso: reviewer(x => x + 1) })
    expect(() => view(o, obj)).toThrow(OpticComposeError)
  })
})
