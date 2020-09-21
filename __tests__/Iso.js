import { iso } from '../src/Iso'

const id = (x) => x
const idIso = iso(id, id)
const optics = [
  'Lens',
  'Prism',
  'Optional',
  'Reviewer',
  'Traversal',
  'Setter',
  'Getter',
  'PartialGetter',
  'Fold',
]

describe('Iso', () => {
  test('asIso', () => {
    expect(idIso.asIso).toBe(idIso)
  })

  optics.forEach((optic) => {
    test(optic, () => {
      const nm = `as${optic}`
      const o = idIso[nm]
      expect(o[nm]).toBe(o)
      expect(o.constructor.name).toBe(optic)
    })
  })
})
