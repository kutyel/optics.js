import { iso, single } from '../src/Iso'
import { view, review } from '../src/operations'

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
    test('conversion to ' + optic, () => {
      const nm = `as${optic}`
      const o = idIso[nm]
      expect(o[nm]).toBe(o)
      expect(o.constructor.name).toBe(optic)
    })
  })

  test('single obtains value', () => {
    expect(view(single('name'), { name: 'Alex' })).toBe('Alex')
  })

  test('single obtains value', () => {
    expect(review(single('name'), 'Alex')).toStrictEqual({ name: 'Alex' })
  })
})
