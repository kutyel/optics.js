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
    'Lens',
    'Prism',
    'Optional',
    'Reviewer',
    'Traversal',
    'Setter',
    'Getter',
    'PartialGetter',
    'Fold',
  ]) {
    test(k, () => {
      const nm = 'as' + k
      const o = idIso[nm]
      expect(o[nm]).toBe(o)
      expect(o.__opticType).toBe(k)
    })
  }
})
