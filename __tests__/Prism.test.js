import { toUpper } from '../src/functions'
import { notFound } from '../src/notFound'
import { optic, over, preview, review, toArray } from '../src/operations'
import { has } from '../src/Prism'

const user = { id: 1, name: 'Flavio' }
const modifiedUser = { id: 1, name: 'Alejandro' }
const modifyUser = (u) => ({ ...u, name: 'Alejandro' })

describe('Prism', () => {
  test('has returns itself if ok', () => {
    expect(preview(has({ id: 1 }), user)).toEqual(user)
  })

  test('has returns nothing if not found', () => {
    expect(preview(has({ id: 2 }), user)).toEqual(notFound)
  })

  test('has works correctly when setting', () => {
    expect(over(has({ id: 1 }), modifyUser, user)).toStrictEqual(modifiedUser)
    expect(has({ id: 1 }).over(modifyUser, user)).toStrictEqual(modifiedUser)
  })

  test('has works correctly in composition with itself', () => {
    expect(optic(has({ id: 1 }), has({ name: 'Flavio' })).preview(user)).toStrictEqual(user)
    expect(optic(has({ id: 1 }), has({ name: 'Flavio' })).preview({ id: 2, name: 'Flavio' })).toBe(
      notFound,
    )
    expect(optic(has({ id: 1 }), has({ name: 'Flavio' })).preview({ name: 'Flavio' })).toBe(
      notFound,
    )
    expect(optic(has({ id: 1 }), has({ name: 'Flavio' })).set(0, { name: 'Alex' })).toStrictEqual({
      name: 'Alex',
    })
  })

  test('has works correctly in composition with lens', () => {
    expect(over(optic(has({ id: 1 }), 'name'), toUpper, user)).toStrictEqual({
      id: 1,
      name: 'FLAVIO',
    })
    expect(optic(has({ id: 1 }), 'name').over(toUpper, user)).toStrictEqual({
      id: 1,
      name: 'FLAVIO',
    })
  })

  test('has works correctly in composition', () => {
    const o = optic(has({ id: 1 }), has({ name: 'Flavio' }))
    expect(review(o, { age: 30 })).toEqual({
      id: 1,
      name: 'Flavio',
      age: 30,
    })
  })

  test('Prism.asTraversal -> works when value is found', () => {
    expect(toArray(has({ id: 1 }), user)).toEqual([user])
    expect(toArray(has({ id: 1 }).asTraversal, user)).toEqual([user])
    expect(toArray(optic(has({ id: 1 }), 'name'), user)).toEqual(['Flavio'])
  })

  test('Prism.asTraversal -> works when value is not found', () => {
    expect(toArray(has({ id: 2 }), user)).toEqual([])
    expect(toArray(has({ id: 2 }).asTraversal, user)).toEqual([])
    expect(toArray(optic(has({ id: 2 }), 'name'), user)).toEqual([])
  })
})
