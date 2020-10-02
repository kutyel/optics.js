import { OpticComposeError, UnavailableOpticOperationError } from '../src/errors'
import { toUpper } from '../src/functions'
import { notFound } from '../src/notFound'
import { matches, optic, over, preview, review, sequence, toArray } from '../src/operations'
import { where } from '../src/Prism'

const user = { id: 1, name: 'Flavio' }
const modifiedUser = { id: 1, name: 'Alejandro' }
const modifyUser = u => ({ ...u, name: 'Alejandro' })

describe('Prism', () => {
  test('where returns itself if ok', () => {
    expect(preview(where({ id: 1 }), user)).toEqual(user)
    expect(matches(where({ id: 1 }), user)).toBe(true)
    expect(() => matches(where({ id: 1 }).asReviewer, user)).toThrow(UnavailableOpticOperationError)
    expect(() => sequence(where({ id: 1 }).asReviewer)).toThrow(OpticComposeError)
  })

  test('where returns nothing if not found', () => {
    expect(preview(where({ id: 2 }), user)).toEqual(notFound)
    expect(matches(where({ id: 2 }), user)).toBe(false)
  })

  test('where works correctly when setting', () => {
    expect(over(where({ id: 1 }), modifyUser, user)).toStrictEqual(modifiedUser)
    expect(where({ id: 1 }).over(modifyUser, user)).toStrictEqual(modifiedUser)
    expect(where({ id: 1 }).set(modifiedUser, user)).toStrictEqual(modifiedUser)
    expect(where({ id: 2 }).set(modifiedUser, user)).toStrictEqual(user)
  })

  test('where sets nothing if not found', () => {
    expect(over(where({ id: 2 }), modifyUser, user)).toStrictEqual(user)
    expect(where({ id: 2 }).over(modifyUser, user)).toStrictEqual(user)
  })

  test('where works in review', () => {
    expect(review(where({ id: 1 }), { name: 'Flavio' })).toStrictEqual(user)
    expect(where({ id: 1 }).review({ name: 'Flavio' })).toStrictEqual(user)
  })

  test('where works correctly in composition with itself', () => {
    expect(optic(where({ id: 1 }), where({ name: 'Flavio' })).preview(user)).toStrictEqual(user)
    expect(
      optic(where({ id: 1 }), where({ name: 'Flavio' })).preview({ id: 2, name: 'Flavio' }),
    ).toBe(notFound)
    expect(optic(where({ id: 1 }), where({ name: 'Flavio' })).preview({ name: 'Flavio' })).toBe(
      notFound,
    )
    expect(
      optic(where({ id: 1 }), where({ name: 'Flavio' })).set(0, { name: 'Alex' }),
    ).toStrictEqual({
      name: 'Alex',
    })
  })

  test('where works correctly in composition with lens', () => {
    expect(over(optic(where({ id: 1 }), 'name'), toUpper, user)).toStrictEqual({
      id: 1,
      name: 'FLAVIO',
    })
    expect(optic(where({ id: 1 }), 'name').over(toUpper, user)).toStrictEqual({
      id: 1,
      name: 'FLAVIO',
    })
  })

  test('where works correctly in composition', () => {
    const o = optic(where({ id: 1 }), where({ name: 'Flavio' }))
    expect(review(o, { age: 30 })).toEqual({
      id: 1,
      name: 'Flavio',
      age: 30,
    })
  })

  test('Prism.asTraversal -> works when value is found', () => {
    expect(toArray(where({ id: 1 }), user)).toEqual([user])
    expect(toArray(where({ id: 1 }).asTraversal, user)).toEqual([user])
    expect(toArray(optic(where({ id: 1 }), 'name'), user)).toEqual(['Flavio'])
  })

  test('Prism.asTraversal -> works when value is not found', () => {
    expect(toArray(where({ id: 2 }), user)).toEqual([])
    expect(toArray(where({ id: 2 }).asTraversal, user)).toEqual([])
    expect(toArray(optic(where({ id: 2 }), 'name'), user)).toEqual([])
  })
})
