import { iso } from '../src/Iso'

const idIso = iso(
  (x) => x,
  (x) => x,
)

describe('going twice does not change', () => {
  test('asIso', () => {
    expect(idIso.asIso).toBe(idIso)
  })

  for (const k of [
    'asLens',
    'asPrism',
    'asOptional',
    'asReviewer',
    'asTraversal',
    'asSetter',
    'asGetter',
    'asPartialGetter',
    'asFold',
  ]) {
    test(k, () => {
      const o = idIso[k]
      expect(o[k]).toBe(o)
    })
  }
})
