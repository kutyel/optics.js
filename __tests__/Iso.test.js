import { UnavailableOpticOperationError } from '../src/errors'
import { toUpper } from '../src/functions'
import { iso, single } from '../src/Iso'
import {
  matches,
  optic,
  over,
  preview,
  reduce,
  review,
  set,
  toArray,
  view,
} from '../src/operations'

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
const getterOptics = ['Getter', 'PartialGetter', 'Fold']
const setterOptics = ['Lens', 'Optional', 'Traversal', 'Setter']
const reviewOptics = ['Iso', 'Prism', 'Reviewer']

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

  test('composition of isos obtains value', () => {
    expect(view(optic(single('name'), single('first')), { name: { first: 'Alex' } })).toBe('Alex')
  })

  test('composition of isos obtains value', () => {
    expect(review(optic(single('name'), single('first')), 'Alex')).toStrictEqual({
      name: { first: 'Alex' },
    })
  })

  getterOptics.forEach((gopt) => {
    test('getter as ' + gopt, () => {
      const nm = `as${gopt}`
      const o = optic(idIso[nm], single('name'))

      expect(toArray(o, { name: 'Alex' })).toStrictEqual(['Alex'])
      expect(o.toArray({ name: 'Alex' })).toStrictEqual(['Alex'])
      expect(reduce(o, (x, y) => x + y, 1, { name: 2 })).toBe(3)
      expect(matches(o, { name: 'Alex' })).toBe(true)
      expect(o.matches({ name: 'Alex' })).toBe(true)

      if (gopt === 'Fold') {
        expect(() => preview(o, { name: 'Alex' })).toThrow(UnavailableOpticOperationError)
      } else {
        expect(preview(o, { name: 'Alex' })).toStrictEqual('Alex')
        expect(o.preview({ name: 'Alex' })).toStrictEqual('Alex')
      }

      expect(() => review(o, 'Flavio')).toThrow(UnavailableOpticOperationError)
      expect(() => set(o, 'Flavio', { name: 'Alex' })).toThrow(UnavailableOpticOperationError)
      expect(() => over(o, toUpper, { name: 'Alex' })).toThrow(UnavailableOpticOperationError)
    })
  })

  setterOptics.forEach((sopt) => {
    test('setter as ' + sopt, () => {
      const nm = `as${sopt}`
      const o = optic(idIso[nm], single('name'))
      expect(set(o, 'Flavio', { name: 'Alex' })).toStrictEqual({ name: 'Flavio' })
      expect(o.set('Flavio', { name: 'Alex' })).toStrictEqual({ name: 'Flavio' })
      expect(() => review(o, 'Flavio')).toThrow(UnavailableOpticOperationError)
    })
  })

  reviewOptics.forEach((ropt) => {
    test('review as ' + ropt, () => {
      const nm = `as${ropt}`
      const o = optic(idIso[nm], single('name'))
      expect(review(o, 'Flavio')).toStrictEqual({ name: 'Flavio' })
      expect(o.review('Flavio')).toStrictEqual({ name: 'Flavio' })

      if (ropt === 'Reviewer') {
        expect(() => view(o, { name: 'Alex' })).toThrow(UnavailableOpticOperationError)
        expect(() => preview(o, { name: 'Alex' })).toThrow(UnavailableOpticOperationError)
        expect(() => reduce(o, (x, y) => x + y, 0, { name: 'Alex' })).toThrow(
          UnavailableOpticOperationError,
        )
        expect(() => toArray(o, { name: 'Alex' })).toThrow(UnavailableOpticOperationError)
        expect(() => set(o, 'Flavio', { name: 'Alex' })).toThrow(UnavailableOpticOperationError)
        expect(() => over(o, toUpper, { name: 'Alex' })).toThrow(UnavailableOpticOperationError)
        expect(() => matches(o, { name: 'Alex' })).toThrow(UnavailableOpticOperationError)
      }
    })
  })
})
